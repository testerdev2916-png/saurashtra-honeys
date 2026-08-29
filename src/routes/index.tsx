import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, Fragment } from "react";
import { Suspense, lazy } from "react";
import { SiteLayout } from "@/components/site/Layout";
const QuickViewLazy = lazy(() => import("@/components/site/QuickView").then(m => ({ default: m.QuickView })));
import { ShoppableVideoCarousel } from "@/components/site/ShoppableVideoCarousel";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import { listPublicPosts } from "@/lib/blog-server.functions";
import { resolvePostImage, formatPostDate } from "@/lib/blog-client-helpers";
import { supabase } from "@/integrations/supabase/client";
import { getPublicInstagramFeed } from "@/lib/instagram.functions";
import { StructuredData, breadcrumbLd, organizationLd } from "@/components/site/StructuredData";
import { fetchHomepageSections, type HomepageSection } from "@/lib/homepage-cms.functions";
import {
  HomeHero,
  HomeTrustStrip,
  HomeShopByCategory,
  HomeBestSellers,
  HomeWhyChoose,
  HomeFarmBanner,
  HomeStatsStrip,
  HomeTestimonials,
  HomeJournalPreview,
  HomeInstagramPreview,
  HomeMarqueeStrip,
} from "@/components/site/HomeSections";

