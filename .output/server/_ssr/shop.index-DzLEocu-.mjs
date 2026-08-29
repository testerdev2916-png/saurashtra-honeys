import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { i as enumType, l as stringType, s as objectType, u as unknownType } from "../_libs/zod.mjs";
import { n as fetchShopCategories } from "./category-catalog-B0p0Q8zD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.index-DzLEocu-.js
var $$splitComponentImporter = () => import("./shop.index-B542ikXJ.mjs");
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
var Route = createFileRoute("/shop/")({
	validateSearch: (s) => searchSchema.parse(s),
	loader: async () => {
		const [categories, products] = await Promise.all([fetchShopCategories(), fetchProducts()]);
		return {
			categories,
			products
		};
	},
	head: () => ({ meta: [{ title: "Shop | Saurashtra Honey" }, {
		name: "description",
		content: "Explore our premium selection of raw honey and bee-crafted essentials."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
