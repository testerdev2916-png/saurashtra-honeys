import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client.server-DL3Csa5z.js
function createSupabaseAdminClient() {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	const KEY_TO_USE = SUPABASE_SECRET_KEY || SUPABASE_SERVICE_ROLE_KEY;
	const isNewSecret = KEY_TO_USE?.startsWith("sb_secret_");
	const isLegacyServiceRole = KEY_TO_USE?.startsWith("eyJ");
	console.log("\n==================================================");
	console.log("TEMPORARY DEVELOPMENT-ONLY DIAGNOSTIC");
	console.log("KEY VARIABLE: " + (SUPABASE_SECRET_KEY ? "SUPABASE_SECRET_KEY" : "SUPABASE_SERVICE_ROLE_KEY"));
	console.log("KEY TYPE: " + (isNewSecret ? "NEW_SECRET" : isLegacyServiceRole ? "LEGACY_SERVICE_ROLE_JWT" : "UNKNOWN"));
	console.log("PREFIX: " + (KEY_TO_USE ? KEY_TO_USE.substring(0, 10) + "..." : "missing"));
	console.log("LENGTH: " + (KEY_TO_USE ? KEY_TO_USE.length : 0));
	console.log("RUNTIME: " + (typeof window === "undefined" ? "SERVER" : "BROWSER"));
	console.log("==================================================\n");
	if (!SUPABASE_URL || !KEY_TO_USE) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!KEY_TO_USE ? ["SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, KEY_TO_USE, {
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (url, options) => {
			return fetch(url, {
				...options,
				signal: options?.signal || AbortSignal.timeout(8e3)
			});
		} }
	});
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
//#endregion
export { supabaseAdmin };
