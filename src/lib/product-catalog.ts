import { supabase } from "@/integrations/supabase/client";
import {
  sortVariantsBySize,
  getVariantPackaging,
  normalizeSizeKey,
  isComboOrHamper,
  extractInfographics,
  type Product,
  type ProductVariant,
  type SharedProductContent,
} from "@/lib/products";
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
  home_sort_order: number | null;
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
  image_url?: string | null;
  images?: unknown;
};

export const aliasMap: Record<string, string> = {
  // Multiflora Honey (250 GM is the parent content source)
  "multiflora-honey": "multiflora-honey-250GM",
  "multiflora-honey-500gm": "multiflora-honey-250GM",
  "multiflora-honey-1kg": "multiflora-honey-250GM",
  "multiflora-honey-28 kg": "multiflora-honey-250GM",
  "multiflora-honey-28kg": "multiflora-honey-250GM",
  "multiflora-honey-50g": "multiflora-honey-250GM",

  // Ajwain Honey (ajwain-honey is the 250 GM variant content source, ajwain-honey-500 is canonical)
  "ajwain-honey": "ajwain-honey-500",
  "ajwain-honey-250": "ajwain-honey-500",
  "ajwain-honey-250g": "ajwain-honey-500",
  "ajwain-honey-250gm": "ajwain-honey-500",
  "ajwain-honey-500": "ajwain-honey-500",
  "ajwain-honey-500g": "ajwain-honey-500",
  "ajwain-honey-500gm": "ajwain-honey-500",
  "ajwain-honey-1 kg": "ajwain-honey-500",
  "ajwain-honey-1kg": "ajwain-honey-500",
  "ajwain-honey-28kg": "ajwain-honey-500",
  "ajwain-honey-28KG": "ajwain-honey-500",

  // Fennel Honey (fennel-honey-250GM is the parent content source)
  "fennel-honey": "fennel-honey-250GM",
  "fennel-honey-250": "fennel-honey-250GM",
  "fennel-honey-250g": "fennel-honey-250GM",
  "fennel-honey-250gm": "fennel-honey-250GM",
  "fennel-honey-500": "fennel-honey-250GM",
  "fennel-honey-500gm": "fennel-honey-250GM",
  "fennel-honey-500g": "fennel-honey-250GM",
  "fennel-honey-28kg": "fennel-honey-250GM",
  "fennel-honey-28KG": "fennel-honey-250GM",

  // Bee Wax
  "bee wax-10kg": "Bee Wax",
  "bee-wax-10kg": "Bee Wax",
};

export function find250GmVariantSlug(product: {
  slug?: string | null;
  name?: string | null;
  category?: string | null;
  flora?: string | null;
}): string | null {
  if (isComboOrHamper(product)) {
    return null;
  }
  const s = (product.slug || "").toLowerCase();
  const n = (product.name || "").toLowerCase();
  const f = (product.flora || "").toLowerCase();

  if (s.includes("multiflora") || n.includes("multiflora") || f.includes("multiflora")) {
    return "multiflora-honey-250GM";
  }
  if (s.includes("ajwain") || n.includes("ajwain") || f.includes("ajwain")) {
    return "ajwain-honey";
  }
  if (s.includes("fennel") || n.includes("fennel") || f.includes("fennel")) {
    return "fennel-honey-250GM";
  }
  return null;
}

