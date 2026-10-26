-- Migration: Transactional Email Notification System with Resend
-- Stores email delivery attempts, idempotency keys, provider message IDs, and failure tracking.

CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'rate_limited', 'skipped'
  idempotency_key TEXT UNIQUE NOT NULL,
  resend_id TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

-- Performance & idempotency indexes
CREATE INDEX IF NOT EXISTS idx_email_notifications_order_id ON public.email_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON public.email_notifications(lower(trim(recipient_email)));
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_idempotency ON public.email_notifications(idempotency_key);

-- RLS: Only staff/admin, order owners, and service_role can access email notification records
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS email_notifications_staff_select ON public.email_notifications;
CREATE POLICY email_notifications_staff_select ON public.email_notifications
  FOR SELECT
  TO authenticated
  USING (
    public.is_staff(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = email_notifications.order_id
      AND o.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS email_notifications_service_all ON public.email_notifications;
CREATE POLICY email_notifications_service_all ON public.email_notifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
