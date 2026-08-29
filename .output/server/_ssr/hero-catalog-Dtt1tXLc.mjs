import { n as supabase } from "./client-CiOF68Zx.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hero-catalog-Dtt1tXLc.js
var fetchPublicHeroRows_createServerFn_handler = createServerRpc({
	id: "8a9bdc3a4066487d682929386bc34b4795485f46a681c01fc836c02b2b401d06",
	name: "fetchPublicHeroRows",
	filename: "src/lib/hero-catalog.tsx"
}, (opts) => fetchPublicHeroRows.__executeServer(opts));
var fetchPublicHeroRows = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ page: stringType() }).parse(d)).handler(fetchPublicHeroRows_createServerFn_handler, async ({ data: { page } }) => {
	try {
		const { data, error } = await supabase.from("hero_slides").select("*").eq("page", page).eq("active", true).order("sort_order", { ascending: true });
		if (data && data.length > 0) return { rows: data };
		if (error && error.code === "42501") {
			const { supabaseAdmin } = await import("./client.server-DL3Csa5z.mjs");
			const { data: adminData, error: adminError } = await supabaseAdmin.from("hero_slides").select("*").eq("page", page).eq("active", true).order("sort_order", { ascending: true });
			if (adminData && adminData.length > 0) return { rows: adminData };
		}
		return { rows: [] };
	} catch (err) {
		console.error("fetchPublicHeroRows error:", err);
		return { rows: [] };
	}
});
//#endregion
export { fetchPublicHeroRows_createServerFn_handler };
