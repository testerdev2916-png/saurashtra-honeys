import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, D as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { l as listAudit } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, l as Th, n as BtnPrimary, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-BWH76yWP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const list = useServerFn(listAudit);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [entity, setEntity] = (0, import_react.useState)("");
	async function load() {
		setLoading(true);
		try {
			const r = await list({ data: {
				q: q || void 0,
				entity_type: entity || void 0
			} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Audit Logs",
			subtitle: `${rows.length} events`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4 flex flex-wrap gap-2 items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: entity,
					onChange: (e) => setEntity(e.target.value),
					placeholder: "Entity (product/order/…)",
					className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") load();
						},
						placeholder: "Search action…",
						className: "w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: load,
					children: "APPLY"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"Time",
			"Action",
			"Entity",
			"Entity ID",
			"Actor",
			"Metadata"
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "Loading…"
				}) }),
				!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "No events."
				}) }),
				!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-cream/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground whitespace-nowrap",
							children: new Date(r.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs font-mono",
							children: r.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs",
							children: r.entity_type ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs font-mono text-muted-foreground",
							children: r.entity_id ? r.entity_id.slice(0, 8) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs font-mono text-muted-foreground",
							children: r.actor_id ? r.actor_id.slice(0, 8) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground max-w-md truncate",
							children: r.metadata ? JSON.stringify(r.metadata) : "—"
						})
					]
				}, r.id))
			]
		})] })
	] });
}
//#endregion
export { AuditPage as component };
