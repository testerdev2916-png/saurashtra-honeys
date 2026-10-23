CREATE TABLE IF NOT EXISTS public.homepage_trust_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
GRANT SELECT ON public.homepage_trust_items TO anon, authenticated;
GRANT ALL ON public.homepage_trust_items TO service_role;
ALTER TABLE public.homepage_trust_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read homepage_trust_items" ON public.homepage_trust_items;
DROP POLICY IF EXISTS "staff manage homepage_trust_items" ON public.homepage_trust_items;
DROP POLICY IF EXISTS "homepage_trust_anon_read" ON public.homepage_trust_items;
DROP POLICY IF EXISTS "homepage_trust_auth_read" ON public.homepage_trust_items;
DROP POLICY IF EXISTS "homepage_trust_staff_manage" ON public.homepage_trust_items;

CREATE POLICY "homepage_trust_anon_read" ON public.homepage_trust_items FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_trust_auth_read" ON public.homepage_trust_items FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_trust_staff_manage" ON public.homepage_trust_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

NOTIFY pgrst, reload_schema;
