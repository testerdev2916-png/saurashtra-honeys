import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category-catalog-B0p0Q8zD.js
var DEFAULT_SHOP_CATEGORIES = [];
var listPublicCategoriesFn = createServerFn({ method: "POST" }).handler(createSsrRpc("0ecc0eed542cf92ebb78d194ee7f8f39b0568a7fadc9b3a725d906dbad6ebfdd"));
async function fetchShopCategories() {
	try {
		return await listPublicCategoriesFn();
	} catch (err) {
		console.error("fetchShopCategories caught an error.", err);
		return [];
	}
}
//#endregion
export { fetchShopCategories as n, DEFAULT_SHOP_CATEGORIES as t };
