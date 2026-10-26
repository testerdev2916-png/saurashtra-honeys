-- Migration: Mandatory Authentication for Checkout & Secure Guest Order Claiming
-- Description:
--   1. Create order_claims_audit table to log every guest order claim.
--   2. Create email_claim_verifications table for single-use expiring verification codes.
--   3. Create indexes on orders(user_id) and orders(lower(trim(email))) for fast, normalized lookups.
--   4. Ensure RLS policies on orders enforce strict isolation:
--      - Authenticated users can only read their own orders (or staff).
--      - Only authenticated users can insert orders for themselves (or staff).
--      - Public/anon users cannot read, insert, update or delete orders.
--   5. Add claim_guest_orders_for_user stored function (executable only by service_role).

-- ============================================================================
-- 1. Order Claims Audit Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_claims_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_email text NOT NULL,
  claim_method text NOT NULL DEFAULT 'supabase_auth_verified',
  claimed_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_order_claims_audit_user_id ON public.order_claims_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_order_claims_audit_order_id ON public.order_claims_audit(order_id);
CREATE INDEX IF NOT EXISTS idx_order_claims_audit_email ON public.order_claims_audit(claimed_email);

GRANT SELECT ON public.order_claims_audit TO authenticated;
GRANT ALL ON public.order_claims_audit TO service_role;

ALTER TABLE public.order_claims_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "claims_audit_user_read" ON public.order_claims_audit;
CREATE POLICY "claims_audit_user_read" ON public.order_claims_audit
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- ============================================================================
-- 2. Email Claim Verifications Table (expiring single-use verification codes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_claim_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  token_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_claim_verif_user_email ON public.email_claim_verifications(user_id, email);
GRANT ALL ON public.email_claim_verifications TO service_role;
ALTER TABLE public.email_claim_verifications ENABLE ROW LEVEL SECURITY;
-- No client permissions for email_claim_verifications; strictly managed by service_role

-- ============================================================================
-- 3. Performance & Normalization Indexes on Orders
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_lower_email ON public.orders((lower(trim(email))));

-- ============================================================================
-- 4. RLS Reinforcement on Orders Table
-- ============================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Revoke anon access completely
REVOKE ALL ON public.orders FROM anon;

-- Authenticated select policy: customer can ONLY see their own orders, or staff
DROP POLICY IF EXISTS "orders_auth_read" ON public.orders;
CREATE POLICY "orders_auth_read" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- Authenticated insert policy: customer can ONLY insert orders with their own user_id, or staff
DROP POLICY IF EXISTS "orders_auth_insert" ON public.orders;
CREATE POLICY "orders_auth_insert" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- Update policy: customers CANNOT update orders directly. Only staff can update orders.
DROP POLICY IF EXISTS "orders_staff_update" ON public.orders;
CREATE POLICY "orders_staff_update" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Delete policy: only staff
DROP POLICY IF EXISTS "orders_staff_delete" ON public.orders;
CREATE POLICY "orders_staff_delete" ON public.orders
  FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

-- ============================================================================
-- 5. Stored Procedure for Atomic, Idempotent, Auditable Guest Order Claiming
-- ============================================================================
CREATE OR REPLACE FUNCTION public.claim_guest_orders_for_user(
  _target_user_id uuid,
  _target_email text,
  _method text DEFAULT 'supabase_auth_verified'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_normalized_email text;
  v_order_record record;
  v_claimed_count integer := 0;
  v_claimed_ids uuid[] := ARRAY[]::uuid[];
  v_current_timeline jsonb;
  v_new_timeline jsonb;
BEGIN
  IF _target_user_id IS NULL THEN
    RAISE EXCEPTION 'Target user ID is required';
  END IF;

  IF _target_email IS NULL OR trim(_target_email) = '' THEN
    RAISE EXCEPTION 'Target email is required';
  END IF;

  v_normalized_email := lower(trim(_target_email));

  -- Lock and iterate eligible orders where user_id IS NULL and email matches
  FOR v_order_record IN
    SELECT id, order_number, status, timeline
    FROM public.orders
    WHERE user_id IS NULL
      AND lower(trim(email)) = v_normalized_email
    FOR UPDATE
  LOOP
    v_current_timeline := COALESCE(v_order_record.timeline, '[]'::jsonb);
    IF jsonb_typeof(v_current_timeline) != 'array' THEN
      v_current_timeline := '[]'::jsonb;
    END IF;

    v_new_timeline := v_current_timeline || jsonb_build_object(
      'at', now()::text,
      'status', v_order_record.status,
      'note', 'Historical guest order claimed by verified account ' || v_normalized_email
    );

    -- Only claim if user_id is STILL null
    UPDATE public.orders
    SET user_id = _target_user_id,
        timeline = v_new_timeline,
        updated_at = now()
    WHERE id = v_order_record.id
      AND user_id IS NULL;

    -- Record in audit table
    INSERT INTO public.order_claims_audit (
      order_id, user_id, claimed_email, claim_method, claimed_at, metadata
    ) VALUES (
      v_order_record.id,
      _target_user_id,
      v_normalized_email,
      _method,
      now(),
      jsonb_build_object('order_number', v_order_record.order_number)
    );

    -- Record in general audit_logs
    INSERT INTO public.audit_logs (
      actor_id, action, entity_type, entity_id, metadata
    ) VALUES (
      _target_user_id,
      'order.claimed_from_guest',
      'order',
      v_order_record.id::text,
      jsonb_build_object(
        'order_number', v_order_record.order_number,
        'email', v_normalized_email,
        'method', _method
      )
    );

    v_claimed_count := v_claimed_count + 1;
    v_claimed_ids := array_append(v_claimed_ids, v_order_record.id);
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'claimed_count', v_claimed_count,
    'claimed_ids', to_jsonb(v_claimed_ids)
  );
END;
$$;

-- Restrict execution to service_role (backend server functions only)
REVOKE ALL ON FUNCTION public.claim_guest_orders_for_user(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_guest_orders_for_user(uuid, text, text) TO service_role;
