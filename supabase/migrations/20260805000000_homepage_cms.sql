-- ============================================================
-- 20260805000000_homepage_cms.sql
-- ============================================================
-- Creates the table structure for the Homepage Management CMS
-- ============================================================

-- 1. homepage_sections: Central table controlling order, visibility and settings
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
GRANT SELECT ON public.homepage_sections TO anon, authenticated;
GRANT ALL ON public.homepage_sections TO service_role;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read homepage_sections" ON public.homepage_sections
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "staff manage homepage_sections" ON public.homepage_sections
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER homepage_sections_touch BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. announcement_items
CREATE TABLE IF NOT EXISTS public.announcement_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  icon TEXT,
  link TEXT,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.announcement_items TO anon, authenticated;
GRANT ALL ON public.announcement_items TO service_role;
ALTER TABLE public.announcement_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read announcement_items" ON public.announcement_items
  FOR SELECT TO anon, authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

CREATE POLICY "staff manage announcement_items" ON public.announcement_items
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER announcement_items_touch BEFORE UPDATE ON public.announcement_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. homepage_category_selection
CREATE TABLE IF NOT EXISTS public.homepage_category_selection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_category_selection TO anon, authenticated;
GRANT ALL ON public.homepage_category_selection TO service_role;
ALTER TABLE public.homepage_category_selection ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read homepage_category_selection" ON public.homepage_category_selection
  FOR SELECT TO anon, authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

CREATE POLICY "staff manage homepage_category_selection" ON public.homepage_category_selection
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER homepage_category_selection_touch BEFORE UPDATE ON public.homepage_category_selection
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. homepage_featured_products
CREATE TABLE IF NOT EXISTS public.homepage_featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_featured_products TO anon, authenticated;
GRANT ALL ON public.homepage_featured_products TO service_role;
ALTER TABLE public.homepage_featured_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read homepage_featured_products" ON public.homepage_featured_products
  FOR SELECT TO anon, authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

CREATE POLICY "staff manage homepage_featured_products" ON public.homepage_featured_products
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER homepage_featured_products_touch BEFORE UPDATE ON public.homepage_featured_products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. homepage_trust_items
CREATE TABLE IF NOT EXISTS public.homepage_trust_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_trust_items TO anon, authenticated;
GRANT ALL ON public.homepage_trust_items TO service_role;
ALTER TABLE public.homepage_trust_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read homepage_trust_items" ON public.homepage_trust_items
  FOR SELECT TO anon, authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

CREATE POLICY "staff manage homepage_trust_items" ON public.homepage_trust_items
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER homepage_trust_items_touch BEFORE UPDATE ON public.homepage_trust_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. Add featured_on_homepage to reviews for Testimonials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'featured_on_homepage'
  ) THEN
    ALTER TABLE public.reviews ADD COLUMN featured_on_homepage BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;


-- ==================== SEED INITIAL DATA ====================
-- This ensures the homepage doesn't break upon deployment
INSERT INTO public.homepage_sections (section_key, sort_order, enabled, settings) VALUES
  ('hero', 1, true, '{}'::jsonb),
  ('trust_strip', 2, true, '{}'::jsonb),
  ('shop_by_category', 3, true, '{"eyebrow": "DISCOVER", "heading": "Explore Our World", "description": "Discover every expression of pure honey—from everyday favourites to rare treasures, thoughtfully crafted by nature.", "cta_text": "VIEW ALL CATEGORIES", "cta_url": "/shop"}'::jsonb),
  ('featured_products', 4, true, '{"eyebrow": "OUR SIGNATURE COLLECTION", "heading": "Best Sellers", "cta_text": "SHOP ALL BEST SELLERS", "cta_url": "/shop"}'::jsonb),
  ('shoppable_videos', 5, true, '{"eyebrow": "FROM THE HIVE", "heading": "Stories from the Hive", "description": "Watch the journey behind every jar and discover how purity begins long before it reaches your home."}'::jsonb),
  ('why_choose', 6, true, '{"eyebrow": "WHY SAURASHTRA HONEY", "heading": "Where Purity Begins", "cta_text": "LEARN MORE", "cta_url": "/our-story"}'::jsonb),
  ('farm_banner', 7, true, '{}'::jsonb),
  ('stats_strip', 8, true, '{}'::jsonb),
  ('testimonials', 9, true, '{"eyebrow": "TESTIMONIALS", "heading": "From Our Customers"}'::jsonb),
  ('journal', 10, true, '{"eyebrow": "JOURNAL", "heading": "Learn About Honey"}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Trust Items
INSERT INTO public.homepage_trust_items (title, description, icon, sort_order) VALUES
  ('100% Pure Honey', 'Sustainably sourced', 'Droplet', 1),
  ('Lab Tested', 'Verified purity', 'TestTube2', 2),
  ('Farm Sourced', 'From local beekeepers', 'Leaf', 3),
  ('Pan India Delivery', 'Safe and secure', 'Truck', 4)
ON CONFLICT DO NOTHING;
