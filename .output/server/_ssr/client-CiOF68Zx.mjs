import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/client-CiOF68Zx.js
var client_exports = /* @__PURE__ */ __exportAll({ supabase: () => supabase });
function createSupabaseClient() {
	return createClient("https://lxdkcqdkfuuqjudsysrr.supabase.co", "sb_publishable_E3rv2tJCU_jTt1wL_TyWDQ_u1_9ztgY", {
		auth: {
			storage: typeof window !== "undefined" ? localStorage : void 0,
			persistSession: true,
			autoRefreshToken: true
		},
		global: { fetch: (url, options) => {
			return fetch(url, {
				...options,
				signal: options?.signal || AbortSignal.timeout(8e3)
			});
		} }
	});
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as n, __exportAll as r, client_exports as t };
