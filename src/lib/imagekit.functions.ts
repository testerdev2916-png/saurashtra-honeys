import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import ImageKit from "imagekit";

export const getImageKitAuthParams = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Verify admin access
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      throw new Error("Forbidden: Admin access required");
    }

    const pubKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY;
    const privKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEp = process.env.IMAGEKIT_URL_ENDPOINT || process.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/fqbnkx3tz';

    if (!pubKey) console.error("[ImageKit API] Error: Missing IMAGEKIT_PUBLIC_KEY in environment variables");
    if (!privKey) console.error("[ImageKit API] Error: Missing IMAGEKIT_PRIVATE_KEY in environment variables");

    const imagekit = new ImageKit({
      publicKey: pubKey || '',
      privateKey: privKey || '',
      urlEndpoint: urlEp,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();

    return {
      ...authenticationParameters,
      publicKey: pubKey,
      urlEndpoint: urlEp,
    };
  });
