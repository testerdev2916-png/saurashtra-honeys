import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any;

async function assertStaff(supabase: SB, userId: string) {
  const { data, error } = await supabase.rpc("is_staff", { _user_id: userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: staff role required");
}
async function assertPerm(supabase: SB, userId: string, key: string) {
  const { data, error } = await supabase.rpc("has_permission", {
    _user_id: userId,
    _permission_key: key,
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Forbidden: missing permission ${key}`);
}
async function audit(
  supabase: any,
  actor: string,
  action: string,
  entity_type?: string,
  entity_id?: string,
  metadata: Record<string, unknown> = {},
) {
    await supabase
    .from("audit_logs")
    .insert({ actor_id: actor, action, entity_type, entity_id, metadata } as never);
}

/* -------------------- DASHBOARD -------------------- */

export const getDashboardStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ stats: DashboardStats }> => {
    await assertStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase.rpc("admin_dashboard_stats");
    if (error) throw new Error(error.message);
    return { stats: data as DashboardStats };
  });

export type DashboardStats = {
  revenue_total_paise: number;
  revenue_month_paise: number;
  orders_today: number;
  orders_pending: number;
  orders_delivered: number;
  orders_cancelled: number;
  customers_total: number;
  products_total: number;
  low_stock_products: number;
  out_of_stock: number;
  sales_last_30: { day: string; revenue_paise: number; orders: number }[];
  top_products: { name: string | null; slug: string | null; units: number; revenue: number }[];
  top_customers: { name: string; email: string | null; orders: number; spent_paise: number }[];
  recent_orders: {
    id: string;
    order_number: string | null;
    full_name: string | null;
    email: string | null;
    total_paise: number;
    status: string;
    created_at: string;
  }[];
};

/* -------------------- CATEGORIES -------------------- */

const catSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  image_url: z.string().max(2000).nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
  seo_title: z.string().max(200).nullable().optional(),
  seo_description: z.string().max(400).nullable().optional(),
});

export async function seedDefaultCategoriesIfEmpty(supabase: SB) {
  try {
    const defaults = [
      { slug: "all-products", name: "All Products", sort_order: 1, active: true },
      { slug: "honey", name: "Honey", sort_order: 2, active: true },
      { slug: "beeswax", name: "Beeswax", sort_order: 3, active: true },
      { slug: "bee-pollen", name: "Bee Pollen", sort_order: 4, active: true },
      { slug: "beeswax-candle", name: "Beeswax Candles", sort_order: 5, active: true },
      { slug: "beauty-products", name: "Beauty Products", sort_order: 6, active: true },
    ];
    await supabase
      .from("categories")
      .upsert(defaults, { onConflict: "slug", ignoreDuplicates: true });

    // Safely migrate any products associated with disallowed categories and clean up disallowed category rows
    await supabase
      .from("products")
      .update({ category: "Beauty Products" })
      .in("name", ["Soft Skin Gel", "Royal Honey Glow Serum"]);

    await supabase
      .from("categories")
      .delete()
      .in("name", ["Virtual Categories", "New Category", "Virtual Collections"]);
  } catch (e) {
    console.error("Failed to seed categories:", e);
  }
}

export const listCategories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
        await seedDefaultCategoriesIfEmpty(context.supabase);
    const { data, error } = await context.supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[listCategories Error]:", error);
      throw new Error(error.message);
    }
    const DISALLOWED_SLUGS = [
      "body-care",
      "hair-care",
      "lip-care",
      "skin-care",
      "wood-leather-care",
      "single-flora",
    ];
    return {
      rows: (data ?? []).filter(
        (r) => !DISALLOWED_SLUGS.includes(String(r.slug).toLowerCase().trim())
      ),
    };
  });

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof catSchema>) => catSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "categories.manage");
        const { id, ...rest } = data;
    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!id) {
      const { data: existing } = await context.supabase
        .from("categories")
        .select("id")
        .eq("slug", cleanSlug)
        .maybeSingle();
      if (existing) {
        throw new Error(`A category with slug "${cleanSlug}" already exists.`);
      }
    } else {
      const { data: existing } = await context.supabase
        .from("categories")
        .select("id")
        .eq("slug", cleanSlug)
        .neq("id", id)
        .maybeSingle();
      if (existing) {
        throw new Error(`Another category with slug "${cleanSlug}" already exists.`);
      }
    }

    let oldName: string | null = null;
    if (id) {
      const { data: oldCat } = await context.supabase
        .from("categories")
        .select("name")
        .eq("id", id)
        .maybeSingle();
      if (oldCat) oldName = oldCat.name;
    }

    const payload = { ...rest, slug: cleanSlug };
    const q = id
      ? context.supabase
          .from("categories")
          .update(payload as never)
          .eq("id", id)
      : context.supabase.from("categories").insert(payload as never);
    const { error } = await q;
    if (error) throw new Error(error.message);

    if (id && oldName && oldName.trim() !== data.name.trim()) {
      await context.supabase
        .from("products")
        .update({ category: data.name.trim() })
        .ilike("category", oldName.trim());
    }

    await audit(context.supabase, context.userId, id ? "category.update" : "category.create", "category", id, {
      slug: cleanSlug,
    });
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "categories.manage");
        const { data: cat } = await context.supabase
      .from("categories")
      .select("name, slug")
      .eq("id", data.id)
      .maybeSingle();
    if (cat) {
      const { data: assigned, error: prodErr } = await context.supabase
        .from("products")
        .select("id")
        .ilike("category", cat.name.trim())
        .limit(1);
      if (!prodErr && assigned && assigned.length > 0) {
        throw new Error(
          `Cannot delete "${cat.name}": Products are currently assigned to this category. Reassign or remove those products before deleting.`,
        );
      }
    }
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "category.delete", "category", data.id);
    return { ok: true };
  });

// Dedicated upload for "Shop by Category" images. Stores into the shared `media`
// bucket under a `categories/` prefix and returns a permanent PUBLIC url (not a
// signed url) since category images render on the public storefront and must
// never expire. The admin then saves the returned url onto categories.image_url
// via upsertCategory.
export const uploadCategoryImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { filename: string; contentType: string; base64: string }) =>
    z
      .object({
        filename: z.string().min(1).max(200),
        contentType: z.string().max(120),
        base64: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "categories.manage");
        if (!data.contentType.startsWith("image/")) throw new Error("Only image files are allowed");
    const safe = data.filename.replace(/[^\w.-]+/g, "_");
    const path = `categories/${Date.now()}_${safe}`;
    const buf = Buffer.from(data.base64, "base64");
    if (buf.byteLength > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
    const up = await context.supabase.storage
      .from("media")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (up.error) throw new Error(up.error.message);
    await context.supabase.from("media_library").insert({
      bucket: "media",
      path,
      filename: data.filename,
      mime_type: data.contentType,
      size_bytes: buf.byteLength,
      uploaded_by: context.userId,
    } as never);
    const { data: pub } = context.supabase.storage.from("media").getPublicUrl(path);
    await audit(context.supabase, context.userId, "category.image_upload", "category", undefined, {
      filename: data.filename,
    });
    return { url: pub?.publicUrl ?? null };
  });

export const uploadProductImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { filename: string; contentType: string; base64: string }) =>
    z
      .object({
        filename: z.string().min(1).max(200),
        contentType: z.string().max(120),
        base64: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "products.manage");
        if (!data.contentType.startsWith("image/")) throw new Error("Only image files are allowed");
    const safe = data.filename.replace(/[^\w.-]+/g, "_");
    const path = `products/${Date.now()}_${safe}`;
    const buf = Buffer.from(data.base64, "base64");
    if (buf.byteLength > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
    const up = await context.supabase.storage
      .from("media")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (up.error) throw new Error(up.error.message);
    await context.supabase.from("media_library").insert({
      bucket: "media",
      path,
      filename: data.filename,
      mime_type: data.contentType,
      size_bytes: buf.byteLength,
      uploaded_by: context.userId,
    } as never);
    const { data: pub } = context.supabase.storage.from("media").getPublicUrl(path);
    await audit(context.supabase, context.userId, "product.image_upload", "product", undefined, {
      filename: data.filename,
    });
    return { url: pub?.publicUrl ?? null };
  });

/* -------------------- COUPONS -------------------- */

const couponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z
    .string()
    .min(2)
    .max(40)
    .transform((s) => s.toUpperCase()),
  description: z.string().max(400).nullable().optional(),
  discount_type: z.enum(["percent", "fixed", "free_shipping"]),
  discount_value: z.number().int().nonnegative().default(0),
  min_order_paise: z.number().int().nonnegative().default(0),
  max_discount_paise: z.number().int().nonnegative().nullable().optional(),
  usage_limit: z.number().int().nonnegative().nullable().optional(),
  per_user_limit: z.number().int().nonnegative().nullable().optional(),
  starts_at: z.string().nullable().optional(),
  expires_at: z.string().nullable().optional(),
  active: z.boolean().default(true),
});

export const listCoupons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
        const { data, error } = await context.supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const upsertCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof couponSchema>) => couponSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "coupons.manage");
        const { id, ...rest } = data;
    const payload = { ...rest, created_by: context.userId } as never;
    const q = id
      ? context.supabase
          .from("coupons")
          .update(rest as never)
          .eq("id", id)
      : context.supabase.from("coupons").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, id ? "coupon.update" : "coupon.create", "coupon", id, {
      code: data.code,
    });
    return { ok: true };
  });

export const deleteCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "coupons.manage");
        const { error } = await context.supabase.from("coupons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "coupon.delete", "coupon", data.id);
    return { ok: true };
  });

/* -------------------- BLOG -------------------- */

const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(160),
  title: z.string().min(1).max(240),
  excerpt: z.string().max(500).nullable().optional(),
  body_markdown: z.string().max(200000).nullable().optional(),
  cover_image_url: z.string().max(2000).nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  category_name: z.string().max(100).nullable().optional(),
  author_name: z.string().max(100).nullable().optional(),
  reading_time: z.string().max(40).nullable().optional(),
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  seo_title: z.string().max(200).nullable().optional(),
  seo_description: z.string().max(400).nullable().optional(),
  tags: z.array(z.string().max(40)).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().nullable().optional(),
});

export const listPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
        const { data, error } = await context.supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof postSchema>) => postSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "blog.manage");
        const { id, ...rest } = data;
    const payload = { ...rest, author_id: context.userId } as never;
    const q = id
      ? context.supabase
          .from("blog_posts")
          .update(rest as never)
          .eq("id", id)
      : context.supabase.from("blog_posts").insert(payload);
    const { error } = await q;
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, id ? "post.update" : "post.create", "post", id, {
      slug: data.slug,
      status: data.status,
    });
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "blog.manage");
        const { error } = await context.supabase
      .from("blog_posts")
      .update({ deleted_at: new Date().toISOString() } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "post.delete", "post", data.id);
    return { ok: true };
  });

/* -------------------- CUSTOMERS -------------------- */

export const listCustomers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { q?: string }) => z.object({ q: z.string().max(200).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        let q = context.supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.q)
      q = q.or(`full_name.ilike.%${data.q}%,email.ilike.%${data.q}%,phone.ilike.%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    // Attach counts via aggregate query
    const ids = (rows ?? []).map((r: { id: string }) => r.id);
    let counts: Record<string, { orders: number; spent: number }> = {};
    if (ids.length) {
      const { data: orders } = await context.supabase
        .from("orders")
        .select("user_id,total_paise,status")
        .in("user_id", ids)
        .is("deleted_at", null);
      counts = (orders ?? []).reduce<Record<string, { orders: number; spent: number }>>(
        (acc, o) => {
          if (!o.user_id) return acc;
          const k = o.user_id;
          if (!acc[k]) acc[k] = { orders: 0, spent: 0 };
          acc[k].orders++;
          if (
            ["paid", "processing", "packed", "shipped", "delivered", "confirmed"].includes(o.status)
          )
            acc[k].spent += o.total_paise;
          return acc;
        },
        {},
      );
    }
    return {
      rows: (rows ?? []).map((r: { id: string }) => ({
        ...r,
        orders_count: counts[r.id]?.orders ?? 0,
        spent_paise: counts[r.id]?.spent ?? 0,
      })),
    };
  });

export const updateCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status?: "active" | "disabled"; admin_notes?: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["active", "disabled"]).optional(),
        admin_notes: z.string().max(4000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
    const { error } = await context.supabase
      .from("profiles")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "customer.update", "customer", data.id, patch);
    return { ok: true };
  });

