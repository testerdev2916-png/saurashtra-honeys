import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.newsletter-hYyxMozN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(500);
			setRows(data ?? []);
		})();
	}, []);
	const filtered = rows.filter((r) => !q || r.email.toLowerCase().includes(q.toLowerCase()));
	const confirmed = rows.filter((r) => r.confirmed_at && !r.unsubscribed_at).length;
	const pending = rows.filter((r) => !r.confirmed_at && !r.unsubscribed_at).length;
	const unsub = rows.filter((r) => r.unsubscribed_at).length;
	function exportCsv() {
		const csv = ["email,source,confirmed_at,unsubscribed_at,created_at,tags", ...filtered.map((r) => [
			r.email,
			r.source ?? "",
			r.confirmed_at ?? "",
			r.unsubscribed_at ?? "",
			r.created_at,
			(r.tags ?? []).join("|")
		].map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(","))].join("\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "newsletter.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl text-forest-dark",
					children: "Newsletter Subscribers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Double opt-in email list."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: exportCsv,
					className: "bg-forest-dark text-cream rounded px-4 py-2 text-xs font-bold tracking-widest",
					children: "EXPORT CSV"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Total",
						value: rows.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Confirmed",
						value: confirmed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Pending",
						value: pending
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Unsubscribed",
						value: unsub
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				placeholder: "Search email…",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "w-full border border-border rounded p-2 text-sm w-full max-w-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border border-border rounded-xl overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-cream/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Source" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Added" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: r.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-muted-foreground",
								children: r.source ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.unsubscribed_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-600",
								children: "Unsubscribed"
							}) : r.confirmed_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-600",
								children: "Confirmed"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber-600",
								children: "Pending"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-muted-foreground",
								children: new Date(r.created_at).toLocaleDateString()
							})
						]
					}, r.id)) })]
				})
			})
		]
	});
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white border border-border rounded-xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-2xl font-semibold text-forest-dark",
			children: value
		})]
	});
}
//#endregion
export { Page as component };
