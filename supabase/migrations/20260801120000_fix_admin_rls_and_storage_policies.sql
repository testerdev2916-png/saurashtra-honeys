-- 20260801120000_fix_admin_rls_and_storage_policies.sql
-- Resolves "new row violates row-level security policy" for admin panel saves & storage uploads.
--
-- 1. Helper functions: is_staff, has_role, is_admin, claim_admin_if_none
-- 2. Grants for authenticated role on all admin-managed tables
-- 3. RLS policies for admin-managed database tables (hero_slides, site_settings, products, etc.)
-- 4. RLS policies for Supabase Storage (storage.objects & storage.buckets)

-- ============================================================================
-- 1. HELPER FUNCTIONS FOR ADMIN & STAFF ROLES
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin', 'manager', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin', 'manager', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = _role
        OR (_role = 'admin' AND role IN ('super_admin', 'admin', 'manager', 'editor'))
      )
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Securely claim admin role if none exists, or if current user already is admin
CREATE OR REPLACE FUNCTION public.claim_admin_if_none()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  has_admin boolean;
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = uid
      AND role IN ('super_admin', 'admin', 'manager', 'editor')
  ) THEN
    RETURN true;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role IN ('super_admin', 'admin')
  ) INTO has_admin;

  IF has_admin THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN true;
END
$$;

GRANT EXECUTE ON FUNCTION public.claim_admin_if_none() TO authenticated, service_role;

-- ============================================================================
-- 2. TABLE GRANTS TO AUTHENTICATED
-- Ensure PostgreSQL table permissions exist before RLS checks
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.who_we_supply_services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.form_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.blog_categories TO anon;
GRANT SELECT ON public.who_we_supply_services TO anon;
GRANT SELECT ON public.redirects TO anon;
GRANT SELECT ON public.app_settings TO anon;

-- ============================================================================
-- 3. RLS POLICIES FOR ADMIN-MANAGED DATABASE TABLES
-- ============================================================================

-- ---- hero_slides ----
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read active slides" ON public.hero_slides;
DROP POLICY IF EXISTS "admin write slides" ON public.hero_slides;
DROP POLICY IF EXISTS "slides public read" ON public.hero_slides;
DROP POLICY IF EXISTS "slides staff manage" ON public.hero_slides;

CREATE POLICY "slides public read" ON public.hero_slides
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "slides staff manage" ON public.hero_slides
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- site_settings ----
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings public read" ON public.site_settings;
DROP POLICY IF EXISTS "settings staff write" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings public read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings staff manage" ON public.site_settings;

CREATE POLICY "site_settings public read" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (is_public = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site_settings staff manage" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- products ----
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products public read" ON public.products;
DROP POLICY IF EXISTS "products staff manage" ON public.products;
DROP POLICY IF EXISTS "admin write products" ON public.products;

CREATE POLICY "products public read" ON public.products
  FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "products staff manage" ON public.products
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- product_variants ----
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "variants public read" ON public.product_variants;
DROP POLICY IF EXISTS "variants staff manage" ON public.product_variants;

CREATE POLICY "variants public read" ON public.product_variants
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "variants staff manage" ON public.product_variants
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- categories ----
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories public read" ON public.categories;
DROP POLICY IF EXISTS "categories staff manage" ON public.categories;

CREATE POLICY "categories public read" ON public.categories
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "categories staff manage" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- blog_posts ----
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_posts public read" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts staff manage" ON public.blog_posts;

CREATE POLICY "blog_posts public read" ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog_posts staff manage" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- who_we_supply_services ----
ALTER TABLE public.who_we_supply_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read active who_we_supply_services" ON public.who_we_supply_services;
DROP POLICY IF EXISTS "staff manage who_we_supply_services" ON public.who_we_supply_services;

CREATE POLICY "public read active who_we_supply_services" ON public.who_we_supply_services
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "staff manage who_we_supply_services" ON public.who_we_supply_services
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- redirects ----
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "redirects public read" ON public.redirects;
DROP POLICY IF EXISTS "redirects staff manage" ON public.redirects;

CREATE POLICY "redirects public read" ON public.redirects
  FOR SELECT TO anon, authenticated
  USING (active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "redirects staff manage" ON public.redirects
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- app_settings ----
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "app_settings public read" ON public.app_settings;
DROP POLICY IF EXISTS "app_settings staff manage" ON public.app_settings;

CREATE POLICY "app_settings public read" ON public.app_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "app_settings staff manage" ON public.app_settings
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ---- user_roles ----
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "staff read all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin manage user roles" ON public.user_roles;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin manage user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 4. SUPABASE STORAGE RLS POLICIES
-- Fix storage.objects and storage.buckets RLS so admin uploads succeed
-- ============================================================================

DO $$
BEGIN
  ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN NULL;
END
$$;

DROP POLICY IF EXISTS "buckets public read" ON storage.buckets;
CREATE POLICY "buckets public read" ON storage.buckets
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "app buckets public read" ON storage.objects;
DROP POLICY IF EXISTS "app buckets staff insert" ON storage.objects;
DROP POLICY IF EXISTS "app buckets staff update" ON storage.objects;
DROP POLICY IF EXISTS "app buckets staff delete" ON storage.objects;
DROP POLICY IF EXISTS "public content read" ON storage.objects;
DROP POLICY IF EXISTS "public content staff insert" ON storage.objects;
DROP POLICY IF EXISTS "public content staff update" ON storage.objects;
DROP POLICY IF EXISTS "public content staff delete" ON storage.objects;

-- 1) SELECT: allow anon/authenticated to view files in public buckets
CREATE POLICY "storage public read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id IN (
      'media',
      'product-images',
      'logos',
      'hero',
      'banners',
      'blog',
      'blog-images',
      'avatars',
      'documents',
      'general',
      'review-media'
    )
  );

-- 2) INSERT: allow staff/admin to upload files to any app bucket
CREATE POLICY "storage staff insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin')
  );

-- 3) UPDATE: allow staff/admin to update/replace files in any app bucket
CREATE POLICY "storage staff update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin')
  );

-- 4) DELETE: allow staff/admin to delete files from any app bucket
CREATE POLICY "storage staff delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin')
  );
