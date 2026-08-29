import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Route } from "./shop.index-DzLEocu-.mjs";
import { t as ShopPage } from "./ShopPage-BB7wIZYU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.index-B542ikXJ.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPage, {
		initialCategories: data.categories,
		initialProducts: data.products
	});
};
//#endregion
export { SplitComponent as component };
