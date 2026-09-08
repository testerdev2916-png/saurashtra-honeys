-- Add shop navigation settings to the categories table
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS show_in_shop_nav BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shop_nav_label TEXT,
  ADD COLUMN IF NOT EXISTS shop_nav_sort_order INT NOT NULL DEFAULT 0;

-- Initialize existing typical categories to show in nav by default
UPDATE public.categories 
SET show_in_shop_nav = true, shop_nav_sort_order = sort_order
WHERE slug != 'all-products';

-- Ensure Gift Hamper exists in the database
INSERT INTO public.categories (slug, name, show_in_shop_nav, shop_nav_sort_order, active)
VALUES ('gift-hampers', 'Gift Hamper', true, 7, true)
ON CONFLICT (slug) DO UPDATE 
SET show_in_shop_nav = true, shop_nav_sort_order = 7;
