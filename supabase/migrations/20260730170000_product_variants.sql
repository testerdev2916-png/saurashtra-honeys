-- Migration: Create product_variants table and backfill existing products
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  weight_g integer,
  price integer NOT NULL DEFAULT 0,
  mrp integer,
  cost_price integer,
  stock_quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  sku text,
  barcode text,
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants(product_id, sort_order);
CREATE INDEX IF NOT EXISTS product_variants_sku_idx ON public.product_variants(sku) WHERE sku IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_default_uidx ON public.product_variants(product_id) WHERE is_default = true;

GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT ALL ON public.product_variants TO service_role;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active variants" ON public.product_variants;
CREATE POLICY "public read active variants" ON public.product_variants
  FOR SELECT TO anon, authenticated
  USING (is_active = true OR public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin write variants" ON public.product_variants;
CREATE POLICY "admin write variants" ON public.product_variants
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS product_variants_touch_updated_at ON public.product_variants;
CREATE TRIGGER product_variants_touch_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Backfill existing products without data loss
DO $$ 
DECLARE
  prod RECORD;
  sz text;
  idx integer;
BEGIN
  FOR prod IN SELECT id, slug, sizes, price, mrp, stock_quantity, sku, weight_g, low_stock_limit FROM public.products
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = prod.id) THEN
      IF prod.slug = 'ajwain-honey' OR prod.slug = 'prod-ajwain' THEN
        INSERT INTO public.product_variants (product_id, label, weight_g, price, mrp, cost_price, stock_quantity, low_stock_threshold, sku, is_default, is_active, sort_order)
        VALUES 
          (prod.id, '250g', 250, 349, 399, 200, 100, 5, 'SH-AJW-250', true, true, 0),
          (prod.id, '500g', 500, 649, 749, 400, 75, 5, 'SH-AJW-500', false, true, 1),
          (prod.id, '1kg', 1000, 1199, 1399, 750, 40, 5, 'SH-AJW-1000', false, true, 2);
      ELSIF prod.slug = 'fennel-honey' OR prod.slug = 'prod-fennel' THEN
        INSERT INTO public.product_variants (product_id, label, weight_g, price, mrp, cost_price, stock_quantity, low_stock_threshold, sku, is_default, is_active, sort_order)
        VALUES 
          (prod.id, '250g', 250, 349, 399, 200, 80, 5, 'SH-FEN-250', true, true, 0),
          (prod.id, '500g', 500, 649, 749, 400, 60, 5, 'SH-FEN-500', false, true, 1),
          (prod.id, '1kg', 1000, 1199, 1399, 750, 30, 5, 'SH-FEN-1000', false, true, 2);
      ELSIF prod.slug = 'lychee-honey' OR prod.slug = 'prod-lychee' THEN
        INSERT INTO public.product_variants (product_id, label, weight_g, price, mrp, cost_price, stock_quantity, low_stock_threshold, sku, is_default, is_active, sort_order)
        VALUES 
          (prod.id, '250g', 250, 399, 449, 220, 90, 5, 'SH-LYC-250', true, true, 0),
          (prod.id, '500g', 500, 749, 849, 450, 50, 5, 'SH-LYC-500', false, true, 1),
          (prod.id, '1kg', 1000, 1399, 1599, 850, 25, 5, 'SH-LYC-1000', false, true, 2);
      ELSIF prod.slug = 'multiflora-honey' OR prod.slug = 'prod-multiflora' THEN
        INSERT INTO public.product_variants (product_id, label, weight_g, price, mrp, cost_price, stock_quantity, low_stock_threshold, sku, is_default, is_active, sort_order)
        VALUES 
          (prod.id, '250g', 250, 299, 349, 180, 120, 5, 'SH-MUL-250', true, true, 0),
          (prod.id, '500g', 500, 549, 649, 350, 80, 5, 'SH-MUL-500', false, true, 1),
          (prod.id, '1kg', 1000, 999, 1199, 650, 45, 5, 'SH-MUL-1000', false, true, 2);
      ELSIF prod.sizes IS NOT NULL AND jsonb_typeof(prod.sizes) = 'array' AND jsonb_array_length(prod.sizes) > 0 THEN
        idx := 0;
        FOR sz IN SELECT * FROM jsonb_array_elements_text(prod.sizes)
        LOOP
          INSERT INTO public.product_variants (
            product_id, label, price, mrp, stock_quantity, sku, weight_g, low_stock_threshold, is_default, sort_order
          ) VALUES (
            prod.id,
            sz,
            COALESCE(prod.price, 0),
            prod.mrp,
            COALESCE(prod.stock_quantity, 100),
            CASE 
              WHEN idx = 0 THEN prod.sku 
              WHEN prod.sku IS NOT NULL AND prod.sku <> '' THEN prod.sku || '-' || sz
              ELSE NULL 
            END,
            prod.weight_g,
            COALESCE(prod.low_stock_limit, 5),
            CASE WHEN idx = 0 THEN true ELSE false END,
            idx
          );
          idx := idx + 1;
        END LOOP;
      ELSE
        INSERT INTO public.product_variants (
          product_id, label, price, mrp, stock_quantity, sku, weight_g, low_stock_threshold, is_default, sort_order
        ) VALUES (
          prod.id,
          'Default',
          COALESCE(prod.price, 0),
          prod.mrp,
          COALESCE(prod.stock_quantity, 100),
          prod.sku,
          prod.weight_g,
          COALESCE(prod.low_stock_limit, 5),
          true,
          0
        );
      END IF;
    END IF;
  END LOOP;
END $$;
