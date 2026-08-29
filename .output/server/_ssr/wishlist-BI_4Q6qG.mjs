import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart } from "./cart-Bp2wgR53.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as ShoppingBag, in as ArrowRight, mt as Heart, p as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as useWishlist } from "./collection-helpers-DAdv5muE.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-BI_4Q6qG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const wl = useWishlist();
	const { add } = useCart();
	const [all, setAll] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			if (r.length) setAll(r);
		});
	}, []);
	const items = (0, import_react.useMemo)(() => {
		return all.filter((p) => wl.has(p.slug));
	}, [
		all,
		wl.slugs,
		wl
	]);
	const handleAddToCart = (p) => {
		add(p);
		toast.success(`Added ${p.name} to cart`);
	};
	const handleClearAll = async () => {
		if (confirm("Clear all items from your wishlist?")) {
			await wl.clear();
			toast.success("Wishlist cleared");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6 mb-8 sm:mb-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Favorites" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso tracking-tight",
				children: ["Saved for Later ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-burnt-orange font-normal text-2xl sm:text-3xl",
					children: [
						"(",
						items.length,
						")"
					]
				})]
			})] }), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleClearAll,
				className: "inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors self-start md:self-auto py-2 px-4 rounded-xl border border-border/60 hover:border-destructive/30 hover:bg-destructive/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " CLEAR ALL"]
			})]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-cream-deep/40 border border-border/70 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto my-6 shadow-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto size-20 rounded-full bg-cream border border-border/80 flex items-center justify-center text-burnt-orange mb-6 shadow-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl sm:text-3xl font-bold text-espresso",
					children: "Your Wishlist is Empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed",
					children: "Save your favorite raw forest honeys, gift sets, and single-flora reserves to keep track of what you love and order anytime."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "inline-flex items-center gap-2.5 bg-espresso text-cream px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-burnt-orange transition-all duration-300 shadow-md hover:shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EXPLORE COLLECTIONS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8",
			children: items.map((p) => {
				const discount = p.mrp && p.mrp > p.price ? Math.round((p.mrp - p.price) / p.mrp * 100) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group bg-white rounded-2xl border border-border/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lift md:hover:-translate-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative block bg-cream aspect-square overflow-hidden shrink-0",
						children: [
							p.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-3 left-3 z-10 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm bg-espresso text-cream",
								children: p.badge
							}),
							discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute top-3 left-3 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full bg-terracotta text-white shadow-sm",
								style: { top: p.badge ? "2.25rem" : "0.75rem" },
								children: [
									"-",
									discount,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Remove from wishlist",
								onClick: (e) => {
									e.preventDefault();
									wl.remove(p.slug);
									toast.success(`Removed ${p.name}`);
								},
								className: "absolute top-3 right-3 z-10 size-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-terracotta hover:text-destructive transition-colors shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$slug",
								params: { slug: p.slug },
								className: "block w-full h-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: p.name,
									loading: "lazy",
									className: "w-full h-full object-cover object-center md:group-hover:scale-105 transition-transform duration-700 ease-out"
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-5 flex flex-col flex-1",
						children: [
							p.flora && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold tracking-widest uppercase text-burnt-orange mb-1",
								children: p.flora
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$slug",
								params: { slug: p.slug },
								className: "font-serif text-base sm:text-lg font-bold text-espresso group-hover:text-burnt-orange transition-colors line-clamp-2 leading-snug",
								children: p.name
							}),
							p.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-1 line-clamp-1",
								children: p.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto pt-4 flex items-center justify-between gap-3 border-t border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-serif text-lg font-bold text-espresso leading-none",
									children: ["₹", p.price.toLocaleString("en-IN")]
								}), p.mrp && p.mrp > p.price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground line-through mt-0.5",
									children: ["₹", p.mrp.toLocaleString("en-IN")]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleAddToCart(p),
									className: "inline-flex items-center gap-1.5 bg-espresso text-cream hover:bg-burnt-orange hover:text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all shadow-xs shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ADD" })]
								})]
							})
						]
					})]
				}, p.slug);
			})
		})]
	}) });
}
//#endregion
export { WishlistPage as component };
