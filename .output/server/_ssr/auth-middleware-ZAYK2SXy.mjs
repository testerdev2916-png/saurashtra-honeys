import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-ZAYK2SXy.js
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	if (token.split(".").length !== 3) throw new Error("Unauthorized: Invalid token");
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: {
			headers: { Authorization: `Bearer ${token}` },
			fetch: (url, options) => {
				const headers = new Headers(options?.headers);
				headers.set("Authorization", `Bearer ${token}`);
				const signal = options?.signal || AbortSignal.timeout(8e3);
				return fetch(url, {
					...options,
					headers,
					signal
				});
			}
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data: { user }, error } = await supabase.auth.getUser(token);
	if (error || !user) throw new Error("Unauthorized: Invalid token");
	return next({ context: {
		supabase,
		userId: user.id
	} });
});
//#endregion
export { requireSupabaseAuth as t };
