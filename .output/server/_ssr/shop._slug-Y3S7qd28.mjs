import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Route } from "./shop._slug-Dp1hCuvf.mjs";
import { t as ShopPage } from "./ShopPage-BB7wIZYU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop._slug-Y3S7qd28.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { slug } = Route.useParams();
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopPage, {
		overrideCategorySlug: slug,
		initialCategories: data.categories,
		initialProducts: data.products
	});
};
//#endregion
export { SplitComponent as component };
