-- Consolidate storage to two buckets: product-images, media
-- Replaces the old policies from 20260724043004_4b57d073-b23a-4574-aa95-0d770c0cbf19.sql
-- which referenced product-images / blog-images / hero-images / avatars / documents.
--
-- This migration does NOT drop the old blog-images / hero-images / avatars / documents
-- buckets or their existing files (that is a manual Supabase Dashboard step — see report).
-- It only removes the old *policies* so those bucket names are no longer treated as
-- selectable, writable storage targets by the app, and installs policies scoped to the
-- two buckets the app now uses.

-- Drop old policies (safe no-ops if a policy was already removed/renamed)
DROP POLICY IF EXISTS "public content read" ON storage.objects;
DROP POLICY IF EXISTS "public content staff insert" ON storage.objects;
DROP POLICY IF EXISTS "public content staff update" ON storage.objects;
DROP POLICY IF EXISTS "public content staff delete" ON storage.objects;
DROP POLICY IF EXISTS "avatars owner read" ON storage.objects;
DROP POLICY IF EXISTS "avatars owner insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars owner update" ON storage.objects;
DROP POLICY IF EXISTS "avatars owner delete" ON storage.objects;
DROP POLICY IF EXISTS "documents staff all" ON storage.objects;

-- product-images / media: public read (storefront needs to render these),
-- staff-only write, reusing the existing is_staff() authorization model.
CREATE POLICY "app buckets public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('product-images', 'media'));

CREATE POLICY "app buckets staff insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images', 'media') AND public.is_staff(auth.uid()));

CREATE POLICY "app buckets staff update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images', 'media') AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id IN ('product-images', 'media') AND public.is_staff(auth.uid()));

CREATE POLICY "app buckets staff delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images', 'media') AND public.is_staff(auth.uid()));