function toProduct(
  r: Row,
  varMap?: Map<string, VariantRow[]>,
  requestedSizeHint?: string,
  parent250Row?: Row | null,
): Product {
  const dbVariants = r.id && varMap ? varMap.get(r.id) : undefined;
  let mappedVariants: ProductVariant[] | undefined =
    dbVariants && dbVariants.length > 0
      ? dbVariants.map((v) => ({
          id: v.id,
          label: v.label,
          price: v.price,
          mrp: v.mrp ?? undefined,
          stock: v.stock_quantity ?? 100,
          inStock: v.is_active !== false && (v.stock_quantity ?? 100) > 0,
          isDefault: requestedSizeHint
            ? normalizeSizeKey(v.label) === normalizeSizeKey(requestedSizeHint)
            : !!v.is_default,
          sku: v.sku ?? undefined,
          weightG: v.weight_g ?? undefined,
          packaging: getVariantPackaging(v.label),
          image: v.image_url ? resolveImage(v.image_url, null, "", r.updated_at) : undefined,
          image_url: v.image_url ? resolveImage(v.image_url, null, "", r.updated_at) : undefined,
          images: Array.isArray(v.images)
            ? (v.images as string[])
                .filter((u) => typeof u === "string" && u.trim().length > 0)
                .map((u) => resolveImage(u, null, "", r.updated_at))
            : undefined,
        }))
      : undefined;

  // Preserve the intended default variant BEFORE sorting
  const defaultVariant =
    mappedVariants && mappedVariants.length > 0
      ? mappedVariants.find((v) => v.isDefault) || mappedVariants[0]
      : undefined;

  // Apply logical ascending numerical sort to variants (e.g. 50g -> 250g -> 1kg)
  if (mappedVariants) {
    mappedVariants = sortVariantsBySize(mappedVariants);
  }

  const activeSizes =
    mappedVariants && mappedVariants.length > 0
      ? mappedVariants.map((v) => v.label)
      : Array.isArray(r.sizes)
        ? (r.sizes as string[])
        : [];

  const rawImages = Array.isArray(r.images)
    ? (r.images as unknown[]).filter(
        (u): u is string => typeof u === "string" && u.trim().length > 0,
      )
    : [];
  const galleryImages =
    rawImages.length > 0
      ? Array.from(new Set(rawImages))
          .slice(0, 9)
          .map((img) => resolveImage(img, null, "", r.updated_at))
      : [];
  const primaryImg = resolveImage(
    r.image_key,
    r.image_url,
    galleryImages && galleryImages.length > 0 ? galleryImages[0] : "",
    r.updated_at,
  );

  const rawAdditional = Array.isArray(r.additional_images)
    ? (r.additional_images as unknown[]).filter(
        (u): u is string => typeof u === "string" && u.trim().length > 0,
      )
    : r.attributes &&
        typeof r.attributes === "object" &&
        Array.isArray((r.attributes as Record<string, unknown>).additional_images)
      ? ((r.attributes as Record<string, unknown>).additional_images as unknown[]).filter(
          (u): u is string => typeof u === "string" && u.trim().length > 0,
        )
      : [];
  const additionalImages =
    rawAdditional.length > 0
      ? Array.from(new Set(rawAdditional))
          .slice(0, 8)
          .map((img) => resolveImage(img, null, "", r.updated_at))
      : [];

  // Content Source: The 250 GM variant is the single source of truth for shared educational and trust content
  const contentSource = !isComboOrHamper(r) && parent250Row ? parent250Row : r;
  const rawSharedImages = Array.isArray(contentSource.images)
    ? (contentSource.images as unknown[]).filter(
        (u): u is string => typeof u === "string" && u.trim().length > 0,
      )
    : [];
  const infographics = extractInfographics(
    rawSharedImages.map((img) => resolveImage(img, null, "", contentSource.updated_at)),
  );

  const sharedContent: SharedProductContent = {
    sourceVariant: "250 GM",
    sourceSlug: contentSource.slug,
    story_description: contentSource.story_description ?? undefined,
    what_makes_special: Array.isArray(contentSource.what_makes_special)
      ? (contentSource.what_makes_special as string[])
      : undefined,
    floral_source_notes: contentSource.floral_source_notes ?? undefined,
    storage_usage: contentSource.storage_usage ?? undefined,
    purity_lab_test: contentSource.purity_lab_test ?? undefined,
    usage_instructions:
      (contentSource as Record<string, unknown>).usage_instructions &&
      typeof (contentSource as Record<string, unknown>).usage_instructions === "string"
        ? ((contentSource as Record<string, unknown>).usage_instructions as string)
        : undefined,
    ingredients:
      (contentSource as Record<string, unknown>).ingredients &&
      typeof (contentSource as Record<string, unknown>).ingredients === "string"
        ? ((contentSource as Record<string, unknown>).ingredients as string)
        : undefined,
    benefits: Array.isArray(contentSource.benefits)
      ? (contentSource.benefits as string[])
      : undefined,
    infographics,
  };

  return {
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    category: (r.category ?? "Honey") as Product["category"],
    flora: r.flora ?? undefined,
    badge: (r.badge ?? undefined) as Product["badge"],
    price: defaultVariant ? defaultVariant.price : r.price,
    priceMax: r.price_max ?? undefined,
    mrp: defaultVariant ? defaultVariant.mrp : (r.mrp ?? undefined),
    rating: typeof r.rating === "string" ? Number(r.rating) : r.rating,
    reviews: r.reviews_count,
    sizes: activeSizes,
    variants: mappedVariants,
    image: primaryImg,
    images: galleryImages,
    additionalImages: additionalImages,
    benefits: Array.isArray(contentSource.benefits)
      ? (contentSource.benefits as string[])
      : Array.isArray(r.benefits)
        ? (r.benefits as string[])
        : [],
    attributes:
      typeof r.attributes === "object" && r.attributes !== null
        ? (r.attributes as Record<string, string | string[]>)
        : undefined,
    showOnHomepage: !!r.show_on_homepage,
    homeSortOrder: r.home_sort_order ?? undefined,
    story_description: contentSource.story_description ?? r.story_description ?? undefined,
    what_makes_special: Array.isArray(contentSource.what_makes_special)
      ? (contentSource.what_makes_special as string[])
      : Array.isArray(r.what_makes_special)
        ? (r.what_makes_special as string[])
        : undefined,
    floral_source_notes: contentSource.floral_source_notes ?? r.floral_source_notes ?? undefined,
    storage_usage: contentSource.storage_usage ?? r.storage_usage ?? undefined,
    purity_lab_test: contentSource.purity_lab_test ?? r.purity_lab_test ?? undefined,
    updatedAt: r.updated_at,
    sharedContent,
  };
}

