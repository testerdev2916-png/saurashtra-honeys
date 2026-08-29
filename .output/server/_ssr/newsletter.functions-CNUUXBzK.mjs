import { l as stringType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsletter.functions-CNUUXBzK.js
var emailSchema = stringType().trim().email().max(255).transform((s) => s.toLowerCase());
function token() {
	return crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2, 10);
}
var subscribeNewsletter_createServerFn_handler = createServerRpc({
	id: "d1aab19b2ab28150ceb2b590995b3418b900aba58952db73f4f1c665ca4d5782",
	name: "subscribeNewsletter",
	filename: "src/lib/newsletter.functions.ts"
}, (opts) => subscribeNewsletter.__executeServer(opts));
var subscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((input) => ({
	email: emailSchema.parse(input.email),
	source: (input.source ?? "footer").slice(0, 60)
})).handler(subscribeNewsletter_createServerFn_handler, async ({ data }) => {
	const { supabase } = await import("./client-CiOF68Zx.mjs").then((n) => n.t);
	const confirm = token(), unsub = token();
	const { data: existing } = await supabase.from("newsletter_subscribers").select("id, confirmed_at, unsubscribed_at, confirm_token, unsubscribe_token").eq("email", data.email).maybeSingle();
	if (existing?.confirmed_at && !existing.unsubscribed_at) return {
		ok: true,
		already: true
	};
	if (existing) await supabase.from("newsletter_subscribers").update({
		source: data.source,
		confirm_token: existing.confirm_token ?? confirm,
		unsubscribe_token: existing.unsubscribe_token ?? unsub,
		unsubscribed_at: null
	}).eq("id", existing.id);
	else await supabase.from("newsletter_subscribers").insert({
		email: data.email,
		source: data.source,
		confirm_token: confirm,
		unsubscribe_token: unsub
	});
	return {
		ok: true,
		already: false
	};
});
var confirmNewsletter_createServerFn_handler = createServerRpc({
	id: "9c84b52da68a0e24001f662aa411154d6273e3823202dae3843023521b8e6aa5",
	name: "confirmNewsletter",
	filename: "src/lib/newsletter.functions.ts"
}, (opts) => confirmNewsletter.__executeServer(opts));
var confirmNewsletter = createServerFn({ method: "POST" }).inputValidator((input) => ({ token: String(input.token).slice(0, 128) })).handler(confirmNewsletter_createServerFn_handler, async ({ data }) => {
	const { supabase } = await import("./client-CiOF68Zx.mjs").then((n) => n.t);
	const { data: row } = await supabase.from("newsletter_subscribers").select("id, confirmed_at").eq("confirm_token", data.token).maybeSingle();
	if (!row) throw new Error("Invalid or expired link");
	if (!row.confirmed_at) await supabase.from("newsletter_subscribers").update({ confirmed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", row.id);
	return { ok: true };
});
var unsubscribeNewsletter_createServerFn_handler = createServerRpc({
	id: "429dc75206059fa17a94856c0578c5386836bfd6424fb5094691ff4e3035a305",
	name: "unsubscribeNewsletter",
	filename: "src/lib/newsletter.functions.ts"
}, (opts) => unsubscribeNewsletter.__executeServer(opts));
var unsubscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((input) => ({ token: String(input.token).slice(0, 128) })).handler(unsubscribeNewsletter_createServerFn_handler, async ({ data }) => {
	const { supabase } = await import("./client-CiOF68Zx.mjs").then((n) => n.t);
	const { error } = await supabase.from("newsletter_subscribers").update({ unsubscribed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("unsubscribe_token", data.token);
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { confirmNewsletter_createServerFn_handler, subscribeNewsletter_createServerFn_handler, unsubscribeNewsletter_createServerFn_handler };
