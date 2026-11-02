import { supabase } from "@/integrations/supabase/client";
import { type Product } from "@/lib/products";
import { aliasMap } from "@/lib/product-catalog";

export type HomepageVideoItem = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  video_url: string | null;
  thumbnail_url: string | null;
  product_slug: string | null;
  link_url: string | null;
  status: "draft" | "published" | "archived";
  is_active: boolean;
  is_featured: boolean;
  placement: string;
  display_order: number;
  fallbackImage: string;
};

/**
 * Robust helper to resolve a linked product for a story card or reel.
 * Handles direct slug, case variations, aliasMap targets (e.g. ajwain-honey -> ajwain-honey-500),
 * product id matches, link_url paths, and fallback title/subtitle matching.
 */
export function findStoryProduct(
  item: {
    product_slug?: string | null;
    link_url?: string | null;
    title?: string | null;
    subtitle?: string | null;
  },
  allProducts: Product[],
): Product | undefined {
  if (!allProducts || allProducts.length === 0) return undefined;

  // 1. Direct or aliased product_slug match
  if (item.product_slug) {
    const raw = item.product_slug.trim();
    // Direct exact match
    const direct = allProducts.find((p) => p.slug === raw);
    if (direct) return direct;

    const lower = raw.toLowerCase();
    // Case-insensitive match
    const caseMatch = allProducts.find((p) => p.slug.toLowerCase() === lower);
    if (caseMatch) return caseMatch;

    // Check aliasMap (e.g., "ajwain-honey" -> "ajwain-honey-500", "multiflora-honey" -> "multiflora-honey-250GM")
    const aliased = aliasMap[lower];
    if (aliased) {
      const aliasMatch = allProducts.find(
        (p) => p.slug.toLowerCase() === aliased.toLowerCase(),
      );
      if (aliasMatch) return aliasMatch;
    }

    // Match by ID
    const idMatch = allProducts.find((p) => p.id === raw);
    if (idMatch) return idMatch;
  }

  // 2. Extract slug from link_url (e.g. "/product/ajwain-honey" or "https://saurashtrahoney.com/product/fennel-honey-250GM")
  if (item.link_url) {
    const cleanUrl = item.link_url.split("?")[0].split("#")[0].trim();
    const slugMatch = cleanUrl.match(/\/product\/([a-zA-Z0-9_\-%]+)/i);
    if (slugMatch && slugMatch[1]) {
      const urlSlug = decodeURIComponent(slugMatch[1]).toLowerCase();
      const directUrl = allProducts.find((p) => p.slug.toLowerCase() === urlSlug);
      if (directUrl) return directUrl;

      const aliasedUrl = aliasMap[urlSlug];
      if (aliasedUrl) {
        const aliasMatch = allProducts.find(
          (p) => p.slug.toLowerCase() === aliasedUrl.toLowerCase(),
        );
        if (aliasMatch) return aliasMatch;
      }
    }
  }

  // 3. Fallback: match by title or subtitle against product name/category
  const subLower = (item.subtitle || "").toLowerCase().trim();
  const titleLower = (item.title || "").toLowerCase().trim();

  if (subLower || titleLower) {
    const nameMatch = allProducts.find((p) => {
      const pName = p.name.toLowerCase();
      return (
        (subLower && (pName === subLower || pName.includes(subLower) || subLower.includes(pName))) ||
        (titleLower && (pName === titleLower || pName.includes(titleLower) || titleLower.includes(pName)))
      );
    });
    if (nameMatch) return nameMatch;
  }

  return undefined;
}

type Row = {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  product_slug: string | null;
  link_url: string | null;
  status: string;
  is_active: boolean;
  is_featured?: boolean;
  placement?: string;
  display_order: number;
};

function getFallbackImage(slug: string | null): string {
  return "";
}

export const DEFAULT_HOMEPAGE_VIDEOS: HomepageVideoItem[] = [
  {
    id: "def-1",
    title: "Digestive Ritual",
    subtitle: "Ajwain Honey",
    badge: "SINGLE FLORA",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: null,
    product_slug: "ajwain-honey",
    link_url: "/product/ajwain-honey",
    status: "published",
    is_active: true,
    is_featured: false,
    placement: "all",
    display_order: 1,
    fallbackImage: getFallbackImage("ajwain-honey"),
  },
  {
    id: "def-2",
    title: "The Orchard Bloom",
    subtitle: "Lychee Honey",
    badge: "SEASONAL RARITY",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail_url: null,
    product_slug: "lychee-honey",
    link_url: "/product/lychee-honey",
    status: "published",
    is_active: true,
    is_featured: false,
    placement: "all",
    display_order: 2,
    fallbackImage: getFallbackImage("lychee-honey"),
  },
  {
    id: "def-3",
    title: "Straight From The Frame",
    subtitle: "Honey Comb",
    badge: "BEE PRODUCTS",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail_url: null,
    product_slug: "honey-comb",
    link_url: "/product/honey-comb",
    status: "published",
    is_active: true,
    is_featured: false,
    placement: "all",
    display_order: 3,
    fallbackImage: getFallbackImage("honey-comb"),
  },
  {
    id: "def-4",
    title: "A Cooling Note",
    subtitle: "Fennel Honey",
    badge: "SINGLE FLORA",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
    thumbnail_url: null,
    product_slug: "fennel-honey",
    link_url: "/product/fennel-honey",
    status: "published",
    is_active: true,
    is_featured: false,
    placement: "all",
    display_order: 4,
    fallbackImage: getFallbackImage("fennel-honey"),
  },
  {
    id: "def-5",
    title: "The Everyday Jar",
    subtitle: "Multiflora Honey",
    badge: "BESTSELLER",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail_url: null,
    product_slug: "multiflora-honey",
    link_url: "/product/multiflora-honey",
    status: "published",
    is_active: true,
    is_featured: false,
    placement: "all",
    display_order: 5,
    fallbackImage: getFallbackImage("multiflora-honey"),
  },
  {
    id: "def-6",
    title: "Daily Radiance",
    subtitle: "Soft Skin Gel",
    badge: "BEAUTY PRODUCTS",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail_url: null,
    product_slug: "soft-skin-gel",
    link_url: "/product/soft-skin-gel",
    status: "published",
    is_active: true,
    is_featured: false,
    placement: "all",
    display_order: 6,
    fallbackImage: getFallbackImage("soft-skin-gel"),
  },
];

function toHomepageVideoItem(r: Row): HomepageVideoItem {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle ?? "",
    badge: r.badge ?? "",
    video_url: r.video_url || null,
    thumbnail_url: r.thumbnail_url || null,
    product_slug: r.product_slug || null,
    link_url: r.link_url || (r.product_slug ? `/product/${r.product_slug}` : null),
    status: (r.status as "draft" | "published" | "archived") || "published",
    is_active: !!r.is_active,
    is_featured: !!r.is_featured,
    placement: r.placement || "all",
    display_order: Number(r.display_order ?? 0),
    fallbackImage: getFallbackImage(r.product_slug),
  };
}

export async function fetchHomepageVideos(): Promise<HomepageVideoItem[]> {
  try {
    const { data, error } = await supabase
      .from("homepage_videos")
      .select("*")
      .eq("status", "published")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_HOMEPAGE_VIDEOS;
    return (data as unknown as Row[]).map(toHomepageVideoItem);
  } catch {
    return DEFAULT_HOMEPAGE_VIDEOS;
  }
}