/* -------------------- SITE SETTINGS -------------------- */

export const listSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
        const { data, error } = await context.supabase.from("site_settings").select("*").order("key");
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const upsertSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; value: unknown; is_public?: boolean }) =>
    z
      .object({
        key: z.string().min(1).max(80),
        value: z.unknown(),
        is_public: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "settings.manage");
        const payload = {
      key: data.key,
      value: data.value,
      is_public: data.is_public ?? true,
      updated_by: context.userId,
    } as never;
    const { error } = await context.supabase.from("site_settings").upsert(payload);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "setting.update", "setting", data.key);
    return { ok: true };
  });

/* -------------------- MEDIA LIBRARY -------------------- */

export const listMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bucket?: string; q?: string }) =>
    z.object({ bucket: z.string().max(60).optional(), q: z.string().max(200).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        let q = context.supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.bucket) q = q.eq("bucket", data.bucket);
    if (data.q) q = q.ilike("filename", `%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const withUrls = await Promise.all(
      (rows ?? []).map(async (r: { bucket: string; path: string }) => {
        const { data: pub } = context.supabase.storage
          .from(r.bucket)
          .getPublicUrl(r.path);
        return { ...r, url: pub?.publicUrl ?? null };
      }),
    );
    return { rows: withUrls };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "media.manage");
        const { data: row, error: e0 } = await context.supabase
      .from("media_library")
      .select("bucket,path")
      .eq("id", data.id)
      .single();
    if (e0) throw new Error(e0.message);
    await context.supabase.storage.from(row.bucket).remove([row.path]);
    const { error } = await context.supabase.from("media_library").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "media.delete", "media", data.id);
    return { ok: true };
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      bucket: string;
      folder?: string;
      filename: string;
      contentType: string;
      base64: string;
      alt_text?: string;
    }) =>
      z
        .object({
          bucket: z.enum(["product-images", "media"]),
          folder: z
            .enum(["logos", "hero", "banners", "blog", "avatars", "documents", "general"])
            .optional(),
          filename: z.string().min(1).max(200),
          contentType: z.string().max(120),
          base64: z.string().min(1),
          alt_text: z.string().max(300).optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "media.manage");
        const safe = data.filename.replace(/[^\w.-]+/g, "_");
    const folderPrefix = data.bucket === "media" && data.folder ? `${data.folder}/` : "";
    const path = `${folderPrefix}${Date.now()}_${safe}`;
    const buf = Buffer.from(data.base64, "base64");
    if (buf.byteLength > 20 * 1024 * 1024) throw new Error("File too large (max 20MB)");
    const up = await context.supabase.storage
      .from(data.bucket)
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (up.error) throw new Error(up.error.message);
    const { data: row, error } = await context.supabase
      .from("media_library")
      .insert({
        bucket: data.bucket,
        path,
        filename: data.filename,
        mime_type: data.contentType,
        size_bytes: buf.byteLength,
        alt_text: data.alt_text ?? null,
        uploaded_by: context.userId,
      } as never)
      .select("id,bucket,path")
      .single();
    if (error) throw new Error(error.message);
    const { data: pub } = context.supabase.storage
      .from(data.bucket)
      .getPublicUrl(path);
    await audit(context.supabase, context.userId, "media.upload", "media", row.id, {
      filename: data.filename,
      bucket: data.bucket,
    });
    return { id: row.id, url: pub?.publicUrl ?? null, path };
  });

/* -------------------- USERS / ROLES -------------------- */

export const listUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPerm(context.supabase, context.userId, "users.manage");
        const { data: roles } = await context.supabase.from("user_roles").select("user_id,role");
    const { data: users, error } = await context.supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error) throw new Error(error.message);
    const byId: Record<string, string[]> = {};
    (roles ?? []).forEach((r: { user_id: string; role: string }) => {
      (byId[r.user_id] ||= []).push(r.role);
    });
    return {
      rows: users.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        roles: byId[u.id] ?? [],
      })),
    };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { user_id: string; role: string; action: "grant" | "revoke" }) =>
    z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["super_admin", "admin", "manager", "editor", "customer"]),
        action: z.enum(["grant", "revoke"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "users.manage");
        if (data.action === "grant") {
      const { error } = await context.supabase
        .from("user_roles")
        .insert({ user_id: data.user_id, role: data.role } as never);
      if (error && !String(error.message).includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    await audit(context.supabase, context.userId, `role.${data.action}`, "user", data.user_id, { role: data.role });
    return { ok: true };
  });

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; role?: string }) =>
    z.object({ email: z.string().email(), role: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "users.manage");
        const { data: inv, error } = await context.supabase.auth.admin.inviteUserByEmail(data.email);
    if (error) throw new Error(error.message);
    if (data.role && inv.user) {
      await context.supabase
        .from("user_roles")
        .insert({ user_id: inv.user.id, role: data.role } as never);
    }
    await audit(context.supabase, context.userId, "user.invite", "user", inv.user?.id, {
      email: data.email,
      role: data.role,
    });
    return { ok: true };
  });

export const sendPasswordReset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string }) => z.object({ email: z.string().email() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "users.manage");
        const { error } = await context.supabase.auth.admin.generateLink({
      type: "recovery",
      email: data.email,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* -------------------- AUDIT -------------------- */

export const listAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { q?: string; entity_type?: string }) =>
    z
      .object({ q: z.string().max(120).optional(), entity_type: z.string().max(40).optional() })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "audit.read");
        let q = context.supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.entity_type) q = q.eq("entity_type", data.entity_type);
    if (data.q) q = q.ilike("action", `%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

/* -------------------- ORDERS EXTENDED -------------------- */

export const updateOrderExtended = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      id: string;
      status?: string;
      admin_notes?: string;
      tracking_number?: string;
      shipping_carrier?: string;
      refund_amount_paise?: number;
    }) =>
      z
        .object({
          id: z.string().uuid(),
          status: z
            .enum([
              "pending",
              "paid",
              "confirmed",
              "processing",
              "packed",
              "shipped",
              "delivered",
              "cancelled",
              "refunded",
            ])
            .optional(),
          admin_notes: z.string().max(4000).optional(),
          tracking_number: z.string().max(200).optional(),
          shipping_carrier: z.string().max(120).optional(),
          refund_amount_paise: z.number().int().nonnegative().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "orders.manage");
        const patch: Record<string, unknown> = {};
    (
      [
        "status",
        "admin_notes",
        "tracking_number",
        "shipping_carrier",
        "refund_amount_paise",
      ] as const
    ).forEach((k) => {
      if ((data as Record<string, unknown>)[k] !== undefined)
        patch[k] = (data as Record<string, unknown>)[k];
    });
    if (data.status === "refunded") patch.refunded_at = new Date().toISOString();
    const { data: cur } = await context.supabase
      .from("orders")
      .select("timeline")
      .eq("id", data.id)
      .single();
    const timeline = Array.isArray((cur as { timeline?: unknown })?.timeline)
      ? (cur as { timeline: unknown[] }).timeline
      : [];
    if (data.status)
      timeline.push({
        at: new Date().toISOString(),
        by: context.userId,
        status: data.status,
        note: data.admin_notes,
      });
    patch.timeline = timeline;
    const { error } = await context.supabase
      .from("orders")
      .update(patch as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "order.update", "order", data.id, patch);
    return { ok: true };
  });

