-- Add Product Story & Details columns to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS story_description TEXT,
ADD COLUMN IF NOT EXISTS what_makes_special JSONB,
ADD COLUMN IF NOT EXISTS floral_source_notes TEXT,
ADD COLUMN IF NOT EXISTS storage_usage TEXT,
ADD COLUMN IF NOT EXISTS purity_lab_test TEXT;
