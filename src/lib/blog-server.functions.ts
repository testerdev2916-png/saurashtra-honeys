import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  category_name: string | null;
  author_name: string | null;
  reading_time: string | null;
  is_featured: boolean;
  is_popular: boolean;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapBlogPostRow(row: any): PublicBlogPost {
  if (!row) return row;
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return {
    ...row,
    category_name: row.blog_categories?.name || "Honey & Health",
    author_name: row.author_name || "Saurashtra Honey Team",
    reading_time: row.reading_time || "5 min read",
    is_featured: !!row.is_featured || tags.includes("featured"),
    is_popular: !!row.is_popular || tags.includes("popular"),
  };
}

const listInputSchema = z.object({
  cat: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(6),
});

export const listPublicPosts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listInputSchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const page = data.page || 1;
    const pageSize = data.pageSize || 6;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from("blog_posts")
      .select("*, blog_categories(name)", { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null);

    if (data.cat && data.cat !== "All Posts") {
      const { data: catMatch } = await supabase
        .from("blog_categories")
        .select("id")
        .ilike("name", data.cat.trim())
        .maybeSingle();
      if (catMatch) {
        query = query.eq("category_id", catMatch.id);
      }
    }

    if (data.q && data.q.trim()) {
      const term = data.q.trim().replace(/%/g, "");
      query = query.or(
        `title.ilike.%${term}%,excerpt.ilike.%${term}%,body_markdown.ilike.%${term}%`,
      );
    }

    query = query
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(start, end);

    const { data: rows, error, count } = await query;
    if (error) {
      if (error.code !== "42501") {
        console.error("listPublicPosts error:", error.message);
      }
      return { rows: [], total: 0, page, totalPages: 1 };
    }

    const total = count ?? (rows ? rows.length : 0);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      rows: (rows ?? []).map(mapBlogPostRow),
      total,
      page,
      totalPages,
    };
  });

export const getPublicPost = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*, blog_categories(name)")
      .eq("slug", data.slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !post) {
      return { post: null, related: [] as PublicBlogPost[] };
    }

    const currentPost = mapBlogPostRow(post);

    // Fetch up to 3 related published posts (same category first, then others)
    let relatedQuery = supabase
      .from("blog_posts")
      .select("*, blog_categories(name)")
      .eq("status", "published")
      .is("deleted_at", null)
      .neq("slug", currentPost.slug)
      .order("published_at", { ascending: false })
      .limit(6);

    const { data: relatedRows } = await relatedQuery;
    const allRelated = (relatedRows ?? []).map(mapBlogPostRow);
    const sameCat = allRelated.filter(
      (r) =>
        r.category_name &&
        currentPost.category_name &&
        r.category_name.toLowerCase() === currentPost.category_name.toLowerCase(),
    );
    const otherCat = allRelated.filter(
      (r) =>
        !(
          r.category_name &&
          currentPost.category_name &&
          r.category_name.toLowerCase() === currentPost.category_name.toLowerCase()
        ),
    );

    const related = [...sameCat, ...otherCat].slice(0, 3);

    return {
      post: currentPost,
      related,
    };
  });

export const getPopularPosts = createServerFn({ method: "POST" })
  .inputValidator((d: { limit?: number } | undefined) =>
    z.object({ limit: z.number().int().min(1).max(20).default(4) }).parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const limit = data.limit || 4;

    const { data: popularRows } = await supabase
      .from("blog_posts")
      .select("*, blog_categories(name)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(limit);

    let rows = (popularRows ?? []).map(mapBlogPostRow);

    // If fewer than limit marked popular, fallback to top recent published posts
    if (rows.length < limit) {
      const existingIds = rows.map((r) => r.id);
      let fallbackQuery = supabase
        .from("blog_posts")
        .select("*, blog_categories(name)")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(limit - rows.length);

      const { data: fallbackRows } = await fallbackQuery;
      if (fallbackRows) {
        for (const fb of (fallbackRows ?? []).map(mapBlogPostRow)) {
          if (!existingIds.includes(fb.id)) {
            rows.push(fb);
          }
        }
      }
    }

    return { rows: rows.slice(0, limit) };
  });

export const getFeaturedPost = createServerFn({ method: "POST" }).handler(async () => {
  let { data: post } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(name)")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!post) {
    const { data: latest } = await supabase
      .from("blog_posts")
      .select("*, blog_categories(name)")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    post = latest;
  }

  return { post: post ? mapBlogPostRow(post) : null };
});
