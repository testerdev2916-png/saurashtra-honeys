import { supabase } from "@/integrations/supabase/client";
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
