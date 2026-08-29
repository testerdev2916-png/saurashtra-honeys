-- Migration: Add additional_images column to products table for storing up to 3 additional product storytelling images
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS additional_images JSONB DEFAULT '[]'::jsonb;
