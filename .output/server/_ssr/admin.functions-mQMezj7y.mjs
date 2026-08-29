import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-mQMezj7y.js
var claimAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("420039d888d6f92ecb02d2e25a67a5644d3a2ad34e92c5fcd0204779278c07c3"));
var listSchema = objectType({
	form_type: stringType().optional(),
	q: stringType().optional(),
	status: stringType().optional(),
	from: stringType().optional(),
	to: stringType().optional()
});
var listSubmissions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => listSchema.parse(d)).handler(createSsrRpc("49238202c15f88de4491aa5f73217eeb7e434a69e1077a396c9d5d222f186eeb"));
var getSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("dcb2553e413e70f4eb4c9f440a2da5b1461d5f638bc7b193aa6fb2bc2e5b3cbd"));
var updateSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: stringType().max(40).optional(),
	admin_notes: stringType().max(4e3).optional()
}).parse(d)).handler(createSsrRpc("3126ec8be8c0adbc963c1c3ed3f7de2748634b474f3710552268770859c691d4"));
var listOrders = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("417c9a43e3b2c8a52369c51aeba4e0a3cfd0fcc464e265d473e113f9511a245b"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: stringType().max(40).optional(),
	admin_notes: stringType().max(4e3).optional()
}).parse(d)).handler(createSsrRpc("fcf97b38ffe3f8999f4795b9252aa918a4ac5e567faed6d92c78b19efe212dc9"));
//#endregion
export { updateSubmission as a, listSubmissions as i, getSubmission as n, listOrders as r, claimAdmin as t };
