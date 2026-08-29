import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, g as Link, v as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QuickView } from "./QuickView-rTBXp2Kp.mjs";
import { t as DEFAULT_SHOP_CATEGORIES } from "./category-catalog-B0p0Q8zD.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { n as toItem, r as track } from "./analytics-DCmDeuTY.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
import { t as Autoplay } from "../_libs/embla-carousel-autoplay.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as ProductCard } from "./ProductCard-EQWSFYBy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ShopPage-BB7wIZYU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var defaultFilters = {
	honeyType: [],
	packSize: [],
	availability: [],
	rating: [],
	discount: []
};
function ShopPage({ overrideCategorySlug, initialCategories = DEFAULT_SHOP_CATEGORIES, initialProducts = [] }) {
	console.table(initialCategories.map((c) => ({
		slug: c.slug,
		name: c.name,
		image_url: c.image_url,
		image: c.image,
		updated_at: c.updated_at
	})));
	const search = useSearch({ strict: false });
	const navigate = useNavigate();
	const [emblaRef] = useEmblaCarousel({
		loop: true,
		align: "start",
		duration: 60,
		skipSnaps: false,
		breakpoints: { "(min-width: 768px)": { active: false } }
	}, [Autoplay({
		delay: 3e3,
		stopOnInteraction: false
	})]);
	const normalizedInitialProducts = (0, import_react.useMemo)(() => {
		const mergedMap = /* @__PURE__ */ new Map();
		if (initialProducts && initialProducts.length > 0) initialProducts.forEach((p) => {
			mergedMap.set(p.slug, p);
		});
		const validCategories = [
			"Honey",
			"Beeswax",
			"Bee Pollen",
			"Beeswax Candles",
			"Beeswax Products",
			"Beauty Products"
		];
		return Array.from(mergedMap.values()).map((p) => {
			let finalCat = p.category;
			if (finalCat === "Beeswax Candle") finalCat = "Beeswax Candles";
			if (p.name.includes("Gift Pack")) finalCat = "Honey";
			if (!validCategories.includes(finalCat)) if (p.name.includes("Honey")) finalCat = "Honey";
			else finalCat = "Honey";
			return {
				...p,
				category: finalCat
			};
		});
	}, [initialProducts]);
	const [products, setProducts] = (0, import_react.useState)(normalizedInitialProducts);
	const [categories, setCategories] = (0, import_react.useState)(initialCategories);
	const [quick, setQuick] = (0, import_react.useState)(null);
	const [cat, setCat] = (0, import_react.useState)(overrideCategorySlug || "All Products");
	const [q, setQ] = (0, import_react.useState)(search.q || "");
	const [sort, setSort] = (0, import_react.useState)(search.sort || "popular");
	const [filters, setFilters] = (0, import_react.useState)(defaultFilters);
	(0, import_react.useEffect)(() => {
		setProducts(normalizedInitialProducts);
	}, [normalizedInitialProducts]);
	(0, import_react.useEffect)(() => {
		setCategories(initialCategories);
	}, [initialCategories]);
	(0, import_react.useEffect)(() => {
		if (overrideCategorySlug) setCat(overrideCategorySlug);
		else setCat("All Products");
		if (search.q !== void 0) setQ(search.q || "");
		if (search.sort !== void 0) setSort(search.sort || "popular");
	}, [
		overrideCategorySlug,
		search.q,
		search.sort
	]);
	const updateUrlWithoutScrolling = (0, import_react.useCallback)((newSort, newQ) => {
		navigate({
			search: (prev) => ({
				...prev,
				sort: newSort !== "popular" ? newSort : void 0,
				q: newQ.trim() || void 0
			}),
			replace: true
		});
	}, [navigate]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = [...products];
		let activeCat = overrideCategorySlug || cat;
		if (activeCat !== "All Products" && activeCat !== "All" && activeCat !== "all" && activeCat !== "all-products") {
			const catLower = activeCat.toLowerCase().trim();
			const matchedCatDef = categories.find((c) => c.slug.toLowerCase() === catLower || c.name.toLowerCase() === catLower) || DEFAULT_SHOP_CATEGORIES.find((c) => c.slug.toLowerCase() === catLower || c.name.toLowerCase() === catLower);
			if (matchedCatDef) list = list.filter((p) => {
				const pCat = p.category ? p.category.toLowerCase().trim() : "";
				return pCat === matchedCatDef.slug.toLowerCase() || pCat === matchedCatDef.name.toLowerCase();
			});
			else list = list.filter((p) => {
				return (p.category ? p.category.toLowerCase().trim() : "") === catLower;
			});
		}
		if (q.trim()) {
			const term = q.trim().toLowerCase();
			list = list.filter((p) => [
				p.name,
				p.tagline,
				p.description,
				p.flora ?? "",
				p.category,
				...p.benefits ?? []
			].join(" ").toLowerCase().includes(term));
		}
		switch (sort) {
			case "price-asc":
				list.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				list.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
				break;
			case "newest":
				list.sort((a, b) => (b.badge === "NEW" ? 1 : 0) - (a.badge === "NEW" ? 1 : 0));
				break;
			default: list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
		}
		return list;
	}, [
		cat,
		q,
		sort,
		products
	]);
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(12);
	(0, import_react.useEffect)(() => {
		track("view_item_list", {
			item_list_name: cat,
			items: filtered.slice(0, 20).map((p) => toItem(p))
		});
	}, [cat, filtered]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([{
			name: "Home",
			url: "/"
		}, {
			name: "Shop",
			url: "/shop"
		}]) }),
		!overrideCategorySlug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "shop" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative bg-cream-deep/40 py-16 sm:py-24 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page relative z-10 text-center flex flex-col items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl md:text-5xl lg:text-6xl text-espresso font-medium mb-4",
					children: categories.find((c) => c.slug === overrideCategorySlug)?.name || overrideCategorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
				})
			})
		}),
		!overrideCategorySlug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-cream pt-10 sm:pt-12 pb-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-[1700px] mx-auto px-4 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-widest text-brand-orange font-semibold mb-2 sm:mb-4",
							children: "FROM THE HIVE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-[28px] sm:text-[36px] text-espresso font-[500]",
							children: "Shop by Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-espresso/70 text-[15px] max-w-2xl mt-2 text-center",
							children: "Explore our pure, authentic honey and bee-crafted essentials."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-[1250px] mx-auto overflow-hidden md:overflow-visible",
					ref: emblaRef,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-nowrap md:flex-wrap justify-start md:justify-center items-start gap-4 sm:gap-6 *:shrink-0 *:w-[140px] *:aspect-square md:*:w-[280px] md:*:h-[280px] pb-4 md:pb-0 touch-pan-y cursor-grab active:cursor-grabbing md:cursor-auto md:touch-auto",
						children: [categories.find((c) => c.slug === "all-products" || c.name.toLowerCase() === "all products") || {
							slug: "all-products",
							name: "All Products",
							image_url: "/assets/hero-products-Dvn7VLJs.jpg",
							hasCustomImage: false
						}, ...categories.filter((c) => c.slug !== "all-products" && c.name.toLowerCase() !== "all products")].map((c) => c.slug === "all-products" || c.name.toLowerCase() === "all products" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 aspect-square snap-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image_url || void 0,
								alt: c.name,
								className: "absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out",
								loading: "lazy",
								onError: (event) => {
									console.error("[CATEGORY IMAGE FAILED]", {
										slug: c.slug,
										name: c.name,
										src: event.currentTarget.src
									});
								}
							})
						}, c.slug) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop/$slug",
							params: { slug: c.slug },
							className: "group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 aspect-square snap-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.image_url || void 0,
								alt: c.name,
								className: "absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out",
								loading: "lazy",
								onError: (event) => {
									console.error("[CATEGORY IMAGE FAILED]", {
										slug: c.slug,
										name: c.name,
										src: event.currentTarget.src
									});
								}
							})
						}, c.slug))
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full bg-brand-orange py-2.5 sm:py-3 overflow-hidden ticker-wrap border-y border-brand-orange-hover",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-max items-center animate-ticker",
				style: { animationDuration: "30s" },
				children: [1, 2].map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center whitespace-nowrap text-white text-[13px] sm:text-[14px] font-medium tracking-wide",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🍯 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pure & Unfiltered Honey" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "From the Wildflowers of Saurashtra" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🐝 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Responsibly Harvested" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["✨ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Natural & Authentic" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🍯 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Multi Flora | Ajwain Flora | Fennel Flora" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🎁 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Perfect for Gifting" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🚚 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Free Delivery on Orders Above ₹400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🍯 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pure & Unfiltered Honey" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "From the Wildflowers of Saurashtra" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🐝 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Responsibly Harvested" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["✨ ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Natural & Authentic" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🍯 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Multi Flora | Ajwain Flora | Fennel Flora" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🎁 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Perfect for Gifting" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 mx-4 sm:mx-6",
							children: ["🚚 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Free Delivery on Orders Above ₹400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/40",
							children: "•"
						})
					]
				}, group))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "products-grid",
			className: "py-10 sm:py-12 bg-cream relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden xl:flex absolute top-16 bottom-0 lg:-left-20 xl:-left-10 2xl:left-4 w-[300px] xl:w-[350px] 2xl:w-[450px] flex-col gap-[700px] opacity-10 mix-blend-multiply pointer-events-none z-0 select-none overflow-visible",
					children: [
						"/images/bg_illustrations/floral_alpha.png",
						"/images/heritage/illus_beekeeping.png",
						"/images/bg_illustrations/bees_alpha.png",
						"/images/heritage/illus_wildflower.png",
						"/images/bg_illustrations/floral_alpha.png",
						"/images/heritage/illus_beekeeping.png"
					].map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "",
						className: "w-full object-contain shrink-0",
						loading: "lazy"
					}, `left-art-${i}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden xl:flex absolute top-64 bottom-0 lg:-right-20 xl:-right-10 2xl:right-4 w-[350px] xl:w-[400px] 2xl:w-[500px] flex-col gap-[700px] opacity-10 mix-blend-multiply pointer-events-none z-0 select-none overflow-visible",
					children: [
						"/images/bg_illustrations/honeycomb_alpha.png",
						"/images/heritage/illus_hive_to_home.png",
						"/images/bg_illustrations/dipper_alpha.png",
						"/images/heritage/illus_pure.png",
						"/images/bg_illustrations/honeycomb_alpha.png",
						"/images/heritage/illus_hive_to_home.png"
					].map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "",
						className: "w-full object-contain shrink-0",
						loading: "lazy"
					}, `right-art-${i}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page relative z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-30 bg-cream py-4 mb-8 border-b sm:border-none border-border/80 flex flex-wrap items-center justify-between gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:block text-[15px] text-espresso/80 font-medium",
							children: [
								"Showing ",
								filtered.length,
								" products"
							]
						})
					}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-border/80 rounded-3xl p-16 text-center shadow-soft max-w-xl mx-auto my-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-5xl mb-4",
								children: "🐝"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-2xl font-bold text-espresso",
								children: overrideCategorySlug ? "No products found in this category." : "No honey matches your filter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-espresso/70",
								children: overrideCategorySlug ? "Please try checking back later or browse our other collections." : "Try selecting a different category or viewing all products."
							}),
							overrideCategorySlug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "mt-6 inline-flex items-center gap-2 bg-brand-orange text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-orange-hover transition-colors shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VIEW ALL PRODUCTS" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setCat("All Products");
									setQ("");
									updateUrlWithoutScrolling("All Products", "", sort);
								},
								className: "mt-6 inline-flex items-center gap-2 bg-brand-orange text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-orange-hover transition-colors shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VIEW ALL PRODUCTS" })
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-5 sm:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
						children: filtered.slice(0, visibleCount).map((product, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both",
							style: { animationDelay: `${idx * 40}ms` },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
								p: product,
								onQuickView: (p) => setQuick(p)
							})
						}, `${product.slug}-${cat}`))
					}), visibleCount < filtered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full flex justify-center mt-12 mb-4 relative z-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setVisibleCount((c) => c + 12),
							className: "bg-cream border border-brand-orange text-brand-orange px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-orange hover:text-white transition-colors",
							children: "Load More"
						})
					})] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-cream py-16 md:py-24 overflow-hidden border-t border-border/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page px-6 md:px-12 lg:px-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 max-w-[1400px] mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full md:w-[35%] flex justify-center md:justify-end animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both",
							style: { animationDelay: "100ms" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/heritage/illus_beekeeping.png",
								alt: "Heritage Beekeeping",
								className: "w-[260px] sm:w-[320px] md:w-full max-w-[420px] object-contain opacity-90 mix-blend-multiply",
								loading: "lazy"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full md:w-[30%] flex flex-col items-center text-center px-4 shrink-0 animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both",
							style: { animationDelay: "300ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-widest text-brand-orange font-semibold mb-5",
								children: "FROM THE HIVE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "inline-flex items-center justify-center bg-brand-orange text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm hover:bg-brand-orange-hover transition-all duration-400 shadow-[0_8px_20px_rgba(166,97,14,0.15)] hover:shadow-[0_12px_25px_rgba(166,97,14,0.25)] hover:-translate-y-1 whitespace-nowrap",
								children: "Explore our story →"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full md:w-[35%] flex justify-center md:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both",
							style: { animationDelay: "500ms" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/heritage/illus_wildflower.png",
								alt: "Wildflowers",
								className: "w-[260px] sm:w-[320px] md:w-full max-w-[420px] object-contain opacity-90 mix-blend-multiply",
								loading: "lazy"
							})
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickView, {
			product: quick,
			onClose: () => setQuick(null)
		})
	] });
}
//#endregion
export { ShopPage as t };
