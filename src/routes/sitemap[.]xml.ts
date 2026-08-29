import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = ""; // resolves relative-safely; set once a canonical domain is defined

type Entry = { path: string; changefreq?: string; priority?: string };

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/shop", changefreq: "daily", priority: "0.9" },
          { path: "/our-story", changefreq: "monthly", priority: "0.6" },
          { path: "/bee-farming", changefreq: "monthly", priority: "0.6" },
          { path: "/become-a-partner", changefreq: "monthly", priority: "0.5" },
          { path: "/bulk-orders", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/auth", changefreq: "yearly", priority: "0.3" },
          { path: "/collections", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/raw-honey", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/beeswax", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/bee-pollen", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/beeswax-candles", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/beauty", changefreq: "weekly", priority: "0.8" },
          { path: "/collections/gift-hampers", changefreq: "weekly", priority: "0.8" },
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
                  if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                  h.set("apikey", key);
                  return fetch(input, { ...init, headers: h });
                },
              },
            });
            const [{ data: products }, { data: posts }, { data: cats }] = await Promise.all([
              supa.from("products").select("slug").eq("status", "published"),
              supa.from("blog_posts").select("slug").eq("status", "published"),
              supa.from("categories").select("slug").eq("active", true),
            ]);
            dynamic = [
              ...((products ?? []).map((p) => ({ path: `/product/${p.slug}`, changefreq: "weekly", priority: "0.8" }))),
              ...((posts ?? []).map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6" }))),
              ...((cats ?? []).map((c) => ({ path: `/collections/${c.slug}`, changefreq: "weekly", priority: "0.7" }))),
            ];
          }
        } catch { /* fall back to static-only sitemap */ }

        const all = [...staticEntries, ...dynamic];
        const urls = all.map((e) => [
          `  <url>`,
          `    <loc>${BASE_URL}${e.path}</loc>`,
          e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
          e.priority ? `    <priority>${e.priority}</priority>` : null,
          `  </url>`,
        ].filter(Boolean).join("\n"));
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
