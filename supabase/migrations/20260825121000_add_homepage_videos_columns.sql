-- Migration: Enhance homepage_videos table with is_featured and placement columns
ALTER TABLE public.homepage_videos ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.homepage_videos ADD COLUMN IF NOT EXISTS placement text NOT NULL DEFAULT 'all';

-- Force PostgREST to reload its schema cache so the new columns are immediately available
NOTIFY pgrst, reload schema;