/* -------------------- INVENTORY -------------------- */

export const adjustStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { product_id: string; change: number; reason?: string }) =>
    z
      .object({
        product_id: z.string().uuid(),
        change: z.number().int(),
        reason: z.string().max(400).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPerm(context.supabase, context.userId, "products.manage");
        const { data: p, error: e0 } = await context.supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", data.product_id)
      .single();
    if (e0) throw new Error(e0.message);
    const before = (p as { stock_quantity: number }).stock_quantity;
    const after = Math.max(0, before + data.change);
    const { error } = await context.supabase
      .from("products")
      .update({ stock_quantity: after, in_stock: after > 0 } as never)
      .eq("id", data.product_id);
    if (error) throw new Error(error.message);
    await context.supabase.from("inventory_history").insert({
      product_id: data.product_id,
      change: data.change,
      before,
      after,
      reason: data.reason ?? "adjustment",
      actor_id: context.userId,
    } as never);
    await audit(context.supabase, context.userId, "inventory.adjust", "product", data.product_id, {
      change: data.change,
    });
    return { ok: true, before, after };
  });

/* -------------------- HOMEPAGE VIDEOS / STORIES -------------------- */

const homepageVideoSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).nullable().optional(),
  badge: z.string().max(100).nullable().optional(),
  video_url: z.string().max(2000).nullable().optional(),
  thumbnail_url: z.string().max(2000).nullable().optional(),
  product_slug: z.string().max(200).nullable().optional(),
  link_url: z.string().max(500).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  placement: z.string().default("all"),
  display_order: z.number().int().default(0),
});

