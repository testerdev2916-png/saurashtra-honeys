import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Gt as Check, N as Plus, O as Save, an as ArrowLeft, i as X, nn as ArrowUp, p as Trash2, sn as ArrowDown, t as lucide_react_exports, y as SquarePen } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as updateHomepageTrustItemOrder, S as updateHomepageTrustItem, c as deleteHomepageTrustItem, f as fetchAllHomepageTrustItems, g as logAudit, i as createHomepageTrustItem } from "./homepage-cms.functions-dnhwKaHU.mjs";
import { a as PageHeader, i as Field, n as BtnPrimary, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.homepage_.trust-svNDrCC-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminTrustItems() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		title: "",
		description: "",
		icon: ""
	});
	const loadData = async () => {
		setLoading(true);
		try {
			setItems(await fetchAllHomepageTrustItems());
		} catch (e) {
			toast.error("Failed to load trust items");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			icon: ""
		});
		setShowAdd(false);
		setEditingId(null);
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!formData.title.trim()) return toast.error("Title is required");
		try {
			if (editingId) {
				await updateHomepageTrustItem(editingId, formData);
				toast.success("Trust item updated");
			} else {
				await createHomepageTrustItem({
					...formData,
					enabled: true,
					sort_order: items.length + 1
				});
				toast.success("Trust item added");
			}
			await logAudit({ data: {
				action: editingId ? "homepage.trust_item_updated" : "homepage.trust_item_added",
				entity_type: "homepage_trust_items",
				entity_id: editingId || "new"
			} });
			resetForm();
			loadData();
		} catch (err) {
			toast.error("Failed to save trust item");
		}
	};
	const handleRemove = async (id) => {
		if (!confirm("Delete this trust item?")) return;
		try {
			await deleteHomepageTrustItem(id);
			toast.success("Trust item deleted");
			loadData();
		} catch (e) {
			toast.error("Failed to delete trust item");
		}
	};
	const handleMove = async (index, direction) => {
		if (direction === "up" && index === 0 || direction === "down" && index === items.length - 1) return;
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		const newItems = [...items];
		const [moved] = newItems.splice(index, 1);
		newItems.splice(targetIndex, 0, moved);
		const updates = newItems.map((s, idx) => ({
			id: s.id,
			sort_order: idx + 1
		}));
		setItems(newItems.map((s, idx) => ({
			...s,
			sort_order: idx + 1
		})));
		try {
			await updateHomepageTrustItemOrder(updates);
			toast.success("Order saved");
		} catch (e) {
			toast.error("Failed to save order");
			loadData();
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-24 text-center text-muted-foreground",
		children: "Loading..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Trust Strip",
			subtitle: "Manage the trust badges (e.g. 100% Pure Honey, Lab Tested) displayed on the homepage.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/homepage",
				className: "inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to Homepage CMS"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl font-bold text-forest-dark",
				children: "Active Badges"
			}), !showAdd && !editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: () => setShowAdd(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Badge"]
			})]
		}),
		(showAdd || editingId) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-5 mb-6 bg-cream/40 border-gold-deep/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title *",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: formData.title,
								onChange: (e) => setFormData({
									...formData,
									title: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "e.g. 100% Pure Honey"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Icon Name (Lucide icon name)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.icon,
								onChange: (e) => setFormData({
									...formData,
									icon: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "e.g. ShieldCheck"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: formData.description,
									onChange: (e) => setFormData({
										...formData,
										description: e.target.value
									}),
									className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
									placeholder: "e.g. Sustainably sourced"
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
						type: "button",
						onClick: resetForm,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Cancel"]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl",
				children: "No badges configured."
			}) : items.map((item, index) => {
				const IconComponent = item.icon && lucide_react_exports[item.icon] ? lucide_react_exports[item.icon] : Check;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: `p-4 flex items-center justify-between ${editingId === item.id ? "border-gold-deep" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-full bg-cream border border-border flex items-center justify-center text-brand-orange",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-forest-dark",
							children: item.title
						}), item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: item.description
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center border border-border rounded-lg overflow-hidden bg-white mr-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: index === 0,
									onClick: () => handleMove(index, "up"),
									className: "p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: index === items.length - 1,
									onClick: () => handleMove(index, "down"),
									className: "p-2 hover:bg-cream/60 disabled:opacity-30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setEditingId(item.id);
									setFormData({
										title: item.title,
										description: item.description || "",
										icon: item.icon || ""
									});
									setShowAdd(false);
								},
								className: "p-2 text-forest-dark hover:bg-cream rounded",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleRemove(item.id),
								className: "p-2 text-destructive hover:bg-destructive/10 rounded",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})
						]
					})]
				}, item.id);
			})
		})
	] });
}
//#endregion
export { AdminTrustItems as component };