async function fetchAllVariantsMap(
  productIds?: string[],
): Promise<Map<string, VariantRow[]> | undefined> {
  try {
    let query = supabase
      .from("product_variants")
      .select(
        "id,product_id,label,price,mrp,stock_quantity,is_active,is_default,sku,sort_order,weight_g,image_url,images",
      )
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
      .select(
        `
        id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,
        image_key,
        image_url,
        images,
        attributes,
        show_on_homepage,
        home_sort_order,
        story_description,
        what_makes_special,
        floral_source_notes,
        storage_usage,
        purity_lab_test,
        updated_at
      `,
      )
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
    const rowSlugSet = new Set(rows.map((r) => r.slug.toLowerCase()));
    const canonicalRows = rows.filter((r) => {
      const aliasTarget = aliasMap[r.slug.toLowerCase()];
      if (
        aliasTarget &&
        aliasTarget.toLowerCase() !== r.slug.toLowerCase() &&
        rowSlugSet.has(aliasTarget.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    const parent250Map = new Map<string, Row>();
    for (const r of rows) {
      if (
        r.slug === "multiflora-honey-250GM" ||
        r.slug === "ajwain-honey" ||
        r.slug === "fennel-honey-250GM"
      ) {
        parent250Map.set(r.slug.toLowerCase(), r);
      }
    }

    const productIds = canonicalRows.map((r) => r.id).filter(Boolean);
    const varMap = await fetchAllVariantsMap(productIds);
    return canonicalRows.map((r) => {
      const pSlug = find250GmVariantSlug(r);
      const parentRow = pSlug ? parent250Map.get(pSlug.toLowerCase()) : null;
      return toProduct(r, varMap, undefined, parentRow);
    });
  } catch (err) {
    console.error("[fetchProducts] Exception:", err);
    throw err;
  }
}

export async function fetchProduct(rawSlug: string): Promise<Product | null> {
  const slug = decodeURIComponent(rawSlug).trim().replace(/\/+$/, "");
  try {
    const targetSlug = aliasMap[slug.toLowerCase()] || slug;
    let requestedSizeHint: string | undefined = undefined;
    if (targetSlug !== slug) {
      const match = slug.match(
        /[-_\s](250gm|250g|500gm|500g|1\s*kg|28\s*kg|50g|10kg|250|500)/i,
      );
      if (match) {
        requestedSizeHint = match[1].trim();
      }
    }

    let { data, error } = await supabase
      .from("products")
      .select(
        `
        id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,
        image_key,
        image_url,
        images,
        attributes,
        show_on_homepage,
        home_sort_order,
        story_description,
        what_makes_special,
        floral_source_notes,
        storage_usage,
        purity_lab_test,
        updated_at
      `,
      )
      .eq("slug", targetSlug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error("[fetchProduct] Supabase error:", error);
      throw error; // Let the router catch it as a real error
    }

    if (!data && targetSlug !== slug) {
      // If alias didn't match, fallback to original slug query
      const { data: origData } = await supabase
        .from("products")
        .select(
          `
          id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,
          image_key,
          image_url,
          images,
          attributes,
          show_on_homepage,
          home_sort_order,
          story_description,
          what_makes_special,
          floral_source_notes,
          storage_usage,
          purity_lab_test,
          updated_at
        `,
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      data = origData;
    }

    const finalData = data;

    if (!finalData) {
      // No DB product found
      return null;
    }

    const row = finalData as unknown as Row;
    let parent250Row: Row | null = null;
    const parentSlug = find250GmVariantSlug(row);
    if (parentSlug && parentSlug.toLowerCase() !== row.slug.toLowerCase()) {
      const { data: p250Data } = await supabase
        .from("products")
        .select(
          `
          id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,
          image_key,
          image_url,
          images,
          attributes,
          show_on_homepage,
          home_sort_order,
          story_description,
          what_makes_special,
          floral_source_notes,
          storage_usage,
          purity_lab_test,
          updated_at
        `,
        )
        .eq("slug", parentSlug)
        .eq("status", "published")
        .maybeSingle();
      if (p250Data) {
        parent250Row = p250Data as unknown as Row;
      }
    }

    const varMap = await fetchAllVariantsMap(row.id ? [row.id] : undefined);
    return toProduct(row, varMap, requestedSizeHint, parent250Row);
  } catch (err) {
    console.error("[fetchProduct] Exception:", err);
    throw err;
  }
}
