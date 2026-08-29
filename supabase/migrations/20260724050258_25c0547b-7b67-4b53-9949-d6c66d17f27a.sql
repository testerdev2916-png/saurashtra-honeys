
-- 1. Canonical singleton app settings
CREATE TABLE public.app_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_settings public read" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "app_settings staff update" ON public.app_settings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "app_settings staff insert" ON public.app_settings FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
INSERT INTO public.app_settings(id, data) VALUES (1, jsonb_build_object(
  'seo', jsonb_build_object(
    'default_title','Saurashtra Honey — Raw, Unfiltered Honey from Saurashtra',
    'default_description','Raw, unfiltered, single-origin honey from the wildflower farms of Saurashtra. Pure, lab-tested and packed with natural enzymes.',
    'default_keywords','raw honey, pure honey, organic honey, saurashtra, ajwain honey, multiflora honey',
    'default_og_image',''
  ),
  'analytics', jsonb_build_object('ga4_measurement_id','','meta_pixel_id','','clarity_id','','gsc_verification',''),
  'social', jsonb_build_object('instagram','','facebook','','youtube','','linkedin','','x','','pinterest',''),
  'whatsapp', jsonb_build_object('enabled',true,'number','919687328404','default_message','Hi! I would like to know more about your honey.'),
  'newsletter', jsonb_build_object('double_opt_in',true,'welcome_reward_points',0),
  'loyalty', jsonb_build_object('enabled',true,'points_per_rupee',1,'redeem_rate_paise',100,'signup_bonus',0,'referral_reward',100,'referred_reward',50),
  'features', jsonb_build_object('recently_purchased_popup',true,'trust_badges',true,'low_stock_message',true,'exit_intent_ready',true),
  'robots', jsonb_build_object('disallow_paths', to_jsonb(ARRAY['/admin','/account','/checkout','/order','/lovable']),'extra',''),
  'i18n', jsonb_build_object('default_locale','en','supported_locales', to_jsonb(ARRAY['en','hi','gu']))
)) ON CONFLICT DO NOTHING;

-- 2. Redirects
CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  code integer NOT NULL DEFAULT 301 CHECK (code IN (301,302,307,308)),
  active boolean NOT NULL DEFAULT true,
  hits integer NOT NULL DEFAULT 0,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX redirects_active_from_idx ON public.redirects(from_path) WHERE active;
GRANT SELECT ON public.redirects TO anon, authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "redirects public read active" ON public.redirects FOR SELECT USING (active);
CREATE POLICY "redirects staff manage" ON public.redirects FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_redirects_updated_at BEFORE UPDATE ON public.redirects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Loyalty
CREATE TABLE public.loyalty_accounts (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points_balance integer NOT NULL DEFAULT 0,
  lifetime_points integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.loyalty_accounts TO authenticated;
GRANT ALL ON public.loyalty_accounts TO service_role;
ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loyalty own read" ON public.loyalty_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE TABLE public.loyalty_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  reason text NOT NULL,
  order_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX loyalty_ledger_user_idx ON public.loyalty_ledger(user_id, created_at DESC);
GRANT SELECT ON public.loyalty_ledger TO authenticated;
GRANT ALL ON public.loyalty_ledger TO service_role;
ALTER TABLE public.loyalty_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "loyalty ledger own read" ON public.loyalty_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- 4. Referrals + profiles enrichment
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES auth.users(id);

CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
  reward_points integer,
  first_order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX referrals_referrer_idx ON public.referrals(referrer_id, created_at DESC);
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals own" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR referred_user_id = auth.uid() OR public.is_staff(auth.uid()));

-- 5. Abandoned carts
CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  full_name text,
  cart jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal_paise integer NOT NULL DEFAULT 0,
  reminded_at timestamptz,
  reminder_count integer NOT NULL DEFAULT 0,
  recovered_at timestamptz,
  recovered_order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX abandoned_email_idx ON public.abandoned_carts(email) WHERE recovered_at IS NULL;
GRANT ALL ON public.abandoned_carts TO service_role;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "abandoned staff" ON public.abandoned_carts FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_abandoned_updated_at BEFORE UPDATE ON public.abandoned_carts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. Newsletter double opt-in
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS confirm_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz,
  ADD COLUMN IF NOT EXISTS unsubscribe_token text UNIQUE,
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- 7. Push subscriptions
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  topics text[] NOT NULL DEFAULT ARRAY['offers','order_updates']::text[],
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "push own" ON public.push_subscriptions FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- 8. Public recent-orders RPC (social proof)
CREATE OR REPLACE FUNCTION public.recent_public_orders(_limit integer DEFAULT 8)
RETURNS TABLE(first_name text, city text, product_name text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    CASE WHEN o.full_name IS NULL OR o.full_name = '' THEN 'A customer'
         ELSE split_part(o.full_name, ' ', 1) END,
    COALESCE(o.shipping->>'city',''),
    (o.items->0->>'name'),
    o.created_at
  FROM public.orders o
  WHERE o.status IN ('paid','processing','packed','shipped','delivered','confirmed')
    AND o.deleted_at IS NULL
  ORDER BY o.created_at DESC
  LIMIT LEAST(_limit, 20)
$$;
GRANT EXECUTE ON FUNCTION public.recent_public_orders(integer) TO anon, authenticated;

-- 9. Loyalty accrual trigger
CREATE OR REPLACE FUNCTION public.accrue_loyalty_on_order() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _pts integer; _rate integer;
BEGIN
  IF NEW.user_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.status IN ('paid','confirmed','processing','packed','shipped','delivered')
     AND (TG_OP = 'INSERT' OR OLD.status IS NULL OR OLD.status NOT IN ('paid','confirmed','processing','packed','shipped','delivered')) THEN
    SELECT COALESCE((data->'loyalty'->>'points_per_rupee')::int, 1) INTO _rate FROM public.app_settings WHERE id = 1;
    _pts := GREATEST(0, (NEW.total_paise / 100) * COALESCE(_rate,1));
    IF _pts > 0 THEN
      INSERT INTO public.loyalty_accounts(user_id, points_balance, lifetime_points)
      VALUES (NEW.user_id, _pts, _pts)
      ON CONFLICT (user_id) DO UPDATE SET
        points_balance = loyalty_accounts.points_balance + EXCLUDED.points_balance,
        lifetime_points = loyalty_accounts.lifetime_points + EXCLUDED.points_balance,
        updated_at = now();
      INSERT INTO public.loyalty_ledger(user_id, delta, reason, order_id)
      VALUES (NEW.user_id, _pts, 'order_earn', NEW.id);
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_accrue_loyalty ON public.orders;
CREATE TRIGGER trg_accrue_loyalty AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.accrue_loyalty_on_order();

-- 10. Auto referral code on profiles
CREATE OR REPLACE FUNCTION public.assign_referral_code() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := upper(substr(replace(NEW.id::text, '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_referral_code ON public.profiles;
CREATE TRIGGER trg_referral_code BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_referral_code();

-- Backfill referral codes for existing profiles
UPDATE public.profiles SET referral_code = upper(substr(replace(id::text,'-',''),1,8)) WHERE referral_code IS NULL;