export const listHomepageVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
        const { data, error } = await context.supabase
      .from("homepage_videos")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const upsertHomepageVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof homepageVideoSchema>) => homepageVideoSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
    const { id, ...rest } = data;
    const q = id
      ? context.supabase
          .from("homepage_videos")
          .update(rest as never)
          .eq("id", id)
      : context.supabase.from("homepage_videos").insert(rest as never);
    const { error } = await q;
    if (error) throw new Error(error.message);
    await audit(
      context.supabase,
      context.userId,
      id ? "homepage_video.update" : "homepage_video.create",
      "homepage_video",
      id,
      { title: data.title },
    );
    return { ok: true };
  });

export const deleteHomepageVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        const { error } = await context.supabase.from("homepage_videos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.supabase, context.userId, "homepage_video.delete", "homepage_video", data.id);
    return { ok: true };
  });

export const reorderHomepageVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { items: { id: string; display_order: number }[] }) =>
    z
      .object({
        items: z.array(z.object({ id: z.string().uuid(), display_order: z.number().int() })),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.supabase, context.userId);
        for (const item of data.items) {
      const { error } = await context.supabase
        .from("homepage_videos")
        .update({ display_order: item.display_order } as never)
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    }
    await audit(context.supabase, context.userId, "homepage_video.reorder", "homepage_video", undefined, {
      count: data.items.length,
    });
    return { ok: true };
  });
