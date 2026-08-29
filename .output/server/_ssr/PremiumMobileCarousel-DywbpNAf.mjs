import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
import { t as Autoplay } from "../_libs/embla-carousel-autoplay.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PremiumMobileCarousel-DywbpNAf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PremiumMobileCarousel({ items, renderItem, slideClassName = "flex-[0_0_86vw]", containerClassName = "pb-4" }) {
	if (!items || items.length === 0) return null;
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "start",
		duration: 60,
		skipSnaps: false
	}, [Autoplay({
		delay: 3e3,
		stopOnInteraction: true,
		playOnInit: false
	})]);
	(0, import_react.useEffect)(() => {
		if (!emblaApi) return;
		const autoplay = emblaApi.plugins().autoplay;
		if (!autoplay) return;
		const initTimeout = setTimeout(() => {
			autoplay.play();
		}, 3e3);
		const resumeAutoplay = () => {
			autoplay.play();
		};
		let timeoutId;
		const onInteract = () => {
			autoplay.stop();
			clearTimeout(timeoutId);
			clearTimeout(initTimeout);
			timeoutId = setTimeout(resumeAutoplay, 5e3);
		};
		emblaApi.on("pointerDown", onInteract);
		emblaApi.on("pointerUp", onInteract);
		return () => {
			emblaApi.off("pointerDown", onInteract);
			emblaApi.off("pointerUp", onInteract);
			clearTimeout(timeoutId);
			clearTimeout(initTimeout);
		};
	}, [emblaApi]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `overflow-hidden w-full -mx-4 px-4 sm:mx-0 sm:px-0 ${containerClassName}`,
		ref: emblaRef,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex touch-pan-y cursor-grab active:cursor-grabbing pb-2",
			style: { marginLeft: "-16px" },
			children: items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${slideClassName} min-w-0 pl-[16px]`,
				children: renderItem(item, idx)
			}, idx))
		})
	});
}
//#endregion
export { PremiumMobileCarousel as t };
