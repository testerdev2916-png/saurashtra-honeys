import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/instagram.functions-Dxd_lCp7.js
var defaultSettings = {
	is_enabled: false,
	post_count: 6,
	instagram_token: null,
	last_synced: null
};
async function fetchFromInstagramAPI(token, limit) {
	const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${token}&limit=${limit}`;
	const response = await fetch(url);
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Instagram API Error: ${response.status} ${errorText}`);
	}
	return ((await response.json()).data || []).map((item) => ({
		id: item.id,
		media_type: item.media_type,
		media_url: item.media_url,
		thumbnail_url: item.thumbnail_url,
		permalink: item.permalink,
		caption: item.caption,
		timestamp: item.timestamp
	}));
}
async function performSync(supabaseClient) {
	const { data: settingsRow } = await supabaseClient.from("app_settings").select("data").eq("id", 1).maybeSingle();
	const data = settingsRow?.data || {};
	const settings = {
		...defaultSettings,
		...data.instagram_settings || {}
	};
	if (!settings.instagram_token) throw new Error("Instagram is not connected.");
	const posts = await fetchFromInstagramAPI(settings.instagram_token, 20);
	const cache = { posts };
	settings.last_synced = (/* @__PURE__ */ new Date()).toISOString();
	const newData = {
		...data,
		instagram_settings: settings,
		instagram_cache: cache
	};
	const { error } = await supabaseClient.from("app_settings").upsert({
		id: 1,
		data: newData,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (error) throw error;
	return {
		ok: true,
		count: posts.length
	};
}
var syncInstagramPosts_createServerFn_handler = createServerRpc({
	id: "c24edb8c9f122a8e931bcdc3011fd2f16b67bc469557851156e359330a814785",
	name: "syncInstagramPosts",
	filename: "src/lib/instagram.functions.ts"
}, (opts) => syncInstagramPosts.__executeServer(opts));
var syncInstagramPosts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(syncInstagramPosts_createServerFn_handler, async ({ context }) => {
	const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!role) throw new Error("Forbidden");
	return await performSync(context.supabase);
});
var getInstagramSettings_createServerFn_handler = createServerRpc({
	id: "187267653995c8da7d5003c15a8125f468d3a1d59a71e67641dc1dab6f6783a2",
	name: "getInstagramSettings",
	filename: "src/lib/instagram.functions.ts"
}, (opts) => getInstagramSettings.__executeServer(opts));
var getInstagramSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getInstagramSettings_createServerFn_handler, async ({ context }) => {
	const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!role) throw new Error("Forbidden");
	const { data: settingsRow } = await context.supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
	const data = settingsRow?.data || {};
	return {
		...defaultSettings,
		...data.instagram_settings || {}
	};
});
var saveInstagramSettings_createServerFn_handler = createServerRpc({
	id: "deaccdd12c6c6b5fa627a6edc751556b1ff41b462a15964fe63a496d09b51c84",
	name: "saveInstagramSettings",
	filename: "src/lib/instagram.functions.ts"
}, (opts) => saveInstagramSettings.__executeServer(opts));
var saveInstagramSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => input).handler(saveInstagramSettings_createServerFn_handler, async ({ data: input, context }) => {
	const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
	if (!role) throw new Error("Forbidden");
	const { data: settingsRow } = await context.supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
	const existingData = settingsRow?.data || {};
	const newSettings = {
		...existingData.instagram_settings || {},
		is_enabled: input.is_enabled,
		post_count: input.post_count,
		instagram_token: input.instagram_token
	};
	const newData = {
		...existingData,
		instagram_settings: newSettings
	};
	if (!input.instagram_token) {
		newData.instagram_cache = { posts: [] };
		newSettings.last_synced = null;
	}
	const { error } = await context.supabase.from("app_settings").upsert({
		id: 1,
		data: newData,
		updated_by: context.userId,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (error) throw error;
	await context.supabase.rpc("log_audit", {
		_action: "instagram.settings_updated",
		_entity_type: "app_settings",
		_entity_id: "1",
		_metadata: {}
	});
	return { ok: true };
});
var getPublicInstagramFeed_createServerFn_handler = createServerRpc({
	id: "a54dd193bc5224094a367d718ddccb37ff0a4f3825575291f08857a428063ae8",
	name: "getPublicInstagramFeed",
	filename: "src/lib/instagram.functions.ts"
}, (opts) => getPublicInstagramFeed.__executeServer(opts));
var getPublicInstagramFeed = createServerFn({ method: "GET" }).handler(getPublicInstagramFeed_createServerFn_handler, async () => {
	const { supabase } = await import("./client-CiOF68Zx.mjs").then((n) => n.t);
	const { data: settingsRow } = await supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
	if (!settingsRow || !settingsRow.data) return {
		settings: defaultSettings,
		posts: []
	};
	const settings = {
		...defaultSettings,
		...settingsRow.data.instagram_settings || {}
	};
	const cache = settingsRow.data.instagram_cache || { posts: [] };
	if (settings.is_enabled && settings.instagram_token) {
		const ONE_DAY = 1440 * 60 * 1e3;
		const lastSyncedTime = settings.last_synced ? new Date(settings.last_synced).getTime() : 0;
		if (Date.now() - lastSyncedTime > ONE_DAY) performSync(supabase).catch((err) => {
			console.error("Background Instagram Sync Failed:", err);
		});
	}
	return {
		settings,
		posts: cache.posts.slice(0, settings.post_count || 6)
	};
});
//#endregion
export { getInstagramSettings_createServerFn_handler, getPublicInstagramFeed_createServerFn_handler, saveInstagramSettings_createServerFn_handler, syncInstagramPosts_createServerFn_handler };
