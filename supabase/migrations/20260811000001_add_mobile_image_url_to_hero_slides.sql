-- URGENT UI/UX + ARCHITECTURE FIX
-- Add mobile_image_url to hero_slides

ALTER TABLE public.hero_slides 
ADD COLUMN mobile_image_url text;

-- Add mobile_image_key to support clean deletes if necessary
ALTER TABLE public.hero_slides 
ADD COLUMN mobile_image_key text;
