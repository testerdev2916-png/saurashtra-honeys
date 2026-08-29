import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recently-viewed-vyH4vNwq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var KEY = "sh_recent_v1";
var MAX = 12;
function read() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function write(list) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
	} catch {}
	try {
		window.dispatchEvent(new Event("sh:recent-changed"));
	} catch {}
}
function pushRecent(slug) {
	write([slug, ...read().filter((s) => s !== slug)]);
}
function useRecentlyViewed(excludeSlug) {
	const [slugs, setSlugs] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const load = () => setSlugs(read());
		load();
		const listener = () => load();
		window.addEventListener("sh:recent-changed", listener);
		window.addEventListener("storage", listener);
		return () => {
			window.removeEventListener("sh:recent-changed", listener);
			window.removeEventListener("storage", listener);
		};
	}, []);
	const clear = (0, import_react.useCallback)(() => write([]), []);
	return {
		slugs: excludeSlug ? slugs.filter((s) => s !== excludeSlug) : slugs,
		clear
	};
}
//#endregion
export { useRecentlyViewed as n, pushRecent as t };
