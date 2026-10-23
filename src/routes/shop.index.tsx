import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";
import { fetchShopCategories } from "@/lib/category-catalog";
import { fetchProducts } from "@/lib/product-catalog";
import { fetchHeroSlides } from "@/lib/hero-catalog";
import { z } from "zod";

const searchSchema = z
  .object({
    q: z.string().optional(),
    sort: z.enum(["popular", "price-asc", "price-desc", "newest", "rating"]).optional(),
  })
  .catchall(z.unknown());

export const Route = createFileRoute("/shop/")({
  validateSearch: (s) => searchSchema.parse(s),
  loader: async () => {
    const [categories, products, heroSlides] = await Promise.all([
      fetchShopCategories(),
      fetchProducts(),
      fetchHeroSlides("shop"),
    ]);
    return { categories, products, heroSlides };
  },
  head: () => ({
    meta: [
      { title: "Shop Premium Raw Honey & Bee Products | Saurashtra Honey" },
      { name: "description", content: "Explore our premium selection of raw, unfiltered wildflower, ajwain, and single-origin honey and natural bee-crafted essentials." },
      { property: "og:title", content: "Shop Pure & Raw Honey — Saurashtra Honey" },
      { property: "og:description", content: "Explore our premium selection of raw honey and bee-crafted essentials." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://saurastrahoney.com/shop" },
      { property: "og:image", content: "https://saurastrahoney.com/saurashtra-honey-logo-complete.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://saurastrahoney.com/saurashtra-honey-logo-complete.png" },
    ],
    links: [
      { rel: "canonical", href: "https://saurastrahoney.com/shop" },
    ],
  }),
  component: () => {
    const data = Route.useLoaderData();
    return <ShopPage initialCategories={data.categories} initialProducts={data.products} initialHeroSlides={data.heroSlides} />;
  },
});
