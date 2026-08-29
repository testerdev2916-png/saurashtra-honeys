
-- Extend products with enterprise fields
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS barcode text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS ingredients text,
  ADD COLUMN IF NOT EXISTS usage_instructions text,
  ADD COLUMN IF NOT EXISTS warnings text,
  ADD COLUMN IF NOT EXISTS cost_price_paise integer,
  ADD COLUMN IF NOT EXISTS gst_percent numeric(5,2),
  ADD COLUMN IF NOT EXISTS hsn_code text,
  ADD COLUMN IF NOT EXISTS weight_g integer,
  ADD COLUMN IF NOT EXISTS dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS low_stock_limit integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_bestseller boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new_arrival boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS meta_keywords text,
  ADD COLUMN IF NOT EXISTS canonical_url text;

DO $$ BEGIN
  ALTER TABLE public.products ADD CONSTRAINT products_status_check CHECK (status IN ('draft','published','archived'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE UNIQUE INDEX IF NOT EXISTS products_sku_uidx ON public.products(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products(status);
CREATE INDEX IF NOT EXISTS products_stock_idx ON public.products(stock_quantity);

-- Extend orders with fulfillment fields + broader statuses
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS shipping_carrier text,
  ADD COLUMN IF NOT EXISTS timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS refund_amount_paise integer,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz;

-- Broaden order status to include full lifecycle
DO $$ BEGIN
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending','paid','confirmed','processing','packed','shipped','delivered','cancelled','refunded'));
END $$;

-- Extend profiles for admin customer management
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS avatar_url text;
DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check CHECK (status IN ('active','disabled'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow staff to read/update all profiles for customer management
DROP POLICY IF EXISTS "staff read profiles" ON public.profiles;
CREATE POLICY "staff read profiles" ON public.profiles FOR SELECT TO authenticated USING (is_staff(auth.uid()));
DROP POLICY IF EXISTS "staff update profiles" ON public.profiles;
CREATE POLICY "staff update profiles" ON public.profiles FOR UPDATE TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

-- Reviews: reply + featured
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS admin_reply text,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Backfill handle_new_user to also populate email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  INSERT INTO public.profiles(id, full_name, phone, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone', NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill emails for existing profiles
UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- Dashboard stats RPC
CREATE OR REPLACE FUNCTION public.admin_dashboard_stats()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE result jsonb;
BEGIN
  IF NOT is_staff(auth.uid()) THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT jsonb_build_object(
    'revenue_total_paise', COALESCE((SELECT SUM(total_paise) FROM public.orders WHERE status IN ('paid','processing','packed','shipped','delivered','confirmed') AND deleted_at IS NULL),0),
    'revenue_month_paise', COALESCE((SELECT SUM(total_paise) FROM public.orders WHERE status IN ('paid','processing','packed','shipped','delivered','confirmed') AND created_at >= date_trunc('month', now()) AND deleted_at IS NULL),0),
    'orders_today',        COALESCE((SELECT COUNT(*)  FROM public.orders WHERE created_at::date = current_date AND deleted_at IS NULL),0),
    'orders_pending',      COALESCE((SELECT COUNT(*)  FROM public.orders WHERE status = 'pending' AND deleted_at IS NULL),0),
    'orders_delivered',    COALESCE((SELECT COUNT(*)  FROM public.orders WHERE status = 'delivered' AND deleted_at IS NULL),0),
    'orders_cancelled',    COALESCE((SELECT COUNT(*)  FROM public.orders WHERE status = 'cancelled' AND deleted_at IS NULL),0),
    'customers_total',     COALESCE((SELECT COUNT(*)  FROM public.profiles),0),
    'products_total',      COALESCE((SELECT COUNT(*)  FROM public.products),0),
    'low_stock_products',  COALESCE((SELECT COUNT(*)  FROM public.products WHERE stock_quantity <= low_stock_limit),0),
    'out_of_stock',        COALESCE((SELECT COUNT(*)  FROM public.products WHERE stock_quantity = 0),0),
    'sales_last_30', COALESCE((
      SELECT jsonb_agg(row_to_json(t)) FROM (
        SELECT to_char(d::date,'YYYY-MM-DD') AS day,
               COALESCE(SUM(o.total_paise),0) AS revenue_paise,
               COUNT(o.id) AS orders
        FROM generate_series(current_date - interval '29 days', current_date, interval '1 day') d
        LEFT JOIN public.orders o ON o.created_at::date = d::date AND o.status IN ('paid','processing','packed','shipped','delivered','confirmed') AND o.deleted_at IS NULL
        GROUP BY d ORDER BY d
      ) t
    ),'[]'::jsonb),
    'top_products', COALESCE((
      SELECT jsonb_agg(row_to_json(t)) FROM (
        SELECT p.name, p.slug,
               SUM((item->>'qty')::int) AS units,
               SUM((item->>'qty')::int * (item->>'price')::int) AS revenue
        FROM public.orders o, jsonb_array_elements(o.items) item
        LEFT JOIN public.products p ON p.slug = item->>'slug'
        WHERE o.status IN ('paid','processing','packed','shipped','delivered','confirmed') AND o.deleted_at IS NULL
        GROUP BY p.name, p.slug ORDER BY revenue DESC NULLS LAST LIMIT 5
      ) t
    ),'[]'::jsonb),
    'top_customers', COALESCE((
      SELECT jsonb_agg(row_to_json(t)) FROM (
        SELECT COALESCE(o.full_name,'Guest') AS name, o.email,
               COUNT(*) AS orders, SUM(o.total_paise) AS spent_paise
        FROM public.orders o
        WHERE o.status IN ('paid','processing','packed','shipped','delivered','confirmed') AND o.deleted_at IS NULL
        GROUP BY o.full_name, o.email ORDER BY spent_paise DESC LIMIT 5
      ) t
    ),'[]'::jsonb),
    'recent_orders', COALESCE((
      SELECT jsonb_agg(row_to_json(t)) FROM (
        SELECT id, order_number, full_name, email, total_paise, status, created_at
        FROM public.orders WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 8
      ) t
    ),'[]'::jsonb)
  ) INTO result;
  RETURN result;
END $$;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_stats() TO authenticated;

-- Seed default site_settings if empty
INSERT INTO public.site_settings(key, value, is_public) VALUES
  ('company', '{"name":"Saurashtra Honey","tagline":"Pure • Traceable • Lab-tested"}', true),
  ('contact', '{"email":"hello@saurashtrahoney.in","phone":"+91 00000 00000","whatsapp":"+91 00000 00000","address":""}', true),
  ('social',  '{"instagram":"","facebook":"","youtube":"","twitter":""}', true),
  ('business','{"gst":"","hours":"Mon–Sat, 9am–7pm IST"}', true),
  ('footer',  '{"copyright":"© Saurashtra Honey. All rights reserved.","links":[]}', true),
  ('seo',     '{"default_title":"Saurashtra Honey","default_description":"Premium single-flora honey","og_image":""}', true)
ON CONFLICT (key) DO NOTHING;
