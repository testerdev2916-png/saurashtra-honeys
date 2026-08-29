import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as confirmNewsletter } from "./newsletter.functions-CwCLhrRj.mjs";
import { t as Route } from "./newsletter.confirm._token-BxVpDBTa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsletter.confirm._token-DbVzVIHq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Confirm() {
	const { token } = Route.useParams();
	const confirm = useServerFn(confirmNewsletter);
	const [state, setState] = (0, import_react.useState)("loading");
	(0, import_react.useEffect)(() => {
		confirm({ data: { token } }).then(() => setState("ok")).catch(() => setState("err"));
	}, [token, confirm]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[60vh] flex items-center justify-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Confirming…"
				}),
				state === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl text-forest-dark",
						children: "You're in 🍯"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Thanks for confirming. Sweet updates on their way."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "inline-block mt-6 bg-forest-dark text-cream px-5 py-3 rounded-lg text-xs tracking-widest font-bold",
						children: "SHOP NOW"
					})
				] }),
				state === "err" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl text-forest-dark",
					children: "Invalid or expired link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Try subscribing again from the footer."
				})] })
			]
		})
	});
}
//#endregion
export { Confirm as component };
