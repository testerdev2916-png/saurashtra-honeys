-- Seed the "Shop by Category" categories shown on the storefront homepage.
-- Non-destructive: only inserts rows that don't already exist (by slug),
-- and never touches image_url on existing rows so Admin-uploaded images
-- are never overwritten by re-running this migration.
INSERT INTO public.categories (slug, name, sort_order, active)
VALUES
  ('honey', 'Honey', 1, true),
  ('beeswax', 'Beeswax', 2, true),
  ('bee-pollen', 'Bee Pollen', 3, true),
  ('beeswax-candle', 'Beeswax Candle', 4, true),
  ('beeswax-products', 'Beeswax Products', 5, true)
ON CONFLICT (slug) DO NOTHING;
