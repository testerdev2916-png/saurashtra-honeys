import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ht as ChevronRight, Ut as ChevronLeft, in as ArrowRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HeroSlider-CikMyqvX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HeroSlider({ slides, interval = 6e3, size = "md", variant }) {
	const [i, setI] = (0, import_react.useState)(0);
	const [dir, setDir] = (0, import_react.useState)(1);
	const timer = (0, import_react.useRef)(null);
	const paused = (0, import_react.useRef)(false);
	const touchX = (0, import_react.useRef)(null);
	const go = (n, d = 1) => {
		if (!slides || slides.length <= 1) return;
		setDir(d);
		setI((n + slides.length) % slides.length);
	};
	const next = () => go(i + 1, 1);
	const prev = () => go(i - 1, -1);
	(0, import_react.useEffect)(() => {
		if (paused.current || !slides || slides.length <= 1) return;
		timer.current = setTimeout(() => go(i + 1, 1), interval);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [
		i,
		interval,
		slides?.length
	]);
	const effVariant = variant === "home" || size === "home" || size === "md" ? "home" : "inner";
	const aspectCls = effVariant === "home" ? "aspect-square md:aspect-[1920/700]" : "aspect-square md:aspect-[1920/600]";
	if (!slides || slides.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative w-full max-w-[100vw] overflow-x-hidden bg-[#120E0C]",
		onMouseEnter: () => {
			paused.current = true;
			if (timer.current) clearTimeout(timer.current);
		},
		onMouseLeave: () => {
			paused.current = false;
			setI((v) => v);
		},
		onTouchStart: (e) => {
			touchX.current = e.touches[0].clientX;
		},
		onTouchEnd: (e) => {
			if (touchX.current === null) return;
			const dx = e.changedTouches[0].clientX - touchX.current;
			if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
			touchX.current = null;
		},
		"aria-roledescription": "carousel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `relative w-full ${aspectCls}`,
			children: [slides.map((s, idx) => {
				const isActive = idx === i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": !isActive,
					className: `absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "translate-x-0 opacity-100 z-10" : `${dir === 1 ? "translate-x-full" : "-translate-x-full"} opacity-0 z-0`}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: s.ctaTo || "/",
						params: s.ctaParams,
						className: "absolute inset-0 z-0 block cursor-pointer",
						"aria-label": `Go to ${s.ctaTo || "/"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", {
							className: "w-full h-full block",
							children: [s.mobileImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
								media: "(max-width: 767px)",
								srcSet: s.mobileImage,
								fetchpriority: idx === 0 ? "high" : "auto"
							}, `mob-${s.updatedAt || s.mobileImage}`), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.image,
								alt: s.title,
								className: "w-full h-full object-cover object-center",
								loading: idx === 0 ? "eager" : "lazy",
								fetchpriority: idx === 0 ? "high" : "auto"
							}, `desk-${s.updatedAt || s.image}`)]
						}), effVariant !== "home" && (s.eyebrow || s.description || s.ctaText) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-t from-[#120E0C]/70 via-[#120E0C]/20 to-transparent pointer-events-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-4xl mx-auto space-y-4 md:space-y-6 mt-12 md:mt-0",
								children: [
									s.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-brand-orange drop-shadow-md",
										children: s.eyebrow
									}),
									idx === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-cream drop-shadow-lg leading-tight md:leading-tight",
										children: s.title
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-cream drop-shadow-lg leading-tight md:leading-tight",
										children: s.title
									}),
									s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm md:text-lg text-cream/90 drop-shadow-md max-w-2xl mx-auto leading-relaxed md:leading-relaxed",
										children: s.description
									}),
									s.ctaText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-4 md:pt-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2 bg-brand-orange text-white rounded-full px-6 py-3.5 md:px-8 md:py-4 font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-md transition-transform pointer-events-auto hover:bg-brand-orange-hover hover:scale-[1.02]",
											children: [s.ctaText, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										})
									})
								]
							})
						})]
					})
				}, idx);
			}), slides.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: prev,
					"aria-label": "Previous slide",
					className: "absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 size-[42px] md:size-10 rounded-full bg-cream/15 hover:bg-cream/35 text-cream backdrop-blur-sm flex items-center justify-center transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5 md:size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: next,
					"aria-label": "Next slide",
					className: "absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 size-[42px] md:size-10 rounded-full bg-cream/15 hover:bg-cream/35 text-cream backdrop-blur-sm flex items-center justify-center transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 md:size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2",
					children: slides.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => go(idx, idx > i ? 1 : -1),
						"aria-label": `Go to slide ${idx + 1}`,
						className: `h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-6 bg-burnt-orange" : "w-1.5 bg-cream/40 hover:bg-cream/70"}`
					}, idx))
				})
			] })]
		})
	});
}
//#endregion
export { HeroSlider as t };
