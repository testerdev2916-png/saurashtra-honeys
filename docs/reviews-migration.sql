-- Apply this via the Lovable Cloud database tool (Cloud → Database → SQL editor)
-- Creates a product-scoped reviews table + `review-media` storage bucket with
-- per-user folder policies. Media path convention: `<auth.uid()>/<product_slug>/<file>`.

-- ===== Product Reviews =====
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text,
  media jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{url, type: 'image'|'video'}]
  verified_purchase boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'approved',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_slug)
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read approved reviews" ON public.reviews FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "users insert own reviews" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own reviews" ON public.reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users delete own reviews" ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update reviews" ON public.reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS reviews_product_slug_idx ON public.reviews (product_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_user_idx ON public.reviews (user_id);

CREATE TRIGGER reviews_touch BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===== Storage bucket for review media =====
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-media',
  'review-media',
  true,
  52428800,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "review media public read" ON storage.objects;
CREATE POLICY "review media public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'review-media');

DROP POLICY IF EXISTS "review media user insert own" ON storage.objects;
CREATE POLICY "review media user insert own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-media' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "review media user update own" ON storage.objects;
CREATE POLICY "review media user update own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'review-media' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "review media user delete own" ON storage.objects;
CREATE POLICY "review media user delete own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'review-media' AND (storage.foldername(name))[1] = auth.uid()::text);
