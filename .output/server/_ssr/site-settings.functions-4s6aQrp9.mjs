import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-settings.functions-4s6aQrp9.js
var updateSiteSettings_createServerFn_handler = createServerRpc({
	id: "afc995e6400aa2dc6d12f04a990623f12023f4496bfccbfda32702d28d40d61c",
	name: "updateSiteSettings",
	filename: "src/lib/site-settings.functions.ts"
}, (opts) => updateSiteSettings.__executeServer(opts));
var updateSiteSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(updateSiteSettings_createServerFn_handler, async ({ data, context }) => {
	const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!role) throw new Error("Forbidden");
	const { error } = await context.supabase.from("app_settings").upsert({
		id: 1,
		data: data.data,
		updated_by: context.userId,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (error) throw error;
	await context.supabase.rpc("log_audit", {
		_action: "settings.update",
		_entity_type: "app_settings",
		_entity_id: "1",
		_metadata: {}
	});
	return { ok: true };
});
//#endregion
export { updateSiteSettings_createServerFn_handler };
