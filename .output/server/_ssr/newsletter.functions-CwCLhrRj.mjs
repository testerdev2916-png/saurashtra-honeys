import { l as stringType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsletter.functions-CwCLhrRj.js
var emailSchema = stringType().trim().email().max(255).transform((s) => s.toLowerCase());
var subscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((input) => ({
	email: emailSchema.parse(input.email),
	source: (input.source ?? "footer").slice(0, 60)
})).handler(createSsrRpc("d1aab19b2ab28150ceb2b590995b3418b900aba58952db73f4f1c665ca4d5782"));
var confirmNewsletter = createServerFn({ method: "POST" }).inputValidator((input) => ({ token: String(input.token).slice(0, 128) })).handler(createSsrRpc("9c84b52da68a0e24001f662aa411154d6273e3823202dae3843023521b8e6aa5"));
var unsubscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((input) => ({ token: String(input.token).slice(0, 128) })).handler(createSsrRpc("429dc75206059fa17a94856c0578c5386836bfd6424fb5094691ff4e3035a305"));
//#endregion
export { subscribeNewsletter as n, unsubscribeNewsletter as r, confirmNewsletter as t };
