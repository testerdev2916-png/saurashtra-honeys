-- Fix regression from 20260801120000_fix_admin_rls_and_storage_policies
-- Anon users must have EXECUTE permission on these functions so that RLS policies 
-- evaluating "OR public.is_staff()" do not crash with "permission denied for function".

GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;
GRANT EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[]) TO anon;
