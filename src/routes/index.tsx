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
  HomeFarmBanner,
  HomeHeritageVideo,
  HomeStatsStrip,
  HomeCustomerStories,
  HomeJournalPreview,
  HomeInstagramPreview,
  HomeMarqueeStrip,
} from "@/components/site/HomeSections";

import { fetchShopCategories } from "@/lib/category-catalog";
import { fetchAllHomepageCustomerStories, type HomepageCustomerStory } from "@/lib/homepage-cms.functions";

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
  "farm_banner",
  "heritage_video",
  "stats_strip",
  "testimonials",
  "journal",
] as const;

type SectionKey = (typeof CANONICAL_SECTIONS)[number];

function Home() {
  const [quick, setQuick] = useState<Product | null>(null);
  const [list, setList] = useState<Product[]>([]);
  const [stories, setStories] = useState<HomepageCustomerStory[]>([]);
  // cmsMap: keyed by section_key — only present if DB returned that row
  const [cmsMap, setCmsMap] = useState<Record<string, HomepageSection>>({});
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [homePosts, setHomePosts] = useState<any[]>([]);
  const [instaFeed, setInstaFeed] = useState<any>(null);
  const fetchPostsFn = useServerFn(listPublicPosts);
  const fetchInstaFn = useServerFn(getPublicInstagramFeed);

  useEffect(() => {

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

      // Fetch customer stories for the new review section
      const dummyPosters = [
        "https://placehold.co/400x700/FDFBF7/D97706?text=Video+Placeholder+1",
        "https://placehold.co/400x700/FDFBF7/D97706?text=Video+Placeholder+2",
        "https://placehold.co/400x700/FDFBF7/D97706?text=Video+Placeholder+3",
        "https://placehold.co/400x700/FDFBF7/D97706?text=Video+Placeholder+4",
        "https://placehold.co/400x700/FDFBF7/D97706?text=Video+Placeholder+5",
        "https://placehold.co/400x700/FDFBF7/D97706?text=Video+Placeholder+6",
      ];
      
      const setDummyStories = () => {
        setStories([
          {
            id: "dummy-1",
            type: "video",
            customer_name: "Zayn",
            customer_city: "Bhavnagar",
            customer_state: "Gujarat",
            review_text: "Bahut achha honey hai. Taste bahut natural laga.",
            rating: 5,
            verified: false,
            published: true,
            sort_order: 1,
            media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster_image: dummyPosters[0],
          },
          {
            id: "dummy-2",
            type: "video",
            customer_name: "Neha",
            customer_city: "Ahmedabad",
            customer_state: "Gujarat",
            review_text: "Absolutely loved the quality and taste.",
            rating: 5,
            verified: false,
            published: true,
            sort_order: 2,
            media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster_image: dummyPosters[1],
          },
          {
            id: "dummy-3",
            type: "video",
            customer_name: "Ritika Verma",
            customer_city: "Surat",
            customer_state: "Gujarat",
            review_text: "The raw honeycomb was a hit with my kids! Truly unfiltered, natural sweetness without any artificial aftertaste.",
            rating: 5,
            verified: false,
            published: true,
            sort_order: 3,
            media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster_image: dummyPosters[2],
            product_slug: "raw-honeycomb",
            product_name: "Raw Honeycomb",
          },
          {
            id: "dummy-4",
            type: "video",
            customer_name: "Aman Patel",
            customer_city: "Vadodara",
            customer_state: "Gujarat",
            review_text: "Best quality honey I've ever tasted. The packaging was beautiful and the delivery was quick.",
            rating: 4,
            verified: false,
            published: true,
            sort_order: 4,
            media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster_image: dummyPosters[3],
            product_slug: "fennel-honey",
            product_name: "Fennel Flora Honey",
          },
          {
            id: "dummy-5",
            type: "video",
            customer_name: "Pooja Desai",
            customer_city: "Mumbai",
            customer_state: "Maharashtra",
            review_text: "I use this honey every morning in my tea. It's incredibly pure and has a very rich texture. Highly recommended!",
            rating: 5,
            verified: false,
            published: true,
            sort_order: 5,
            media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster_image: dummyPosters[4],
            product_slug: "ajwain-honey",
            product_name: "Ajwain Honey",
          },
          {
            id: "dummy-6",
            type: "video",
            customer_name: "Rahul Singh",
            customer_city: "Pune",
            customer_state: "Maharashtra",
            review_text: "I was skeptical about buying honey online, but Saurashtra Honey proved me wrong. Authentic and fresh.",
            rating: 5,
            verified: false,
            published: true,
            sort_order: 6,
            media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
            poster_image: dummyPosters[5],
            product_slug: "raw-honey",
            product_name: "Raw Honey",
          }
        ] as HomepageCustomerStory[]);
      };

      void fetchAllHomepageCustomerStories().then((res) => {
        if (res && res.length > 0) {
          setStories(res.filter(s => s.published));
        } else {
          setDummyStories();
        }
      }).catch((e) => {
        console.warn("Failed to fetch customer stories, using dummy data:", e);
        setDummyStories();
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
            <HomeMarqueeStrip settings={settings} />
            <ShoppableVideoCarousel placementContext="homepage" />
          </Fragment>
        );
      case "farm_banner":
        return <HomeFarmBanner key="farm_banner" settings={settings} />;
      case "heritage_video":
        return <HomeHeritageVideo key="heritage_video" settings={settings} />;
      case "stats_strip":
        return <HomeStatsStrip key="stats_strip" settings={settings} />;
      case "testimonials":
        return <HomeCustomerStories key="testimonials" stories={stories} settings={settings} />;
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
