-- Create Homepage Category Selection table
CREATE TABLE IF NOT EXISTS public.homepage_category_selection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Homepage Featured Products table
CREATE TABLE IF NOT EXISTS public.homepage_featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grants & RLS for Categories
GRANT SELECT ON public.homepage_category_selection TO anon, authenticated;
GRANT ALL ON public.homepage_category_selection TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.homepage_category_selection TO authenticated;
ALTER TABLE public.homepage_category_selection ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "homepage_category_selection_anon_read" ON public.homepage_category_selection;
DROP POLICY IF EXISTS "homepage_category_selection_auth_read" ON public.homepage_category_selection;
DROP POLICY IF EXISTS "homepage_category_selection_staff_manage" ON public.homepage_category_selection;

CREATE POLICY "homepage_category_selection_anon_read" ON public.homepage_category_selection FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_category_selection_auth_read" ON public.homepage_category_selection FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_category_selection_staff_manage" ON public.homepage_category_selection FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Grants & RLS for Featured Products
GRANT SELECT ON public.homepage_featured_products TO anon, authenticated;
GRANT ALL ON public.homepage_featured_products TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.homepage_featured_products TO authenticated;
ALTER TABLE public.homepage_featured_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "homepage_featured_products_anon_read" ON public.homepage_featured_products;
DROP POLICY IF EXISTS "homepage_featured_products_auth_read" ON public.homepage_featured_products;
DROP POLICY IF EXISTS "homepage_featured_products_staff_manage" ON public.homepage_featured_products;

CREATE POLICY "homepage_featured_products_anon_read" ON public.homepage_featured_products FOR SELECT TO anon USING (enabled = true);
CREATE POLICY "homepage_featured_products_auth_read" ON public.homepage_featured_products FOR SELECT TO authenticated USING (enabled = true OR public.is_staff(auth.uid()));
CREATE POLICY "homepage_featured_products_staff_manage" ON public.homepage_featured_products FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
