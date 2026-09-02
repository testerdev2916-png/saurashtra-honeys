-- Migration: Dedicated Homepage Heritage Video
CREATE TABLE IF NOT EXISTS public.homepage_heritage_video (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  eyebrow text DEFAULT 'OUR HERITAGE',
  title text DEFAULT 'Where Purity Begins',
  video_url text,
  poster_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE public.homepage_heritage_video ENABLE ROW LEVEL SECURITY;

-- Only admins can manage
CREATE POLICY "Admins manage homepage_heritage_video"
  ON public.homepage_heritage_video
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Public can read
CREATE POLICY "Public read homepage_heritage_video"
  ON public.homepage_heritage_video
  FOR SELECT
  TO public
  USING (true);

-- Insert a default record if empty so admin has something to edit
INSERT INTO public.homepage_heritage_video (eyebrow, title, is_active)
SELECT 'OUR HERITAGE', 'Where Purity Begins', true
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_heritage_video);
