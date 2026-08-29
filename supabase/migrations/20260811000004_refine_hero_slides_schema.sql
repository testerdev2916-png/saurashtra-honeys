-- ============================================================
-- 20260811000004_refine_hero_slides_schema.sql
-- ============================================================
-- Makes aesthetic text fields nullable since banners are purely image-based.
-- Keeps title and cta_href required for admin, SEO, and navigation purposes.
-- ============================================================

-- 1. Ensure purely visual text fields are nullable (the user relies on images)
ALTER TABLE public.hero_slides
  ALTER COLUMN eyebrow DROP NOT NULL,
  ALTER COLUMN subtitle DROP NOT NULL,
  ALTER COLUMN title_accent DROP NOT NULL,
  ALTER COLUMN cta_label DROP NOT NULL,
  ALTER COLUMN align DROP NOT NULL;

-- 2. Ensure critical fields remain NOT NULL
-- (These may already be NOT NULL, but we enforce it here for consistency)
ALTER TABLE public.hero_slides
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN cta_href SET NOT NULL;
