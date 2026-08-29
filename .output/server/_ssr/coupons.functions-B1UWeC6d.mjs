import { l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coupons.functions-B1UWeC6d.js
var validateSchema = objectType({
	code: stringType().trim().min(1).max(60),
	subtotal_paise: numberType().int().nonnegative()
});
var validateCouponFn = createServerFn({ method: "POST" }).inputValidator((d) => validateSchema.parse(d)).handler(createSsrRpc("ea0b867a828e5a8f9e2137d2911fd4b1e50406954ad62b300b05b5dadcbe9320"));
var trackSchema = objectType({
	order_number: stringType().trim().min(3).max(60),
	email: stringType().trim().email().max(255)
});
var trackOrderFn = createServerFn({ method: "POST" }).inputValidator((d) => trackSchema.parse(d)).handler(createSsrRpc("0d1301948603582bdc9de858dac3f75272bb8c54a1a8a274f68c24aaa9ba7564"));
//#endregion
export { validateCouponFn as n, trackOrderFn as t };
