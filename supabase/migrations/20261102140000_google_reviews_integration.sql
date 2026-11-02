-- Google Reviews Integration Migration
-- Creates tables for Google Business Profile & Places Reviews, settings, and sync audit logs.

-- 1. Table: google_reviews
CREATE TABLE IF NOT EXISTS public.google_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_review_id text UNIQUE NOT NULL,      -- Unique Google review ID / resource name
  reviewer_name text NOT NULL,                -- Customer display name
  reviewer_photo_url text,                    -- Google profile photo URL
  star_rating smallint NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  review_text text,                           -- Customer review text
  review_date timestamptz NOT NULL,           -- Timestamp of the review on Google
  update_time timestamptz,                    -- Last updated on Google
  google_review_url text,                     -- Link to original review
  is_published boolean NOT NULL DEFAULT true, -- Admin moderation visibility
  raw_payload jsonb,                          -- Raw response payload from Google API
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_google_reviews_published ON public.google_reviews(is_published, review_date DESC);
CREATE INDEX IF NOT EXISTS idx_google_reviews_rating ON public.google_reviews(star_rating);

-- 2. Table: google_business_settings
CREATE TABLE IF NOT EXISTS public.google_business_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  account_id text,                            -- Google Business Profile Account ID
  location_id text,                           -- Google Business Profile Location ID
  place_id text,                              -- Google Place ID (e.g., ChIJ...)
  places_api_key text,                        -- Google Places API key (encrypted/server-only)
  oauth_access_token text,                    -- Server-only OAuth access token
  oauth_refresh_token text,                   -- Server-only OAuth refresh token
  token_expires_at timestamptz,               -- Token expiry timestamp
  google_maps_url text DEFAULT 'https://www.google.com/maps/search/?api=1&query=Saurashtra+Honey+Bee+Farm+Mahuva',
  google_review_dialog_url text,              -- Link for customers to leave a review
  average_rating numeric(2,1) DEFAULT 4.9,    -- Cached aggregate rating
  total_review_count integer DEFAULT 0,       -- Cached review count
  sync_frequency_hours integer DEFAULT 24,    -- Sync schedule in hours
  last_synced_at timestamptz,                 -- Last sync timestamp
  sync_status text DEFAULT 'idle',            -- 'idle' | 'syncing' | 'error' | 'success'
  last_error text,                            -- Error message if last sync failed
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default settings row if missing
INSERT INTO public.google_business_settings (id, google_maps_url, average_rating, total_review_count)
VALUES (1, 'https://www.google.com/maps/search/?api=1&query=Saurashtra+Honey+Bee+Farm+Mahuva', 4.9, 0)
ON CONFLICT (id) DO NOTHING;

-- 3. Table: google_reviews_sync_logs
CREATE TABLE IF NOT EXISTS public.google_reviews_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL,                       -- 'success' | 'failed' | 'in_progress'
  reviews_fetched integer DEFAULT 0,
  reviews_upserted integer DEFAULT 0,
  error_message text,
  triggered_by text DEFAULT 'system',         -- 'cron' | 'admin_manual' | 'oauth_initial'
  source text DEFAULT 'google_places_api',    -- 'google_business_api' | 'google_places_api'
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_google_reviews_sync_logs_started ON public.google_reviews_sync_logs(started_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_reviews_sync_logs ENABLE ROW LEVEL SECURITY;

-- 5. Permissions & Grants
GRANT SELECT ON public.google_reviews TO anon, authenticated;
GRANT ALL ON public.google_reviews TO service_role;

GRANT SELECT ON public.google_business_settings TO anon, authenticated;
GRANT ALL ON public.google_business_settings TO service_role;

GRANT SELECT ON public.google_reviews_sync_logs TO authenticated;
GRANT ALL ON public.google_reviews_sync_logs TO service_role;

-- 6. RLS Policies
-- Public can read published reviews
DROP POLICY IF EXISTS "public read published google reviews" ON public.google_reviews;
CREATE POLICY "public read published google reviews" ON public.google_reviews
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

-- Admin can manage all google reviews
DROP POLICY IF EXISTS "admin all google reviews" ON public.google_reviews;
CREATE POLICY "admin all google reviews" ON public.google_reviews
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can read non-secret settings (average_rating, total_review_count, google_maps_url)
DROP POLICY IF EXISTS "public read google settings" ON public.google_business_settings;
CREATE POLICY "public read google settings" ON public.google_business_settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admin can manage google settings
DROP POLICY IF EXISTS "admin all google settings" ON public.google_business_settings;
CREATE POLICY "admin all google settings" ON public.google_business_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can view sync logs
DROP POLICY IF EXISTS "admin read google sync logs" ON public.google_reviews_sync_logs;
CREATE POLICY "admin read google sync logs" ON public.google_reviews_sync_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin write google sync logs" ON public.google_reviews_sync_logs;
CREATE POLICY "admin write google sync logs" ON public.google_reviews_sync_logs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

