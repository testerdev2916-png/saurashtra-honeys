import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.migrate-catalog-C-YG9s5f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var runMigration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("19b1f3b106f12ea0640b997bbec7a5ebd4094663a38094348aca0c2ab50f24cb"));
function MigrateCatalog() {
	const [res, setRes] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleMigrate = async () => {
		setLoading(true);
		try {
			const data = await runMigration();
			setRes(data);
		} catch (e) {
			setRes({ error: e.message });
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold mb-4",
				children: "Migrate Static Catalog to Supabase"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleMigrate,
				disabled: loading,
				className: "bg-blue-600 text-white px-4 py-2 rounded",
				children: loading ? "Migrating..." : "Run Migration"
			}),
			res && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-8 bg-gray-100 p-4 rounded text-sm overflow-auto",
				children: JSON.stringify(res, null, 2)
			})
		]
	});
}
//#endregion
export { MigrateCatalog as component };
