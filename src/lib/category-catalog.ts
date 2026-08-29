import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/product-images";
import honeyFallback from "@/assets/hero-honey.jpg";
import beeswaxFallback from "@/assets/prod-honeycomb.jpg";
import pollenFallback from "@/assets/mortar-herbs.jpg";
import candleFallback from "@/assets/honeycomb-bees.jpg";
import giftpackFallback from "@/assets/prod-giftpack.jpg";
import beautyFallback from "@/assets/prod-lychee.jpg";
import allProductsFallback from "@/assets/hero-products.jpg";

export type ShopCategory = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  active: boolean;
  updated_at?: string;
};

type Row = {
  slug: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  active: boolean;
  updated_at: string;
};

export const DEFAULT_SHOP_CATEGORIES: ShopCategory[] = [];

export const listPublicCategoriesFn = async (): Promise<ShopCategory[]> => {

  const mapCategory = (c: any): ShopCategory => {
    let fallback = allProductsFallback;
    if (c.slug === "honey") fallback = honeyFallback;
    else if (c.slug === "beeswax") fallback = beeswaxFallback;
    else if (c.slug === "bee-pollen") fallback = pollenFallback;
    else if (c.slug === "beeswax-candles") fallback = candleFallback;
    else if (c.slug === "premium-gift-pack" || c.slug === "gift-hampers") fallback = giftpackFallback;
    else if (c.slug === "beauty-products") fallback = beautyFallback;

    if (!c.image_url) {
      console.warn("CATEGORY IMAGE MISSING", { slug: c.slug, name: c.name, image_url: c.image_url, source: "database/cache" });
    }

    const resolvedImg = resolveImage(null, c.image_url, fallback, c.updated_at);
    
    console.log("[CATEGORY FINAL IMAGE]", {
      slug: c.slug,
      name: c.name,
      image_url: resolvedImg
    });

    return {
      ...c,
      image_url: resolvedImg
    } as ShopCategory;
  };

  // TIER 2: Direct Database Query (Will likely fail due to 42501 until RLS is fixed)
  try {
    // Wrap the entire Supabase fetch in a strict 6-second timeout to prevent GoDaddy SSR hangs
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase fetchProducts timeout")), 6000)
    );

    const fetchPromise = (async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, slug, name, image_url, parent_id, sort_order, active, updated_at")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error && error.code === '42501') {
        // TIER 3: The Native Fallback (Extract unique categories from active products so the UI never crashes)
        const { data: prodData } = await supabase.from("products").select("category");
        if (prodData) {
          const uniqueCats = [...new Set(prodData.map(p => p.category).filter(Boolean))];
          const sortOrder = ["All Products", "Honey", "Beeswax", "Bee Pollen", "Beeswax Candles", "Beauty Products"];
          
          const dynamicCats: ShopCategory[] = [
            { id: "all-products", slug: "all-products", name: "All Products", image_url: null, parent_id: null, sort_order: 0, active: true }
          ];

          uniqueCats.forEach(name => {
            const strName = name as string;
            const slug = strName.toLowerCase().replace(/\s+/g, '-');
            dynamicCats.push({
              id: slug, slug, name: strName, image_url: null, parent_id: null,
              sort_order: sortOrder.indexOf(strName) !== -1 ? sortOrder.indexOf(strName) + 1 : 99,
              active: true
            });
          });

          const finalCats = dynamicCats.map(mapCategory).sort((a, b) => a.sort_order - b.sort_order);
          
          // Ensure Gift Hamper always exists
          if (!finalCats.find(c => c.slug === "gift-hamper" || c.slug === "gift-hampers")) {
            finalCats.push({
              id: "gift-hamper",
              slug: "gift-hamper",
              name: "Gift Hamper",
              image_url: giftpackFallback,
              parent_id: null,
              sort_order: 99,
              active: true
            });
          }

          console.log("[CATEGORY PIPELINE]", {
            source: "PRODUCTS_FALLBACK (42501)",
            categories: finalCats
          });
          return finalCats;
        }
      }

      if (error && error.code !== '42501') {
        console.error("Failed to fetch categories from Supabase:", error);
      }
      
      const finalCats = (data || []).map(mapCategory);
      
      // Ensure Gift Hamper always exists
      if (!finalCats.find(c => c.slug === "gift-hamper" || c.slug === "gift-hampers")) {
        finalCats.push({
          id: "gift-hamper",
          slug: "gift-hamper",
          name: "Gift Hamper",
          image_url: giftpackFallback,
          parent_id: null,
          sort_order: 99,
          active: true
        });
      }

      console.log("[CATEGORY PIPELINE]", {
        source: "SUPABASE_DB",
        categories: finalCats
      });
      return finalCats;
    })();

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.error("listPublicCategoriesFn caught an error.", err);
    return [];
  }
};

export async function fetchShopCategories(): Promise<ShopCategory[]> {
  try {
    const rows = await listPublicCategoriesFn();
    return rows;
  } catch (err) {
    console.error("fetchShopCategories caught an error.", err);
    // Returning empty array so UI doesn't crash but shows error state if needed
    return [];
  }
}
