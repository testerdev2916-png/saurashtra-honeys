-- Migration: Split anon/authenticated policies to avoid "permission denied for function is_staff"
-- This ensures security remains fully intact, is_staff is NOT granted to anon, 
-- and RLS correctly isolates the public vs staff logic.

-- 1. hero_slides
DROP POLICY IF EXISTS "slides public read" ON public.hero_slides;
CREATE POLICY "slides anon read" ON public.hero_slides
  FOR SELECT TO anon
  USING (active = true);
CREATE POLICY "slides auth read" ON public.hero_slides
  FOR SELECT TO authenticated
  USING (active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 2. site_settings
DROP POLICY IF EXISTS "site_settings public read" ON public.site_settings;
CREATE POLICY "site_settings anon read" ON public.site_settings
  FOR SELECT TO anon
  USING (is_public = true);
CREATE POLICY "site_settings auth read" ON public.site_settings
  FOR SELECT TO authenticated
  USING (is_public = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 3. products
DROP POLICY IF EXISTS "products public read" ON public.products;
CREATE POLICY "products anon read" ON public.products
  FOR SELECT TO anon
  USING (published = true);
CREATE POLICY "products auth read" ON public.products
  FOR SELECT TO authenticated
  USING (published = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 4. product_variants
DROP POLICY IF EXISTS "variants public read" ON public.product_variants;
CREATE POLICY "variants anon read" ON public.product_variants
  FOR SELECT TO anon
  USING (is_active = true);
CREATE POLICY "variants auth read" ON public.product_variants
  FOR SELECT TO authenticated
  USING (is_active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 5. blog_posts
DROP POLICY IF EXISTS "blog_posts public read" ON public.blog_posts;
CREATE POLICY "blog_posts anon read" ON public.blog_posts
  FOR SELECT TO anon
  USING (status = 'published');
CREATE POLICY "blog_posts auth read" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (status = 'published' OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 6. who_we_supply_services
DROP POLICY IF EXISTS "public read active who_we_supply_services" ON public.who_we_supply_services;
CREATE POLICY "anon read active who_we_supply_services" ON public.who_we_supply_services
  FOR SELECT TO anon
  USING (active = true);
CREATE POLICY "auth read active who_we_supply_services" ON public.who_we_supply_services
  FOR SELECT TO authenticated
  USING (active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 7. redirects
DROP POLICY IF EXISTS "redirects public read" ON public.redirects;
CREATE POLICY "redirects anon read" ON public.redirects
  FOR SELECT TO anon
  USING (active = true);
CREATE POLICY "redirects auth read" ON public.redirects
  FOR SELECT TO authenticated
  USING (active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 8. announcement_items
DROP POLICY IF EXISTS "public read announcement_items" ON public.announcement_items;
CREATE POLICY "anon read announcement_items" ON public.announcement_items
  FOR SELECT TO anon
  USING (enabled = true);
CREATE POLICY "auth read announcement_items" ON public.announcement_items
  FOR SELECT TO authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

-- 9. homepage_category_selection
DROP POLICY IF EXISTS "public read homepage_category_selection" ON public.homepage_category_selection;
CREATE POLICY "anon read homepage_category_selection" ON public.homepage_category_selection
  FOR SELECT TO anon
  USING (enabled = true);
CREATE POLICY "auth read homepage_category_selection" ON public.homepage_category_selection
  FOR SELECT TO authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

-- 10. homepage_featured_products
DROP POLICY IF EXISTS "public read homepage_featured_products" ON public.homepage_featured_products;
CREATE POLICY "anon read homepage_featured_products" ON public.homepage_featured_products
  FOR SELECT TO anon
  USING (enabled = true);
CREATE POLICY "auth read homepage_featured_products" ON public.homepage_featured_products
  FOR SELECT TO authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));

-- 11. homepage_trust_items
DROP POLICY IF EXISTS "public read homepage_trust_items" ON public.homepage_trust_items;
CREATE POLICY "anon read homepage_trust_items" ON public.homepage_trust_items
  FOR SELECT TO anon
  USING (enabled = true);
CREATE POLICY "auth read homepage_trust_items" ON public.homepage_trust_items
  FOR SELECT TO authenticated
  USING (enabled = true OR public.is_staff(auth.uid()));
