import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/instagram.functions-CZs_jpgy.js
var syncInstagramPosts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c24edb8c9f122a8e931bcdc3011fd2f16b67bc469557851156e359330a814785"));
var getInstagramSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("187267653995c8da7d5003c15a8125f468d3a1d59a71e67641dc1dab6f6783a2"));
var saveInstagramSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((input) => input).handler(createSsrRpc("deaccdd12c6c6b5fa627a6edc751556b1ff41b462a15964fe63a496d09b51c84"));
var getPublicInstagramFeed = createServerFn({ method: "GET" }).handler(createSsrRpc("a54dd193bc5224094a367d718ddccb37ff0a4f3825575291f08857a428063ae8"));
//#endregion
export { syncInstagramPosts as i, getPublicInstagramFeed as n, saveInstagramSettings as r, getInstagramSettings as t };
