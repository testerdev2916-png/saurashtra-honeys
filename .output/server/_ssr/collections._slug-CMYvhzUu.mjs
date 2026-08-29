import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getCategorySlug, r as getCategoryMetadata } from "./collection-helpers-DAdv5muE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._slug-CMYvhzUu.js
var $$splitComponentImporter = () => import("./collections._slug-DT5OXWe7.mjs");
var Route = createFileRoute("/collections/$slug")({
	loader: async ({ params }) => {
		return { slug: params.slug };
	},
	head: ({ loaderData }) => {
		const meta = getCategoryMetadata(loaderData?.slug || "raw-honey");
		return {
			meta: [
				{ title: `${meta.name} — Pure & Artisanal | Saurashtra Honey` },
				{
					name: "description",
					content: meta.heroDescription.slice(0, 155)
				},
				{
					property: "og:title",
					content: `${meta.name} — Saurashtra Honey`
				},
				{
					property: "og:description",
					content: meta.tagline
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:image",
					content: meta.heroImage
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:image",
					content: meta.heroImage
				}
			],
			links: [{
				rel: "canonical",
				href: `https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app/collections/${getCategorySlug(loaderData?.slug || "raw-honey")}`
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
