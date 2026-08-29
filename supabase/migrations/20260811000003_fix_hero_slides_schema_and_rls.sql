-- 1. Make legacy text columns nullable since banners are now purely image-based
ALTER TABLE public.hero_slides
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN cta_href DROP NOT NULL,
  ALTER COLUMN align DROP NOT NULL;

-- 2. Ensure RLS is enabled
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- 3. Drop all previous confusing policies to start fresh safely
DROP POLICY IF EXISTS "public read active slides" ON public.hero_slides;
DROP POLICY IF EXISTS "admin write slides" ON public.hero_slides;
DROP POLICY IF EXISTS "slides public read" ON public.hero_slides;
DROP POLICY IF EXISTS "slides staff manage" ON public.hero_slides;
DROP POLICY IF EXISTS "slides public read active" ON public.hero_slides;
DROP POLICY IF EXISTS "slides admin read all" ON public.hero_slides;
DROP POLICY IF EXISTS "slides admin insert" ON public.hero_slides;
DROP POLICY IF EXISTS "slides admin update" ON public.hero_slides;
DROP POLICY IF EXISTS "slides admin delete" ON public.hero_slides;

-- 4. Recreate precise policies for SELECT
-- Public can only see active slides
CREATE POLICY "slides_select_public_active" ON public.hero_slides
  FOR SELECT TO anon, authenticated
  USING (active = true);

-- Admins can see all slides (required for .insert().select() to work for inactive slides)
CREATE POLICY "slides_select_admin_all" ON public.hero_slides
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

-- 5. Recreate precise policies for mutations
CREATE POLICY "slides_insert_admin" ON public.hero_slides
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

CREATE POLICY "slides_update_admin" ON public.hero_slides
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

CREATE POLICY "slides_delete_admin" ON public.hero_slides
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

