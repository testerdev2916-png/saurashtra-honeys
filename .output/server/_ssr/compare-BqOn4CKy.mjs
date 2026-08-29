import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart } from "./cart-Bp2wgR53.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Gt as Check, i as X, x as ShoppingCart, xt as GitCompare } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
import { n as useCompare } from "./compare-Cg9kkhzV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-BqOn4CKy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComparePage() {
	const { slugs, remove, clear, count } = useCompare();
	const { add } = useCart();
	const [all, setAll] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			if (r.length) setAll(r);
		});
	}, []);
	const selected = (0, import_react.useMemo)(() => slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean), [slugs, all]);
	const allBenefits = (0, import_react.useMemo)(() => Array.from(new Set(selected.flatMap((p) => p.benefits ?? []))), [selected]);
	if (count === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-20 text-center max-w-lg mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto size-20 rounded-full bg-cream-deep border border-border/80 flex items-center justify-center text-burnt-orange mb-5 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-bold text-espresso",
				children: "Nothing to compare yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2.5 text-sm md:text-base text-muted-foreground leading-relaxed",
				children: "Tap the compare icon on any honey jar or comb in the catalog to see them side-by-side (up to 4 at a time)."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-7 inline-flex items-center gap-2 bg-espresso text-cream rounded-full px-6 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm",
				children: "BROWSE HONEY COLLECTION"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap justify-between items-end gap-3 mb-8 border-b border-border/80 pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Side-by-Side Comparison" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-2 font-serif text-3xl md:text-4xl font-bold text-espresso",
				children: [
					"Compare ",
					count,
					" harvest",
					count > 1 ? "s" : ""
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: clear,
				className: "text-xs font-bold tracking-widest text-burnt-orange hover:underline uppercase",
				children: "CLEAR ALL"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto -mx-4 px-4 pb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "min-w-full border-separate border-spacing-0 bg-white rounded-2xl border border-border/80 shadow-soft overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "sticky left-0 z-10 bg-cream/90 backdrop-blur text-left text-[11px] tracking-widest font-bold text-espresso uppercase p-5 min-w-[160px] border-b border-border/80",
					children: "Harvest Attribute"
				}), selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "text-left align-top p-5 min-w-[220px] border-b border-border/80 bg-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative bg-cream-deep/50 border border-border/80 rounded-2xl p-4 shadow-xs group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Remove",
								onClick: () => remove(p.slug),
								className: "absolute top-3 right-3 size-7 rounded-full bg-white text-muted-foreground hover:text-terracotta flex items-center justify-center shadow-xs transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$slug",
								params: { slug: p.slug },
								className: "block overflow-hidden rounded-xl bg-cream-deep aspect-square",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: p.name,
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$slug",
								params: { slug: p.slug },
								className: "block mt-3 font-serif text-base font-bold text-espresso leading-snug hover:text-burnt-orange transition-colors",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground font-medium line-clamp-1",
								children: p.tagline
							})
						]
					})
				}, p.slug))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Price & Value",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-5 font-serif text-xl font-bold text-espresso border-t border-border/60",
								children: [
									"₹",
									p.price,
									p.priceMax && ` – ₹${p.priceMax}`
								]
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Category",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 font-semibold text-espresso",
								children: p.category
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Floral Source",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 text-espresso font-medium",
								children: p.flora ?? "Saurashtra Wildflower"
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Tasting Notes",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 text-muted-foreground italic",
								children: p.flora === "Ajwain" ? "Warm, herbal & aromatic" : p.flora === "Tulsi" ? "Soothing, holy basil notes" : "Earthy, rich wildflower nectar"
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Best For",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 text-muted-foreground",
								children: p.flora === "Ajwain" ? "Digestive health & tea" : p.flora === "Tulsi" ? "Immunity & respiratory care" : "Daily sweetener & toast"
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Purity Assurance",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 font-medium text-botanical",
								children: "100% Unheated, Raw & Lab Verified"
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Customer Rating",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-5 border-t border-border/60 font-bold text-espresso",
								children: [
									p.rating,
									" ★ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-normal text-muted-foreground",
										children: [
											"(",
											p.reviews,
											" verified)"
										]
									})
								]
							}, p.slug))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Available Pack Sizes",
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 font-medium text-espresso",
								children: p.sizes.join(", ")
							}, p.slug))
						}),
						allBenefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: b,
							children: selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-5 border-t border-border/60 text-center",
								children: p.benefits?.includes(b) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5 text-burnt-orange mx-auto" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/40",
									children: "—"
								})
							}, p.slug))
						}, b)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "sticky left-0 z-10 bg-cream/90 backdrop-blur text-left text-[11px] tracking-widest font-bold text-espresso uppercase p-5 border-t border-border/80",
							children: "Direct Purchase"
						}), selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-5 border-t border-border/80 bg-cream/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									add(p);
									toast.success(`Added ${p.name}`);
								},
								className: "w-full inline-flex items-center justify-center gap-2 bg-espresso text-cream rounded-xl px-4 py-3 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-4" }), " ADD TO CART"]
							})
						}, p.slug))] })
					]
				})]
			})
		})]
	}) });
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "sticky left-0 z-10 bg-cream/90 backdrop-blur text-left text-xs font-bold text-espresso p-5 border-t border-border/60 align-top",
		children: label
	}), children] });
}
//#endregion
export { ComparePage as component };
