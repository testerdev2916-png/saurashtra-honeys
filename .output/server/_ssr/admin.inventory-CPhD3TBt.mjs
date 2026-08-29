import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, d as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as adjustStock } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, l as Th, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
import { i as listAdminProducts } from "./admin-catalog.functions-Bf3hxAUH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-CPhD3TBt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventoryPage() {
	const list = useServerFn(listAdminProducts);
	const adj = useServerFn(adjustStock);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [filter, setFilter] = (0, import_react.useState)("all");
	async function load() {
		setLoading(true);
		try {
			const r = await list({});
			setRows(r.rows);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function change(id, delta) {
		const reason = delta > 0 ? "incoming stock" : "manual adjustment";
		try {
			const r = await adj({ data: {
				product_id: id,
				change: delta,
				reason
			} });
			toast.success(`Stock ${r.before} → ${r.after}`);
			load();
		} catch (e) {
			toast.error(e.message);
		}
	}
	const filtered = rows.filter((r) => filter === "all" ? true : filter === "low" ? r.stock_quantity <= r.low_stock_limit : r.stock_quantity === 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Inventory",
			subtitle: `${rows.length} products • ${rows.filter((r) => r.stock_quantity <= r.low_stock_limit).length} need attention`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4 mb-4 flex flex-wrap gap-2",
			children: [
				"all",
				"low",
				"oos"
			].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(f),
				className: `px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${filter === f ? "bg-forest-dark text-cream" : "bg-white text-forest-dark border border-border hover:border-gold-deep"}`,
				children: f === "all" ? "All" : f === "low" ? "Low stock" : "Out of stock"
			}, f))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"SKU",
			"Product",
			"Stock",
			"Threshold",
			"Status",
			"Adjust"
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "Loading…"
				}) }),
				!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "No products match."
				}) }),
				!loading && filtered.map((r) => {
					const low = r.stock_quantity <= r.low_stock_limit;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-cream/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-xs font-mono",
								children: r.sku ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
								className: "font-medium text-forest-dark",
								children: [r.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground font-mono",
									children: r.slug
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: `text-lg font-serif ${low ? "text-destructive" : "text-forest-dark"}`,
								children: r.stock_quantity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
								className: "text-xs text-muted-foreground",
								children: ["≤ ", r.low_stock_limit]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.stock_quantity === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: "disabled" }) : low ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3 inline" }), " Low"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: "active" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: [
									-10,
									-1,
									1,
									10,
									100
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => change(r.id, n),
									className: `text-[11px] font-bold rounded px-2 py-1 ${n > 0 ? "bg-forest text-cream hover:bg-forest-dark" : "border border-border hover:border-destructive hover:text-destructive"}`,
									children: n > 0 ? `+${n}` : n
								}, n))
							}) })
						]
					}, r.id);
				})
			]
		})] })
	] });
}
//#endregion
export { InventoryPage as component };
