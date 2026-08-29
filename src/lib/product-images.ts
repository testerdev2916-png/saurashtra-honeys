import { supabase } from "@/integrations/supabase/client";
import ajwain from "@/assets/prod-ajwain.jpg";
import fennel from "@/assets/prod-fennel.jpg";
import lychee from "@/assets/prod-lychee.jpg";
import multiflora from "@/assets/prod-multiflora.jpg";
import squeeze from "@/assets/prod-squeeze.jpg";
import honeycomb from "@/assets/prod-honeycomb.jpg";
import giftpack from "@/assets/prod-giftpack.jpg";
import hero from "@/assets/hero-honey.jpg";
import beeFarm from "@/assets/bee-farm.jpg";
import drizzle from "@/assets/honey-drizzle.jpg";
import family from "@/assets/family-honey.jpg";
import beeFlower from "@/assets/bee-flower.jpg";
import liquid from "@/assets/prod-liquid.jpg";
import team from "@/assets/team-beekeepers.jpg";
import beeswaxPellets from "@/assets/prod-beeswax-pellets.png";
import beePollen from "@/assets/prod-bee-pollen.png";
import beeswaxCandles from "@/assets/prod-beeswax-candles.png";
import beautyProducts from "@/assets/prod-beauty.png";
import luxuryHamper from "@/assets/prod-luxury-hamper.png";

export const imageMap: Record<string, string> = {
  "ajwain-honey": ajwain,
  "prod-ajwain": ajwain,
  "fennel-honey": fennel,
  "prod-fennel": fennel,
  "lychee-honey": lychee,
  "prod-lychee": lychee,
  "multiflora-honey": multiflora,
  "prod-multiflora": multiflora,
  "raw-honey-squeeze": squeeze,
  "prod-squeeze": squeeze,
  "honey-comb": honeycomb,
  "prod-honeycomb": honeycomb,
  "premium-gift-pack": giftpack,
  "family-gift-pack": giftpack,
  "prod-giftpack": giftpack,
  "hero-honey": hero,
  "bee-farm": beeFarm,
  "honey-drizzle": drizzle,
  "family-honey": family,
  "bee-flower": beeFlower,
  "prod-liquid": liquid,
  "team-beekeepers": team,
  // Add new product images mapped from products.json
  "prod-beeswax-pellets": beeswaxPellets,
  "prod-bee-pollen": beePollen,
  "prod-beeswax-candles": beeswaxCandles,
  "prod-beauty": beautyProducts,
  "prod-luxury-hamper": luxuryHamper,
};

export const IMAGE_KEYS = Object.keys(imageMap);
export const FALLBACK_IMAGE = hero;

export function resolveImage(
  key: string | null | undefined,
  url: string | null | undefined,
  fallback: string = FALLBACK_IMAGE,
  updatedAt?: string | null,
): string {
  let cleanUrl = url?.trim();
  
  // If url is empty but key looks like a path (e.g. products/123.jpg), treat it as the url
  if (!cleanUrl && key?.trim() && key.includes('/')) {
    cleanUrl = key.trim();
  }

  let resultUrl = fallback;
  if (cleanUrl) {
    if (/^https?:\/\//i.test(cleanUrl)) {
      resultUrl = cleanUrl;
    } else {
      let path = cleanUrl.replace(/^\/+/, '');
      let bucket = "media";
      
      if (path.startsWith('media/')) {
        path = path.substring(6);
      } else if (path.startsWith('review-media/')) {
        bucket = "review-media";
        path = path.substring(13);
      }
      
      // Remove query strings if they accidentally got stored
      path = path.split('?')[0].split('#')[0];

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      if (data && data.publicUrl) {
        resultUrl = data.publicUrl;
      }
    }
  } else if (key && imageMap[key]) {
      resultUrl = imageMap[key];
  }
  
  if (updatedAt && resultUrl.includes('supabase.co')) {
      const ts = new Date(updatedAt).getTime();
      if (!isNaN(ts)) {
          const separator = resultUrl.includes('?') ? '&' : '?';
          resultUrl += `${separator}v=${ts}`;
      }
  }
  
  return resultUrl;
}

/**
 * ONE CANONICAL HELPER for Category Images as requested.
 * 1. Returns null if there is no image.
 * 2. Returns category.image_url unchanged if it is already an absolute HTTPS URL.
 * 3. Converts a Storage path to the correct public URL exactly once.
 * 4. Never uses local fallback when a valid image_url exists.
 */
export function getCategoryImageUrl(category: { image_url?: string | null, slug?: string }): string | null {
  if (!category || !category.image_url) {
    return null;
  }
  
  const cleanUrl = category.image_url.trim();
  if (!cleanUrl) return null;

  // If it's already a full HTTP/HTTPS URL, return it exactly as-is.
  if (/^https?:\/\//i.test(cleanUrl)) {
    return cleanUrl;
  }

  // It's a storage path, convert it exactly once using the "media" bucket.
  let path = cleanUrl.replace(/^\/+/, '');
  if (path.startsWith('media/')) {
    path = path.substring(6);
  }
  
  path = path.split('?')[0].split('#')[0]; // remove accidental query strings

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  if (data && data.publicUrl) {
    return data.publicUrl;
  }

  return null;
}

