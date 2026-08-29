-- ============================================================================
-- UNIFIED ADMIN RLS SECURITY AUDIT
-- Resolves "new row violates row-level security policy"
-- Enforces strict STAFF/ADMIN permissions for all administrative tables.
-- Separates ANON / AUTHENTICATED policies cleanly.
-- ============================================================================

-- A. HELPER FUNCTIONS
-- Re-affirm is_staff and has_role just in case
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN _user_id IS NULL THEN false ELSE EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'admin', 'manager', 'editor')
  ) END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN _user_id IS NULL THEN false ELSE EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND (role = _role OR (_role = 'admin' AND role IN ('super_admin', 'admin', 'manager', 'editor')))
  ) END;
$$;

-- Ensure execute grants
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Macro variable for policy cleanup script generator logic
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'site_settings', 'app_settings', 'hero_slides', 'homepage_videos', 
        'homepage_sections', 'announcement_items', 'homepage_category_selection', 
        'homepage_featured_products', 'homepage_trust_items', 'products', 
        'product_variants', 'categories', 'orders', 'reviews', 'form_submissions', 
        'blog_posts', 'blog_categories', 'who_we_supply_services', 'redirects', 
        'user_roles', 'audit_logs'
    ];
BEGIN
    -- Drop all existing policies on these tables to prevent overlap
    FOR tbl IN SELECT unnest(tables) LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        
        -- Drop all existing policies for the table
        DECLARE
            pol RECORD;
        BEGIN
            FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
            END LOOP;
        END;
    END LOOP;
END $$;


-- ============================================================================
-- B. RECREATE POLICIES TABLE BY TABLE
-- ============================================================================

