-- Add show_on_homepage column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;
