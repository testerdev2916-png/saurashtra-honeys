-- Drop old policies that might be causing conflicts
DROP POLICY IF EXISTS "public read active slides" ON public.hero_slides;
DROP POLICY IF EXISTS "admin write slides" ON public.hero_slides;
DROP POLICY IF EXISTS "slides public read" ON public.hero_slides;
DROP POLICY IF EXISTS "slides staff manage" ON public.hero_slides;

-- Public/anonymous users can READ active hero slides only
CREATE POLICY "slides public read active" ON public.hero_slides
  FOR SELECT TO anon, authenticated
  USING (active = true);

-- Staff/Admins can READ all hero slides
CREATE POLICY "slides admin read all" ON public.hero_slides
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

-- Authenticated admin users can INSERT hero slides
CREATE POLICY "slides admin insert" ON public.hero_slides
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

-- Authenticated admin users can UPDATE hero slides
CREATE POLICY "slides admin update" ON public.hero_slides
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));

-- Authenticated admin users can DELETE hero slides
CREATE POLICY "slides admin delete" ON public.hero_slides
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_staff(auth.uid()));
