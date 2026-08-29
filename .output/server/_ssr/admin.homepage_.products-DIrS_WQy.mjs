import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as Plus, an as ArrowLeft, nn as ArrowUp, p as Trash2, sn as ArrowDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { d as fetchAllHomepageFeaturedProducts, g as logAudit, r as createHomepageFeaturedProduct, s as deleteHomepageFeaturedProduct, x as updateHomepageFeaturedProductOrder } from "./homepage-cms.functions-dnhwKaHU.mjs";
import { a as PageHeader, n as BtnPrimary, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.homepage_.products-DIrS_WQy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHomepageProducts() {
	const [selections, setSelections] = (0, import_react.useState)([]);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)("");
	const loadData = async () => {
		setLoading(true);
		try {
			const [prods, sel] = await Promise.all([fetchProducts(), fetchAllHomepageFeaturedProducts()]);
			setAllProducts(prods);
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
		if (!selectedSlug) return toast.error("Please select a product");
		if (selections.some((s) => s.product_slug === selectedSlug)) return toast.error("Product already added to homepage");
		try {
			await createHomepageFeaturedProduct({
				product_slug: selectedSlug,
				enabled: true,
				sort_order: selections.length + 1
			});
			toast.success("Product added to homepage");
			await logAudit({ data: {
				action: "homepage.product_added",
				entity_type: "homepage_featured_products",
				metadata: { product_slug: selectedSlug }
			} });
			setShowAdd(false);
			setSelectedSlug("");
			loadData();
		} catch (e) {
			toast.error("Failed to add product");
		}
	};
	const handleRemove = async (id, slug) => {
		if (!confirm("Remove this product from the homepage?")) return;
		try {
			await deleteHomepageFeaturedProduct(id);
			toast.success("Removed from homepage");
			await logAudit({ data: {
				action: "homepage.product_removed",
				entity_type: "homepage_featured_products",
				entity_id: id,
				metadata: { product_slug: slug }
			} });
			loadData();
		} catch (e) {
			toast.error("Failed to remove product");
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
			await updateHomepageFeaturedProductOrder(updates);
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
			title: "Featured Products",
			subtitle: "Manage the products displayed in the 'Best Sellers' section on the homepage.",
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
				children: "Selected Products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: () => setShowAdd(!showAdd),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Product"]
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
						children: "Select a product to add..."
					}), allProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: p.slug,
						disabled: selections.some((s) => s.product_slug === p.slug),
						children: [
							p.name,
							" ",
							selections.some((s) => s.product_slug === p.slug) ? "(Already added)" : ""
						]
					}, p.slug))]
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
				children: "No products added yet."
			}) : selections.map((sel, index) => {
				const prod = allProducts.find((p) => p.slug === sel.product_slug);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [prod?.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: prod.image,
							alt: prod.name,
							className: "w-12 h-12 object-cover rounded bg-cream"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 rounded bg-cream border border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-forest-dark",
							children: prod?.name || sel.product_slug
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"/",
								sel.product_slug,
								" • ₹",
								prod?.price || "---"
							]
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
							onClick: () => handleRemove(sel.id, sel.product_slug),
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
export { AdminHomepageProducts as component };
