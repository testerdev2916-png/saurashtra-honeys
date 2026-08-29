-- Migration: Enhance homepage_videos table with is_featured and placement columns for Discover by Product shoppable reels
ALTER TABLE public.homepage_videos ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.homepage_videos ADD COLUMN IF NOT EXISTS placement text NOT NULL DEFAULT 'all';

-- Update comment
COMMENT ON TABLE public.homepage_videos IS 'Shoppable vertical video reels (9:16) linked to existing products for Discover by Product carousel.';
