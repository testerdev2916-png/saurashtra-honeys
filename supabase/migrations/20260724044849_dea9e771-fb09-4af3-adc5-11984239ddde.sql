
-- 1) Customer notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('order','shipping','offer','wishlist','back_in_stock','account','system')),
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_user_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON public.notifications (user_id) WHERE read = false;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notif r" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own notif u" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own notif d" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2) Coupon redemptions (per-user limit + audit)
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_paise integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS coupon_red_user_idx ON public.coupon_redemptions (user_id);
CREATE INDEX IF NOT EXISTS coupon_red_coupon_idx ON public.coupon_redemptions (coupon_id);
GRANT SELECT ON public.coupon_redemptions TO authenticated;
GRANT ALL ON public.coupon_redemptions TO service_role;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own redemptions r" ON public.coupon_redemptions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- 3) Extend orders with coupon + delivery estimate
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS discount_paise integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_paise integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS estimated_delivery date,
  ADD COLUMN IF NOT EXISTS gift_note text;

-- 4) Extend addresses with country + default helper
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS full_name text;

-- 5) Public tracking function (order_number + email lookup)
CREATE OR REPLACE FUNCTION public.track_order(_order_number text, _email text)
RETURNS TABLE(
  order_number text,
  status text,
  created_at timestamptz,
  estimated_delivery date,
  delivered_at timestamptz,
  tracking_number text,
  shipping_carrier text,
  timeline jsonb,
  total_paise integer,
  items jsonb,
  shipping jsonb
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT o.order_number, o.status, o.created_at, o.estimated_delivery,
         o.delivered_at, o.tracking_number, o.shipping_carrier, o.timeline,
         o.total_paise, o.items, o.shipping
  FROM public.orders o
  WHERE o.order_number = _order_number
    AND lower(o.email) = lower(_email)
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.track_order(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;

-- 6) Password change audit trigger — record account events
-- (using notifications table)
