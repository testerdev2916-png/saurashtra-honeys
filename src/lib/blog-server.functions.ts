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
      .select("*", { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null);

    if (data.cat && data.cat !== "All Posts") {
      // NOTE: category_name does not exist in the blog_posts table directly. 
      // If categories are needed, this should join with a categories table or use category_id.
    }

    if (data.q && data.q.trim()) {
      const term = data.q.trim().replace(/%/g, "");
      query = query.or(
        `title.ilike.%${term}%,excerpt.ilike.%${term}%,body_markdown.ilike.%${term}%`
      );
    }

    query = query
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(start, end);

    const { data: rows, error, count } = await query;
    if (error) {
      if (error.code !== '42501') {
        console.error("listPublicPosts error:", error.message);
      }
      return { rows: [], total: 0, page, totalPages: 1 };
    }

    const total = count ?? (rows ? rows.length : 0);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      rows: (rows ?? []) as unknown as PublicBlogPost[],
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
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !post) {
      return { post: null, related: [] as PublicBlogPost[] };
    }

    const currentPost = post as unknown as PublicBlogPost;

    // Fetch up to 3 related published posts (same category first, then others)
    let relatedQuery = supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .is("deleted_at", null)
      .neq("slug", currentPost.slug)
      .order("published_at", { ascending: false })
      .limit(6);

    const { data: relatedRows } = await relatedQuery;
    const allRelated = (relatedRows ?? []) as unknown as PublicBlogPost[];
    const sameCat = allRelated.filter(
      (r) => r.category_name && currentPost.category_name && r.category_name.toLowerCase() === currentPost.category_name.toLowerCase()
    );
    const otherCat = allRelated.filter(
      (r) => !(r.category_name && currentPost.category_name && r.category_name.toLowerCase() === currentPost.category_name.toLowerCase())
    );

    const related = [...sameCat, ...otherCat].slice(0, 3);

    return {
      post: currentPost,
      related,
    };
  });

export const getPopularPosts = createServerFn({ method: "POST" })
  .inputValidator((d: { limit?: number } | undefined) =>
    z.object({ limit: z.number().int().min(1).max(20).default(4) }).parse(d ?? {})
  )
  .handler(async ({ data }) => {
        const limit = data.limit || 4;

    const { data: popularRows } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(limit);

    let rows = (popularRows ?? []) as unknown as PublicBlogPost[];

    // If fewer than limit marked popular, fallback to top recent published posts
    if (rows.length < limit) {
      const existingIds = rows.map((r) => r.id);
      let fallbackQuery = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(limit - rows.length);

      const { data: fallbackRows } = await fallbackQuery;
      if (fallbackRows) {
        for (const fb of fallbackRows as unknown as PublicBlogPost[]) {
          if (!existingIds.includes(fb.id)) {
            rows.push(fb);
          }
        }
      }
    }

    return { rows: rows.slice(0, limit) };
  });

export const getFeaturedPost = createServerFn({ method: "POST" })
  .handler(async () => {
    
    let { data: post } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!post) {
      const { data: latest } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      post = latest;
    }

    return { post: (post ?? null) as PublicBlogPost | null };
  });
