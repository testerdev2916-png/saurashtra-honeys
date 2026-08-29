import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ht as ChevronRight, Ut as ChevronLeft, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ShoppableVideoCarousel-xbi21IV0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getFallbackImage(slug) {
	return "";
}
var DEFAULT_HOMEPAGE_VIDEOS = [
	{
		id: "def-1",
		title: "Digestive Ritual",
		subtitle: "Ajwain Honey",
		badge: "SINGLE FLORA",
		video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		thumbnail_url: null,
		product_slug: "ajwain-honey",
		link_url: "/product/ajwain-honey",
		status: "published",
		is_active: true,
		is_featured: false,
		placement: "all",
		display_order: 1,
		fallbackImage: getFallbackImage("ajwain-honey")
	},
	{
		id: "def-2",
		title: "The Orchard Bloom",
		subtitle: "Lychee Honey",
		badge: "SEASONAL RARITY",
		video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		thumbnail_url: null,
		product_slug: "lychee-honey",
		link_url: "/product/lychee-honey",
		status: "published",
		is_active: true,
		is_featured: false,
		placement: "all",
		display_order: 2,
		fallbackImage: getFallbackImage("lychee-honey")
	},
	{
		id: "def-3",
		title: "Straight From The Frame",
		subtitle: "Honey Comb",
		badge: "BEE PRODUCTS",
		video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
		thumbnail_url: null,
		product_slug: "honey-comb",
		link_url: "/product/honey-comb",
		status: "published",
		is_active: true,
		is_featured: false,
		placement: "all",
		display_order: 3,
		fallbackImage: getFallbackImage("honey-comb")
	},
	{
		id: "def-4",
		title: "A Cooling Note",
		subtitle: "Fennel Honey",
		badge: "SINGLE FLORA",
		video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
		thumbnail_url: null,
		product_slug: "fennel-honey",
		link_url: "/product/fennel-honey",
		status: "published",
		is_active: true,
		is_featured: false,
		placement: "all",
		display_order: 4,
		fallbackImage: getFallbackImage("fennel-honey")
	},
	{
		id: "def-5",
		title: "The Everyday Jar",
		subtitle: "Multiflora Honey",
		badge: "BESTSELLER",
		video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
		thumbnail_url: null,
		product_slug: "multiflora-honey",
		link_url: "/product/multiflora-honey",
		status: "published",
		is_active: true,
		is_featured: false,
		placement: "all",
		display_order: 5,
		fallbackImage: getFallbackImage("multiflora-honey")
	},
	{
		id: "def-6",
		title: "Daily Radiance",
		subtitle: "Soft Skin Gel",
		badge: "BEAUTY PRODUCTS",
		video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
		thumbnail_url: null,
		product_slug: "soft-skin-gel",
		link_url: "/product/soft-skin-gel",
		status: "published",
		is_active: true,
		is_featured: false,
		placement: "all",
		display_order: 6,
		fallbackImage: getFallbackImage("soft-skin-gel")
	}
];
function toHomepageVideoItem(r) {
	return {
		id: r.id,
		title: r.title,
		subtitle: r.subtitle ?? "",
		badge: r.badge ?? "",
		video_url: r.video_url || null,
		thumbnail_url: r.thumbnail_url || null,
		product_slug: r.product_slug || null,
		link_url: r.link_url || (r.product_slug ? `/product/${r.product_slug}` : null),
		status: r.status || "published",
		is_active: !!r.is_active,
		is_featured: !!r.is_featured,
		placement: r.placement || "all",
		display_order: Number(r.display_order ?? 0),
		fallbackImage: getFallbackImage(r.product_slug)
	};
}
async function fetchHomepageVideos() {
	try {
		const { data, error } = await supabase.from("homepage_videos").select("*").eq("status", "published").eq("is_active", true).order("display_order", { ascending: true }).order("created_at", { ascending: true });
		if (error || !data || data.length === 0) return DEFAULT_HOMEPAGE_VIDEOS;
		return data.map(toHomepageVideoItem);
	} catch {
		return DEFAULT_HOMEPAGE_VIDEOS;
	}
}
function ShoppableVideoCard({ item, product, index, isVisible }) {
	const videoRef = (0, import_react.useRef)(null);
	const cardRef = (0, import_react.useRef)(null);
	const [isVideoInView, setIsVideoInView] = (0, import_react.useState)(false);
	const [hasLoaded, setHasLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = cardRef.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		const obs = new IntersectionObserver(([entry]) => {
			setIsVideoInView(entry.isIntersecting && entry.intersectionRatio > .5);
		}, { threshold: [.5] });
		obs.observe(el);
		return () => obs.unobserve(el);
	}, []);
	(0, import_react.useEffect)(() => {
		const vid = videoRef.current;
		if (!vid) return;
		const playVideo = async () => {
			try {
				await vid.play();
			} catch (err) {}
		};
		if (isVideoInView && !document.hidden) playVideo();
		else vid.pause();
		const handleVisibility = () => {
			if (document.hidden) vid.pause();
			else if (isVideoInView) playVideo();
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [isVideoInView]);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setHasLoaded(true), 50);
		return () => clearTimeout(t);
	}, []);
	const toUrl = product ? `/product/${product.slug}` : item.link_url || "/shop";
	const displayTitle = item.title || product?.name || "Saurashtra Honey";
	item.subtitle || product?.tagline || product?.category;
	const customBezier = "cubic-bezier(0.22, 1, 0.36, 1)";
	const customDuration = "350ms";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: cardRef,
		className: `group relative shrink-0 flex flex-col snap-center sm:snap-start
        w-[70vw] sm:w-[calc(50vw-24px)] md:w-[calc(33.33vw-24px)] lg:w-[calc(20vw-24px)] xl:w-[280px]
        aspect-[9/16]
        rounded-[24px] overflow-hidden cursor-pointer
        shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]
        transition-all will-change-transform bg-espresso
      `,
		style: {
			transitionDuration: customDuration,
			transitionTimingFunction: customBezier,
			transform: hasLoaded ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
			opacity: hasLoaded ? 1 : 0,
			transitionDelay: hasLoaded ? "0ms" : `${index * 40}ms`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: toUrl,
				className: "absolute inset-0 z-30 outline-none",
				"aria-label": `View ${displayTitle}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 w-full h-full group-hover:scale-[1.03] origin-center",
				style: { transition: `transform ${customDuration} ${customBezier}` },
				children: item.video_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					src: item.video_url,
					poster: item.thumbnail_url || item.fallbackImage,
					preload: "metadata",
					playsInline: true,
					muted: true,
					loop: true,
					className: "absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05]",
					style: { transition: `transform ${customDuration} ${customBezier}` }
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					loading: "lazy",
					src: item.thumbnail_url || item.fallbackImage,
					alt: "",
					className: "absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05]",
					style: { transition: `transform ${customDuration} ${customBezier}` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-0 inset-x-0 p-3 sm:p-5 z-20 flex items-center gap-2 sm:gap-3",
				children: [
					product && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 size-10 sm:size-14 rounded-xl border border-white/20 bg-cream/10 backdrop-blur-md overflow-hidden shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							loading: "lazy",
							src: product.image,
							alt: product.name,
							className: "w-full h-full object-cover"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0 flex flex-col justify-center text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif font-bold text-sm sm:text-base truncate drop-shadow-sm",
							children: displayTitle
						}), product && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1.5 mt-0.5 drop-shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-sm",
								children: ["₹", product.price.toLocaleString("en-IN")]
							}), product.mrp && product.mrp > product.price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] sm:text-[11px] text-white/70 line-through",
								children: ["₹", product.mrp.toLocaleString("en-IN")]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 size-8 sm:size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-burnt-orange group-hover:border-burnt-orange transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							className: "size-4 sm:size-5 group-hover:translate-x-1",
							style: { transition: `transform ${customDuration} ${customBezier}` }
						})
					})
				]
			})
		]
	});
}
function ShoppableVideoCarousel({ eyebrow = "FROM THE HIVE", title = "Stories from the Hive", subtitle = "Watch the journey behind every jar and discover how purity begins long before it reaches your home.", category, currentSlug, placementContext = "all", className }) {
	const [videos, setVideos] = (0, import_react.useState)([]);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [isSectionVisible, setIsSectionVisible] = (0, import_react.useState)(false);
	const sectionRef = (0, import_react.useRef)(null);
	const carouselRef = (0, import_react.useRef)(null);
	let isDown = false;
	let startX;
	let scrollLeft;
	(0, import_react.useEffect)(() => {
		let mounted = true;
		Promise.all([fetchHomepageVideos(), fetchProducts()]).then(([videoList, productList]) => {
			if (!mounted) return;
			if (productList.length > 0) setAllProducts(productList);
			setVideos(videoList);
		});
		return () => {
			mounted = false;
		};
	}, []);
	const activeVideos = (0, import_react.useMemo)(() => {
		return videos.filter((v) => {
			if (!v.is_active || v.status !== "published") return false;
			if (placementContext !== "all" && v.placement && v.placement !== "all" && v.placement !== placementContext) return false;
			return true;
		});
	}, [videos, placementContext]);
	const sortedVideos = (0, import_react.useMemo)(() => {
		if (!category && !currentSlug) return activeVideos;
		const catLower = category?.toLowerCase() ?? "";
		const matchesCat = (v) => {
			if (!v.product_slug) return false;
			const prod = allProducts.find((p) => p.slug === v.product_slug);
			if (!prod) return false;
			return prod.category?.toLowerCase() === catLower || prod.flora?.toLowerCase() === catLower || v.title.toLowerCase().includes(catLower) || v.subtitle.toLowerCase().includes(catLower);
		};
		return [...activeVideos].sort((a, b) => {
			const aIsCurrent = a.product_slug === currentSlug;
			const bIsCurrent = b.product_slug === currentSlug;
			if (aIsCurrent && !bIsCurrent) return 1;
			if (!aIsCurrent && bIsCurrent) return -1;
			const aMatch = matchesCat(a);
			const bMatch = matchesCat(b);
			if (aMatch && !bMatch) return -1;
			if (!aMatch && bMatch) return 1;
			return (a.display_order ?? 0) - (b.display_order ?? 0);
		});
	}, [
		activeVideos,
		category,
		currentSlug,
		allProducts
	]);
	(0, import_react.useEffect)(() => {
		const el = sectionRef.current;
		if (!el || typeof IntersectionObserver === "undefined") return;
		const obs = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsSectionVisible(true);
				obs.disconnect();
			}
		}, { threshold: .1 });
		obs.observe(el);
		return () => obs.unobserve(el);
	}, []);
	const handleNextSlide = (0, import_react.useCallback)(() => {
		const track = carouselRef.current;
		if (track) {
			const cardWidth = track.children[0]?.clientWidth || 300;
			track.scrollBy({
				left: cardWidth + 24,
				behavior: "smooth"
			});
		}
	}, []);
	const handlePrevSlide = (0, import_react.useCallback)(() => {
		const track = carouselRef.current;
		if (track) {
			const cardWidth = track.children[0]?.clientWidth || 300;
			track.scrollBy({
				left: -(cardWidth + 24),
				behavior: "smooth"
			});
		}
	}, []);
	const onMouseDown = (e) => {
		const track = carouselRef.current;
		if (!track) return;
		isDown = true;
		track.classList.add("cursor-grabbing");
		track.classList.remove("snap-mandatory");
		startX = e.pageX - track.offsetLeft;
		scrollLeft = track.scrollLeft;
	};
	const onMouseLeave = () => {
		const track = carouselRef.current;
		if (!track) return;
		isDown = false;
		track.classList.remove("cursor-grabbing");
		track.classList.add("snap-mandatory");
	};
	const onMouseUp = () => {
		const track = carouselRef.current;
		if (!track) return;
		isDown = false;
		track.classList.remove("cursor-grabbing");
		track.classList.add("snap-mandatory");
	};
	const onMouseMove = (e) => {
		if (!isDown) return;
		e.preventDefault();
		const track = carouselRef.current;
		if (!track) return;
		const walk = (e.pageX - track.offsetLeft - startX) * 2;
		track.scrollLeft = scrollLeft - walk;
	};
	if (sortedVideos.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		ref: sectionRef,
		className: `py-12 md:py-20 bg-[#F8F5EF] overflow-hidden ${className ?? ""}`,
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
						children: title
					}),
					subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]",
						children: subtitle
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative group",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handlePrevSlide,
						"aria-label": "Previous slide",
						className: "absolute left-2 sm:-left-6 top-[40%] -translate-y-1/2 z-20 size-12 rounded-full border border-border/80 bg-white hover:bg-cream-deep hover:border-burnt-orange text-espresso flex items-center justify-center transition-all shadow-sm hover:scale-105 opacity-0 group-hover:opacity-100 hidden sm:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleNextSlide,
						"aria-label": "Next slide",
						className: "absolute right-2 sm:-right-6 top-[40%] -translate-y-1/2 z-20 size-12 rounded-full border border-border/80 bg-white hover:bg-cream-deep hover:border-burnt-orange text-espresso flex items-center justify-center transition-all shadow-sm hover:scale-105 opacity-0 group-hover:opacity-100 hidden sm:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: carouselRef,
						onMouseDown,
						onMouseLeave,
						onMouseUp,
						onMouseMove,
						className: "flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 pt-4 px-[15vw] sm:px-0 -mx-4 sm:mx-0 cursor-grab active:cursor-grabbing",
						style: { scrollBehavior: "smooth" },
						children: sortedVideos.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppableVideoCard, {
							item,
							product: allProducts.find((p) => p.slug === item.product_slug),
							index: idx,
							isVisible: isSectionVisible
						}, item.id))
					})
				]
			})]
		})
	});
}
//#endregion
export { ShoppableVideoCarousel as t };
