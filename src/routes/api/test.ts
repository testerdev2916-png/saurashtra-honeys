// @ts-ignore - Route file that is currently resolving fine but typescript complains
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const APIRoute = createAPIFileRoute("/api/test")({
  GET: async () => {
    try {
      const { data, error } = await supabaseAdmin.from("categories").select("*").order("sort_order", { ascending: true });
      return new Response(JSON.stringify({ data, error }), { headers: { 'content-type': 'application/json' } });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { headers: { 'content-type': 'application/json' } });
    }
  },
});
