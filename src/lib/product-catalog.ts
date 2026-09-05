import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, type Product, type ProductVariant } from "@/lib/products";
import { resolveImage } from "@/lib/product-images";

type Row = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  flora: string | null;
  badge: string | null;
  price: number;
  price_max: number | null;
  mrp: number | null;
  rating: number | string;
  reviews_count: number;
  sizes: unknown;
  benefits: unknown;
  image_key: string | null;
  image_url: string | null;
  images?: unknown;
  attributes?: unknown;
  additional_images?: unknown;
  show_on_homepage: boolean | null;
  story_description: string | null;
  what_makes_special: unknown;
  floral_source_notes: string | null;
  storage_usage: string | null;
  purity_lab_test: string | null;
  updated_at: string;
};

type VariantRow = {
  id: string;
  product_id: string;
  label: string;
  price: number;
  mrp: number | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  is_default: boolean | null;
  sku: string | null;
  weight_g: number | null;
};

function fallbackImage(slug: string): string {
  return staticProducts.find((p) => p.slug === slug)?.image ?? "";
}

function toProduct(r: Row, varMap?: Map<string, VariantRow[]>): Product {
  const dbVariants = r.id && varMap ? varMap.get(r.id) : undefined;
  const mappedVariants: ProductVariant[] | undefined =
    dbVariants && dbVariants.length > 0
      ? dbVariants.map((v) => ({
          id: v.id,
          label: v.label,
          price: v.price,
          mrp: v.mrp ?? undefined,
          stock: v.stock_quantity ?? 100,
          inStock: v.is_active !== false && (v.stock_quantity ?? 100) > 0,
          isDefault: !!v.is_default,
          sku: v.sku ?? undefined,
          weightG: v.weight_g ?? undefined,
        }))
      : undefined;

  const activeSizes =
    mappedVariants && mappedVariants.length > 0
      ? mappedVariants.map((v) => v.label)
      : Array.isArray(r.sizes)
      ? (r.sizes as string[])
      : [];

  const defaultVariant =
    mappedVariants && mappedVariants.length > 0
      ? mappedVariants.find((v) => v.isDefault) || mappedVariants[0]
      : undefined;

  const staticMatch = staticProducts.find((p) => p.slug === r.slug);
  const rawImages = Array.isArray(r.images)
    ? (r.images as unknown[]).filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : [];
  const galleryImages =
    rawImages.length > 0
      ? Array.from(new Set(rawImages)).slice(0, 9).map(img => resolveImage(img, null, fallbackImage(r.slug), r.updated_at))
      : staticMatch?.images;
  const primaryImg = resolveImage(
    r.image_key,
    r.image_url,
    galleryImages && galleryImages.length > 0 ? galleryImages[0] : fallbackImage(r.slug),
    r.updated_at
  );

  const rawAdditional = Array.isArray(r.additional_images)
    ? (r.additional_images as unknown[]).filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : r.attributes && typeof r.attributes === "object" && Array.isArray((r.attributes as Record<string, unknown>).additional_images)
    ? ((r.attributes as Record<string, unknown>).additional_images as unknown[]).filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : [];
  const additionalImages =
    rawAdditional.length > 0
      ? Array.from(new Set(rawAdditional)).slice(0, 8).map(img => resolveImage(img, null, fallbackImage(r.slug), r.updated_at))
      : staticMatch?.additionalImages;

  return {
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? "",
    description: r.description ?? staticMatch?.description ?? "",
    category: (r.category ?? "Honey") as Product["category"],
    flora: r.flora ?? staticMatch?.flora,
    badge: (r.badge ?? undefined) as Product["badge"],
    price: defaultVariant ? defaultVariant.price : r.price,
    priceMax: r.price_max ?? undefined,
    mrp: defaultVariant ? defaultVariant.mrp : r.mrp ?? undefined,
    rating: typeof r.rating === "string" ? Number(r.rating) : r.rating,
    reviews: r.reviews_count,
    sizes: activeSizes,
    variants: mappedVariants,
    image: primaryImg,
    images: galleryImages,
    additionalImages: additionalImages,
    benefits: Array.isArray(r.benefits)
      ? (r.benefits as string[])
      : staticMatch?.benefits ?? [],
    attributes:
      typeof r.attributes === "object" && r.attributes !== null
        ? (r.attributes as Record<string, string | string[]>)
        : staticMatch?.attributes,
    showOnHomepage: !!r.show_on_homepage,
    story_description: r.story_description ?? undefined,
    what_makes_special: Array.isArray(r.what_makes_special) ? (r.what_makes_special as string[]) : undefined,
    floral_source_notes: r.floral_source_notes ?? undefined,
    storage_usage: r.storage_usage ?? undefined,
    purity_lab_test: r.purity_lab_test ?? undefined,
    updatedAt: r.updated_at,
  };
}

async function fetchAllVariantsMap(productIds?: string[]): Promise<Map<string, VariantRow[]> | undefined> {
  try {
    let query = supabase
      .from("product_variants")
      .select("id,product_id,label,price,mrp,stock_quantity,is_active,is_default,sku,sort_order,weight_g")
      .order("sort_order", { ascending: true });

    if (productIds && productIds.length > 0) {
      query = query.in("product_id", productIds);
    }

    const { data: vData } = await query;
    if (vData && Array.isArray(vData)) {
      const varMap = new Map<string, VariantRow[]>();
      for (const v of vData as unknown as VariantRow[]) {
        if (!varMap.has(v.product_id)) varMap.set(v.product_id, []);
        varMap.get(v.product_id)!.push(v);
      }
      return varMap;
    }
  } catch {
    // Graceful fallback if product_variants is missing from PostgREST schema cache
  }
  return undefined;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,
        image_key,
        image_url,
        images,
        attributes,
        additional_images,
        show_on_homepage,
        story_description,
        what_makes_special,
        floral_source_notes,
        storage_usage,
        purity_lab_test,
        updated_at
      `)
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    
    if (error) {
      console.error("[fetchProducts] Supabase error:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn("[fetchProducts] No products found in Supabase. Returning empty array.");
      return [];
    }
    const rows = data as unknown as Row[];
    const productIds = rows.map((r) => r.id).filter(Boolean);
    const varMap = await fetchAllVariantsMap(productIds);
    return rows.map((r) => toProduct(r, varMap));
  } catch (err) {
    console.error("[fetchProducts] Exception:", err);
    throw err;
  }
}

export async function fetchProduct(rawSlug: string): Promise<Product | null> {
  const slug = decodeURIComponent(rawSlug).trim().replace(/\/+$/, "");
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,
        image_key,
        image_url,
        images,
        attributes,
        additional_images,
        show_on_homepage,
        story_description,
        what_makes_special,
        floral_source_notes,
        storage_usage,
        purity_lab_test,
        updated_at
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("[fetchProduct] Supabase error:", error);
      throw error; // Let the router catch it as a real error
    }

    if (!data) {
      // No DB product found
      return null;
    }

    const row = data as unknown as Row;
    const varMap = await fetchAllVariantsMap(row.id ? [row.id] : undefined);
    return toProduct(row, varMap);
  } catch (err) {
    console.error("[fetchProduct] Exception:", err);
    throw err;
  }
}

