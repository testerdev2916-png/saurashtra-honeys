import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as HeroSlider } from "./HeroSlider-CikMyqvX.mjs";
import { r as getDefaultHeroSlides, t as fetchHeroSlides } from "./hero-catalog-BOSpOcA3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PageHeroSlider-B2niNRj-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PageHeroSlider({ page, interval = 6e3 }) {
	const [slides, setSlides] = (0, import_react.useState)(() => getDefaultHeroSlides(page));
	(0, import_react.useEffect)(() => {
		fetchHeroSlides(page).then(setSlides);
	}, [page]);
	const isHome = page.toLowerCase() === "home";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlider, {
		slides,
		interval,
		size: isHome ? "home" : "inner",
		variant: isHome ? "home" : "inner"
	});
}
//#endregion
export { PageHeroSlider as t };
