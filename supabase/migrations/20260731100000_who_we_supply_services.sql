-- ============================================================
-- 20260731100000_who_we_supply_services.sql
-- ============================================================
-- 1. Create who_we_supply_services table for Who We Supply CMS
-- 2. Configure RLS policies for storefront public read & staff write
-- 3. Seed initial 4 Who We Supply cards
-- ============================================================

CREATE TABLE IF NOT EXISTS public.who_we_supply_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  image_key TEXT,
  image_url TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Store',
  detail_title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  full_description TEXT NOT NULL,
  key_points TEXT[] NOT NULL DEFAULT '{}',
  cta_text TEXT NOT NULL,
  cta_message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.who_we_supply_services TO anon, authenticated;
GRANT ALL ON public.who_we_supply_services TO service_role;

ALTER TABLE public.who_we_supply_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active who_we_supply_services" ON public.who_we_supply_services;
CREATE POLICY "public read active who_we_supply_services" ON public.who_we_supply_services
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff manage who_we_supply_services" ON public.who_we_supply_services;
CREATE POLICY "staff manage who_we_supply_services" ON public.who_we_supply_services
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

DROP TRIGGER IF EXISTS who_we_supply_services_touch ON public.who_we_supply_services;
CREATE TRIGGER who_we_supply_services_touch BEFORE UPDATE ON public.who_we_supply_services
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX IF NOT EXISTS who_we_supply_services_order_idx ON public.who_we_supply_services (sort_order);

-- Seed initial 4 cards if table is empty
INSERT INTO public.who_we_supply_services (
  title, short_description, image_key, image_url, icon_name, detail_title, subtitle, full_description, key_points, cta_text, cta_message, is_active, sort_order
)
SELECT * FROM (
  VALUES
  (
    'Retail Chains',
    'Grocery, organic and speciality stores',
    'prod-multiflora',
    NULL,
    'Store',
    'Retail Chains',
    'Premium Natural Honey for Modern Retail',
    'Partner with Saurashtra Honey to bring authentic, quality honey products to your customers. We supply retail-ready products suitable for supermarkets, grocery stores, organic stores and specialty retail outlets.',
    ARRAY[
      'Multiple honey varieties and pack sizes',
      'Retail-ready branded packaging',
      'Bulk ordering support',
      'Consistent supply for retail partners',
      'Wholesale/business pricing',
      'Support for recurring orders'
    ]::TEXT[],
    'Enquire for Retail Supply',
    'Hello Saurashtra Honey, I’m interested in Retail Supply. Please share business pricing, MOQ and available products.',
    true,
    1
  ),
  (
    'HORECA',
    'Hotels, restaurants and luxury cafes',
    'prod-liquid',
    NULL,
    'Factory',
    'HORECA Supply',
    'Honey Solutions for Hotels, Restaurants & Cafés',
    'Reliable honey supply for hospitality and food-service businesses, from boutique cafés to hotels and restaurants.',
    ARRAY[
      'Bulk honey supply',
      'Multiple packaging options',
      'Suitable for hotels, restaurants and cafés',
      'Consistent quality and supply',
      'Business quantity ordering',
      'Custom requirements based on volume'
    ]::TEXT[],
    'Enquire for HORECA Supply',
    'Hello Saurashtra Honey, I’m interested in HORECA Supply. Please share bulk options, MOQ and pricing.',
    true,
    2
  ),
  (
    'Corporate Gifting',
    'Diwali, employee & executive gifts',
    'prod-giftpack',
    NULL,
    'Gift',
    'Corporate Gifting',
    'Premium Honey Gifts for Every Occasion',
    'Create memorable corporate gifts with premium Saurashtra Honey products. Suitable for festive gifting, employee appreciation, client gifting and executive gift requirements.',
    ARRAY[
      'Premium honey gift boxes',
      'Corporate bulk orders',
      'Custom gift combinations',
      'Festive gifting options',
      'Employee and client gifting',
      'Custom branding/packaging where available'
    ]::TEXT[],
    'Enquire for Corporate Gifting',
    'Hello Saurashtra Honey, I’m interested in Corporate Gifting. Please share available gift options, MOQ and pricing.',
    true,
    3
  ),
  (
    'Private Label',
    'Your brand, our NABL purity',
    'team-beekeepers',
    NULL,
    'Users2',
    'Private Label',
    'Your Brand. Our Honey Expertise.',
    'For businesses looking to launch honey products under their own brand, provide a professional private-label enquiry experience.',
    ARRAY[
      'Bulk honey sourcing',
      'Private-label opportunities',
      'Packaging options',
      'Custom quantity requirements',
      'Business-to-business supply',
      'Quality-focused sourcing and production'
    ]::TEXT[],
    'Enquire for Private Label',
    'Hello Saurashtra Honey, I’m interested in Private Label services. Please share MOQ, packaging options and business details.',
    true,
    4
  )
) AS v(title, short_description, image_key, image_url, icon_name, detail_title, subtitle, full_description, key_points, cta_text, cta_message, is_active, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.who_we_supply_services);
