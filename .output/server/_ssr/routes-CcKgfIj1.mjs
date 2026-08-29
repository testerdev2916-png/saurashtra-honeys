import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { n as fetchShopCategories } from "./category-catalog-B0p0Q8zD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CcKgfIj1.js
var $$splitComponentImporter = () => import("./routes-CsYpO6gY.mjs");
var Route = createFileRoute("/")({
	loader: async () => {
		const [categories, products] = await Promise.all([fetchShopCategories(), fetchProducts()]);
		return {
			categories,
			products
		};
	},
	head: () => ({ meta: [
		{ title: "Saurashtra Honey — Pure, Raw & Unfiltered Honey from Saurashtra" },
		{
			name: "description",
			content: "Raw, unfiltered honey straight from the floral farms of Saurashtra. Lab-tested for purity in every batch, ethically harvested for family wellness."
		},
		{
			property: "og:title",
			content: "Saurashtra Honey — Pure Honey. Proven Purity."
		},
		{
			property: "og:description",
			content: "Raw. Natural. Unfiltered. From our farms to your home, with care."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
