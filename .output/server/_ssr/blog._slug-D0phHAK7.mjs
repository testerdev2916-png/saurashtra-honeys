import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-D0phHAK7.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container-page py-24 text-center",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-4xl font-bold text-espresso",
			children: "Article not found"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "The story you are looking for may have been moved or unpublished."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/blog",
			className: "mt-6 inline-block bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all",
			children: "BACK TO JOURNAL"
		})
	]
}) });
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
