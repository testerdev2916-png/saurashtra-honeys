-- ============================================================
-- 20260731120000_complete_category_system.sql
-- ============================================================
-- 1. Ensure all standard categories exist in public.categories with correct sort_order
-- 2. Safely migrate existing products from using "Product Type" attribute to belonging
--    directly to their proper category (Lip Care, Skin Care, Hair Care, Body Care, Wood & Leather Care).
-- 3. Remove duplicate "Product Type" attribute from those products.
-- ============================================================

INSERT INTO public.categories (slug, name, sort_order, active)
VALUES
  ('honey', 'Honey', 1, true),
  ('beeswax', 'Beeswax', 2, true),
  ('bee-pollen', 'Bee Pollen', 3, true),
  ('beeswax-candle', 'Beeswax Candle', 4, true),
  ('beeswax-products', 'Beeswax Products', 5, true),
  ('body-care', 'Body Care', 6, true),
  ('hair-care', 'Hair Care', 7, true),
  ('lip-care', 'Lip Care', 8, true),
  ('skin-care', 'Skin Care', 9, true),
  ('wood-leather-care', 'Wood & Leather Care', 10, true),
  ('beauty-products', 'Beauty Products', 11, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  active = true;

-- Safely migrate existing products to their correct category and clean up duplicate Product Type attribute
UPDATE public.products
SET 
  category = 'Lip Care',
  attributes = (attributes - 'Product Type') || '{"Form": "Balm"}'::jsonb
WHERE (attributes->>'Product Type' ILIKE 'Lip Care' OR slug = 'honey-beeswax-lip-balm')
  AND category != 'Lip Care';

UPDATE public.products
SET 
  category = 'Skin Care',
  attributes = (attributes - 'Product Type') || '{"Form": "Scrub"}'::jsonb
WHERE (attributes->>'Product Type' ILIKE 'Skin Care' OR slug = 'raw-honey-facial-polish')
  AND category != 'Skin Care';

UPDATE public.products
SET 
  category = 'Hair Care',
  attributes = (attributes - 'Product Type') || '{"Form": "Mask"}'::jsonb
WHERE (attributes->>'Product Type' ILIKE 'Hair Care' OR slug = 'royal-jelly-hair-mask')
  AND category != 'Hair Care';

UPDATE public.products
SET 
  category = 'Body Care',
  attributes = (attributes - 'Product Type') || '{"Form": "Butter"}'::jsonb
WHERE (attributes->>'Product Type' ILIKE 'Body Care' OR slug = 'beeswax-body-butter')
  AND category != 'Body Care';

UPDATE public.products
SET 
  category = 'Wood & Leather Care',
  attributes = (attributes - 'Product Type') || '{"Form": "Polish"}'::jsonb
WHERE (attributes->>'Product Type' ILIKE 'Wood & Leather Care' OR slug = 'natural-beeswax-wood-polish')
  AND category != 'Wood & Leather Care';
