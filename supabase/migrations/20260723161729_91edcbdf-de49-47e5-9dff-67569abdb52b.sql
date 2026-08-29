
-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  description text,
  category text,
  flora text,
  badge text,
  price integer NOT NULL DEFAULT 0,
  price_max integer,
  mrp integer,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_key text,
  image_url text,
  stock_quantity integer NOT NULL DEFAULT 100,
  in_stock boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  seo_title text,
  seo_description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin write products" ON public.products
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER products_touch_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_sort_idx ON public.products (sort_order);

-- =========================
-- HERO SLIDES
-- =========================
CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT 'home',
  eyebrow text,
  title text NOT NULL,
  title_accent text,
  subtitle text,
  image_key text,
  image_url text,
  cta_label text,
  cta_href text NOT NULL DEFAULT '/shop',
  align text NOT NULL DEFAULT 'left',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT ALL ON public.hero_slides TO service_role;

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active slides" ON public.hero_slides
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin write slides" ON public.hero_slides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER hero_slides_touch_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX hero_slides_page_sort_idx ON public.hero_slides (page, sort_order);

-- =========================
-- REVIEWS: pending by default + helpful count for sorting
-- =========================
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS helpful_count integer NOT NULL DEFAULT 0;

-- =========================
-- SEED PRODUCTS (8)
-- =========================
INSERT INTO public.products
  (slug, name, tagline, description, category, flora, badge, price, price_max, rating, reviews_count, sizes, benefits, image_key, sort_order)
VALUES
('ajwain-honey', 'Ajwain Honey', 'Raw • Unfiltered • Unheated',
 'Sourced from the nectar of Ajwain flowers, this honey is rich in antioxidants and known to support digestion, immunity and overall wellness.',
 'Single Flora', 'Ajwain', 'BESTSELLER', 349, 899, 4.8, 256,
 '["250g","500g","1kg"]'::jsonb,
 '["Supports digestion & gut health","Enhances immunity naturally","Rich in antioxidants","Natural source of energy"]'::jsonb,
 'ajwain-honey', 1),
('fennel-honey', 'Fennel Honey', 'Raw • Unfiltered • Unheated',
 'Collected from fennel blossoms of Saurashtra, this honey supports gut health with a subtle, refreshing flavour.',
 'Single Flora', 'Fennel', NULL, 349, 899, 4.7, 184,
 '["250g","500g","1kg"]'::jsonb,
 '["Good for metabolism","Bloating relief","Cooling properties","Natural sweetness"]'::jsonb,
 'fennel-honey', 2),
('lychee-honey', 'Lychee Honey', 'Raw • Unfiltered • Unheated',
 'Harvested from lychee orchards in bloom — smooth, mildly fruity honey that families love.',
 'Single Flora', 'Lychee', 'PREMIUM', 399, 999, 4.8, 142,
 '["250g","500g","1kg"]'::jsonb,
 '["Natural energy booster","Immunity support","Delicate floral notes","Kids-friendly"]'::jsonb,
 'lychee-honey', 3),
('multiflora-honey', 'Multiflora Honey', 'Raw • Unfiltered • Unheated',
 'A wholesome blend from diverse wildflowers of Saurashtra — the perfect everyday jar.',
 'Multiflora', 'Multiflora', NULL, 299, 799, 4.6, 312,
 '["250g","500g","1kg"]'::jsonb,
 '["Daily wellness","Balanced natural taste","Rich in enzymes","Everyday use"]'::jsonb,
 'multiflora-honey', 4),
('raw-honey-squeeze', 'Raw Honey (Squeeze)', 'Raw • Unfiltered • Squeeze Bottle',
 'Our signature raw honey in a mess-free squeeze bottle — perfect for kitchens, tea and toast.',
 'Raw Honey', NULL, 'NEW', 249, 449, 4.5, 208,
 '["250ml","500ml"]'::jsonb,
 '["Convenient squeeze bottle","Wholesome & versatile","Everyday use","Travel-friendly"]'::jsonb,
 'raw-honey-squeeze', 5),
('honey-comb', 'Honey Comb', '100% Natural • Raw & Unprocessed',
 'Raw honey comb straight from the frame — an unforgettable taste experience.',
 'Honey Comb', NULL, 'PREMIUM', 499, NULL, 4.9, 87,
 '["250g","500g"]'::jsonb,
 '["Straight from the hive","Chewable wax + honey","Rich in enzymes","Nothing added"]'::jsonb,
 'honey-comb', 6),
('premium-gift-pack', 'Premium Gift Pack', 'Three curated single flora honeys',
 'A curated trio of our best single-flora honeys in a luxury gift box — Ajwain, Fennel and Lychee.',
 'Gift Packs', NULL, NULL, 749, NULL, 4.8, 64,
 '["3 × 250g"]'::jsonb,
 '["Elegant packaging","Three flora variety","Perfect for gifting","Personalisation available"]'::jsonb,
 'premium-gift-pack', 7),
('family-gift-pack', 'Family Gift Pack', 'Three larger jars for the whole family',
 'A healthy choice for the whole family — three larger jars of our most-loved honeys in premium packaging.',
 'Gift Packs', NULL, NULL, 1149, NULL, 4.7, 41,
 '["3 × 500g"]'::jsonb,
 '["Larger 500g jars","Multiflora + Ajwain + Lychee","Great for celebrations","Made-to-order"]'::jsonb,
 'family-gift-pack', 8);

-- =========================
-- SEED HERO SLIDES (6, homepage)
-- =========================
INSERT INTO public.hero_slides
  (page, eyebrow, title, title_accent, subtitle, image_key, cta_label, cta_href, align, sort_order)
VALUES
('home', 'From the Farms of Saurashtra', 'Pure by Nature.', 'Crafted by Bees.',
 'Raw. Natural. Unfiltered. From the wildflower farms of Saurashtra to your home, with the care of a family that has been keeping bees for over five decades.',
 'hero-honey', 'SHOP NOW', '/shop', 'left', 1),
('home', 'Straight From The Hive', 'Real Honeycomb.', 'Chew The Purity.',
 'Golden, chewable honeycomb frames — a rare, unforgettable taste of nature''s most complete sweetener.',
 'prod-honeycomb', 'SHOP HONEYCOMB', '/shop', 'left', 2),
('home', 'Curated Gift Packs', 'Gift Nature''s', 'Finest Trio.',
 'Premium single-flora honeys in elegant boxes — the healthiest gift for family, friends and corporate hampers.',
 'prod-giftpack', 'EXPLORE GIFT PACKS', '/shop', 'left', 3),
('home', 'Single-Flora Rarities', 'Ajwain, Lychee', '& Fennel Honey.',
 'Distinct floral notes captured in every jar — from the fields of Saurashtra to your table.',
 'honey-drizzle', 'EXPLORE SINGLE FLORA', '/shop', 'left', 4),
('home', 'Our Family, Our Bees', 'Five Decades of', 'Ethical Beekeeping.',
 'Meet the family behind every jar — beekeepers who put the health of the hive first.',
 'bee-farm', 'OUR STORY', '/our-story', 'center', 5),
('home', 'Independently Lab Tested', 'Purity You Can', 'Actually Verify.',
 'Every batch tested for moisture, HMF and adulterants. Real reports, real honey — no shortcuts.',
 'family-honey', 'VIEW PRODUCTS', '/shop', 'left', 6);
