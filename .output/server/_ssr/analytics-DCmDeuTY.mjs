import { n as __exportAll } from "../_runtime.mjs";
import { r as __exportAll$1 } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-DCmDeuTY.js
var analytics_DCmDeuTY_exports = /* @__PURE__ */ __exportAll({
	n: () => toItem,
	r: () => track,
	t: () => analytics_exports
});
var analytics_exports = /* @__PURE__ */ __exportAll$1({
	toItem: () => toItem,
	track: () => track
});
var seen = /* @__PURE__ */ new Map();
var WINDOW_MS = 1500;
function fingerprint(name, params) {
	return JSON.stringify({
		n: name,
		id: params.transaction_id ?? params.item_id ?? params.search_term ?? null,
		list: params.item_list_name ?? null,
		v: params.value ?? null,
		q: params.items?.length ?? null
	});
}
function track(name, params = {}) {
	if (typeof window === "undefined") return;
	const key = fingerprint(name, params);
	const now = Date.now();
	if (now - (seen.get(key) ?? 0) < WINDOW_MS) return;
	seen.set(key, now);
	window.dataLayer = window.dataLayer || [];
	const payload = {
		event: name,
		...params,
		_ts: now
	};
	window.dataLayer.push(payload);
	try {
		window.dispatchEvent(new CustomEvent(`analytics:${name}`, { detail: payload }));
	} catch {}
}
function toItem(p, opts = {}) {
	return {
		item_id: p.slug,
		item_name: p.name,
		item_category: p.category,
		item_variant: opts.size,
		price: p.price,
		quantity: opts.qty ?? 1
	};
}
//#endregion
export { toItem as n, track as r, analytics_DCmDeuTY_exports as t };
