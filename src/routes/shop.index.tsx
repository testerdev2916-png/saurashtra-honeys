import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";
import { fetchPageSections, extractPageSeo } from "@/lib/page-cms.functions";
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
    const [categories, products, heroSlides, sections] = await Promise.all([
      fetchShopCategories(),
      fetchProducts(),
      fetchHeroSlides("shop"),
      fetchPageSections("shop").catch(() => []),
    ]);
    return { categories, products, heroSlides, sections };
  },
  head: ({ loaderData }) =>
    extractPageSeo(loaderData?.sections, {
      title: "Shop Premium Raw Honey & Bee Products | Saurashtra Honey",
      description:
        "Explore our premium selection of raw, unfiltered wildflower, ajwain, and single-origin honey and natural bee-crafted essentials.",
      canonical: "https://saurashtrahoney.com/shop",
    }),
  component: () => {
    const data = Route.useLoaderData();
    return (
      <ShopPage
        initialCategories={data.categories}
        initialProducts={data.products}
        initialHeroSlides={data.heroSlides}
      />
    );
  },
});
