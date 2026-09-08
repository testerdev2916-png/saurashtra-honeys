-- Add image capabilities directly to product_variants table
ALTER TABLE public.product_variants 
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
