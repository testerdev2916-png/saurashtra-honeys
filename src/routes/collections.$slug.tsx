import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCategoryShopSlug } from "@/lib/collection-helpers";

export const Route = createFileRoute("/collections/$slug")({
  beforeLoad: ({ params }) => {
    const slug = getCategoryShopSlug(params.slug);
    throw redirect({
      to: "/shop/$slug",
      params: { slug },
    });
  },
});
