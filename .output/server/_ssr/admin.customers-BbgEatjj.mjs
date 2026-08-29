import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, D as Search, an as ArrowLeft, jt as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { f as listCustomers, x as updateCustomer } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, f as paise, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost, u as csvDownload } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers-BbgEatjj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomersPage() {
	const list = useServerFn(listCustomers);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [current, setCurrent] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		try {
			const r = await list({ data: { q } });
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
	if (current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
		cust: current,
		onClose: () => {
			setCurrent(null);
			load();
		}
	});
	const cols = [
		"full_name",
		"email",
		"phone",
		"status",
		"orders_count",
		"spent_paise",
		"created_at"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Customers",
			subtitle: `${rows.length} customers`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: () => csvDownload(rows, cols, `customers-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4 flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-w-[240px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") load();
					},
					placeholder: "Search name, email, phone…",
					className: "w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
				onClick: load,
				children: "APPLY"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"Name",
			"Contact",
			"Status",
			"Orders",
			"Lifetime",
			"Joined",
			""
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "Loading…"
				}) }),
				!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "No customers."
				}) }),
				!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-cream/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-medium text-forest-dark",
							children: r.full_name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "text-xs",
							children: [r.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.email }), r.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.phone })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs",
							children: r.orders_count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-semibold",
							children: paise(r.spent_paise)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground",
							children: new Date(r.created_at).toLocaleDateString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrent(r),
								className: "text-xs font-bold text-gold-deep hover:underline",
								children: "OPEN →"
							})
						})
					]
				}, r.id))
			]
		})] })
	] });
}
function Detail({ cust, onClose }) {
	const upd = useServerFn(updateCustomer);
	const [status, setStatus] = (0, import_react.useState)(cust.status);
	const [notes, setNotes] = (0, import_react.useState)(cust.admin_notes ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onClose,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1.4fr_1fr] gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-bold tracking-widest text-gold-deep",
					children: "CUSTOMER"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-serif text-2xl text-forest-dark",
					children: cust.full_name ?? cust.email ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						cust.email,
						" • ",
						cust.phone
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid sm:grid-cols-3 gap-4 mt-6 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Orders"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl",
							children: cust.orders_count
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Lifetime spend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl",
							children: paise(cust.spent_paise)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Joined"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-xl",
							children: new Date(cust.created_at).toLocaleDateString()
						})] })
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "bg-cream rounded-2xl p-6 h-fit",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-xl text-forest-dark",
					children: "Manage"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Account status",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: inp,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "disabled",
							children: "Disabled"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Admin notes",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 6,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: inp
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: async () => {
						try {
							await upd({ data: {
								id: cust.id,
								status,
								admin_notes: notes
							} });
							toast.success("Saved");
							onClose();
						} catch (e) {
							toast.error(e.message);
						}
					},
					className: "mt-4 w-full justify-center",
					children: "SAVE"
				})
			]
		})]
	})] });
}
//#endregion
export { CustomersPage as component };
