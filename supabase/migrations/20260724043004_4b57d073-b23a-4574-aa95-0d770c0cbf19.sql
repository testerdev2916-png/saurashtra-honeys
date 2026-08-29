
-- Public-content buckets: authenticated read, staff write
CREATE POLICY "public content read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('product-images','blog-images','hero-images'));
CREATE POLICY "public content staff insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images','blog-images','hero-images') AND public.is_staff(auth.uid()));
CREATE POLICY "public content staff update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images','blog-images','hero-images') AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id IN ('product-images','blog-images','hero-images') AND public.is_staff(auth.uid()));
CREATE POLICY "public content staff delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images','blog-images','hero-images') AND public.is_staff(auth.uid()));

-- Avatars: owner-scoped (path must start with the user's id)
CREATE POLICY "avatars owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Documents: staff-only
CREATE POLICY "documents staff all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'documents' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'documents' AND public.is_staff(auth.uid()));
