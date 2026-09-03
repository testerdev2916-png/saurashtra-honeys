import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage, FALLBACK_IMAGE } from "@/lib/product-images";
import type { HeroSlide } from "@/components/site/HeroSlider";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import heroHoneyImg from "@/assets/hero-honey.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";

export const fetchPublicHeroRows = createServerFn({ method: "POST" })
  .inputValidator((d: { page: string }) => z.object({ page: z.string() }).parse(d))
  .handler(async ({ data: { page } }) => {
    try {
      // 1. Try public client first (will fail with 42501 if RLS is broken)
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("page", page)
        .eq("active", true)
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        return { rows: data as unknown as HeroRow[] };
      }

      // 2. If RLS blocks it (42501), fallback to secure Server Admin client
      if (error && error.code === '42501') {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: adminData, error: adminError } = await supabaseAdmin
          .from("hero_slides")
          .select("*")
          .eq("page", page)
          .eq("active", true)
          .order("sort_order", { ascending: true });
          
        if (adminData && adminData.length > 0) {
          return { rows: adminData as unknown as HeroRow[] };
        }
      }

      return { rows: [] as HeroRow[] };
    } catch (err) {
      console.error("fetchPublicHeroRows error:", err);
      return { rows: [] as HeroRow[] };
    }
  });

export type HeroRow = {
  id: string;
  page: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image_key?: string;
  image_url?: string;
  mobile_image_url?: string;
  cta_label?: string;
  cta_href: string;
  sort_order: number;
  active: boolean;
  updated_at: string;
};

export function heroRowToSlide(r: HeroRow): HeroSlide {
  return {
    eyebrow: r.eyebrow || undefined,
    title: r.title || "Promotional Banner",
    description: r.subtitle || undefined,
    image: resolveImage(r.image_key, r.image_url, FALLBACK_IMAGE, r.updated_at),
    mobileImage: r.mobile_image_url 
      ? `${r.mobile_image_url}${r.mobile_image_url.includes('?') ? '&' : '?'}v=${new Date(r.updated_at).getTime()}` 
      : undefined,
    ctaText: r.cta_label || undefined,
    ctaTo: r.cta_href || "/shop",
    updatedAt: r.updated_at,
  };
}

export function getDefaultHeroSlides(p: string = "home"): HeroSlide[] {
  if (p === "shop") {
    return [
      {
        image: heroHoneyImg,
        eyebrow: "Wildflower Honey from Saurashtra, Gujarat",
        title: "Wildflowers of Saurashtra.",
        description: "Honey made from the nectar of diverse wildflowers across Saurashtra.",
        features: ["100% Pure & Natural", "Rich Taste", "Wildflower Honey"],
        ctaText: "DISCOVER OUR HONEY \u2192",
        ctaTo: "/shop",
      },
      {
        image: honeycombBeesImg,
        eyebrow: "BEESWAX",
        title: "CRAFTED BY BEES.\nMADE FOR YOUR HOME.",
        description: "Natural beeswax, thoughtfully crafted.",
        features: ["100% Pure Beeswax", "Hand-Poured", "Clean Burning"],
        ctaText: "EXPLORE BEESWAX \u2192",
        ctaTo: "/shop/beeswax-candles",
      },
      {
        image: heroProductsImg,
        eyebrow: "BEE PRODUCTS",
        title: "NATURE HAS\nMORE TO OFFER.",
        description: "Discover our collection, inspired by the hive.",
        features: ["Raw Bee Pollen", "Pure Honeycomb", "Natural Skincare"],
        ctaText: "EXPLORE COLLECTION \u2192",
        ctaTo: "/shop",
      },
    ];
  }
  return []; // Return empty array for unknown pages or errors to avoid leaking old data
}

export async function fetchHeroSlides(page: string): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("page", page)
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) {
      return getDefaultHeroSlides(page);
    }
    return (data as unknown as HeroRow[]).map((r) => heroRowToSlide(r));
  } catch {
    return getDefaultHeroSlides(page);
  }
}


