-- ============================================================
-- 20260731110000_beauty_products_category.sql
-- ============================================================
-- 1. Insert 'Beauty Products' category into public.categories
-- 2. Ensure public.products has an 'attributes' JSONB column
-- 3. Seed sample products for non-Honey categories if they have 0 products
-- ============================================================

INSERT INTO public.categories (slug, name, image_url, sort_order, active)
VALUES ('beauty-products', 'Beauty Products', NULL, 6, true)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Insert seed products for Beauty Products if none exist
INSERT INTO public.products (
  slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes
)
SELECT * FROM (
  VALUES
  (
    'honey-beeswax-lip-balm',
    'Honey & Beeswax Lip Balm',
    'Intensive Lip Care • 100% Natural',
    'Deeply moisturizing lip balm made with pure Saurashtra honey, natural beeswax and cold-pressed oils.',
    'Beauty Products',
    NULL,
    'BESTSELLER',
    199,
    NULL,
    249,
    4.9,
    142,
    '["20g"]'::jsonb,
    '["Soothes chapped lips", "Long-lasting hydration", "100% natural ingredients", "Non-greasy formula"]'::jsonb,
    'prod-giftpack',
    NULL,
    true,
    20,
    '{"Product Type": "Lip Care"}'::jsonb
  ),
  (
    'raw-honey-facial-polish',
    'Raw Honey Facial Polish',
    'Gentle Exfoliation & Glow',
    'Gentle facial scrub combining raw crystallized honey and botanical powders to buff away dull skin.',
    'Beauty Products',
    NULL,
    'PREMIUM',
    449,
    799,
    549,
    4.8,
    89,
    '["50g", "100g"]'::jsonb,
    '["Gently exfoliates", "Boosts natural glow", "Rich in enzymes", "Suitable for all skin types"]'::jsonb,
    'prod-ajwain',
    NULL,
    true,
    21,
    '{"Product Type": "Skin Care"}'::jsonb
  ),
  (
    'royal-jelly-hair-mask',
    'Royal Jelly Hair Mask',
    'Deep Conditioning & Shine',
    'Restorative hair treatment infused with raw honey and royal jelly to nourish dry, damaged hair.',
    'Beauty Products',
    NULL,
    'NEW',
    599,
    NULL,
    699,
    4.7,
    63,
    '["100g"]'::jsonb,
    '["Deeply conditions", "Adds natural shine", "Strengthens roots", "Sulfate-free"]'::jsonb,
    'prod-lychee',
    NULL,
    true,
    22,
    '{"Product Type": "Hair Care"}'::jsonb
  ),
  (
    'beeswax-body-butter',
    'Beeswax Body Butter',
    '24-Hour Rich Moisture',
    'Rich body butter crafted with unrefined beeswax and honey to protect and soften dry skin.',
    'Beauty Products',
    NULL,
    NULL,
    399,
    699,
    499,
    4.8,
    115,
    '["50g", "100g"]'::jsonb,
    '["24-hour moisture", "Protective moisture barrier", "Natural honey aroma", "Absorbs smoothly"]'::jsonb,
    'prod-fennel',
    NULL,
    true,
    23,
    '{"Product Type": "Body Care"}'::jsonb
  )
) AS v(slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE category = 'Beauty Products'
);

-- Insert seed product for Beeswax if none exist
INSERT INTO public.products (
  slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes
)
SELECT * FROM (
  VALUES
  (
    'pure-beeswax-block',
    '100% Pure Beeswax Block',
    'Natural Unrefined Wax • Multi-Purpose',
    'Pure aromatic beeswax blocks from our Saurashtra apiaries, ideal for DIY cosmetics, candles and salves.',
    'Beeswax',
    NULL,
    'BESTSELLER',
    299,
    899,
    349,
    4.8,
    98,
    '["100g", "250g", "500g"]'::jsonb,
    '["100% pure & unrefined", "Natural honey aroma", "Great for DIY skincare", "Clean burn for candles"]'::jsonb,
    'prod-honeycomb',
    NULL,
    true,
    30,
    '{}'::jsonb
  )
) AS v(slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE category = 'Beeswax'
);

-- Insert seed product for Bee Pollen if none exist
INSERT INTO public.products (
  slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes
)
SELECT * FROM (
  VALUES
  (
    'raw-bee-pollen-granules',
    'Raw Bee Pollen Granules',
    'Superfood • Amino Acids & Vitamins',
    'Multi-floral bee pollen granules harvested sustainably from Saurashtra wildflowers. Packed with protein and vitamins.',
    'Bee Pollen',
    NULL,
    'PREMIUM',
    499,
    949,
    599,
    4.9,
    76,
    '["100g", "250g"]'::jsonb,
    '["Rich in protein & vitamins", "Daily superfood boost", "Sustainably harvested", "Mild sweet floral taste"]'::jsonb,
    'prod-multiflora',
    NULL,
    true,
    31,
    '{}'::jsonb
  )
) AS v(slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE category = 'Bee Pollen'
);

-- Insert seed product for Beeswax Candle if none exist
INSERT INTO public.products (
  slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes
)
SELECT * FROM (
  VALUES
  (
    'hand-rolled-beeswax-candle',
    'Hand-Rolled Beeswax Candle',
    'Natural Honey Aroma • Clean Burning',
    'Hand-rolled natural beeswax candles that burn cleanly while releasing a subtle warm honey fragrance.',
    'Beeswax Candle',
    NULL,
    'NEW',
    249,
    449,
    299,
    4.8,
    54,
    '["Small", "Large"]'::jsonb,
    '["100% cotton wick", "Non-toxic & clean burning", "Subtle honey aroma", "Long burn time"]'::jsonb,
    'prod-giftpack',
    NULL,
    true,
    32,
    '{"Candle Type": "Pillar"}'::jsonb
  )
) AS v(slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE category = 'Beeswax Candle'
);

-- Insert seed product for Beeswax Products if none exist
INSERT INTO public.products (
  slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes
)
SELECT * FROM (
  VALUES
  (
    'natural-beeswax-wood-polish',
    'Natural Beeswax Wood & Leather Polish',
    '100% Natural Condition & Protect',
    'Natural beeswax condition balm formulated to protect, seal and shine fine wood and leather goods.',
    'Beeswax Products',
    NULL,
    NULL,
    349,
    599,
    399,
    4.7,
    42,
    '["50g", "100g"]'::jsonb,
    '["Protects wood & leather", "No synthetic chemicals", "Easy application", "Water-repellent barrier"]'::jsonb,
    'prod-honeycomb',
    NULL,
    true,
    33,
    '{"Product Type": "Wood & Leather Care"}'::jsonb
  )
) AS v(slug, name, tagline, description, category, flora, badge, price, price_max, mrp, rating, reviews_count, sizes, benefits, image_key, image_url, published, sort_order, attributes)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products WHERE category = 'Beeswax Products'
);
