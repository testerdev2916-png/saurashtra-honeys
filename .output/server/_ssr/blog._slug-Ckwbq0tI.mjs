import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-Ckwbq0tI.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ reset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container-page py-24 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-serif text-4xl font-bold text-espresso",
		children: "Something went wrong"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: reset,
		className: "mt-4 text-burnt-orange border-b border-burnt-orange font-bold",
		children: "Try again"
	})]
}) });
//#endregion
export { SplitErrorComponent as errorComponent };
