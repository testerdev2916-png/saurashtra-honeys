import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { r as unsubscribeNewsletter } from "./newsletter.functions-CwCLhrRj.mjs";
import { t as Route } from "./newsletter.unsubscribe._token-DRlCfBim.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsletter.unsubscribe._token-D8YMtlAa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Unsub() {
	const { token } = Route.useParams();
	const run = useServerFn(unsubscribeNewsletter);
	const [state, setState] = (0, import_react.useState)("loading");
	(0, import_react.useEffect)(() => {
		run({ data: { token } }).then(() => setState("ok")).catch(() => setState("err"));
	}, [token, run]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[60vh] flex items-center justify-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				state === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Working…"
				}),
				state === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-2xl text-forest-dark",
						children: "You're unsubscribed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "You will no longer receive marketing emails from us."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-block mt-6 text-gold-deep underline text-sm",
						children: "Back to home"
					})
				] }),
				state === "err" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl text-forest-dark",
					children: "Invalid link"
				})
			]
		})
	});
}
//#endregion
export { Unsub as component };
