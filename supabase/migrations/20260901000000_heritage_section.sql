-- Migration: Heritage CMS Section

CREATE TABLE IF NOT EXISTS public.heritage_section (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  eyebrow text DEFAULT 'OUR HERITAGE',
  title text DEFAULT 'Where Purity Begins',
  description text,
  video_url text,
  video_poster_url text,
  cta_text text DEFAULT 'KNOW MORE ABOUT US',
  cta_url text DEFAULT '/our-story',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.heritage_points (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id uuid REFERENCES public.heritage_section(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.heritage_media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id uuid REFERENCES public.heritage_section(id) ON DELETE CASCADE,
  media_type text NOT NULL, -- e.g. 'secondary_card'
  media_url text,
  title text,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.heritage_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for active heritage sections"
  ON public.heritage_section FOR SELECT
  USING (true);

CREATE POLICY "Public read access for active heritage points"
  ON public.heritage_points FOR SELECT
  USING (true);

CREATE POLICY "Public read access for heritage media"
  ON public.heritage_media FOR SELECT
  USING (true);

-- Admin full access
CREATE POLICY "Admin full access heritage_section"
  ON public.heritage_section
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access heritage_points"
  ON public.heritage_points
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access heritage_media"
  ON public.heritage_media
  FOR ALL
  USING (auth.role() = 'authenticated');


-- Seed data if empty
INSERT INTO public.heritage_section (id, eyebrow, title, description, cta_text, cta_url, is_active)
SELECT '11111111-1111-1111-1111-111111111111', 'OUR HERITAGE', 'Where Purity Begins', 'Every drop reflects generations of beekeeping, sustainable farming, and an unwavering commitment to quality.', 'KNOW MORE ABOUT US', '/our-story', true
WHERE NOT EXISTS (SELECT 1 FROM public.heritage_section);

INSERT INTO public.heritage_points (section_id, title, sort_order)
SELECT '11111111-1111-1111-1111-111111111111', 'Pure & Unadulterated Honey', 1
WHERE NOT EXISTS (SELECT 1 FROM public.heritage_points);

INSERT INTO public.heritage_points (section_id, title, sort_order)
SELECT '11111111-1111-1111-1111-111111111111', 'Ethically Sourced & Sustainably Harvested', 2
WHERE NOT EXISTS (SELECT 1 FROM public.heritage_points);

INSERT INTO public.heritage_points (section_id, title, sort_order)
SELECT '11111111-1111-1111-1111-111111111111', 'Lab Tested for Moisture, HMF & Purity', 3
WHERE NOT EXISTS (SELECT 1 FROM public.heritage_points);

INSERT INTO public.heritage_points (section_id, title, sort_order)
SELECT '11111111-1111-1111-1111-111111111111', 'No Artificial Flavours or Preservatives', 4
WHERE NOT EXISTS (SELECT 1 FROM public.heritage_points);

INSERT INTO public.heritage_media (section_id, media_type, title, description)
SELECT '11111111-1111-1111-1111-111111111111', 'secondary_card', 'Naturally Sweet. Truly Wholesome.', 'Experience the authentic aroma and floral notes of honey straight from the comb. No processing, no overheating—just 100% natural goodness.'
WHERE NOT EXISTS (SELECT 1 FROM public.heritage_media);
