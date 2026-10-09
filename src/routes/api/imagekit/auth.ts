// @ts-ignore
import { createAPIFileRoute } from "@tanstack/react-start/api";
import ImageKit from "imagekit";
import { createClient } from "@supabase/supabase-js";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/fqbnkx3tz',
});

export const APIRoute = createAPIFileRoute("/api/imagekit/auth")({
  GET: async ({ request }: { request: Request }) => {
    try {
      const authHeader = request.headers.get("authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
      }

      const token = authHeader.replace("Bearer ", "");
      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
          throw new Error("Missing Supabase configuration on server");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
      }

      // Check if user is an admin
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), { status: 403, headers: { "content-type": "application/json" } });
      }

      const pubKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY;
      const privKey = process.env.IMAGEKIT_PRIVATE_KEY;
      const urlEp = process.env.IMAGEKIT_URL_ENDPOINT || process.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/fqbnkx3tz';

      if (!pubKey) console.error("[ImageKit API] Error: Missing IMAGEKIT_PUBLIC_KEY in environment variables");
      if (!privKey) console.error("[ImageKit API] Error: Missing IMAGEKIT_PRIVATE_KEY in environment variables");

      const authenticationParameters = imagekit.getAuthenticationParameters();

      return new Response(
        JSON.stringify({
          ...authenticationParameters,
          publicKey: pubKey,
          urlEndpoint: urlEp,
        }),
        { headers: { "content-type": "application/json" } }
      );
    } catch (e) {
      console.error("ImageKit auth error", e);
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
});
