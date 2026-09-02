CREATE TABLE IF NOT EXISTS public.page_content (
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (page_slug, section_key)
);

-- RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read page_content" ON public.page_content
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "staff manage page_content" ON public.page_content
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()));

-- Automatically update updated_at
CREATE OR REPLACE FUNCTION update_page_content_modtime()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_page_content_updated_at ON public.page_content;
CREATE TRIGGER trg_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_modtime();
