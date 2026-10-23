CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_sections TO anon, authenticated;
GRANT ALL ON public.homepage_sections TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read homepage_sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "staff manage homepage_sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "homepage_sections_anon_read" ON public.homepage_sections;
DROP POLICY IF EXISTS "homepage_sections_auth_read" ON public.homepage_sections;
DROP POLICY IF EXISTS "homepage_sections_staff_manage" ON public.homepage_sections;

CREATE POLICY "homepage_sections_anon_read" ON public.homepage_sections FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_sections_auth_read" ON public.homepage_sections FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_sections_staff_manage" ON public.homepage_sections FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
