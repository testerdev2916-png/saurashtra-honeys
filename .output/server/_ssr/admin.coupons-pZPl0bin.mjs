import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, L as Pencil, N as Plus, an as ArrowLeft, p as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { D as upsertCoupon, d as listCoupons, r as deleteCoupon } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, f as paise, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.coupons-pZPl0bin.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	code: "",
	description: "",
	discount_type: "percent",
	discount_value: 10,
	min_order_paise: 0,
	active: true
};
function CouponsPage() {
	const list = useServerFn(listCoupons);
	const del = useServerFn(deleteCoupon);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
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
	if (edit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		initial: edit,
		onCancel: () => setEdit(null),
		onSaved: async () => {
			setEdit(null);
			await load();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Coupons",
		subtitle: `${rows.length} codes`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
			onClick: load,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
			onClick: () => setEdit(EMPTY),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " NEW COUPON"]
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
		"Code",
		"Type",
		"Value",
		"Min. Order",
		"Uses",
		"Expires",
		"Status",
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
				children: "No coupons."
			}) }),
			!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-cream/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs font-bold",
						children: r.code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs uppercase",
						children: r.discount_type.replace("_", " ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: r.discount_type === "percent" ? `${r.discount_value}%` : r.discount_type === "fixed" ? paise(r.discount_value * 100) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: r.min_order_paise ? paise(r.min_order_paise) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "text-xs",
						children: [r.usage_count, r.usage_limit ? `/${r.usage_limit}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.active ? "active" : "disabled" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEdit(r),
							className: "text-gold-deep hover:underline text-xs font-bold mr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" }), " EDIT"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								if (!confirm("Delete?")) return;
								try {
									await del({ data: { id: r.id } });
									toast.success("Deleted");
									load();
								} catch (e) {
									toast.error(e.message);
								}
							},
							className: "text-destructive hover:underline text-xs font-bold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 inline" })
						})]
					})
				]
			}, r.id))
		]
	})] })] });
}
function Editor({ initial, onCancel, onSaved }) {
	const [f, setF] = (0, import_react.useState)({ ...initial });
	const [busy, setBusy] = (0, import_react.useState)(false);
	const save = useServerFn(upsertCoupon);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-forest-dark mb-4",
				children: f.id ? "Edit coupon" : "New coupon"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Code *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.code ?? "",
							onChange: (e) => setF({
								...f,
								code: e.target.value.toUpperCase()
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Discount type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.discount_type ?? "percent",
							onChange: (e) => setF({
								...f,
								discount_type: e.target.value
							}),
							className: inp,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "percent",
									children: "Percent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "fixed",
									children: "Fixed (₹)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "free_shipping",
									children: "Free shipping"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: f.discount_type === "percent" ? "Percent %" : "Amount ₹",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.discount_value ?? 0,
							onChange: (e) => setF({
								...f,
								discount_value: Number(e.target.value)
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Min order (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: (f.min_order_paise ?? 0) / 100,
							onChange: (e) => setF({
								...f,
								min_order_paise: Number(e.target.value) * 100
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Max discount cap (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: (f.max_discount_paise ?? 0) / 100 || "",
							onChange: (e) => setF({
								...f,
								max_discount_paise: e.target.value ? Number(e.target.value) * 100 : null
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Usage limit (total)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.usage_limit ?? "",
							onChange: (e) => setF({
								...f,
								usage_limit: e.target.value ? Number(e.target.value) : null
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Per-user limit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.per_user_limit ?? "",
							onChange: (e) => setF({
								...f,
								per_user_limit: e.target.value ? Number(e.target.value) : null
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Starts at",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: f.starts_at ? f.starts_at.slice(0, 16) : "",
							onChange: (e) => setF({
								...f,
								starts_at: e.target.value ? new Date(e.target.value).toISOString() : null
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Expires at",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: f.expires_at ? f.expires_at.slice(0, 16) : "",
							onChange: (e) => setF({
								...f,
								expires_at: e.target.value ? new Date(e.target.value).toISOString() : null
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: f.description ?? "",
								onChange: (e) => setF({
									...f,
									description: e.target.value
								}),
								className: inp
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: !!f.active,
							onChange: (e) => setF({
								...f,
								active: e.target.checked
							})
						}), " Active"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await save({ data: {
								id: f.id,
								code: f.code,
								description: f.description ?? null,
								discount_type: f.discount_type ?? "percent",
								discount_value: Number(f.discount_value ?? 0),
								min_order_paise: Number(f.min_order_paise ?? 0),
								max_discount_paise: f.max_discount_paise ?? null,
								usage_limit: f.usage_limit ?? null,
								per_user_limit: f.per_user_limit ?? null,
								starts_at: f.starts_at ?? null,
								expires_at: f.expires_at ?? null,
								active: !!f.active
							} });
							toast.success("Saved");
							await onSaved();
						} catch (e) {
							toast.error(e.message);
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "SAVING…" : "SAVE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
					onClick: onCancel,
					children: "CANCEL"
				})]
			})
		]
	})] });
}
//#endregion
export { CouponsPage as component };
