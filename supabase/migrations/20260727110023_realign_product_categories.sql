-- Aligns existing products.category values with the new "Shop by Category"
-- taxonomy (Honey, Beeswax, Bee Pollen, Beeswax Candle, Beeswax Products).
-- Non-destructive: only rewrites the `category` text on rows that still carry
-- the old taxonomy values (Single Flora / Multiflora / Raw Honey / Honey Comb /
-- Gift Packs) — every current product is a honey item, so they all map to
-- the single "Honey" category. No rows are added or removed.
UPDATE public.products
SET category = 'Honey'
WHERE category IN ('Single Flora', 'Multiflora', 'Raw Honey', 'Honey Comb', 'Gift Packs');
