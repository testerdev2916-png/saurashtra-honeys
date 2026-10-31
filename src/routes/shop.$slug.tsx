import { createFileRoute, redirect } from "@tanstack/react-router";
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
  beforeLoad: ({ params }) => {
    if (params.slug === "raw-honey") {
      throw redirect({
        to: "/shop/$slug",
        params: { slug: "honey" },
      });
    }
  },
  loader: async () => {
    const [categories, products] = await Promise.all([fetchShopCategories(), fetchProducts()]);
    return { categories, products };
  },
  head: ({ params }) => {
    const rawName = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const title = `${rawName} | Saurashtra Honey`;
    const canonical = `https://saurashtrahoney.com/shop/${params.slug}`;
    const description = `Shop authentic ${rawName} from Saurashtra Honey. 100% pure, raw, and farm-fresh.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        {
          property: "og:image",
          content: "https://saurashtrahoney.com/saurashtra-honey-logo-complete.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: () => {
    const { slug } = Route.useParams();
    const data = Route.useLoaderData();
    return (
      <ShopPage
        overrideCategorySlug={slug}
        initialCategories={data.categories}
        initialProducts={data.products}
      />
    );
  },
});
