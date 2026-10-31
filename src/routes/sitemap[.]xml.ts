import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = (process.env.SITE_URL || "https://saurashtrahoney.com").replace(/\/$/, "");

type Entry = { path: string; changefreq?: string; priority?: string; lastmod?: string | null };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const todayIso = new Date().toISOString().split("T")[0];
        const staticEntries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: todayIso },
          { path: "/shop", changefreq: "daily", priority: "0.9", lastmod: todayIso },
          { path: "/our-story", changefreq: "monthly", priority: "0.7", lastmod: todayIso },
          { path: "/bee-farming", changefreq: "monthly", priority: "0.6", lastmod: todayIso },
          { path: "/bulk-gifting", changefreq: "monthly", priority: "0.6", lastmod: todayIso },
          { path: "/bulk-orders", changefreq: "monthly", priority: "0.6", lastmod: todayIso },
          { path: "/corporate-gifting", changefreq: "monthly", priority: "0.6", lastmod: todayIso },
          { path: "/gift-hampers", changefreq: "monthly", priority: "0.6", lastmod: todayIso },
          { path: "/private-label", changefreq: "monthly", priority: "0.6", lastmod: todayIso },
          { path: "/become-a-partner", changefreq: "monthly", priority: "0.5", lastmod: todayIso },
          { path: "/contact", changefreq: "monthly", priority: "0.5", lastmod: todayIso },
          { path: "/blog", changefreq: "weekly", priority: "0.7", lastmod: todayIso },
          { path: "/track-order", changefreq: "monthly", priority: "0.4", lastmod: todayIso },
          { path: "/auth", changefreq: "yearly", priority: "0.3", lastmod: todayIso },
        ];

        let dynamic: Entry[] = [];
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
          if (process.env.SUPABASE_URL && key) {
            const supa = createClient(process.env.SUPABASE_URL, key, {
              auth: { persistSession: false, autoRefreshToken: false },
              global: {
                fetch: (input, init) => {
                  const h = new Headers(init?.headers);
                  if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
                    h.delete("Authorization");
                  h.set("apikey", key);
                  return fetch(input, { ...init, headers: h });
                },
              },
            });
            const [{ data: products }, { data: posts }, { data: cats }] = await Promise.all([
              supa.from("products").select("slug, updated_at").eq("status", "published"),
              supa.from("blog_posts").select("slug, updated_at").eq("status", "published"),
              supa.from("categories").select("slug, updated_at").eq("active", true),
            ]);
            dynamic = [
              ...(products ?? []).map((p: any) => ({
                path: `/product/${p.slug}`,
                changefreq: "weekly",
                priority: "0.8",
                lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : null,
              })),
              ...(posts ?? []).map((p: any) => ({
                path: `/blog/${p.slug}`,
                changefreq: "monthly",
                priority: "0.6",
                lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : null,
              })),
              ...(cats ?? []).map((c: any) => ({
                path: `/shop/${c.slug}`,
                changefreq: "weekly",
                priority: "0.8",
                lastmod: c.updated_at ? new Date(c.updated_at).toISOString().split("T")[0] : null,
              })),
            ];
          }
        } catch {
          /* fall back to static-only sitemap */
        }

        const all = [...staticEntries, ...dynamic];
        const urls = all.map((e) => {
          const loc = encodeURI(`${BASE_URL}${e.path}`);
          return [
            `  <url>`,
            `    <loc>${loc}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n");
        });
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
