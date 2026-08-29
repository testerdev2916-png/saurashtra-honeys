import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as Plus, an as ArrowLeft, nn as ArrowUp, p as Trash2, sn as ArrowDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as fetchShopCategories } from "./category-catalog-B0p0Q8zD.mjs";
import { b as updateHomepageCategoryOrder, g as logAudit, n as createHomepageCategory, o as deleteHomepageCategory, u as fetchAllHomepageCategories } from "./homepage-cms.functions-dnhwKaHU.mjs";
import { a as PageHeader, n as BtnPrimary, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.homepage_.categories-BTDtLgq1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHomepageCategories() {
	const [selections, setSelections] = (0, import_react.useState)([]);
	const [allCategories, setAllCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)("");
	const loadData = async () => {
		setLoading(true);
		try {
			const [cats, sel] = await Promise.all([fetchShopCategories(), fetchAllHomepageCategories()]);
			setAllCategories(cats);
			setSelections(sel);
		} catch (e) {
			toast.error("Failed to load data");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleAdd = async () => {
		if (!selectedSlug) return toast.error("Please select a category");
		if (selections.some((s) => s.category_slug === selectedSlug)) return toast.error("Category already added to homepage");
		try {
			await createHomepageCategory({
				category_slug: selectedSlug,
				enabled: true,
				sort_order: selections.length + 1
			});
			toast.success("Category added to homepage");
			await logAudit({ data: {
				action: "homepage.category_added",
				entity_type: "homepage_category_selection",
				metadata: { category_slug: selectedSlug }
			} });
			setShowAdd(false);
			setSelectedSlug("");
			loadData();
		} catch (e) {
			toast.error("Failed to add category");
		}
	};
	const handleRemove = async (id, slug) => {
		if (!confirm("Remove this category from the homepage?")) return;
		try {
			await deleteHomepageCategory(id);
			toast.success("Removed from homepage");
			await logAudit({ data: {
				action: "homepage.category_removed",
				entity_type: "homepage_category_selection",
				entity_id: id,
				metadata: { category_slug: slug }
			} });
			loadData();
		} catch (e) {
			toast.error("Failed to remove category");
		}
	};
	const handleMove = async (index, direction) => {
		if (direction === "up" && index === 0 || direction === "down" && index === selections.length - 1) return;
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		const newItems = [...selections];
		const [moved] = newItems.splice(index, 1);
		newItems.splice(targetIndex, 0, moved);
		const updates = newItems.map((s, idx) => ({
			id: s.id,
			sort_order: idx + 1
		}));
		setSelections(newItems.map((s, idx) => ({
			...s,
			sort_order: idx + 1
		})));
		try {
			await updateHomepageCategoryOrder(updates);
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
			title: "Homepage Categories",
			subtitle: "Manage the categories displayed in the 'Explore Our World' section on the homepage.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/homepage",
				className: "inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to Homepage CMS"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl font-bold text-forest-dark",
				children: "Selected Categories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: () => setShowAdd(!showAdd),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Category"]
			})]
		}),
		showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4 mb-6 bg-cream/40 border-gold-deep/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: selectedSlug,
					onChange: (e) => setSelectedSlug(e.target.value),
					className: "flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select a category to add..."
					}), allCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: c.slug,
						disabled: selections.some((s) => s.category_slug === c.slug),
						children: [
							c.name,
							" ",
							selections.some((s) => s.category_slug === c.slug) ? "(Already added)" : ""
						]
					}, c.slug))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
						onClick: handleAdd,
						children: "Add to Homepage"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
						onClick: () => setShowAdd(false),
						children: "Cancel"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: selections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl",
				children: "No categories added yet."
			}) : selections.map((sel, index) => {
				const cat = allCategories.find((c) => c.slug === sel.category_slug);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [cat?.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: cat.image_url,
							alt: cat.name,
							className: "w-12 h-12 object-cover rounded bg-cream"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 rounded bg-cream border border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-forest-dark",
							children: cat?.name || sel.category_slug
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["/", sel.category_slug]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center border border-border rounded-lg overflow-hidden bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: index === 0,
								onClick: () => handleMove(index, "up"),
								className: "p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border transition-colors",
								title: "Move Up",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4 text-forest-dark" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: index === selections.length - 1,
								onClick: () => handleMove(index, "down"),
								className: "p-2 hover:bg-cream/60 disabled:opacity-30 transition-colors",
								title: "Move Down",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4 text-forest-dark" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleRemove(sel.id, sel.category_slug),
							className: "p-2 text-destructive hover:bg-destructive/10 rounded transition-colors",
							title: "Remove from Homepage",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
						})]
					})]
				}, sel.id);
			})
		})
	] });
}
//#endregion
export { AdminHomepageCategories as component };
