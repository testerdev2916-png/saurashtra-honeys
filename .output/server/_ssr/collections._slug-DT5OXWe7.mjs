import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ShieldCheck, Ht as ChevronRight, b as Sparkles, in as ArrowRight, rt as Leaf, sn as ArrowDown, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as QuickView } from "./QuickView-rTBXp2Kp.mjs";
import { a as getCategorySlug, i as getCategoryProducts, r as getCategoryMetadata, t as DEDICATED_COLLECTION_SLUGS } from "./collection-helpers-DAdv5muE.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { n as fetchShopCategories, t as DEFAULT_SHOP_CATEGORIES } from "./category-catalog-B0p0Q8zD.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as Route } from "./collections._slug-CMYvhzUu.mjs";
import { t as ProductCard } from "./ProductCard-EQWSFYBy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._slug-DT5OXWe7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryCollectionPage() {
	const { slug } = Route.useParams();
	useNavigate();
	const [products, setProducts] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)(DEFAULT_SHOP_CATEGORIES);
	const [quickViewProduct, setQuickViewProduct] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, [slug]);
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			const mergedMap = /* @__PURE__ */ new Map();
			if (r && r.length > 0) r.forEach((p) => {
				mergedMap.set(p.slug, p);
			});
			setProducts(Array.from(mergedMap.values()));
		});
		fetchShopCategories().then((r) => {
			if (r && r.length > 0) setCategories(r);
		});
	}, []);
	const metadata = (0, import_react.useMemo)(() => {
		return getCategoryMetadata(slug, categories);
	}, [slug, categories]);
	const filteredProducts = (0, import_react.useMemo)(() => {
		return getCategoryProducts(slug, products);
	}, [slug, products]);
	const otherCollections = (0, import_react.useMemo)(() => {
		const currentSlug = getCategorySlug(slug);
		return DEDICATED_COLLECTION_SLUGS.filter((s) => s !== currentSlug).slice(0, 4).map((s) => getCategoryMetadata(s, categories));
	}, [slug, categories]);
	const handleScrollToProducts = () => {
		const el = document.getElementById("collection-products");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([
			{
				name: "Home",
				url: "/"
			},
			{
				name: "Shop",
				url: "/shop"
			},
			{
				name: metadata.name,
				url: `/collections/${getCategorySlug(slug)}`
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-[#1A140F] border-b border-white/10 pt-6 pb-3 px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex items-center gap-2 text-xs md:text-sm tracking-wide text-cream/70 font-sans",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-gold transition-colors duration-200",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-cream/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "hover:text-gold transition-colors duration-200 font-medium",
						children: "Shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-cream/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold font-semibold tracking-wider uppercase",
						children: metadata.name
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#1A140F] text-cream group",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: metadata.heroImage,
					alt: metadata.name,
					className: "w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out opacity-40 md:opacity-50"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#1A140F] via-[#1A140F]/70 to-[#1A140F]/30" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative z-10 py-16 sm:py-24 text-center flex flex-col items-center max-w-4xl px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs tracking-[0.25em] uppercase text-gold font-medium mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-gold animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saurashtra Honey • Collection" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-[40px] sm:text-[60px] lg:text-[72px] font-medium leading-[1.08] text-white tracking-tight mb-4",
						children: metadata.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif italic text-xl sm:text-2xl lg:text-3xl text-gold/90 mb-6 font-light",
						children: metadata.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-cream/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light mb-10",
						children: metadata.heroDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleScrollToProducts,
						className: "group/btn inline-flex items-center gap-3 bg-gold text-espresso font-semibold text-sm sm:text-base px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(217,119,6,0.3)] hover:bg-[#F59E0B] hover:shadow-[0_15px_40px_rgba(217,119,6,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: metadata.ctaText }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4 group-hover/btn:translate-y-0.5 transition-transform duration-300" })]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "collection-products",
			className: "py-16 sm:py-24 bg-[#F8F5EF] scroll-mt-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between border-b border-espresso/10 pb-6 mb-12 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.25em] font-semibold text-[#D97706] mb-2",
						children: "PURE ARTISANAL HARVEST"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-espresso",
						children: [
							"The ",
							metadata.name,
							" Collection"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-espresso/70 font-medium",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-espresso font-semibold",
								children: filteredProducts.length
							}),
							" ",
							filteredProducts.length === 1 ? "product" : "products"
						]
					})]
				}), filteredProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8",
					children: filteredProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							p: product,
							onQuickView: (p) => setQuickViewProduct(p)
						})
					}, product.slug))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl p-12 text-center border border-border shadow-sm max-w-2xl mx-auto my-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-2xl text-espresso mb-3",
							children: "New Harvest Arriving Soon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-espresso/70 text-sm sm:text-base mb-6",
							children: "We are currently curating and bottling artisanal items for this collection. Please check back soon or explore our complete catalog."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							className: "inline-flex items-center gap-2 bg-espresso text-cream px-6 py-3 rounded-full text-sm font-medium hover:bg-espresso/90 transition-all duration-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View All Products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 sm:py-28 bg-white overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-6 order-2 lg:order-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] aspect-[4/3] sm:aspect-[16/11] group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: metadata.storyImage,
									alt: metadata.storyTitle,
									className: "w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-6 left-6 right-6 flex items-center justify-between text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "size-10 rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-5 text-gold" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] tracking-[0.2em] uppercase font-bold text-gold",
											children: "SAURASHTRA ORIGIN"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs sm:text-sm text-white/90 font-medium",
											children: metadata.storySubtitle
										})] })]
									})
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#D97706] mb-3",
								children: "EDITORIAL FEATURE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-espresso leading-tight mb-6",
								children: [
									"“",
									metadata.storyTitle,
									"”"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-espresso/80 text-base sm:text-lg leading-relaxed font-light mb-8",
								children: metadata.storyDescription
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 sm:space-y-5",
								children: metadata.storyHighlights.map((hl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4 p-4 rounded-2xl bg-[#F8F5EF]/70 border border-espresso/5 hover:bg-[#F8F5EF] transition-colors duration-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "size-10 rounded-xl bg-white shadow-xs border border-border flex items-center justify-center shrink-0 text-[#D97706]",
										children: [
											idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-5" }),
											idx === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" }),
											idx === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-serif text-base sm:text-lg font-medium text-espresso mb-0.5",
										children: hl.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-espresso/70",
										children: hl.description
									})] })]
								}, idx))
							})
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 sm:py-28 bg-[#F8F5EF] border-t border-espresso/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-2xl mx-auto mb-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.25em] uppercase font-semibold text-[#D97706] mb-3",
							children: "THE ARTISANAL METHOD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-serif text-3xl sm:text-5xl font-medium text-espresso leading-tight mb-4",
							children: ["How We Craft Our ", metadata.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-espresso/70 text-sm sm:text-base",
							children: "Every step of our process honors the natural balance of the hive and the rich floral heritage of Saurashtra."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8",
					children: metadata.processSteps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "group bg-white rounded-[28px] p-6 sm:p-8 border border-border/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							step.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#F8F5EF]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: step.image,
									alt: step.title,
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-3xl sm:text-4xl font-bold text-[#D97706]/30",
									children: step.stepNumber
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl sm:text-2xl font-medium text-espresso mb-2.5",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-espresso/75 leading-relaxed",
								children: step.description
							})
						] })
					}, step.stepNumber))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#1A140F] text-cream",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-white/10 pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2",
						children: "DISCOVER SAURASHTRA HONEY"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-3xl sm:text-4xl font-medium text-white",
						children: "Explore More Collections"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "inline-flex items-center gap-2 text-gold hover:text-white transition-colors duration-200 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Full Catalog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: otherCollections.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/collections/$slug",
						params: { slug: col.slug },
						className: "group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/4] bg-espresso/40 block shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: col.heroImage,
								alt: col.name,
								className: "w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-70"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-[#1A140F] via-[#1A140F]/40 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] tracking-[0.2em] uppercase text-gold font-semibold mb-1",
										children: "COLLECTION"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-xl sm:text-2xl font-medium text-white group-hover:text-gold transition-colors duration-300",
										children: col.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-cream/80 mt-2 group-hover:translate-x-1 transition-transform duration-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore Products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 text-gold" })]
									})
								]
							})
						]
					}, col.slug))
				})]
			})
		}),
		quickViewProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickView, {
			product: quickViewProduct,
			onClose: () => setQuickViewProduct(null)
		})
	] });
}
//#endregion
export { CategoryCollectionPage as component };