import { fetchShopCategories } from "@/lib/category-catalog";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, products] = await Promise.all([
      fetchShopCategories(),
      fetchProducts(),
    ]);
    return { categories, products };
  },
  head: () => ({
    meta: [
      { title: "Saurashtra Honey — Pure, Raw & Unfiltered Honey from Saurashtra" },
      { name: "description", content: "Raw, unfiltered honey straight from the floral farms of Saurashtra. Lab-tested for purity in every batch, ethically harvested for family wellness." },
      { property: "og:title", content: "Saurashtra Honey — Pure Honey. Proven Purity." },
      { property: "og:description", content: "Raw. Natural. Unfiltered. From our farms to your home, with care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

// ─── Canonical section order ──────────────────────────────────────────────────
// This is the ORIGINAL homepage structure. It is ALWAYS the source of truth.
// CMS records can override `enabled` and `sort_order` and `settings`,
// but absence of a CMS record NEVER hides a section.
const CANONICAL_SECTIONS = [
  "hero",
  "trust_strip",
  "shop_by_category",
  "featured_products",
  "shoppable_videos",
  "why_choose",
  "farm_banner",
  "stats_strip",
  "testimonials",
  "journal",
] as const;

type SectionKey = (typeof CANONICAL_SECTIONS)[number];

function Home() {
  const [quick, setQuick] = useState<Product | null>(null);
  const [list, setList] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<
    { id: string; author_name: string; content: string; rating: number; location?: string }[]
  >([]);
  // cmsMap: keyed by section_key — only present if DB returned that row
  const [cmsMap, setCmsMap] = useState<Record<string, HomepageSection>>({});
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [homePosts, setHomePosts] = useState<any[]>([]);
  const [instaFeed, setInstaFeed] = useState<any>(null);
  const fetchPostsFn = useServerFn(listPublicPosts);
  const fetchInstaFn = useServerFn(getPublicInstagramFeed);

  useEffect(() => {
    // Fetch live products
    void fetchProducts().then((r) => {
      if (r.length > 0) setList(r);
    });

    // Fetch CMS sections — failure is safe, just means no CMS overrides
    void fetchHomepageSections()
      .then((data) => {
        const map: Record<string, HomepageSection> = {};
        for (const sec of data) {
          map[sec.section_key] = sec;
        }
        setCmsMap(map);
      })
      .catch((err) => {
        console.warn("[Homepage] CMS sections unavailable — rendering defaults:", err);
      })
      .finally(() => {
        setCmsLoaded(true);
      });

    const nonCriticalTimer = setTimeout(() => {
      // Fetch latest blog posts for journal preview
      void fetchPostsFn({ data: { page: 1, pageSize: 3 } }).then((res) => {
        if (res.rows && res.rows.length > 0) {
          setHomePosts(
            res.rows.map((p) => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || "",
              category: p.category_name || "Journal",
              displayDate: formatPostDate(p.published_at || p.created_at),
              readTime: p.reading_time || "5 min read",
              image: resolvePostImage(p.cover_image_url, p.category_name || p.slug),
            }))
          );
        }
      });

      // Fetch featured reviews for testimonials
      void (supabase
        .from("reviews")
        .select("id, author_name, content, rating, location") as any)
        .eq("featured_on_homepage", true)
        .order("created_at", { ascending: false })
        .limit(6)
        .then(({ data, error }: { data: any[] | null; error: any }) => {
          if (!error && data && data.length >= 3) {
            setReviews(data as any);
          } else {
            // Fallback: most recent approved reviews
            void supabase
              .from("reviews")
              .select("id, author_name, content, rating, location")
              .eq("status", "approved")
              .order("created_at", { ascending: false })
              .limit(6)
              .then((res) => {
                if (res.data && res.data.length >= 3) setReviews(res.data as any);
              });
          }
        });
        
      // Fetch Instagram Feed
      void fetchInstaFn().then((res) => {
        setInstaFeed(res);
      });
    }, 300);

    return () => clearTimeout(nonCriticalTimer);
  }, []);

  // ─── Build ordered + filtered section list ──────────────────────────────────
  // Rules:
  //   1. Start from CANONICAL_SECTIONS (always all visible by default)
  //   2. If a CMS record exists for a key AND enabled===false → hide it
  //   3. Apply CMS sort_order when all CMS records are present, otherwise keep canonical order
  const orderedSections: SectionKey[] = (() => {
    // Check if we have CMS records for ALL canonical sections
    const allKeysInCms = CANONICAL_SECTIONS.every((k) => cmsMap[k] !== undefined);

    let keys: SectionKey[];

    if (allKeysInCms) {
      // Sort by CMS sort_order
      keys = [...CANONICAL_SECTIONS].sort((a, b) => {
        const orderA = cmsMap[a]?.sort_order ?? 999;
        const orderB = cmsMap[b]?.sort_order ?? 999;
        return orderA - orderB;
      });
    } else {
      // Partial or no CMS — use canonical order, supplement missing keys
      keys = [...CANONICAL_SECTIONS];
    }

    // Filter: only hide if CMS record explicitly says enabled===false
    return keys.filter((k) => {
      const rec = cmsMap[k];
      // No record → show (default visible)
      if (!rec) return true;
      // Record exists → respect enabled flag
      return rec.enabled !== false;
    });
  })();

  // ─── Render a single section by key ────────────────────────────────────────
  const data = Route.useLoaderData();
  const renderSection = (key: SectionKey) => {
    const sec = cmsMap[key];
    const settings = sec?.settings ?? {};

    switch (key) {
      case "hero":
        return <HomeHero key="hero" />;
      case "trust_strip":
        return <HomeTrustStrip key="trust_strip" settings={settings} />;
      case "shop_by_category":
        return <HomeShopByCategory key="shop_by_category" settings={settings} initialCategories={data.categories} />;
      case "featured_products":
        return (
          <HomeBestSellers
            key="featured_products"
            products={data.products && data.products.length > 0 ? data.products : list}
            onQuickView={setQuick}
            settings={settings}
          />
        );
      case "shoppable_videos":
        return (
          <Fragment key="shoppable_videos_wrapper">
            <HomeMarqueeStrip />
            <ShoppableVideoCarousel placementContext="homepage" />
          </Fragment>
        );
      case "why_choose":
        return <HomeWhyChoose key="why_choose" settings={settings} />;
      case "farm_banner":
        return <HomeFarmBanner key="farm_banner" settings={settings} />;
      case "stats_strip":
        return <HomeStatsStrip key="stats_strip" settings={settings} />;
      case "testimonials":
        return <HomeTestimonials key="testimonials" reviews={reviews} settings={settings} />;
      case "journal":
        if (instaFeed?.settings?.is_enabled) {
          return <HomeInstagramPreview key="journal" feed={instaFeed} settings={settings} />;
        }
        return <HomeJournalPreview key="journal" posts={homePosts} settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <SiteLayout>
      <StructuredData data={organizationLd()} />
      <StructuredData data={breadcrumbLd([{ name: "Home", url: "/" }])} />

      {/*
        Always render all canonical sections immediately.
        CMS settings are applied progressively once loaded.
        No loading spinner — the page never waits on the CMS.
      */}
      {orderedSections.map(renderSection)}

      {/* QUICK VIEW MODAL - LAZY LOADED */}
      {quick && (
        <Suspense fallback={null}>
          <QuickViewLazy product={quick} onClose={() => setQuick(null)} />
        </Suspense>
      )}
    </SiteLayout>
  );
}
