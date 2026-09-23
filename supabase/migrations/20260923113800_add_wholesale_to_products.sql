-- Add is_wholesale column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_wholesale boolean NOT NULL DEFAULT false;
