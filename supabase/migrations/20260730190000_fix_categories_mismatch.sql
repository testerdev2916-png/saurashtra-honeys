-- ============================================================
-- 20260730190000_fix_categories_mismatch.sql
-- ============================================================
-- Repair category mismatch between Admin Products, Categories CMS, and Storefront Shop:
-- 1. Ensure primary categories (Honey, Beeswax, Bee Pollen, Beeswax Candle, Beeswax Products)
--    are present and active in public.categories.
-- 2. Align existing products (e.g. Ajwain Honey, Lychee Honey, Multiflora Honey) to reference
--    the existing category name ('Honey') without deleting or resetting any catalog data.
-- ============================================================

INSERT INTO public.categories (slug, name, sort_order, active)
VALUES
  ('honey', 'Honey', 1, true),
  ('beeswax', 'Beeswax', 2, true),
  ('bee-pollen', 'Bee Pollen', 3, true),
  ('beeswax-candle', 'Beeswax Candle', 4, true),
  ('beeswax-products', 'Beeswax Products', 5, true)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  active = true;

-- Ensure Honey and core shop categories are active
UPDATE public.categories
SET active = true
WHERE slug IN ('honey', 'beeswax', 'bee-pollen', 'beeswax-candle', 'beeswax-products')
   OR name IN ('Honey', 'Beeswax', 'Bee Pollen', 'Beeswax Candle', 'Beeswax Products');

-- Align existing Honey products so Admin dropdown and Shop filtering match cleanly
UPDATE public.products
SET category = 'Honey'
WHERE category IN (
  'Single Flora Honey',
  'Multiflora Honey',
  'Raw Honey',
  'Honey Comb',
  'Gift Packs',
  'Forest Honey',
  'Single Flora',
  'Multiflora',
  'Single-Flora',
  'Honeycomb',
  'Gift Pack',
  'Gift',
  'Wild Forest Honey',
  'honey'
) OR category IS NULL OR trim(category) = '';
