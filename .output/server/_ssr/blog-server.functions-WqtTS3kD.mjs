import { l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-server.functions-WqtTS3kD.js
var listInputSchema = objectType({
	cat: stringType().optional(),
	q: stringType().optional(),
	page: numberType().int().min(1).default(1),
	pageSize: numberType().int().min(1).max(50).default(6)
});
var listPublicPosts = createServerFn({ method: "POST" }).inputValidator((d) => listInputSchema.parse(d ?? {})).handler(createSsrRpc("0cfaf7220cff63a51c3ae5ab7da2cc2451720864b3648b5f121249e0a86cc3d8"));
var getPublicPost = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ slug: stringType().min(1) }).parse(d)).handler(createSsrRpc("badbaed50db9ee63acd1c07cb0c3ed3673283ade0fe07678aef5c8400b7cd57f"));
var getPopularPosts = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ limit: numberType().int().min(1).max(20).default(4) }).parse(d ?? {})).handler(createSsrRpc("f33819409bfcb08e2f5262fb20573c50f92b6b267a72858fb2e1cc6bd452a7de"));
var getFeaturedPost = createServerFn({ method: "POST" }).handler(createSsrRpc("4523effac57ea3a11fd1e91b0267c2366ff2d10e8b65098e5265810ca51b19ab"));
//#endregion
export { listPublicPosts as i, getPopularPosts as n, getPublicPost as r, getFeaturedPost as t };
