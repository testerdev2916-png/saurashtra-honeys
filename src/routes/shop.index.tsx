import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop/ShopPage";
import { fetchShopCategories } from "@/lib/category-catalog";
import { fetchProducts } from "@/lib/product-catalog";
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
    const [categories, products] = await Promise.all([
      fetchShopCategories(),
      fetchProducts(),
    ]);
    return { categories, products };
  },
  head: () => ({
    meta: [
      { title: "Shop | Saurashtra Honey" },
      { name: "description", content: "Explore our premium selection of raw honey and bee-crafted essentials." },
    ],
  }),
  component: () => {
    const data = Route.useLoaderData();
    return <ShopPage initialCategories={data.categories} initialProducts={data.products} />;
  },
});
