import { supabase } from "@/integrations/supabase/client";

export interface PageSection {
  page_slug: string;
  section_key: string;
  settings: Record<string, any>;
  enabled: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchPageSections(page_slug: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from("page_content" as any)
    .select("*")
    .eq("page_slug", page_slug)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data as any) || [];
}

export async function updatePageSectionSettings(
  page_slug: string,
  section_key: string,
  settings: Record<string, any>,
) {
  // Upsert the record
  const { error } = await supabase
    .from("page_content" as any)
    .upsert({ page_slug, section_key, settings } as any, { onConflict: "page_slug,section_key" });

  if (error) throw error;
}

export async function togglePageSectionVisibility(
  page_slug: string,
  section_key: string,
  enabled: boolean,
) {
  const { error } = await supabase
    .from("page_content" as any)
    .upsert({ page_slug, section_key, enabled } as any, { onConflict: "page_slug,section_key" });

  if (error) throw error;
}

export interface PageSeoConfig {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
}

export function extractPageSeo(
  sections: PageSection[] | null | undefined,
  fallback: {
    title: string;
    description: string;
    canonical: string;
    keywords?: string;
    ogImage?: string;
    type?: string;
  },
) {
  const seoSection = sections?.find((s) => s.section_key === "seo" && s.enabled !== false);
  const s = (seoSection?.settings || {}) as PageSeoConfig;

  const title = s.meta_title?.trim() || fallback.title;
  const description = s.meta_description?.trim() || fallback.description;
  const keywords =
    s.meta_keywords?.trim() ||
    fallback.keywords ||
    "saurashtra honey, pure raw honey, organic honey, natural honey gujarat, buy honey online";
  const canonical = s.canonical_url?.trim() || fallback.canonical;
  const ogImage =
    s.og_image?.trim() ||
    fallback.ogImage ||
    "https://saurashtrahoney.com/saurashtra-honey-logo-complete.png";
  const type = fallback.type || "website";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonical },
      { property: "og:image", content: ogImage },
      { property: "og:site_name", content: "Saurashtra Honey" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
