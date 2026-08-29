import { i as __toESM } from "../_runtime.mjs";
import { a as honeycomb_bees_default, f as prod_giftpack_default, g as prod_lychee_default, i as honey_drizzle_default, m as prod_liquid_default, n as bee_flower_default, p as prod_honeycomb_default, r as family_honey_default, t as bee_farm_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Sparkles, ct as Instagram, in as ArrowRight, v as Star, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { r as hero_honey_default } from "./product-images-CLm3Xqgk.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { n as fetchShopCategories } from "./category-catalog-B0p0Q8zD.mjs";
import { f as fetchAllHomepageTrustItems, m as fetchHomepageSections } from "./homepage-cms.functions-dnhwKaHU.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { n as getPublicInstagramFeed } from "./instagram.functions-CZs_jpgy.mjs";
import { t as HeroSlider } from "./HeroSlider-CikMyqvX.mjs";
import { i as listPublicPosts } from "./blog-server.functions-WqtTS3kD.mjs";
import { i as resolvePostImage, n as formatPostDate } from "./blog-client-helpers-B6pLNpSM.mjs";
import { i as heroRowToSlide, n as fetchPublicHeroRows } from "./hero-catalog-BOSpOcA3.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
import { t as Autoplay } from "../_libs/embla-carousel-autoplay.mjs";
import { t as PremiumMobileCarousel } from "./PremiumMobileCarousel-DywbpNAf.mjs";
import { n as breadcrumbLd, r as organizationLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
import { t as ProductCard } from "./ProductCard-EQWSFYBy.mjs";
import { t as ShoppableVideoCarousel } from "./ShoppableVideoCarousel-xbi21IV0.mjs";
import { t as Route } from "./routes-CcKgfIj1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CsYpO6gY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomeHero() {
	const [slides, setSlides] = import_react.useState([]);
	const getRows = useServerFn(fetchPublicHeroRows);
	import_react.useEffect(() => {
		getRows({ data: { page: "home" } }).then((res) => {
			if (res && res.rows && res.rows.length > 0) setSlides(res.rows.map((r) => heroRowToSlide(r)));
		});
	}, [getRows]);
	if (!slides || slides.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlider, {
		slides,
		size: "home",
		interval: 5e3
	});
}
function HomeTrustStrip({ settings }) {
	const [dbItems, setDbItems] = import_react.useState([]);
	const [loading, setLoading] = import_react.useState(true);
	import_react.useEffect(() => {
		fetchAllHomepageTrustItems().then((data) => setDbItems(data)).catch((err) => console.warn("Failed to fetch trust items, using fallback", err)).finally(() => setLoading(false));
	}, []);
	const fallbackItems = [
		{
			label: "100% Pure No Additives",
			img: "/images/trust/pure_no_additives.png"
		},
		{
			label: "Raw & Unprocessed",
			img: "/images/trust/raw_unprocessed.png"
		},
		{
			label: "Natural Floral Sources",
			img: "/images/trust/natural_floral.png"
		},
		{
			label: "Rich in Nutrients",
			img: "/images/trust/rich_nutrients.png"
		},
		{
			label: "Lab Tested",
			img: "/images/trust/lab_tested.png"
		},
		{
			label: "Ethical Beekeeping",
			img: "/images/trust/ethical_beekeeping.png"
		}
	];
	const items = dbItems.length > 0 ? dbItems.map((item) => {
		const matched = fallbackItems.find((f) => f.label.toLowerCase() === item.title.toLowerCase());
		return {
			label: item.title,
			img: matched ? matched.img : "/images/trust/pure_no_additives.png"
		};
	}) : fallbackItems;
	if (loading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-cream-deep/40 border-y border-border/80 py-8 sm:py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8",
				children: items.map(({ label, img }, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center p-2 group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-28 sm:size-36 lg:size-40 mb-5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img,
							alt: label,
							className: "w-full h-full object-contain",
							loading: "lazy"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs sm:text-[13px] font-bold text-espresso leading-snug group-hover:text-brand-orange transition-colors",
						children: label
					})]
				}, idx))
			})
		})
	});
}
function HomeMarqueeStrip() {
	const block = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center space-x-8 sm:space-x-12 px-4 sm:px-6 text-[11px] sm:text-xs font-semibold tracking-[0.15em] text-white uppercase",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FROM THE HIVE" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white text-[10px]",
				children: "●"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PURE BY NATURE" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white text-[10px]",
				children: "●"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RAW & UNPROCESSED" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white text-[10px]",
				children: "●"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FARM TO JAR" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white text-[10px]",
				children: "●"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NATURAL FLORAL SOURCES" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white text-[10px]",
				children: "●"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ETHICAL BEEKEEPING" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white text-[10px]",
				children: "●"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full bg-[#B96F12] py-4 sm:py-5 overflow-hidden ticker-wrap",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-max items-center animate-ticker",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center",
				children: [
					block,
					block,
					block
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center",
				children: [
					block,
					block,
					block
				]
			})]
		})
	});
}
function HomeShopByCategory({ settings, initialCategories }) {
	const [displayCats, setDisplayCats] = import_react.useState([]);
	const [loading, setLoading] = import_react.useState(true);
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		dragFree: true,
		align: "start"
	}, [Autoplay({
		delay: 2500,
		stopOnInteraction: false,
		stopOnMouseEnter: true
	})]);
	const scrollPrev = (0, import_react.useCallback)(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);
	const scrollNext = (0, import_react.useCallback)(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);
	import_react.useEffect(() => {
		const processCategories = (allCats) => {
			const FALLBACK_IMAGE_BY_SLUG = {
				honey: hero_honey_default,
				beeswax: prod_honeycomb_default,
				"bee-pollen": bee_farm_default,
				"beeswax-candle": honeycomb_bees_default,
				"beeswax-products": prod_giftpack_default,
				"beauty-products": prod_lychee_default,
				"all-products": hero_products_default
			};
			const baseCats = allCats.map((cat) => ({
				name: cat.name,
				img: cat.image_url || FALLBACK_IMAGE_BY_SLUG[cat.slug] || "/assets/hero-honey-_5XoWxQ5.jpg",
				filter: cat.name,
				slug: cat.slug,
				updatedAt: cat.updatedAt
			}));
			setDisplayCats([
				...baseCats,
				...baseCats,
				...baseCats
			]);
			setLoading(false);
		};
		if (initialCategories && initialCategories.length > 0) processCategories(initialCategories);
		else fetchShopCategories().then(processCategories).catch((err) => {
			console.error("Failed to load categories on homepage:", err);
			setLoading(false);
		});
	}, [initialCategories]);
	if (loading) return null;
	const s_eyebrow = settings?.eyebrow ?? "DISCOVER";
	const s_heading = settings?.heading ?? "Explore Our World";
	const s_desc = settings?.description ?? "Discover every expression of pure honey—from everyday favourites to rare treasures, thoughtfully crafted by nature.";
	const s_cta_text = settings?.cta_text ?? "VIEW ALL CATEGORIES";
	const s_cta_url = settings?.cta_url ?? "/shop";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "pt-24 pb-20 bg-[#F8F5EF] overflow-hidden relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 pointer-events-none opacity-[0.15] sm:opacity-[0.18] z-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						loading: "lazy",
						src: "/images/bg_illustrations/floral_alpha.png",
						alt: "",
						className: "absolute -top-[10%] -left-[10%] sm:-left-[5%] w-[400px] sm:w-[500px] max-w-[70vw] object-contain animate-float-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						loading: "lazy",
						src: "/images/bg_illustrations/honeycomb_alpha.png",
						alt: "",
						className: "absolute top-[15%] -right-[15%] sm:right-[5%] w-[350px] sm:w-[400px] max-w-[60vw] object-contain animate-float-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						loading: "lazy",
						src: "/images/bg_illustrations/bees_alpha.png",
						alt: "",
						className: "absolute bottom-[25%] left-[5%] sm:left-[15%] w-[200px] sm:w-[300px] max-w-[40vw] object-contain animate-float-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						loading: "lazy",
						src: "/images/bg_illustrations/dipper_alpha.png",
						alt: "",
						className: "absolute -bottom-[5%] -right-[10%] sm:-right-[5%] w-[350px] sm:w-[450px] max-w-[60vw] object-contain animate-float-4"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page mb-8 relative z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
							children: s_eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
							children: s_heading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]",
							children: s_desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: s_cta_url,
							className: "inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s_cta_text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-300 group-hover:translate-x-[6px]" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-[1696px] mx-auto relative group px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: scrollPrev,
						className: "absolute left-2 sm:-left-4 lg:-left-6 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-border/80 shadow-md flex items-center justify-center text-espresso opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream-deep hover:border-burnt-orange",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-5 h-5 sm:w-6 sm:h-6",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M15 19l-7-7 7-7"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: scrollNext,
						className: "absolute right-2 sm:-right-4 lg:-right-6 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-border/80 shadow-md flex items-center justify-center text-espresso opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream-deep hover:border-burnt-orange",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-6 h-6",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M9 5l7 7-7 7"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-visible w-full px-4 sm:px-0",
						ref: emblaRef,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-4 sm:gap-[24px] py-6 touch-pan-y cursor-grab active:cursor-grabbing",
							children: displayCats.map((cat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-[0_0_80vw] sm:flex-[0_0_calc(100%/2.5-16px)] lg:flex-[0_0_calc(100%/3.5-18px)] xl:flex-[0_0_calc(100%/4.5-19.2px)] min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: cat.filter && cat.filter.toLowerCase() !== "all products" && cat.filter.toLowerCase() !== "all" ? `/shop/${cat.filter.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}` : "/shop",
									className: "group/card relative flex flex-col shrink-0 overflow-hidden bg-white rounded-[16px] sm:rounded-[22px] shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(217,119,6,0.15)] transition-all duration-300 w-full aspect-square",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 w-full h-full bg-[#F8F5EF]/50 overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: cat.img,
											alt: cat.name,
											loading: "lazy",
											onError: (e) => {
												e.target.src = prod_liquid_default;
											},
											className: "w-full h-full object-cover pointer-events-none transform transition-transform duration-300 ease-out group-hover/card:scale-105"
										}, cat.updatedAt || cat.img)
									})
								})
							}, idx))
						})
					})
				]
			})
		]
	});
}
function HomeBestSellers({ products, onQuickView, settings }) {
	const [displayList, setDisplayList] = import_react.useState([]);
	const [loading, setLoading] = import_react.useState(true);
	import_react.useEffect(() => {
		const homepageProducts = products.filter((p) => p.showOnHomepage === true);
		setDisplayList(homepageProducts);
		setLoading(false);
	}, [products]);
	if (loading) return null;
	const bs_eyebrow = settings?.eyebrow ?? "CURATED FOR YOU";
	const bs_heading = settings?.heading ?? "Our Finest Picks";
	const bs_desc = settings?.description ?? "A handpicked selection of our most loved honey and bee-crafted essentials, chosen for their exceptional purity and quality.";
	const bs_cta_text = settings?.cta_text ?? "VIEW ALL PRODUCTS";
	const bs_cta_url = settings?.cta_url ?? "/shop";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pt-[100px] pb-14 sm:pb-20 bg-cream-deep/30 border-y border-border/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-8 sm:mb-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
							children: bs_eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
							children: bs_heading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]",
							children: bs_desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: bs_cta_url,
							className: "inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bs_cta_text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-300 group-hover:translate-x-[6px]" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "block md:hidden mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumMobileCarousel, {
						items: displayList,
						slideClassName: "flex-[0_0_86vw] min-w-0",
						renderItem: (product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							p: product,
							onQuickView
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8",
					children: displayList.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						p: product,
						onQuickView
					}, product.slug))
				})
			]
		})
	});
}
function HomeWhyChoose({ settings }) {
	const benefits = [
		"Pure & Unadulterated Honey",
		"Ethically Sourced & Sustainably Harvested",
		"Lab Tested for Moisture, HMF & Purity",
		"No Artificial Flavours or Preservatives"
	];
	const wc_eyebrow = settings?.eyebrow ?? "OUR HERITAGE";
	const wc_heading = settings?.heading ?? "Where Purity Begins";
	const wc_desc = settings?.description ?? "Every drop reflects generations of beekeeping, sustainable farming, and an unwavering commitment to quality.";
	const wc_cta_text = settings?.cta_text ?? "KNOW MORE ABOUT US";
	const wc_cta_url = settings?.cta_url ?? "/our-story";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "why-saurashtra-honey",
		className: "py-16 sm:py-24 bg-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-[70px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
							children: wc_eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
							children: wc_heading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]",
							children: wc_desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: wc_cta_url,
							className: "inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: wc_cta_text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-300 group-hover:translate-x-[6px]" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-8 lg:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 rounded-[24px] bg-white border border-[#2B2118]/10 space-y-4 shadow-sm text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex items-center justify-center size-12 rounded-full bg-[#D97706]/10 text-[#D97706] mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-serif text-[26px] font-medium text-[#2B2118] leading-tight",
									children: [
										"Naturally Sweet.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										"Truly Wholesome."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[15px] text-[#6B6257] leading-relaxed px-2",
									children: "Experience the authentic aroma and floral notes of honey straight from the comb. No processing, no overheating—just 100% natural goodness."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-4",
								children: benefits.map((text, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 bg-white/50 p-4 rounded-[16px] border border-[#2B2118]/5 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-[22px] text-[#D97706] shrink-0 mt-[2px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[15px] font-medium text-[#2B2118]",
										children: text
									})]
								}, idx))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 mt-2 px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[24px] overflow-hidden aspect-[4/5] shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: honey_drizzle_default,
									alt: "Raw honey pouring",
									loading: "lazy",
									className: "w-full h-full object-cover object-center"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[24px] overflow-hidden aspect-[4/5] shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: bee_flower_default,
									alt: "Honey bee collecting nectar",
									loading: "lazy",
									className: "w-full h-full object-cover object-center"
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden lg:grid grid-cols-12 gap-10 items-stretch",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-4 flex flex-col justify-center space-y-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3.5 pt-1",
								children: benefits.map((text, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-brand-orange shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm sm:text-[15px] font-semibold text-espresso",
										children: text
									})]
								}, idx))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-3xl overflow-hidden shadow-lift border border-border/80 bg-cream-deep min-h-[340px] sm:min-h-[440px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: honey_drizzle_default,
									alt: "Raw honey pouring",
									loading: "lazy",
									className: "w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-4 flex flex-col justify-between gap-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-8 rounded-3xl bg-cream-deep/60 border border-border/80 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex items-center justify-center size-12 rounded-2xl bg-brand-orange/15 text-brand-orange",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-serif text-2xl sm:text-3xl font-bold text-espresso leading-snug",
										children: [
											"Naturally Sweet.",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"Truly Wholesome."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-espresso/75 leading-relaxed",
										children: "Experience the authentic aroma and floral notes of honey straight from the comb. No processing, no overheating—just 100% natural goodness."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 rounded-3xl overflow-hidden shadow-lift border border-border/80 bg-cream-deep min-h-[220px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: bee_flower_default,
									alt: "Honey bee collecting nectar from wild flora",
									loading: "lazy",
									className: "w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
								})
							})]
						})
					]
				})
			]
		})
	});
}
function HomeFarmBanner({ settings }) {
	const storyPoints = [
		{
			title: "From Hive to Home",
			desc: "Carefully harvested honey, brought directly from nature to your home.",
			img: "/images/heritage/illus_hive_to_home.png"
		},
		{
			title: "Wildflower Richness",
			desc: "Naturally influenced by the diverse flowers surrounding our hives.",
			img: "/images/heritage/illus_wildflower.png"
		},
		{
			title: "Pure by Nature",
			desc: "No unnecessary additives — just naturally pure honey.",
			img: "/images/heritage/illus_pure.png"
		},
		{
			title: "Responsible Beekeeping",
			desc: "Thoughtful beekeeping practices that respect bees and their natural environment.",
			img: "/images/heritage/illus_beekeeping.png"
		}
	];
	const fb_cta_text = settings?.cta_text ?? "EXPLORE OUR HIVE";
	const fb_cta_url = settings?.cta_url ?? "/bee-farming";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-[#F8F5EF] py-20 sm:py-32",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 pointer-events-none opacity-[0.15] sm:opacity-[0.20] z-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				loading: "lazy",
				src: "/images/bg_illustrations/floral_alpha.png",
				alt: "",
				className: "absolute top-[20%] -left-[10%] sm:-left-[5%] w-[450px] sm:w-[600px] max-w-[60vw] object-contain animate-float-1"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				loading: "lazy",
				src: "/images/bg_illustrations/honeycomb_alpha.png",
				alt: "",
				className: "absolute top-[40%] -right-[15%] sm:-right-[5%] w-[400px] sm:w-[500px] max-w-[60vw] object-contain animate-float-2"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-12 sm:mb-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
							children: "OUR JOURNEY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
							children: "The Journey Behind Every Drop"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[17px] md:text-[19px] text-[#6B6257] max-w-[760px] leading-[1.7]",
							children: "From the wildflowers of Saurashtra to the hands of our beekeepers, every drop follows a journey rooted in nature, care, and patience. We preserve what nature creates — pure, authentic honey, just as it was meant to be."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-5xl mx-auto mb-20 sm:mb-28 rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-espresso/5 bg-[#F8F5EF] p-2 sm:p-4 border border-border/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl sm:rounded-[24px] overflow-hidden relative group",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/heritage/cinematic.png",
							alt: "Authentic Indian Beekeeping",
							className: "w-full h-auto aspect-[4/3] sm:aspect-[21/9] object-cover transform transition-transform duration-[20s] ease-out group-hover:scale-105",
							loading: "lazy"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8 sm:gap-8 max-w-7xl mx-auto mb-16 sm:mb-28",
					children: storyPoints.map((point, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-[90px] sm:h-[150px] aspect-square mb-4 sm:mb-6 transition-transform duration-700 hover:-translate-y-2 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									loading: "lazy",
									src: point.img,
									alt: point.title,
									className: "w-full h-full object-contain"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-[16px] sm:text-[22px] text-espresso mb-2 sm:mb-3 font-[500] leading-tight",
								children: point.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12px] sm:text-[15px] text-espresso/70 leading-relaxed max-w-[280px]",
								children: point.desc
							})
						]
					}, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: fb_cta_url,
						className: "inline-flex items-center gap-3 text-[13px] sm:text-[14px] font-bold tracking-[0.2em] text-[#D97706] hover:text-[#B46204] uppercase group transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fb_cta_text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 sm:size-5 transition-transform duration-300 group-hover:translate-x-[6px]" })]
					})
				})
			]
		})]
	});
}
function HomeStatsStrip({ settings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-cream-deep/50 border-b border-border/80 py-10 sm:py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center",
				children: (Array.isArray(settings?.stats) && settings.stats.length > 0 ? settings.stats : [
					{
						value: "15+ Years",
						label: "Beekeeping Experience"
					},
					{
						value: "2000+",
						label: "Happy Customers Across India"
					},
					{
						value: "500+",
						label: "Bee Boxes Under Care"
					},
					{
						value: "100%",
						label: "Lab Tested For Purity"
					},
					{
						value: "0%",
						label: "Additives Always Pure"
					}
				]).map(({ value, label }, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 rounded-2xl bg-cream/70 border border-border/60 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-2xl sm:text-3xl font-bold text-brand-orange",
						children: value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs sm:text-sm font-semibold text-espresso/80 mt-1",
						children: label
					})]
				}, idx))
			})
		})
	});
}
function HomeTestimonials({ reviews, settings }) {
	const fallbackTestimonials = [
		{
			id: "t1",
			author_name: "Neha Shah",
			location: "Ahmedabad, Gujarat",
			content: "The Ajwain flora honey is incredible. You can actually smell and taste the difference from commercial store brands. My family loves it!",
			rating: 5,
			avatar: family_honey_default
		},
		{
			id: "t2",
			author_name: "Karan Mehta",
			location: "Rajkot, Gujarat",
			content: "Finally found an authentic raw honey brand from Gujarat. Every bottle comes with NABL test purity reports. Super trustworthy!",
			rating: 5,
			avatar: honey_drizzle_default
		},
		{
			id: "t3",
			author_name: "Ritika Verma",
			location: "Surat, Gujarat",
			content: "The raw honeycomb was a hit with my kids! Truly unfiltered, natural sweetness without any artificial aftertaste.",
			rating: 5,
			avatar: bee_flower_default
		}
	];
	const items = reviews && reviews.length >= 3 ? reviews.slice(0, 3).map((r, i) => ({
		id: r.id,
		author_name: r.author_name,
		location: r.location || "Gujarat, India",
		content: r.content,
		rating: r.rating || 5,
		avatar: fallbackTestimonials[i % fallbackTestimonials.length]?.avatar
	})) : fallbackTestimonials;
	const tm_eyebrow = settings?.eyebrow ?? "TRUSTED BY MANY";
	const tm_heading = settings?.heading ?? "Loved Across India";
	const tm_desc = settings?.description ?? "Real experiences shared by customers who choose purity every day.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 sm:py-24 bg-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-[70px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
							children: tm_eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
							children: tm_heading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7]",
							children: tm_desc
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "block md:hidden mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumMobileCarousel, {
						items,
						slideClassName: "flex-[0_0_86vw] min-w-0",
						renderItem: (item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between p-7 rounded-[22px] bg-white border border-border/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] h-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 text-brand-orange mb-4",
								"aria-label": `${item.rating} out of 5 stars`,
								children: [...Array(item.rating)].map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-brand-orange text-brand-orange" }, idx))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "text-[14px] text-espresso/90 leading-relaxed italic mb-6",
								children: [
									"“",
									item.content,
									"”"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5 pt-4 border-t border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-12 rounded-full overflow-hidden border-2 border-brand-orange/40 shrink-0 bg-cream",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.avatar,
										alt: item.author_name,
										loading: "lazy",
										className: "w-full h-full object-cover pointer-events-none"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-serif font-bold text-[14px] text-espresso",
									children: item.author_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[12px] text-muted-foreground",
									children: item.location
								})] })]
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:grid md:grid-cols-3 gap-6 sm:gap-8",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-cream-deep/40 border border-border/80 shadow-sm hover:shadow-md transition-shadow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 text-brand-orange mb-4",
							"aria-label": `${item.rating} out of 5 stars`,
							children: [...Array(item.rating)].map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-brand-orange text-brand-orange" }, idx))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "text-sm sm:text-base text-espresso/90 leading-relaxed italic mb-6",
							children: [
								"“",
								item.content,
								"”"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5 pt-4 border-t border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-12 rounded-full overflow-hidden border-2 border-brand-orange/40 shrink-0 bg-cream",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.avatar,
									alt: item.author_name,
									loading: "lazy",
									className: "w-full h-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif font-bold text-sm sm:text-base text-espresso",
								children: item.author_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: item.location
							})] })]
						})]
					}, item.id))
				})
			]
		})
	});
}
function HomeJournalPreview({ posts, settings }) {
	const displayPosts = posts.slice(0, 3);
	const jp_eyebrow = settings?.eyebrow ?? "JOIN OUR JOURNEY";
	const jp_heading = settings?.heading ?? "Follow Our Hive";
	const jp_desc = settings?.description ?? "Stay connected for new harvests, behind-the-scenes moments, and everyday inspiration from our farms.";
	const jp_cta_text = settings?.cta_text ?? "READ OUR STORIES";
	const jp_cta_url = settings?.cta_url ?? "/blog";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 sm:py-24 bg-cream-deep/25 border-t border-border/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-[70px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
							children: jp_eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
							children: jp_heading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]",
							children: jp_desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: jp_cta_url,
							className: "inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: jp_cta_text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-300 group-hover:translate-x-[6px]" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "block md:hidden mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumMobileCarousel, {
						items: displayPosts,
						slideClassName: "flex-[0_0_86vw] min-w-0",
						renderItem: (post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "group flex flex-col rounded-[22px] overflow-hidden bg-white border border-border/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 h-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/blog/$slug",
								params: { slug: post.slug },
								className: "block overflow-hidden aspect-[16/10]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: post.image,
									alt: post.title,
									loading: "lazy",
									className: "w-full h-full object-cover object-center pointer-events-none"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 flex flex-col flex-1 justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange",
										children: post.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-[18px] font-bold leading-snug text-espresso",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/blog/$slug",
											params: { slug: post.slug },
											children: post.title
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/blog/$slug",
									params: { slug: post.slug },
									className: "inline-flex items-center gap-2 text-[12px] font-bold tracking-widest text-brand-orange hover:text-[#B46204] transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "READ ARTICLE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
								})]
							})]
						}, post.slug)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:grid md:grid-cols-3 gap-6 sm:gap-8",
					children: displayPosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "group flex flex-col rounded-3xl overflow-hidden bg-cream border border-border/80 shadow-xs hover:shadow-lift transition-all duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/blog/$slug",
							params: { slug: post.slug },
							className: "block overflow-hidden aspect-[16/10]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: post.image,
								alt: post.title,
								loading: "lazy",
								className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 sm:p-7 flex flex-col flex-1 justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-orange",
										children: post.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-lg sm:text-xl font-bold leading-snug text-espresso group-hover:text-brand-orange transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/blog/$slug",
											params: { slug: post.slug },
											children: post.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-espresso/75 line-clamp-2 leading-relaxed",
										children: post.excerpt
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/blog/$slug",
									params: { slug: post.slug },
									className: "inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest text-brand-orange hover:text-[#B46204] transition-colors group-hover:translate-x-1 duration-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "READ ARTICLE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
								})
							})]
						})]
					}, post.slug))
				})
			]
		})
	});
}
function HomeInstagramPreview({ feed, settings }) {
	const isEnabled = feed?.settings?.is_enabled;
	const posts = feed?.posts || [];
	const eyebrow = settings?.eyebrow ?? "JOIN OUR JOURNEY";
	const heading = settings?.heading ?? "Follow Our Hive";
	const desc = settings?.description ?? "Stay connected for new harvests, behind-the-scenes moments, and everyday inspiration from our farms.";
	if (!isEnabled || posts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 sm:py-24 bg-cream-deep/25 border-t border-border/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
					children: heading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] mx-auto leading-[1.7] mb-[36px]",
					children: "Follow us on Instagram for the latest updates."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://instagram.com",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FOLLOW US ON INSTAGRAM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-300 group-hover:translate-x-[6px]" })]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16 sm:py-24 bg-cream-deep/25 border-t border-border/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center mb-[70px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]",
						children: heading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]",
						children: desc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://instagram.com",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FOLLOW US ON INSTAGRAM" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-300 group-hover:translate-x-[6px]" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6",
				children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: post.permalink,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "group block relative rounded-2xl overflow-hidden aspect-square bg-white border border-border/80 shadow-xs hover:shadow-lift transition-all duration-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: post.media_type === "VIDEO" && post.thumbnail_url ? post.thumbnail_url : post.media_url,
						alt: post.caption || "Instagram post",
						loading: "lazy",
						className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "text-white size-8 opacity-90" })
					})]
				}, post.id))
			})]
		})
	});
}
var QuickViewLazy = (0, import_react.lazy)(() => import("./QuickView-rTBXp2Kp.mjs").then((n) => n.n).then((n) => n.n).then((m) => ({ default: m.QuickView })));
var CANONICAL_SECTIONS = [
	"hero",
	"trust_strip",
	"shop_by_category",
	"featured_products",
	"shoppable_videos",
	"why_choose",
	"farm_banner",
	"stats_strip",
	"testimonials",
	"journal"
];
function Home() {
	const [quick, setQuick] = (0, import_react.useState)(null);
	const [list, setList] = (0, import_react.useState)([]);
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [cmsMap, setCmsMap] = (0, import_react.useState)({});
	const [cmsLoaded, setCmsLoaded] = (0, import_react.useState)(false);
	const [homePosts, setHomePosts] = (0, import_react.useState)([]);
	const [instaFeed, setInstaFeed] = (0, import_react.useState)(null);
	const fetchPostsFn = useServerFn(listPublicPosts);
	const fetchInstaFn = useServerFn(getPublicInstagramFeed);
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			if (r.length > 0) setList(r);
		});
		fetchHomepageSections().then((data) => {
			const map = {};
			for (const sec of data) map[sec.section_key] = sec;
			setCmsMap(map);
		}).catch((err) => {
			console.warn("[Homepage] CMS sections unavailable — rendering defaults:", err);
		}).finally(() => {
			setCmsLoaded(true);
		});
		const nonCriticalTimer = setTimeout(() => {
			fetchPostsFn({ data: {
				page: 1,
				pageSize: 3
			} }).then((res) => {
				if (res.rows && res.rows.length > 0) setHomePosts(res.rows.map((p) => ({
					slug: p.slug,
					title: p.title,
					excerpt: p.excerpt || "",
					category: p.category_name || "Journal",
					displayDate: formatPostDate(p.published_at || p.created_at),
					readTime: p.reading_time || "5 min read",
					image: resolvePostImage(p.cover_image_url, p.category_name || p.slug)
				})));
			});
			supabase.from("reviews").select("id, author_name, content, rating, location").eq("featured_on_homepage", true).order("created_at", { ascending: false }).limit(6).then(({ data, error }) => {
				if (!error && data && data.length >= 3) setReviews(data);
				else supabase.from("reviews").select("id, author_name, content, rating, location").eq("status", "approved").order("created_at", { ascending: false }).limit(6).then((res) => {
					if (res.data && res.data.length >= 3) setReviews(res.data);
				});
			});
			fetchInstaFn().then((res) => {
				setInstaFeed(res);
			});
		}, 300);
		return () => clearTimeout(nonCriticalTimer);
	}, []);
	const orderedSections = (() => {
		const allKeysInCms = CANONICAL_SECTIONS.every((k) => cmsMap[k] !== void 0);
		let keys;
		if (allKeysInCms) keys = [...CANONICAL_SECTIONS].sort((a, b) => {
			return (cmsMap[a]?.sort_order ?? 999) - (cmsMap[b]?.sort_order ?? 999);
		});
		else keys = [...CANONICAL_SECTIONS];
		return keys.filter((k) => {
			const rec = cmsMap[k];
			if (!rec) return true;
			return rec.enabled !== false;
		});
	})();
	const data = Route.useLoaderData();
	const renderSection = (key) => {
		const settings = cmsMap[key]?.settings ?? {};
		switch (key) {
			case "hero": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeHero, {}, "hero");
			case "trust_strip": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeTrustStrip, { settings }, "trust_strip");
			case "shop_by_category": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeShopByCategory, {
				settings,
				initialCategories: data.categories
			}, "shop_by_category");
			case "featured_products": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeBestSellers, {
				products: data.products && data.products.length > 0 ? data.products : list,
				onQuickView: setQuick,
				settings
			}, "featured_products");
			case "shoppable_videos": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeMarqueeStrip, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppableVideoCarousel, { placementContext: "homepage" })] }, "shoppable_videos_wrapper");
			case "why_choose": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeWhyChoose, { settings }, "why_choose");
			case "farm_banner": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFarmBanner, { settings }, "farm_banner");
			case "stats_strip": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeStatsStrip, { settings }, "stats_strip");
			case "testimonials": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeTestimonials, {
				reviews,
				settings
			}, "testimonials");
			case "journal":
				if (instaFeed?.settings?.is_enabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeInstagramPreview, {
					feed: instaFeed,
					settings
				}, "journal");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeJournalPreview, {
					posts: homePosts,
					settings
				}, "journal");
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: organizationLd() }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([{
			name: "Home",
			url: "/"
		}]) }),
		orderedSections.map(renderSection),
		quick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewLazy, {
				product: quick,
				onClose: () => setQuick(null)
			})
		})
	] });
}
//#endregion
export { Home as component };