-- 1. site_settings (Public read if is_public, staff manage)
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
CREATE POLICY "site_settings_anon_read" ON public.site_settings FOR SELECT TO anon USING (is_public = true);
CREATE POLICY "site_settings_auth_read" ON public.site_settings FOR SELECT TO authenticated USING (is_public = true OR public.is_staff(auth.uid()));
CREATE POLICY "site_settings_staff_manage" ON public.site_settings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 2. app_settings (Public read true, staff manage)
GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
CREATE POLICY "app_settings_anon_read" ON public.app_settings FOR SELECT TO anon USING (true);
CREATE POLICY "app_settings_auth_read" ON public.app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "app_settings_staff_manage" ON public.app_settings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 3. hero_slides (Public read active, staff manage)
GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
CREATE POLICY "hero_slides_anon_read" ON public.hero_slides FOR SELECT TO anon USING (active = true);
CREATE POLICY "hero_slides_auth_read" ON public.hero_slides FOR SELECT TO authenticated USING (active = true OR public.is_staff(auth.uid()));
CREATE POLICY "hero_slides_staff_manage" ON public.hero_slides FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 4. homepage_videos (Public read active, staff manage)
GRANT SELECT ON public.homepage_videos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_videos TO authenticated;
CREATE POLICY "homepage_videos_anon_read" ON public.homepage_videos FOR SELECT TO anon USING (is_active = true AND status = 'published');
CREATE POLICY "homepage_videos_auth_read" ON public.homepage_videos FOR SELECT TO authenticated USING ((is_active = true AND status = 'published') OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_videos_staff_manage" ON public.homepage_videos FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 5. homepage_sections
GRANT SELECT ON public.homepage_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
CREATE POLICY "homepage_sections_anon_read" ON public.homepage_sections FOR SELECT TO anon USING (true);
CREATE POLICY "homepage_sections_auth_read" ON public.homepage_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "homepage_sections_staff_manage" ON public.homepage_sections FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 6. announcement_items
GRANT SELECT ON public.announcement_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcement_items TO authenticated;
CREATE POLICY "announcement_items_anon_read" ON public.announcement_items FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "announcement_items_auth_read" ON public.announcement_items FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "announcement_items_staff_manage" ON public.announcement_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 7. homepage_category_selection
GRANT SELECT ON public.homepage_category_selection TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_category_selection TO authenticated;
CREATE POLICY "homepage_cat_sel_anon_read" ON public.homepage_category_selection FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_cat_sel_auth_read" ON public.homepage_category_selection FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_cat_sel_staff_manage" ON public.homepage_category_selection FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 8. homepage_featured_products
GRANT SELECT ON public.homepage_featured_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_featured_products TO authenticated;
CREATE POLICY "homepage_feat_prod_anon_read" ON public.homepage_featured_products FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_feat_prod_auth_read" ON public.homepage_featured_products FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_feat_prod_staff_manage" ON public.homepage_featured_products FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 9. homepage_trust_items
GRANT SELECT ON public.homepage_trust_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_trust_items TO authenticated;
CREATE POLICY "homepage_trust_anon_read" ON public.homepage_trust_items FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_trust_auth_read" ON public.homepage_trust_items FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_trust_staff_manage" ON public.homepage_trust_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 10. products
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
CREATE POLICY "products_anon_read" ON public.products FOR SELECT TO anon USING (published = true);
CREATE POLICY "products_auth_read" ON public.products FOR SELECT TO authenticated USING (published = true OR public.is_staff(auth.uid()));
CREATE POLICY "products_staff_manage" ON public.products FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 11. product_variants
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
CREATE POLICY "variants_anon_read" ON public.product_variants FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "variants_auth_read" ON public.product_variants FOR SELECT TO authenticated USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "variants_staff_manage" ON public.product_variants FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 12. categories
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
CREATE POLICY "categories_anon_read" ON public.categories FOR SELECT TO anon USING (true);
CREATE POLICY "categories_auth_read" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "categories_staff_manage" ON public.categories FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 13. orders
GRANT SELECT ON public.orders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;
CREATE POLICY "orders_auth_read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "orders_auth_insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "orders_staff_update" ON public.orders FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "orders_staff_delete" ON public.orders FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- 14. reviews
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
CREATE POLICY "reviews_anon_read" ON public.reviews FOR SELECT TO anon USING (status = 'approved');
CREATE POLICY "reviews_auth_read" ON public.reviews FOR SELECT TO authenticated USING (status = 'approved' OR auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "reviews_auth_insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "reviews_staff_update" ON public.reviews FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "reviews_staff_delete" ON public.reviews FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- 15. form_submissions
GRANT SELECT, INSERT ON public.form_submissions TO anon, authenticated;
GRANT UPDATE, DELETE ON public.form_submissions TO authenticated;
CREATE POLICY "form_submissions_anon_insert" ON public.form_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "form_submissions_auth_insert" ON public.form_submissions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "form_submissions_staff_manage" ON public.form_submissions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 16. blog_posts
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
CREATE POLICY "blog_posts_anon_read" ON public.blog_posts FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "blog_posts_auth_read" ON public.blog_posts FOR SELECT TO authenticated USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "blog_posts_staff_manage" ON public.blog_posts FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 17. blog_categories
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
CREATE POLICY "blog_categories_anon_read" ON public.blog_categories FOR SELECT TO anon USING (true);
CREATE POLICY "blog_categories_auth_read" ON public.blog_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "blog_categories_staff_manage" ON public.blog_categories FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 18. who_we_supply_services
GRANT SELECT ON public.who_we_supply_services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.who_we_supply_services TO authenticated;
CREATE POLICY "who_we_supply_anon_read" ON public.who_we_supply_services FOR SELECT TO anon USING (active = true);
CREATE POLICY "who_we_supply_auth_read" ON public.who_we_supply_services FOR SELECT TO authenticated USING (active = true OR public.is_staff(auth.uid()));
CREATE POLICY "who_we_supply_staff_manage" ON public.who_we_supply_services FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 19. redirects
GRANT SELECT ON public.redirects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
CREATE POLICY "redirects_anon_read" ON public.redirects FOR SELECT TO anon USING (active = true);
CREATE POLICY "redirects_auth_read" ON public.redirects FOR SELECT TO authenticated USING (active = true OR public.is_staff(auth.uid()));
CREATE POLICY "redirects_staff_manage" ON public.redirects FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 20. user_roles
GRANT SELECT ON public.user_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
CREATE POLICY "user_roles_auth_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "user_roles_staff_manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 21. audit_logs
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT INSERT ON public.audit_logs TO authenticated;
-- Notice we grant INSERT for the security definer function, just in case context is dropped
CREATE POLICY "audit_logs_staff_read" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "audit_logs_auth_insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id OR public.is_staff(auth.uid()));


-- ============================================================================
-- C. SUPABASE STORAGE BUCKETS
-- ============================================================================

DO $$
BEGIN
  ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END
$$;

DROP POLICY IF EXISTS "buckets public read" ON storage.buckets;
DROP POLICY IF EXISTS "app buckets public read" ON storage.objects;
DROP POLICY IF EXISTS "app buckets staff insert" ON storage.objects;
DROP POLICY IF EXISTS "app buckets staff update" ON storage.objects;
DROP POLICY IF EXISTS "app buckets staff delete" ON storage.objects;
DROP POLICY IF EXISTS "public content read" ON storage.objects;
DROP POLICY IF EXISTS "public content staff insert" ON storage.objects;
DROP POLICY IF EXISTS "public content staff update" ON storage.objects;
DROP POLICY IF EXISTS "public content staff delete" ON storage.objects;
DROP POLICY IF EXISTS "storage public read" ON storage.objects;
DROP POLICY IF EXISTS "storage staff insert" ON storage.objects;
DROP POLICY IF EXISTS "storage staff update" ON storage.objects;
DROP POLICY IF EXISTS "storage staff delete" ON storage.objects;

-- Buckets public read
CREATE POLICY "buckets_public_read" ON storage.buckets FOR SELECT TO anon, authenticated USING (true);

-- Objects public read
CREATE POLICY "objects_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id IN (
      'media', 'product-images', 'logos', 'hero', 'banners', 
      'blog', 'blog-images', 'avatars', 'documents', 'general', 'review-media', 'stories'
    )
  );

-- Objects staff manage
CREATE POLICY "objects_staff_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "objects_staff_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "objects_staff_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

