-- URGENT PRIVACY FIX
-- Revoke public access to the recent_public_orders RPC so that unauthenticated users cannot fetch real order data.

REVOKE EXECUTE ON FUNCTION public.recent_public_orders(_limit integer) FROM public;
REVOKE EXECUTE ON FUNCTION public.recent_public_orders(_limit integer) FROM anon;

-- Note: The frontend has been updated to use generic marketing data instead of calling this function.
