import { i as __toESM } from "../_runtime.mjs";
import { i as getVariantByLabel } from "./products-CxldZzZM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart } from "./cart-Bp2wgR53.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ot as Eye, mt as Heart, v as Star, x as ShoppingCart, xt as GitCompare } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useWishlist } from "./collection-helpers-DAdv5muE.mjs";
import { n as toItem, r as track } from "./analytics-DCmDeuTY.mjs";
import { n as useCompare } from "./compare-Cg9kkhzV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-EQWSFYBy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ p, onQuickView }) {
	const [size, setSize] = (0, import_react.useState)(p.sizes[0]);
	const { add } = useCart();
	const wl = useWishlist();
	const cmp = useCompare();
	const saved = wl.has(p.slug);
	const inCompare = cmp.has(p.slug);
	const navigate = useNavigate();
	async function toggleSave(e) {
		e.preventDefault();
		e.stopPropagation();
		const nowSaved = await wl.toggle(p.slug);
		toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
	}
	function toggleCompare(e) {
		e.preventDefault();
		e.stopPropagation();
		if (cmp.toggle(p.slug)) toast.success(`Added to compare (${cmp.count + 1}/4)`, { action: {
			label: "View",
			onClick: () => navigate({ to: "/compare" })
		} });
	}
	const activeVariant = getVariantByLabel(p, size);
	const activePrice = activeVariant.price ?? p.price;
	const activeMrp = activeVariant.mrp ?? p.mrp;
	const discount = activeMrp && activeMrp > activePrice ? Math.round((activeMrp - activePrice) / activeMrp * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group bg-white rounded-2xl border border-border/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lift md:hover:-translate-y-1.5 h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative block bg-cream aspect-square overflow-hidden shrink-0",
			children: [
				p.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 text-[9px] md:text-[10px] font-bold tracking-wider px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm ${p.badge === "BESTSELLER" ? "bg-espresso text-cream" : "bg-burnt-orange text-white"}`,
					children: p.badge
				}),
				discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute top-2.5 left-2.5 md:hidden z-10 text-[9px] font-bold px-2 py-0.5 rounded-full bg-terracotta text-white shadow-sm",
					style: { top: p.badge ? "2rem" : "0.625rem" },
					children: [
						"-",
						discount,
						"%"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-2.5 right-2.5 md:top-3 md:right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": saved ? "Remove from wishlist" : "Save to wishlist",
						onClick: toggleSave,
						className: `size-7 md:size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${saved ? "text-terracotta" : "text-espresso hover:text-burnt-orange"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-3.5 md:size-4 ${saved ? "fill-current" : ""}` })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": inCompare ? "Remove from compare" : "Add to compare",
						onClick: toggleCompare,
						className: `size-7 md:size-8 rounded-full bg-white/90 backdrop-blur-md items-center justify-center transition-colors hidden md:flex shadow-sm ${inCompare ? "text-burnt-orange" : "text-espresso hover:text-burnt-orange"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-3.5 md:size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$slug",
					params: { slug: p.slug },
					onClick: () => track("select_item", { items: [toItem(p, { size })] }),
					className: "block w-full h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						loading: "lazy",
						className: "w-full h-full object-cover object-center md:group-hover:scale-108 transition-transform duration-700 ease-out"
					}, p.updatedAt || p.image)
				}),
				onQuickView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: (e) => {
						e.preventDefault();
						onQuickView(p);
					},
					className: "hidden md:inline-flex absolute bottom-3 left-1/2 -translate-x-1/2 z-10 items-center gap-1.5 bg-espresso text-cream text-[11px] font-bold tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-burnt-orange hover:text-white shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " QUICK VIEW"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-3.5 md:p-5 flex flex-col gap-1.5 md:gap-2.5 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] md:text-xs font-bold tracking-widest uppercase text-brand-orange",
					children: p.flora || p.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-sm md:text-base font-bold leading-snug text-espresso line-clamp-2 min-h-[2.5rem] md:min-h-[2.75rem]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: p.slug },
						className: "hover:text-brand-orange transition-colors",
						children: p.name
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center text-brand-orange",
						"aria-label": "5 out of 5 stars",
						children: [...Array(5)].map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-brand-orange text-brand-orange" }, idx))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold text-muted-foreground text-[11px]",
						children: [
							"(",
							p.reviews || 180,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:flex gap-1.5 flex-wrap mt-0.5",
					children: p.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.preventDefault();
							setSize(s);
						},
						className: `text-xs px-3 py-1.5 min-w-[3rem] mb-3 rounded-full border font-semibold transition-colors ${size === s ? "border-brand-orange text-brand-orange bg-cream" : "border-border text-muted-foreground hover:border-brand-orange"}`,
						children: s
					}, s))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2 flex-wrap pt-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-base md:text-lg font-bold text-espresso",
						children: ["₹", activePrice]
					}), activeMrp && activeMrp > activePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground line-through",
						children: ["₹", activeMrp]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden md:inline text-[11px] font-bold text-brand-orange bg-cream-deep px-1.5 py-0.5 rounded",
						children: [
							"-",
							discount,
							"%"
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: (e) => {
						e.preventDefault();
						add(p, size, 1, activeVariant);
						track("add_to_cart", {
							currency: "INR",
							value: activePrice,
							items: [toItem(p, {
								size,
								qty: 1
							})]
						});
						toast.success(`Added ${p.name} (${size}) to cart`);
					},
					className: "mt-auto w-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs group/btn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-3.5 group-hover/btn:scale-110 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ADD TO CART" })]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
