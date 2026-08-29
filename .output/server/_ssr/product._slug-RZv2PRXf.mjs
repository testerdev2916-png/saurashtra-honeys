import { F as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as fetchProduct } from "./product-catalog-DsxAkRUU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-RZv2PRXf.js
var $$splitComponentImporter = () => import("./product._slug-C4ePcoh0.mjs");
var $$splitErrorComponentImporter = () => import("./product._slug-BkRkhYIH.mjs");
var $$splitNotFoundComponentImporter = () => import("./product._slug-Bl1gAsXk.mjs");
var Route = createFileRoute("/product/$slug")({
	loader: async ({ params }) => {
		const p = await fetchProduct(params.slug);
		if (!p) throw notFound();
		return { product: p };
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.product.name} — Saurashtra Honey` },
		{
			name: "description",
			content: loaderData.product.description.slice(0, 155)
		},
		{
			property: "og:title",
			content: `${loaderData.product.name} — Saurashtra Honey`
		},
		{
			property: "og:description",
			content: loaderData.product.tagline
		},
		{
			property: "og:type",
			content: "product"
		},
		{
			property: "og:image",
			content: loaderData.product.image
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:image",
			content: loaderData.product.image
		}
	] : [] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
