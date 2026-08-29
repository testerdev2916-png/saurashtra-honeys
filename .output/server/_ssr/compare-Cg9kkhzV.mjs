import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compare-Cg9kkhzV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var KEY = "sh_compare_v1";
var MAX = 4;
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
		localStorage.setItem(KEY, JSON.stringify(list));
	} catch {}
}
function CompareProvider({ children }) {
	const [slugs, setSlugs] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setSlugs(read());
	}, []);
	(0, import_react.useEffect)(() => {
		write(slugs);
	}, [slugs]);
	const add = (0, import_react.useCallback)((s) => {
		setSlugs((prev) => {
			if (prev.includes(s)) return prev;
			if (prev.length >= MAX) {
				toast.info(`You can compare up to ${MAX} products`);
				return prev;
			}
			return [...prev, s];
		});
	}, []);
	const remove = (0, import_react.useCallback)((s) => setSlugs((p) => p.filter((x) => x !== s)), []);
	const toggle = (0, import_react.useCallback)((s) => {
		let out = false;
		setSlugs((prev) => {
			if (prev.includes(s)) {
				out = false;
				return prev.filter((x) => x !== s);
			}
			if (prev.length >= MAX) {
				toast.info(`You can compare up to ${MAX} products`);
				out = false;
				return prev;
			}
			out = true;
			return [...prev, s];
		});
		return out;
	}, []);
	const clear = (0, import_react.useCallback)(() => setSlugs([]), []);
	const value = (0, import_react.useMemo)(() => ({
		slugs,
		count: slugs.length,
		has: (s) => slugs.includes(s),
		add,
		remove,
		toggle,
		clear
	}), [
		slugs,
		add,
		remove,
		toggle,
		clear
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
var FALLBACK = {
	slugs: [],
	count: 0,
	has: () => false,
	add: () => {},
	remove: () => {},
	toggle: () => false,
	clear: () => {}
};
function useCompare() {
	return (0, import_react.useContext)(Ctx) ?? FALLBACK;
}
//#endregion
export { useCompare as n, CompareProvider as t };
