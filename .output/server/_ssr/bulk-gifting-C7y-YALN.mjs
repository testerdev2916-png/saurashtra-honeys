import { i as __toESM } from "../_runtime.mjs";
import { f as prod_giftpack_default, o as prod_ajwain_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ShieldCheck, St as Gift, V as Package, b as Sparkles, g as Tag, ht as HeartHandshake, in as ArrowRight, tn as Award } from "../_libs/lucide-react.mjs";
import { r as hero_honey_default } from "./product-images-CLm3Xqgk.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
import { t as Autoplay } from "../_libs/embla-carousel-autoplay.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bulk-gifting-C7y-YALN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BulkGiftingHubPage() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "center",
		skipSnaps: false,
		duration: 60
	}, [Autoplay({
		delay: 3e3,
		stopOnInteraction: true,
		stopOnMouseEnter: true,
		playOnInit: false
	})]);
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!emblaApi) return;
		const autoplay = emblaApi.plugins().autoplay;
		const initTimeout = setTimeout(() => {
			if (autoplay) autoplay.play();
		}, 3e3);
		const resumeAutoplay = () => {
			if (autoplay) autoplay.play();
		};
		let timeoutId;
		const onInteract = () => {
			if (autoplay) autoplay.stop();
			clearTimeout(timeoutId);
			clearTimeout(initTimeout);
			timeoutId = setTimeout(resumeAutoplay, 5e3);
		};
		emblaApi.on("pointerDown", onInteract);
		emblaApi.on("pointerUp", onInteract);
		emblaApi.on("select", () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		});
		return () => {
			emblaApi.off("pointerDown", onInteract);
			emblaApi.off("pointerUp", onInteract);
			clearTimeout(timeoutId);
			clearTimeout(initTimeout);
		};
	}, [emblaApi]);
	const serviceCards = [
		{
			title: "Bulk Orders",
			desc: "Premium wholesale honey solutions for retailers, restaurants and distributors.",
			img: hero_products_default,
			Icon: Package,
			href: "/bulk-orders",
			cta: "Explore Bulk Solutions"
		},
		{
			title: "Corporate Gifting",
			desc: "Luxury gifting solutions crafted to impress employees and clients.",
			img: prod_giftpack_default,
			Icon: Gift,
			href: "/corporate-gifting",
			cta: "View Gifting Solutions"
		},
		{
			title: "Gift Hampers",
			desc: "Curated honey gift hampers for festive, wedding and special occasions.",
			img: hero_honey_default,
			Icon: Sparkles,
			href: "/gift-hampers",
			cta: "Explore Hampers"
		},
		{
			title: "Private Labeling",
			desc: "Launch your own premium honey brand with complete private labeling support.",
			img: prod_ajwain_default,
			Icon: Tag,
			href: "/private-label",
			cta: "Build Your Brand"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([{
			name: "Home",
			url: "/"
		}, {
			name: "Bulk & Gifting",
			url: "/bulk-gifting"
		}]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "bulk-orders" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#FDFBF7]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706] mb-4",
						children: "BUSINESS PARTNERSHIPS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-[34px] sm:text-[44px] md:text-[56px] text-[#2B2118] font-[500] leading-tight mb-6 max-w-4xl mx-auto",
						children: "A Trusted Manufacturer of 100% Pure Natural Honey"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[#6B6257] text-[16px] sm:text-[18px] max-w-2xl mx-auto leading-relaxed",
						children: "We provide end-to-end premium honey solutions for businesses worldwide. Select a service below to explore dedicated offerings, minimum order quantities, and custom solutions tailored for your business."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "py-24 sm:py-32 bg-[#F8F5EF] border-t border-border/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full overflow-hidden",
					ref: emblaRef,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex -ml-4 py-4",
						children: serviceCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-[0_0_82vw] pl-4 min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: card.href,
								className: "group flex flex-col rounded-[26px] overflow-hidden bg-white border border-[#2B2118]/5 shadow-[0_4px_24px_rgba(43,33,24,0.04)] active:shadow-[0_12px_40px_rgba(43,33,24,0.08)] transition-all duration-[300ms] ease-out active:scale-[1.02] h-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-[230px] w-full overflow-hidden relative shrink-0 bg-[#FDFBF7]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: card.img,
										alt: card.title,
										className: "w-full h-full object-cover transition-transform duration-[800ms] ease-out group-active:scale-[1.04]"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-[22px] flex flex-col flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.Icon, {
											className: "size-[22px] text-[#D97706] mb-[14px] shrink-0",
											strokeWidth: 1.5
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-[34px] font-medium leading-[1.1] text-[#2B2118] mb-[12px]",
											children: card.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[#4A453E] text-[17px] leading-[1.6] line-clamp-3 mb-auto",
											children: card.desc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-[18px] flex items-center text-[18px] font-semibold text-[#D97706] transition-colors",
											children: [card.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												className: "ml-1.5 size-4 transition-transform duration-[300ms] ease-out group-active:translate-x-1.5",
												strokeWidth: 2.5
											})]
										})
									]
								})]
							})
						}, card.title))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center gap-2 mt-4",
					children: serviceCards.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? "bg-[#D97706] w-4" : "bg-[#D97706]/20 w-1.5"}`,
						onClick: () => emblaApi?.scrollTo(i),
						"aria-label": `Go to slide ${i + 1}`
					}, i))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page hidden md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-8 max-w-[1400px] mx-auto",
					children: serviceCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: card.href,
						className: "group flex flex-col rounded-[26px] overflow-hidden bg-white border border-[#2B2118]/5 shadow-[0_4px_24px_rgba(43,33,24,0.04)] hover:shadow-[0_12px_40px_rgba(43,33,24,0.08)] transition-all duration-[300ms] ease-out hover:-translate-y-2 lg:h-[480px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-[220px] w-full overflow-hidden relative shrink-0 bg-[#FDFBF7]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: card.img,
								alt: card.title,
								className: "w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-[26px] flex flex-col flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.Icon, {
									className: "size-6 text-[#D97706] mb-4 shrink-0",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[32px] xl:text-[34px] font-medium leading-[1.1] text-[#2B2118] mb-3",
									children: card.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] text-[17px] xl:text-[18px] leading-[1.4] line-clamp-2 mb-auto",
									children: card.desc
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex items-center text-[15px] xl:text-[16px] font-semibold text-[#D97706] group-hover:text-[#B57420] transition-colors",
									children: [card.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
										className: "ml-1.5 size-4 transition-transform duration-[300ms] ease-out group-hover:translate-x-1.5",
										strokeWidth: 2.5
									})]
								})
							]
						})]
					}, card.title))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#2B2118] text-[#FDFBF7]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-[28px] sm:text-[36px] mb-12",
					children: "Why Businesses Trust Us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									className: "size-10 text-[#D97706] mb-4",
									strokeWidth: 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-[18px] mb-2",
									children: "100% Lab Tested"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#FDFBF7]/70 text-[14px]",
									children: "Every batch is independently certified for purity."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
									className: "size-10 text-[#D97706] mb-4",
									strokeWidth: 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-[18px] mb-2",
									children: "Premium Quality"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#FDFBF7]/70 text-[14px]",
									children: "Raw, unfiltered, and packed with natural enzymes."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartHandshake, {
									className: "size-10 text-[#D97706] mb-4",
									strokeWidth: 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-[18px] mb-2",
									children: "End-to-End Support"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#FDFBF7]/70 text-[14px]",
									children: "From harvesting to bespoke packaging, we handle it all."
								})
							]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { BulkGiftingHubPage as component };
