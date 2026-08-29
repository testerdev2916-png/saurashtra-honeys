import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { i as enumType, l as stringType, s as objectType, u as unknownType } from "../_libs/zod.mjs";
import { n as fetchShopCategories } from "./category-catalog-B0p0Q8zD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop._slug-Dp1hCuvf.js
var $$splitComponentImporter = () => import("./shop._slug-Y3S7qd28.mjs");
var searchSchema = objectType({
	q: stringType().optional(),
	sort: enumType([
		"popular",
		"price-asc",
		"price-desc",
		"newest",
		"rating"
	]).optional()
}).catchall(unknownType());
var Route = createFileRoute("/shop/$slug")({
	validateSearch: (s) => searchSchema.parse(s),
	loader: async () => {
		const [categories, products] = await Promise.all([fetchShopCategories(), fetchProducts()]);
		return {
			categories,
			products
		};
	},
	head: ({ params }) => {
		const title = `${params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Saurashtra Honey`;
		return { meta: [{ title }, {
			name: "description",
			content: `Explore our premium selection of ${title}. Pure, natural, and ethically sourced.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
