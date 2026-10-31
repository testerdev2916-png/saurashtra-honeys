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
  head: ({ params, loaderData }) => {
    const cat = loaderData?.categories?.find((c: any) => c.slug === params.slug);
    const rawName =
      cat?.name ||
      params.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    const title = cat?.seo_title || `${rawName} | Saurashtra Honey`;
    const canonical = `https://saurashtrahoney.com/shop/${params.slug}`;
    const description =
      cat?.seo_description ||
      `Shop authentic pure ${rawName} from Saurashtra Honey. 100% natural, raw, lab-tested, and farm fresh.`;
    const image =
      cat?.image_url || "https://saurashtrahoney.com/saurashtra-honey-logo-complete.png";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: `${rawName}, pure ${rawName}, buy ${rawName} online, saurashtra honey, natural honey`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:image", content: image },
        { property: "og:site_name", content: "Saurashtra Honey" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
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
