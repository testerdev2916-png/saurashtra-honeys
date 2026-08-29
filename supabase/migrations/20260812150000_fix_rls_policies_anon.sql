-- Fix RLS policies to prevent anon from calling has_role() and crashing

-- 1. Hero Slides Fix
DROP POLICY IF EXISTS "slides public read" ON public.hero_slides;
DROP POLICY IF EXISTS "slides_select_admin_all" ON public.hero_slides;
DROP POLICY IF EXISTS "slides_select_public_active" ON public.hero_slides;

CREATE POLICY "slides_anon_read" ON public.hero_slides
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "slides_auth_read" ON public.hero_slides
  FOR SELECT TO authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'));

-- 2. Products Fix (prevent AutoSeeder getting stuck due to similar errors if anon is somehow involved)
-- Although products public read uses has_role for authenticated, anon should only check published.
DROP POLICY IF EXISTS "products public read" ON public.products;

CREATE POLICY "products_anon_read" ON public.products
  FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "products_auth_read" ON public.products
  FOR SELECT TO authenticated
  USING (published = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 3. Variants Fix
DROP POLICY IF EXISTS "variants public read" ON public.product_variants;

CREATE POLICY "variants_anon_read" ON public.product_variants
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "variants_auth_read" ON public.product_variants
  FOR SELECT TO authenticated
  USING (is_active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));
