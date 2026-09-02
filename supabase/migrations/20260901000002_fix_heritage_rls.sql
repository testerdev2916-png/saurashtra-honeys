-- Fix RLS policy to allow super_admin as well
DROP POLICY IF EXISTS "Admins manage homepage_heritage_video" ON public.homepage_heritage_video;

CREATE POLICY "Admins manage homepage_heritage_video"
  ON public.homepage_heritage_video
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );
