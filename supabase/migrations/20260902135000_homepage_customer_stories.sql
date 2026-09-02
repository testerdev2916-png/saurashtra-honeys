CREATE TABLE IF NOT EXISTS public.homepage_customer_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('video', 'photo', 'review')),
  customer_name text NOT NULL,
  customer_city text,
  customer_state text,
  customer_photo text,
  media_url text,
  poster_image text,
  review_text text,
  rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  product_id uuid,
  product_name text,
  product_slug text,
  verified boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
GRANT SELECT ON public.homepage_customer_stories TO anon, authenticated;
GRANT ALL ON public.homepage_customer_stories TO service_role;

ALTER TABLE public.homepage_customer_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read published stories" ON public.homepage_customer_stories;
CREATE POLICY "public read published stories" ON public.homepage_customer_stories 
  FOR SELECT TO anon, authenticated 
  USING (published = true OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "admin all stories" ON public.homepage_customer_stories;
CREATE POLICY "admin all stories" ON public.homepage_customer_stories 
  FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(),'admin')) 
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Update trigger
DROP TRIGGER IF EXISTS homepage_stories_touch ON public.homepage_customer_stories;
CREATE TRIGGER homepage_stories_touch 
  BEFORE UPDATE ON public.homepage_customer_stories 
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Dummy data to serve as placeholders based on existing reviews (if there are no videos/photos yet)
-- Note: 'video' and 'photo' types can be added later by the admin via the CMS.
INSERT INTO public.homepage_customer_stories (type, customer_name, customer_city, customer_state, review_text, rating, product_name, product_slug, verified, published, sort_order)
VALUES 
  ('review', 'Neha Shah', 'Ahmedabad', 'Gujarat', 'The Ajwain flora honey is incredible. You can actually smell and taste the difference from commercial store brands. My family loves it!', 5, 'Ajwain Honey', 'ajwain-honey', true, true, 10),
  ('review', 'Karan Mehta', 'Rajkot', 'Gujarat', 'Finally found an authentic raw honey brand from Gujarat. Every bottle comes with NABL test purity reports. Super trustworthy!', 5, 'Raw Honey', 'raw-honey', true, true, 20),
  ('review', 'Ritika Verma', 'Surat', 'Gujarat', 'The raw honeycomb was a hit with my kids! Truly unfiltered, natural sweetness without any artificial aftertaste.', 5, 'Raw Honeycomb', 'raw-honeycomb', true, true, 30);
