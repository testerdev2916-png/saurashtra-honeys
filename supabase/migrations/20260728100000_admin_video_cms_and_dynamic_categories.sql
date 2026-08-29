-- ============================================================
-- 20260728100000_admin_video_cms_and_dynamic_categories.sql
-- ============================================================
-- 1. Create homepage_videos table for Video / Story Management CMS
-- 2. Configure RLS policies for public storefront read & staff write
-- 3. Seed initial 6 story cards if homepage_videos is empty
-- 4. Configure Supabase Storage file size limit (200MB) for media bucket
-- 5. Establish Supabase as single source of truth for categories
-- 6. Migrate existing products from generic "Honey" to recovered specific categories
-- ============================================================

-- ==================== 1. Homepage Videos ====================
CREATE TABLE IF NOT EXISTS public.homepage_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  product_slug TEXT,
  link_url TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT homepage_videos_status_check CHECK (status IN ('draft', 'published', 'archived'))
);

GRANT SELECT ON public.homepage_videos TO anon, authenticated;
GRANT ALL ON public.homepage_videos TO service_role;

ALTER TABLE public.homepage_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active homepage videos" ON public.homepage_videos;
CREATE POLICY "public read active homepage videos" ON public.homepage_videos
  FOR SELECT TO anon, authenticated
  USING ((status = 'published' AND is_active = true) OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff manage homepage videos" ON public.homepage_videos;
CREATE POLICY "staff manage homepage videos" ON public.homepage_videos
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

DROP TRIGGER IF EXISTS homepage_videos_touch ON public.homepage_videos;
CREATE TRIGGER homepage_videos_touch BEFORE UPDATE ON public.homepage_videos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX IF NOT EXISTS homepage_videos_order_idx ON public.homepage_videos (display_order);

-- ==================== 2. Seed Homepage Videos ====================
INSERT INTO public.homepage_videos (title, subtitle, badge, product_slug, display_order, status, is_active)
SELECT title, subtitle, badge, product_slug, display_order, status, is_active
FROM (VALUES
  ('Digestive Ritual', 'Ajwain Honey', 'Single Flora', 'ajwain-honey', 1, 'published', true),
  ('The Orchard Bloom', 'Lychee Honey', 'Seasonal Rarity', 'lychee-honey', 2, 'published', true),
  ('Straight From The Frame', 'Honey Comb', 'Chewable Purity', 'honey-comb', 3, 'published', true),
  ('A Cooling Note', 'Fennel Honey', 'Single Flora', 'fennel-honey', 4, 'published', true),
  ('The Everyday Jar', 'Multiflora Honey', 'Wildflower Blend', 'multiflora-honey', 5, 'published', true),
  ('Curated To Gift', 'Premium Gift Pack', 'Gift Edit', 'premium-gift-pack', 6, 'published', true)
) AS v(title, subtitle, badge, product_slug, display_order, status, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_videos);

-- ==================== 3. Storage Bucket Limit (200MB) ====================
DO $$
BEGIN
  UPDATE storage.buckets
  SET file_size_limit = 209715200
  WHERE id IN ('media', 'product-images');
EXCEPTION
  WHEN undefined_table OR undefined_column THEN NULL;
END $$;

-- ==================== 4. Specific Categories Source of Truth ====================
-- Set generic 'honey' category to inactive so customers see specific informative categories
UPDATE public.categories SET active = false WHERE slug = 'honey' OR name = 'Honey';

INSERT INTO public.categories (slug, name, sort_order, active)
VALUES
  ('single-flora-honey', 'Single Flora Honey', 1, true),
  ('multiflora-honey', 'Multiflora Honey', 2, true),
  ('raw-honey', 'Raw Honey', 3, true),
  ('honey-comb', 'Honey Comb', 4, true),
  ('gift-packs', 'Gift Packs', 5, true),
  ('forest-honey', 'Forest Honey', 6, true),
  ('beeswax', 'Beeswax', 7, true),
  ('bee-pollen', 'Bee Pollen', 8, true),
  ('beeswax-candle', 'Beeswax Candle', 9, true),
  ('beeswax-products', 'Beeswax Products', 10, true)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order, active = true;

-- ==================== 5. Product-to-Category Migration ====================
-- Recover accurate specific categories for existing products
UPDATE public.products
SET category = 'Single Flora Honey'
WHERE slug IN ('ajwain-honey', 'fennel-honey', 'lychee-honey')
   OR name ILIKE '%ajwain%' OR name ILIKE '%fennel%' OR name ILIKE '%lychee%'
   OR category IN ('Single Flora', 'Single-Flora');

UPDATE public.products
SET category = 'Multiflora Honey'
WHERE slug IN ('multiflora-honey')
   OR name ILIKE '%multiflora%'
   OR category = 'Multiflora';

UPDATE public.products
SET category = 'Raw Honey'
WHERE slug IN ('raw-honey-squeeze')
   OR name ILIKE '%squeeze%'
   OR category = 'Raw Honey';

UPDATE public.products
SET category = 'Honey Comb'
WHERE slug IN ('honey-comb')
   OR name ILIKE '%honey comb%' OR name ILIKE '%honeycomb%'
   OR category IN ('Honey Comb', 'Honeycomb');

UPDATE public.products
SET category = 'Gift Packs'
WHERE slug IN ('premium-gift-pack', 'family-gift-pack')
   OR name ILIKE '%gift%'
   OR category IN ('Gift Packs', 'Gift Pack', 'Gift');

UPDATE public.products
SET category = 'Forest Honey'
WHERE slug IN ('wild-forest-honey', 'forest-honey')
   OR name ILIKE '%forest%'
   OR category IN ('Forest Honey', 'Wild Forest Honey');
