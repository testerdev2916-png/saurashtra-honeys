import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const DEFAULT_DISALLOW = ["/admin", "/account", "/checkout", "/order", "/lovable"];

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        let disallow = DEFAULT_DISALLOW;
        let extra = "";
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
          if (process.env.SUPABASE_URL && key) {
            const supa = createClient(process.env.SUPABASE_URL, key, {
              auth: { persistSession: false, autoRefreshToken: false },
              global: {
                fetch: (input, init) => {
                  const h = new Headers(init?.headers);
                  if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                  h.set("apikey", key);
                  return fetch(input, { ...init, headers: h });
                },
              },
            });
            const { data } = await supa.from("app_settings").select("data").eq("id", 1).maybeSingle();
            const robots = (data?.data as { robots?: { disallow_paths?: string[]; extra?: string } } | undefined)?.robots;
            if (robots?.disallow_paths?.length) disallow = robots.disallow_paths;
            if (robots?.extra) extra = robots.extra;
          }
        } catch { /* defaults */ }

        const body = [
          "User-agent: *",
          "Allow: /",
          ...disallow.map((p) => `Disallow: ${p}`),
          extra.trim(),
        ].filter(Boolean).join("\n") + "\n";
        return new Response(body, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
