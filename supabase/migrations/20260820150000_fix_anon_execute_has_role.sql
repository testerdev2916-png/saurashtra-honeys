-- Grant execute on has_role to anon so that RLS policies using has_role don't crash
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;
