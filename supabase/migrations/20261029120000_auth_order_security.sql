-- Migration: Complete Authentication & Fake Order Security
-- Date: 2026-10-29
-- Description:
--   1. Add phone_verified and phone_verified_at to profiles.
--   2. Add phone_verified, verification_method, risk_score, and risk_flags to orders.
--   3. Create phone_verifications table for cryptographically hashed, single-use, expiring OTPs.
--   4. Create security_blocked_entities table for admin-managed blocked emails, domains, and phones.
--   5. Create security_audit_events table for tracking security incidents, rate limits, and OTP events.
--   6. Enforce strict Row Level Security (RLS) policies on all new tables.

-- ============================================================================
-- 1. Profiles Table Enhancement (Phone Verification Tracking)
-- ============================================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_verified ON public.profiles(phone_verified);

-- ============================================================================
-- 2. Orders Table Enhancement (Security & Verification Metadata)
-- ============================================================================
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_method text DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS risk_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_flags text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_phone_verified ON public.orders(phone_verified);

-- ============================================================================
-- 3. Phone Verifications Table (Expiring, Single-Use, Salted-Hashed OTPs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  phone text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('signup', 'cod_order', 'phone_update', 'login')),
  otp_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  resend_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  consumed_at timestamptz,
  ip_address text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone_purpose ON public.phone_verifications(phone, purpose);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_user_id ON public.phone_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_expires_at ON public.phone_verifications(expires_at);

GRANT ALL ON public.phone_verifications TO service_role;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
-- Client access is completely prohibited; strictly managed server-side via service role

-- ============================================================================
-- 4. Security Blocked Entities (Admin-Manageable Blocklist)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.security_blocked_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('email', 'domain', 'phone', 'ip')),
  value text NOT NULL UNIQUE,
  reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_blocked_type_val ON public.security_blocked_entities(type, value);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.security_blocked_entities TO authenticated;
GRANT ALL ON public.security_blocked_entities TO service_role;

ALTER TABLE public.security_blocked_entities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "security_blocked_staff_all" ON public.security_blocked_entities;
CREATE POLICY "security_blocked_staff_all" ON public.security_blocked_entities
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Seed standard reserved test domains
INSERT INTO public.security_blocked_entities (type, value, reason)
VALUES
  ('domain', 'example.com', 'Reserved test domain (RFC 2606)'),
  ('domain', 'example.org', 'Reserved test domain (RFC 2606)'),
  ('domain', 'example.net', 'Reserved test domain (RFC 2606)'),
  ('domain', 'test.com', 'Reserved test domain'),
  ('domain', 'invalid', 'Special-use test domain (RFC 6761)'),
  ('domain', 'mailinator.com', 'Disposable temporary email domain'),
  ('domain', 'tempmail.com', 'Disposable temporary email domain'),
  ('domain', 'guerrillamail.com', 'Disposable temporary email domain'),
  ('domain', '10minutemail.com', 'Disposable temporary email domain'),
  ('domain', 'yopmail.com', 'Disposable temporary email domain')
ON CONFLICT (value) DO NOTHING;

-- ============================================================================
-- 5. Security Audit Events Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.security_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  phone text,
  email text,
  ip_address text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_audit_event_type ON public.security_audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_created_at ON public.security_audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_actor_id ON public.security_audit_events(actor_id);

GRANT SELECT ON public.security_audit_events TO authenticated;
GRANT ALL ON public.security_audit_events TO service_role;

ALTER TABLE public.security_audit_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "security_audit_staff_read" ON public.security_audit_events;
CREATE POLICY "security_audit_staff_read" ON public.security_audit_events
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
