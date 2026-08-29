import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.loyalty-W_5-HLK2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: accs } = await supabase.from("loyalty_accounts").select("*").order("lifetime_points", { ascending: false }).limit(200);
			const ids = (accs ?? []).map((a) => a.user_id);
			const { data: profs } = ids.length ? await supabase.from("profiles").select("id, email, full_name").in("id", ids) : { data: [] };
			const pmap = new Map((profs ?? []).map((p) => [p.id, p]));
			setRows((accs ?? []).map((a) => ({
				...a,
				email: pmap.get(a.user_id)?.email,
				full_name: pmap.get(a.user_id)?.full_name
			})));
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl text-forest-dark",
			children: "Loyalty & Rewards"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Top customers by lifetime points."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white border border-border rounded-xl overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-cream/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Balance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right pr-3",
							children: "Lifetime"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 4,
					className: "p-6 text-center text-muted-foreground",
					children: "No loyalty activity yet."
				}) }) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: r.full_name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-muted-foreground",
							children: r.email ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right font-semibold text-forest-dark",
							children: r.points_balance
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right pr-3 text-muted-foreground",
							children: r.lifetime_points
						})
					]
				}, r.user_id)) })]
			})
		})]
	});
}
//#endregion
export { Page as component };
