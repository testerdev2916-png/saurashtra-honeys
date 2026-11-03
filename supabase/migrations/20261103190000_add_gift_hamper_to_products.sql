-- Add is_gift_hamper column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_gift_hamper boolean NOT NULL DEFAULT false;

-- Sync existing flagged products
UPDATE public.products 
SET is_gift_hamper = true 
WHERE (attributes->>'is_gift_hamper')::boolean = true;

