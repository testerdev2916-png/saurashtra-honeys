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

export const Route = createFileRoute("/shop/$slug")({
  validateSearch: (s) => searchSchema.parse(s),
  loader: async () => {
    const [categories, products] = await Promise.all([
      fetchShopCategories(),
      fetchProducts(),
    ]);
    return { categories, products };
  },
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} | Saurashtra Honey`;
    return {
      meta: [
        { title },
        { name: "description", content: `Explore our premium selection of ${title}. Pure, natural, and ethically sourced.` },
      ],
    };
  },
  component: () => {
    const { slug } = Route.useParams();
    const data = Route.useLoaderData();
    return <ShopPage overrideCategorySlug={slug} initialCategories={data.categories} initialProducts={data.products} />;
  },
});
