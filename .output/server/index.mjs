globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/1.jpg": {
		"type": "image/jpeg",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-29T12:39:49.106Z",
		"size": 20373,
		"path": "../public/1.jpg"
	},
	"/manifest.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"168-xDvWZNayMoaKWy/XBMym91PrzAA\"",
		"mtime": "2026-08-29T12:39:49.099Z",
		"size": 360,
		"path": "../public/manifest.webmanifest"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"72-7o00auaIq94mzjpiZDkMkVIjshg\"",
		"mtime": "2026-08-29T12:39:49.099Z",
		"size": 114,
		"path": "../public/robots.txt"
	},
	"/service-worker.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"281-HZnySJ6l+N8KxMipvLHPyOq9V1g\"",
		"mtime": "2026-08-29T12:39:49.099Z",
		"size": 641,
		"path": "../public/service-worker.js"
	},
	"/sw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"281-HZnySJ6l+N8KxMipvLHPyOq9V1g\"",
		"mtime": "2026-08-29T12:39:49.099Z",
		"size": 641,
		"path": "../public/sw.js"
	},
	"/assets/PageHeroSlider-tG5_VxVd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-RtSwIyTeWXig9m8miD2cHKxpCkw\"",
		"mtime": "2026-08-29T12:39:47.154Z",
		"size": 424,
		"path": "../public/assets/PageHeroSlider-tG5_VxVd.js"
	},
	"/assets/Layout-DJ7VU_l4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"84a5-OcIsciIlUkniyT69NCawms1xfDI\"",
		"mtime": "2026-08-29T12:39:47.154Z",
		"size": 33957,
		"path": "../public/assets/Layout-DJ7VU_l4.js"
	},
	"/assets/HeroSlider-CiyfR1FQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"121d-KUTMcyV6tyvt+mQWvVityoS7wVQ\"",
		"mtime": "2026-08-29T12:39:47.154Z",
		"size": 4637,
		"path": "../public/assets/HeroSlider-CiyfR1FQ.js"
	},
	"/assets/ProductCard-B61iZV__.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16b4-hrBHZgw383QrQhHyU+p7vz7wuc4\"",
		"mtime": "2026-08-29T12:39:47.154Z",
		"size": 5812,
		"path": "../public/assets/ProductCard-B61iZV__.js"
	},
	"/assets/PremiumMobileCarousel-CvNEiTRs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"425-lCUUkJMz5CNFly4vzXRv+Ty7lIw\"",
		"mtime": "2026-08-29T12:39:47.154Z",
		"size": 1061,
		"path": "../public/assets/PremiumMobileCarousel-CvNEiTRs.js"
	},
	"/assets/QueryClientProvider-CG6SnrzA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17c-K7hCorjVuATONVYq6HFxgDZC3ok\"",
		"mtime": "2026-08-29T12:39:47.154Z",
		"size": 380,
		"path": "../public/assets/QueryClientProvider-CG6SnrzA.js"
	},
	"/assets/ShopPage-lgmp7ogO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39ca-lHrG0iDMwDn2z++xuLAxSGu7Ofw\"",
		"mtime": "2026-08-29T12:39:47.155Z",
		"size": 14794,
		"path": "../public/assets/ShopPage-lgmp7ogO.js"
	},
	"/saurashtra-honey-logo-complete.png": {
		"type": "image/png",
		"etag": "\"36b93-UuHUjsHgnmL3l5zgtKIVIU0dmx8\"",
		"mtime": "2026-08-29T12:39:49.115Z",
		"size": 224147,
		"path": "../public/saurashtra-honey-logo-complete.png"
	},
	"/assets/ShoppableVideoCarousel-vVvMS0A_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b01-jv+GZSfFIQQwD4YIns5fGLyZO+s\"",
		"mtime": "2026-08-29T12:39:47.155Z",
		"size": 11009,
		"path": "../public/assets/ShoppableVideoCarousel-vVvMS0A_.js"
	},
	"/assets/StructuredData-CYHr4v4h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"481-ZdBIimsSCYY0rHXNnxr6ACR0csE\"",
		"mtime": "2026-08-29T12:39:47.155Z",
		"size": 1153,
		"path": "../public/assets/StructuredData-CYHr4v4h.js"
	},
	"/assets/QuickView-DopS6o5T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"173d-ZK0/PJNdE/CUekw7wWaCV08TpXY\"",
		"mtime": "2026-08-29T12:39:47.155Z",
		"size": 5949,
		"path": "../public/assets/QuickView-DopS6o5T.js"
	},
	"/assets/admin-catalog.functions-pW6O80BU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"626-nTIDunKwD8EcSEPY9tL9VwnlQnc\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 1574,
		"path": "../public/assets/admin-catalog.functions-pW6O80BU.js"
	},
	"/assets/admin-BKaKeBZO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e2d-ZLl+/+suC1zKH5tSwfjE14JNkxg\"",
		"mtime": "2026-08-29T12:39:47.155Z",
		"size": 7725,
		"path": "../public/assets/admin-BKaKeBZO.js"
	},
	"/assets/admin-cms.functions-CbyPLKco.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed1-K6y10y79NrXVld2rkEp25SuO35c\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 3793,
		"path": "../public/assets/admin-cms.functions-CbyPLKco.js"
	},
	"/assets/account-CTYfjfi4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"719f-pAjiHGxRIPwXh6YhEEjqIFJLU1I\"",
		"mtime": "2026-08-29T12:39:47.155Z",
		"size": 29087,
		"path": "../public/assets/account-CTYfjfi4.js"
	},
	"/assets/admin.audit-B7kkagK8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af3-ic38TL6rzu/RyJaGU0F3ba6ekIE\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 2803,
		"path": "../public/assets/admin.audit-B7kkagK8.js"
	},
	"/assets/admin.blog-D6xzcQ6D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34bf-Kjy1dSYCJ3IahieTOuq/e1Ap6g4\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 13503,
		"path": "../public/assets/admin.blog-D6xzcQ6D.js"
	},
	"/assets/admin.categories-BBWY3_yS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20fa-xCaMC2E3yjvPlLCgzVdj42dikwM\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 8442,
		"path": "../public/assets/admin.categories-BBWY3_yS.js"
	},
	"/assets/admin.coupons-Bt_bHDmf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a1d-+9zRyhWtqcJxBqKIQezjLifMr0g\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 6685,
		"path": "../public/assets/admin.coupons-Bt_bHDmf.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"15756c-BU05JzPXK/AcFX6OLM+3ppj6Hyg\"",
		"mtime": "2026-08-29T12:39:49.097Z",
		"size": 1406316,
		"path": "../public/favicon.ico"
	},
	"/assets/admin.functions-D-vYrcI1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33b-CyOUytvw0ZulcO1h6lZvCta8+bY\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 827,
		"path": "../public/assets/admin.functions-D-vYrcI1.js"
	},
	"/assets/admin.homepage-DK2jeySL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3076-sqVW4w2MxPE6+8/QTzGCOqUJRbQ\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 12406,
		"path": "../public/assets/admin.homepage-DK2jeySL.js"
	},
	"/assets/admin.hero-DV-0lUJ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"398a-r0mD/O64iU27YAjIaHBT/9b/0TM\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 14730,
		"path": "../public/assets/admin.hero-DV-0lUJ8.js"
	},
	"/assets/admin.customers-DH4nIVlm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c1-+7IvRO+oTLg5j1KDp5ofWSnk7Ag\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 5313,
		"path": "../public/assets/admin.customers-DH4nIVlm.js"
	},
	"/assets/admin.homepage_.announcements-YzQrHs-9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17a1-bgnyyVHhhbjTL1XVUH0e/HRKF3A\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 6049,
		"path": "../public/assets/admin.homepage_.announcements-YzQrHs-9.js"
	},
	"/assets/admin.homepage_.products-Dbd_5xAd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1401-tzNXloQH56A142/yPT7lhdZ0F3c\"",
		"mtime": "2026-08-29T12:39:47.157Z",
		"size": 5121,
		"path": "../public/assets/admin.homepage_.products-Dbd_5xAd.js"
	},
	"/assets/admin.homepage_.categories-CNsqm-aH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1416-Ytnrw2COX4yre4m9hvD1HwPjn00\"",
		"mtime": "2026-08-29T12:39:47.156Z",
		"size": 5142,
		"path": "../public/assets/admin.homepage_.categories-CNsqm-aH.js"
	},
	"/assets/admin.inventory-B4f7XWBV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2f-6ZRbkKQIoqf6LGDcR14SAoi6DHY\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 3375,
		"path": "../public/assets/admin.inventory-B4f7XWBV.js"
	},
	"/assets/admin.loyalty-1qhitEOn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7cf-yoYLvrrDqGOnhS7vlJZs2pjp3Pw\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 1999,
		"path": "../public/assets/admin.loyalty-1qhitEOn.js"
	},
	"/assets/admin.media-BPEn0rzi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"125a-YO7CYbNWbMlf3+LCnS1sVQQG08Y\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 4698,
		"path": "../public/assets/admin.media-BPEn0rzi.js"
	},
	"/assets/admin.marketing-Ds4hOAjx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18a9-61TMpF3zKVNohrRY6T3WIsu+dqg\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 6313,
		"path": "../public/assets/admin.marketing-Ds4hOAjx.js"
	},
	"/assets/admin.migrate-catalog-Bzjutno0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36e-gWA2HaNmO/Q72Lqj5rsJsxMIzTM\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 878,
		"path": "../public/assets/admin.migrate-catalog-Bzjutno0.js"
	},
	"/assets/admin.newsletter-BoX7zlzw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cdf-BERNYL4+zBE9CC9F2xlfTr/KR5E\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 3295,
		"path": "../public/assets/admin.newsletter-BoX7zlzw.js"
	},
	"/assets/admin.instagram-Bee8JmEb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10dbb-pfuERRMf1kIlk6jkKWdbTWhVJ8w\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 69051,
		"path": "../public/assets/admin.instagram-Bee8JmEb.js"
	},
	"/assets/admin.orders-szBR6EsA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2483-nT9KUnm84Mk3f6huQy4EHdu5vLI\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 9347,
		"path": "../public/assets/admin.orders-szBR6EsA.js"
	},
	"/assets/admin.redirects-XCvc7WUj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed9-gVSw4130WtSLPuFUVD+xbl7dNn8\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 3801,
		"path": "../public/assets/admin.redirects-XCvc7WUj.js"
	},
	"/assets/admin.reviews-ZYJ-A2Dl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1487-CKtYSUFTOEG1OhVAc+b5ryAfAb0\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 5255,
		"path": "../public/assets/admin.reviews-ZYJ-A2Dl.js"
	},
	"/assets/admin.products-DhNjtXm3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ac9-kxJxda2deK8phm8fC3FuM7vQU1E\"",
		"mtime": "2026-08-29T12:39:47.158Z",
		"size": 39625,
		"path": "../public/assets/admin.products-DhNjtXm3.js"
	},
	"/assets/admin.settings-DsK5j4E7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"129e-fxOUiXPwsrLcvzCsyLJG1X/Mt9E\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 4766,
		"path": "../public/assets/admin.settings-DsK5j4E7.js"
	},
	"/assets/admin.stories-KRDvAQHr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f8c-Xsf4xus3du7UzuuppnSHPvo+S8k\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 16268,
		"path": "../public/assets/admin.stories-KRDvAQHr.js"
	},
	"/assets/admin.submissions-BAEau6MA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e54-G8/tdmuct7OYr38tJVgt6+YBmeQ\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 7764,
		"path": "../public/assets/admin.submissions-BAEau6MA.js"
	},
	"/assets/admin.users-DWSkMxFJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d17-cKsyw90E/wSuVCRCn6wVqfvSgb4\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 3351,
		"path": "../public/assets/admin.users-DWSkMxFJ.js"
	},
	"/assets/admin.index-C3RmcK5e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5de3d-ot+fkG73cDlrni9SD5Y9VKueu14\"",
		"mtime": "2026-08-29T12:39:47.157Z",
		"size": 384573,
		"path": "../public/assets/admin.index-C3RmcK5e.js"
	},
	"/assets/admin.homepage_.trust-CvC-t209.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ec0f-tkxpJE+LorXcTVw1WTNWoeDkijY\"",
		"mtime": "2026-08-29T12:39:47.157Z",
		"size": 584719,
		"path": "../public/assets/admin.homepage_.trust-CvC-t209.js"
	},
	"/assets/admin.who-we-supply-uIFb8D9G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b99-gAGCKz488FhYIZCie5MAh3cEBP8\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 11161,
		"path": "../public/assets/admin.who-we-supply-uIFb8D9G.js"
	},
	"/assets/arrow-down--c36GQE-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-BV6cmHBF5s/kjc97CSptY5pMDTk\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 165,
		"path": "../public/assets/arrow-down--c36GQE-.js"
	},
	"/assets/auth-B1GNcC6j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3db-2gyV4A6sGo8dThy4G9Rcqat0p20\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 987,
		"path": "../public/assets/auth-B1GNcC6j.js"
	},
	"/assets/auth-jMp4Bigi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1798-zUfQDKOX8ABGsBWJk86hyK+p9EM\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 6040,
		"path": "../public/assets/auth-jMp4Bigi.js"
	},
	"/assets/auth_.callback-CCkCQLyY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fe-zma/ybhIrBsu/IXZ2uIjNjn/zzo\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 766,
		"path": "../public/assets/auth_.callback-CCkCQLyY.js"
	},
	"/assets/become-a-partner-BbhL0o_T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35b0-tcv4d0NoWLr20dJy/Kif1zlrc9g\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 13744,
		"path": "../public/assets/become-a-partner-BbhL0o_T.js"
	},
	"/assets/award-ClWNtJgY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"112-8yvjLE2k/kIzYbnCZB4P2CDSLg0\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 274,
		"path": "../public/assets/award-ClWNtJgY.js"
	},
	"/assets/bee-farm-CSAQQXe0.jpg": {
		"type": "image/jpeg",
		"etag": "\"4ecf3-s9ABAuCl/77x7w6DRxprD6kk27I\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 322803,
		"path": "../public/assets/bee-farm-CSAQQXe0.jpg"
	},
	"/assets/bee-flower-Hdp8N4bx.jpg": {
		"type": "image/jpeg",
		"etag": "\"1637c-ZVuleyEcQC6ZvtndTt0nAXmLKwE\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 91004,
		"path": "../public/assets/bee-flower-Hdp8N4bx.jpg"
	},
	"/assets/blog-client-helpers-fkWAG_RX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e5b-rWnMmnkWcOIEmVsm2I4S/FeYEvQ\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 3675,
		"path": "../public/assets/blog-client-helpers-fkWAG_RX.js"
	},
	"/assets/arrow-up-ByGWnFMG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-gX5Wx81yrQVfVuZ4u8g5jPvzKZo\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 162,
		"path": "../public/assets/arrow-up-ByGWnFMG.js"
	},
	"/assets/blog-gr66Jrhu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3446-2vxAIYRAxjwEpKvrwzIv+llNbAw\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 13382,
		"path": "../public/assets/blog-gr66Jrhu.js"
	},
	"/assets/arrow-right-Esva9Yfm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-aztb+ewPOxrZ9Yd6VeAfWWP/H6I\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 165,
		"path": "../public/assets/arrow-right-Esva9Yfm.js"
	},
	"/assets/blog._slug-uV4lJbrO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d9-wdJ+FxTRHZ1twCKUc4tMTYghjDQ\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 473,
		"path": "../public/assets/blog._slug-uV4lJbrO.js"
	},
	"/assets/blog._slug-Bz6mda44.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25d7-nw7Kdijds8xwCtwgOhn/TR2WDoo\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 9687,
		"path": "../public/assets/blog._slug-Bz6mda44.js"
	},
	"/assets/blog._slug-CMm_Xv6M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c5-8Zz+1RU5b/9aPPEm7oBbYzIAKZY\"",
		"mtime": "2026-08-29T12:39:47.160Z",
		"size": 709,
		"path": "../public/assets/blog._slug-CMm_Xv6M.js"
	},
	"/assets/bookmark-plus-Db2Zi8u6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a6-AYlcFljZ3Q67spPTMNQVwwLaf8c\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 422,
		"path": "../public/assets/bookmark-plus-Db2Zi8u6.js"
	},
	"/assets/bulk-gifting-BbKozsuV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e62-CKbrjDp5vSRJwR7x3sRJBUOn1lQ\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 7778,
		"path": "../public/assets/bulk-gifting-BbKozsuV.js"
	},
	"/assets/bulk-orders-B_UBM0b9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31ca-fZk7RLPiXQJyoUZQL79VqK96iHU\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 12746,
		"path": "../public/assets/bulk-orders-B_UBM0b9.js"
	},
	"/assets/calendar-CitE7p4T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-LU+hxxR3k9uYByH6vRw22tB+q6E\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 257,
		"path": "../public/assets/calendar-CitE7p4T.js"
	},
	"/assets/check-CcMbXSy4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c-ARgkDtqFnVnagd9yZcdbrtCPPTE\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 124,
		"path": "../public/assets/check-CcMbXSy4.js"
	},
	"/assets/book-open--RRf9aY-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-d+qgW31qRxp75+vX8YmJRaRZtyQ\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 279,
		"path": "../public/assets/book-open--RRf9aY-.js"
	},
	"/assets/checkout-BiMHgqbo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4280-smNzpe+CGE18v+Ese5qzIhwP0KY\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 17024,
		"path": "../public/assets/checkout-BiMHgqbo.js"
	},
	"/assets/arrow-left-tiZSUJ1X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-Y8Nuq/lbWQM2PRKDtRPK0pOBNz8\"",
		"mtime": "2026-08-29T12:39:47.159Z",
		"size": 165,
		"path": "../public/assets/arrow-left-tiZSUJ1X.js"
	},
	"/assets/chevron-left-42snmjQ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-uAP+2iMRllIOONX9SFFzEKfKqcc\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 130,
		"path": "../public/assets/chevron-left-42snmjQ_.js"
	},
	"/assets/circle-alert-BK1Wwj4H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa-fPoV05ZrUN87A+5B6rFgc2m2sHM\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 250,
		"path": "../public/assets/circle-alert-BK1Wwj4H.js"
	},
	"/assets/circle-check-Dg87QLw6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-531zjo1trqYIIwZ3wvPog4GIadw\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 178,
		"path": "../public/assets/circle-check-Dg87QLw6.js"
	},
	"/assets/client-CScxguia.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c87-jwjy4oNOR33wldKE4iUO2qeRc7I\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 208007,
		"path": "../public/assets/client-CScxguia.js"
	},
	"/assets/collections._slug-Ciiz7R_J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31b3-oX7ivOyxPIuguTDaI95ADdDh9Hk\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 12723,
		"path": "../public/assets/collections._slug-Ciiz7R_J.js"
	},
	"/assets/collections.index-B2vfeztm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee2-Yvkaus6UD6ZKo3Lib75KccgYpHU\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 3810,
		"path": "../public/assets/collections.index-B2vfeztm.js"
	},
	"/assets/compare-B-a3F2bN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1af8-J3pqBQlXv+60/FT/SDViVwNRV7A\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 6904,
		"path": "../public/assets/compare-B-a3F2bN.js"
	},
	"/assets/contact-D1pK3zbZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34e4-C4juZ9tE88kKftCsC4QRxYFPytk\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 13540,
		"path": "../public/assets/contact-D1pK3zbZ.js"
	},
	"/assets/copy-I2_zptiW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-UKtqBq7QFulVeDQhxDp/59DSv7M\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 236,
		"path": "../public/assets/copy-I2_zptiW.js"
	},
	"/assets/corporate-gifting-Ki2Z7yag.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"348a-8fa717a/yZFnGMnPLHF/ZoitM5Q\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 13450,
		"path": "../public/assets/corporate-gifting-Ki2Z7yag.js"
	},
	"/assets/clock-kdf4y9rz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-mqC7yPME2LxSRgp2xmLpzAGSWp4\"",
		"mtime": "2026-08-29T12:39:47.161Z",
		"size": 169,
		"path": "../public/assets/clock-kdf4y9rz.js"
	},
	"/assets/createLucideIcon-Cn7UCYIz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b2-n47QWraKYCahgqm/gYl3aSLfdfY\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 1202,
		"path": "../public/assets/createLucideIcon-Cn7UCYIz.js"
	},
	"/assets/credit-card-BINAaZsK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf-drmpQB8Ly/IXsm+TFYcvQPenI6Y\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 207,
		"path": "../public/assets/credit-card-BINAaZsK.js"
	},
	"/assets/createServerFn-Dr7KzJlB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b2f-0BuDRcLhDkjQtiKsXAB3/ZtZKrw\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 35631,
		"path": "../public/assets/createServerFn-Dr7KzJlB.js"
	},
	"/assets/dist-ZkLKsf7s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f41-7Zeub+VSaQ6AKhSuA3OUR2cXuq0\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 32577,
		"path": "../public/assets/dist-ZkLKsf7s.js"
	},
	"/assets/download-MZRDYg_A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-wClM2pnk/HsEAFWrcyf4HDCbM74\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 232,
		"path": "../public/assets/download-MZRDYg_A.js"
	},
	"/assets/embla-carousel-autoplay.esm-5elf5gND.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53b5-iJPwEP6IOK16DnImAIDxQHsyvQ0\"",
		"mtime": "2026-08-29T12:39:47.162Z",
		"size": 21429,
		"path": "../public/assets/embla-carousel-autoplay.esm-5elf5gND.js"
	},
	"/assets/eye-Coz-PiEC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"100-O5S8gKT1gh7Rep11fMk4jeHkQbI\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 256,
		"path": "../public/assets/eye-Coz-PiEC.js"
	},
	"/assets/eye-off-BPvxdUIA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"274-jOZfHUX0mxO+ybT90LbT81MMdVk\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 628,
		"path": "../public/assets/eye-off-BPvxdUIA.js"
	},
	"/assets/factory-BbQ9mPEX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a8-XnC0gOo6rGMSBlrhd+1i9Y7cfdo\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 1192,
		"path": "../public/assets/factory-BbQ9mPEX.js"
	},
	"/assets/family-honey-DHvjIJcc.jpg": {
		"type": "image/jpeg",
		"etag": "\"37751-MWA2BjqZVudHC66dxEbY+c0Offg\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 227153,
		"path": "../public/assets/family-honey-DHvjIJcc.jpg"
	},
	"/assets/gift-hampers-C_5uRwS-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"350c-BVM5FUCWO6SXcBLxT6MInunWb6w\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 13580,
		"path": "../public/assets/gift-hampers-C_5uRwS-.js"
	},
	"/assets/forgot-password-BqTN3Fa6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"795-B0adG9vvl2zkRaFHv6YKW38UYEI\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 1941,
		"path": "../public/assets/forgot-password-BqTN3Fa6.js"
	},
	"/assets/gift-pa-3nAIv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d-P/YYpF7Gk5fraC+7NhfGjTG2QWU\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 349,
		"path": "../public/assets/gift-pa-3nAIv.js"
	},
	"/assets/git-compare-U8Eag3wE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11d-NaKkJhGbkMafHhmzGuDWxDUiIgA\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 285,
		"path": "../public/assets/git-compare-U8Eag3wE.js"
	},
	"/assets/headphones-CoXLvQrE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47e-sFYMh3v091T7OnbFw+di80Dh5hg\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 1150,
		"path": "../public/assets/headphones-CoXLvQrE.js"
	},
	"/assets/heart-handshake-B0_pmNja.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ca-i0E5NS6kQ+eIVNgBtFl0uN1tj64\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 458,
		"path": "../public/assets/heart-handshake-B0_pmNja.js"
	},
	"/assets/hero-catalog-CMXgX-qR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38d-SVEKFJaHBxGrxm0sbdCJxmlk/es\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 909,
		"path": "../public/assets/hero-catalog-CMXgX-qR.js"
	},
	"/assets/homepage-cms.functions-YcWjUTYZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd8-OKMtTjyOvF4oCRINXzmVVSDaxs4\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 3544,
		"path": "../public/assets/homepage-cms.functions-YcWjUTYZ.js"
	},
	"/assets/honey-drizzle-Bik8s8kE.jpg": {
		"type": "image/jpeg",
		"etag": "\"1ca34-6kreYvJNS/QojUN/iQ9Uub27aCM\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 117300,
		"path": "../public/assets/honey-drizzle-Bik8s8kE.jpg"
	},
	"/assets/hero-products-B5fLLBzL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a-h2WL7akj8ibMY65gjBd7yv0rxcI\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 58,
		"path": "../public/assets/hero-products-B5fLLBzL.js"
	},
	"/assets/hero-products-Dvn7VLJs.jpg": {
		"type": "image/jpeg",
		"etag": "\"2cc48-INkRzAdeWyHhGJjo0d4tHVfhcrM\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 183368,
		"path": "../public/assets/hero-products-Dvn7VLJs.jpg"
	},
	"/assets/image-Bl-n4tDm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10d-+V478K6owJshuR8gaCH1yTs9O9U\"",
		"mtime": "2026-08-29T12:39:47.163Z",
		"size": 269,
		"path": "../public/assets/image-Bl-n4tDm.js"
	},
	"/assets/image-off-KohgxvPr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d7-w/dOxB1ssSXMPSgiSab5xXX3UZI\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 471,
		"path": "../public/assets/image-off-KohgxvPr.js"
	},
	"/assets/hero-honey-_5XoWxQ5.jpg": {
		"type": "image/jpeg",
		"etag": "\"36bdd-3pwCA644SZnSrsahzebMf0+3ob8\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 224221,
		"path": "../public/assets/hero-honey-_5XoWxQ5.jpg"
	},
	"/assets/indian-rupee-xTkyLrnK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123-fCNB57cSTGlMsSTBgx3kM1WQYec\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 291,
		"path": "../public/assets/indian-rupee-xTkyLrnK.js"
	},
	"/assets/instagram-CV5wqZTa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-NfJe1GHUDQ1Qd0AW0knxvOQmY8I\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 296,
		"path": "../public/assets/instagram-CV5wqZTa.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/jsx-runtime-KJkY8l8U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2157-uh2PnvJKYWZAlieFni6eRY8YAVs\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 8535,
		"path": "../public/assets/jsx-runtime-KJkY8l8U.js"
	},
	"/assets/key-round-Cp5FZbSn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"163-QVnSsFfkgUZ9McDcfLcjkk1WLUo\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 355,
		"path": "../public/assets/key-round-Cp5FZbSn.js"
	},
	"/assets/leaf-wugvjSP0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-iVzanritW7GJufpWVfVAaONmHkA\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 265,
		"path": "../public/assets/leaf-wugvjSP0.js"
	},
	"/assets/link-B6BKqMWf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1149-ddIRJj7Y+fX4Sd4MrI7XLEF9b0Y\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 4425,
		"path": "../public/assets/link-B6BKqMWf.js"
	},
	"/assets/lock-CxxOOski.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-aCvjF3MUZtPZxmK3IpzdYIZ/fX0\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 206,
		"path": "../public/assets/lock-CxxOOski.js"
	},
	"/assets/matchContext-Bnmix0ZT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-9QL1mPcodZXXGDjuoChD/kWhVd0\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 162,
		"path": "../public/assets/matchContext-Bnmix0ZT.js"
	},
	"/assets/megaphone-D2ytncqD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c0-+VtBBohbdtr9q6atPiqxLjR+4KU\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 704,
		"path": "../public/assets/megaphone-D2ytncqD.js"
	},
	"/assets/minus-cdSEl-GR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-KvwGITyGbvHVXNWHEai6rLDEhuc\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 117,
		"path": "../public/assets/minus-cdSEl-GR.js"
	},
	"/assets/menu-DFujbrpw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"237-rRwMXAKgxTs24xheRDVeune3f/E\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 567,
		"path": "../public/assets/menu-DFujbrpw.js"
	},
	"/assets/honeycomb-bees-C0mOiH5S.jpg": {
		"type": "image/jpeg",
		"etag": "\"63f43-ZjJw2/m7FG0dHzOKcRjheLL1rAw\"",
		"mtime": "2026-08-29T12:39:47.170Z",
		"size": 409411,
		"path": "../public/assets/honeycomb-bees-C0mOiH5S.jpg"
	},
	"/assets/index-D9AWHfBv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"71720-D+IJmSKJ0fSNKhIhaRbZnzdrrf0\"",
		"mtime": "2026-08-29T12:39:47.153Z",
		"size": 464672,
		"path": "../public/assets/index-D9AWHfBv.js"
	},
	"/assets/newsletter.confirm._token-CwCS2mHs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"542-FRguHtIISPqCEJvdimb0cd1FM+I\"",
		"mtime": "2026-08-29T12:39:47.164Z",
		"size": 1346,
		"path": "../public/assets/newsletter.confirm._token-CwCS2mHs.js"
	},
	"/assets/newsletter.functions-BKgkw7Q4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17b-mQuEgaK8m06a/mfcPMu40vXJWOc\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 379,
		"path": "../public/assets/newsletter.functions-BKgkw7Q4.js"
	},
	"/assets/newsletter.unsubscribe._token-BYGGZvn0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"475-Ixiqtz8wo3gjJyva1I9l67P+lOA\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 1141,
		"path": "../public/assets/newsletter.unsubscribe._token-BYGGZvn0.js"
	},
	"/assets/honey-process-infographic-vq6TDbM8.png": {
		"type": "image/png",
		"etag": "\"1e5245-n/vVInXZhj19rScGVpXlWfwErCc\"",
		"mtime": "2026-08-29T12:39:47.170Z",
		"size": 1987141,
		"path": "../public/assets/honey-process-infographic-vq6TDbM8.png"
	},
	"/assets/order._id-CIuyqsLu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fb3-RO65XSxVPlZ8ONL7fN1FT8iXEHQ\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 8115,
		"path": "../public/assets/order._id-CIuyqsLu.js"
	},
	"/assets/package-7xDD79Sr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-R4uQGdwG1P4wDXqyxjPpoMeP4bo\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 372,
		"path": "../public/assets/package-7xDD79Sr.js"
	},
	"/assets/our-story-oQlUR381.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3746-A4pHrQv57TSIYZwRh92rdi6Wi0U\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 14150,
		"path": "../public/assets/our-story-oQlUR381.js"
	},
	"/assets/palette-Hjyf76p4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"349-iD5/FjskAsFveu023rvkJcVnSc4\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 841,
		"path": "../public/assets/palette-Hjyf76p4.js"
	},
	"/assets/pen-tool-DvO6O0Ew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d7-BQhGhdKaPNzQkrU2HlMPzeGDkPU\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 471,
		"path": "../public/assets/pen-tool-DvO6O0Ew.js"
	},
	"/assets/pencil-p5yDkSfn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-6Ru03yv2whpEXTxNfzEpdID/H4Q\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 276,
		"path": "../public/assets/pencil-p5yDkSfn.js"
	},
	"/assets/plus-B-FMdtdj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-JYUX5smMnFTUJoBx+IA3JXE1meQ\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 153,
		"path": "../public/assets/plus-B-FMdtdj.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 1196,
		"path": "../public/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/printer-AEeaasxr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-o0bqJX0b4ko03xxDfcUCW26oE1g\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 319,
		"path": "../public/assets/printer-AEeaasxr.js"
	},
	"/assets/private-label-_toBIDoI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bb5-DjT0Qom+31qoA9keciUpyTSW0cw\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 15285,
		"path": "../public/assets/private-label-_toBIDoI.js"
	},
	"/assets/phone-call-BBYTEz9_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a7-30ZdHrJ6XPnkP4HT6RtsPYwPFPY\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 423,
		"path": "../public/assets/phone-call-BBYTEz9_.js"
	},
	"/assets/partner-handshake-Byc1Jn4K.jpg": {
		"type": "image/jpeg",
		"etag": "\"316b6-OXFvf9S6p55YDyxpzO9lOx2gOiE\"",
		"mtime": "2026-08-29T12:39:47.175Z",
		"size": 202422,
		"path": "../public/assets/partner-handshake-Byc1Jn4K.jpg"
	},
	"/assets/prod-ajwain-kDwYKqzY.jpg": {
		"type": "image/jpeg",
		"etag": "\"1fbc0-C+XcZA7SwkdbTGfVh40gZ5XWi4c\"",
		"mtime": "2026-08-29T12:39:47.175Z",
		"size": 129984,
		"path": "../public/assets/prod-ajwain-kDwYKqzY.jpg"
	},
	"/assets/our-bee-farm-timeline-CF0sJ7dK.jpg": {
		"type": "image/jpeg",
		"etag": "\"6755e-dKhxlOVZNVPBZwYsM4ikiq1E9gw\"",
		"mtime": "2026-08-29T12:39:47.170Z",
		"size": 423262,
		"path": "../public/assets/our-bee-farm-timeline-CF0sJ7dK.jpg"
	},
	"/assets/prod-giftpack-ysMgcFCY.jpg": {
		"type": "image/jpeg",
		"etag": "\"1c168-A5P9+OghLY8KE2GBIZkn6XTuckU\"",
		"mtime": "2026-08-29T12:39:47.180Z",
		"size": 115048,
		"path": "../public/assets/prod-giftpack-ysMgcFCY.jpg"
	},
	"/assets/prod-fennel-DXcPW6xZ.jpg": {
		"type": "image/jpeg",
		"etag": "\"17baa-4g4N/dV5hhh8yutfIRp2tO0fBi8\"",
		"mtime": "2026-08-29T12:39:47.180Z",
		"size": 97194,
		"path": "../public/assets/prod-fennel-DXcPW6xZ.jpg"
	},
	"/assets/prod-beeswax-pellets-B7akrIgq.png": {
		"type": "image/png",
		"etag": "\"a4f42-bES1gOh2ZfoaNJDL7UeMAcl5er4\"",
		"mtime": "2026-08-29T12:39:47.179Z",
		"size": 675650,
		"path": "../public/assets/prod-beeswax-pellets-B7akrIgq.png"
	},
	"/assets/prod-beauty-CPBiXN7M.png": {
		"type": "image/png",
		"etag": "\"aa618-QgBQnNjhCjCbT/oZPlCmv5d/3Wk\"",
		"mtime": "2026-08-29T12:39:47.175Z",
		"size": 697880,
		"path": "../public/assets/prod-beauty-CPBiXN7M.png"
	},
	"/assets/prod-bee-pollen-ClIlvju3.png": {
		"type": "image/png",
		"etag": "\"adbd2-fjnezR1w2YYcvzJIRYKtmCvs64Q\"",
		"mtime": "2026-08-29T12:39:47.177Z",
		"size": 711634,
		"path": "../public/assets/prod-bee-pollen-ClIlvju3.png"
	},
	"/assets/prod-honeycomb-D8_aKc35.jpg": {
		"type": "image/jpeg",
		"etag": "\"191ea-nGWFi9J5zawb4sNDav8pgunFJUc\"",
		"mtime": "2026-08-29T12:39:47.180Z",
		"size": 102890,
		"path": "../public/assets/prod-honeycomb-D8_aKc35.jpg"
	},
	"/assets/prod-beeswax-candles-kNdwedKX.png": {
		"type": "image/png",
		"etag": "\"95806-GYvFQFi5ODBEDIaoeFXciC7I23g\"",
		"mtime": "2026-08-29T12:39:47.177Z",
		"size": 612358,
		"path": "../public/assets/prod-beeswax-candles-kNdwedKX.png"
	},
	"/assets/our-bees-illustration-BKmnyXMY.jpg": {
		"type": "image/jpeg",
		"etag": "\"13aa32-oDyAvtayBdkQ5GnEhfj8MLI0eu4\"",
		"mtime": "2026-08-29T12:39:47.174Z",
		"size": 1288754,
		"path": "../public/assets/our-bees-illustration-BKmnyXMY.jpg"
	},
	"/assets/prod-liquid-CKR42HH0.jpg": {
		"type": "image/jpeg",
		"etag": "\"11de7-GVzx3yNRAugpIX6Euap4/BLtPSY\"",
		"mtime": "2026-08-29T12:39:47.180Z",
		"size": 73191,
		"path": "../public/assets/prod-liquid-CKR42HH0.jpg"
	},
	"/assets/prod-lychee-CEQKBjKQ.jpg": {
		"type": "image/jpeg",
		"etag": "\"18aed-/C/ZjhNXws7JUXHhUYPY4vdlmlE\"",
		"mtime": "2026-08-29T12:39:47.182Z",
		"size": 101101,
		"path": "../public/assets/prod-lychee-CEQKBjKQ.jpg"
	},
	"/assets/prod-multiflora-D-7CGTjb.jpg": {
		"type": "image/jpeg",
		"etag": "\"261eb-ApcFh9zusOfKri08R9pJb6QRYLg\"",
		"mtime": "2026-08-29T12:39:47.182Z",
		"size": 156139,
		"path": "../public/assets/prod-multiflora-D-7CGTjb.jpg"
	},
	"/assets/prod-squeeze-CwbNjkda.jpg": {
		"type": "image/jpeg",
		"etag": "\"1982e-87RW2bv5pE91fhgHsx+R/ADL3Os\"",
		"mtime": "2026-08-29T12:39:47.182Z",
		"size": 104494,
		"path": "../public/assets/prod-squeeze-CwbNjkda.jpg"
	},
	"/assets/product-images-qQ-N70wd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"536-t84zhWBVj1znE955VEEcs/leNFY\"",
		"mtime": "2026-08-29T12:39:47.165Z",
		"size": 1334,
		"path": "../public/assets/product-images-qQ-N70wd.js"
	},
	"/assets/product._slug-Cw6kpwEc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d1-JHPyUF5SmctQ7E0QRZZxxX59lWY\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 465,
		"path": "../public/assets/product._slug-Cw6kpwEc.js"
	},
	"/assets/product._slug-CyMpxCjA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ef-lxC1A0RRp/DGrfBqeeBuBHvr7PA\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 495,
		"path": "../public/assets/product._slug-CyMpxCjA.js"
	},
	"/assets/product._slug-OASZVB4i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a65f-X1OIffFwxecP78uZCx+KRCDpLhM\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 42591,
		"path": "../public/assets/product._slug-OASZVB4i.js"
	},
	"/assets/products-Cf9W0jRy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45ca-qkKoz0LdsOuB9AlMbC69K/00tto\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 17866,
		"path": "../public/assets/products-Cf9W0jRy.js"
	},
	"/assets/quote-B2xTQPCp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64d-jcekyUesJt2EwWDzzazP7UJSxj4\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 1613,
		"path": "../public/assets/quote-B2xTQPCp.js"
	},
	"/assets/react-dom-BsrxZfdi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dda-/KkbQdWpmEcddLNsaiMx/D5PdtI\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 3546,
		"path": "../public/assets/react-dom-BsrxZfdi.js"
	},
	"/assets/recently-viewed-BNL4KIjd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"332-1j9u1SS51er0NzvRP9alKyLewkQ\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 818,
		"path": "../public/assets/recently-viewed-BNL4KIjd.js"
	},
	"/assets/redirect-Coy-z-9D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f1-BGhm892UY1sbezQKq2st5UIjfBc\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 1009,
		"path": "../public/assets/redirect-Coy-z-9D.js"
	},
	"/assets/refresh-ccw-Du6aQWsq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"141-/eZt4ZsDJ5dyzTkw/BlhaCvE0fE\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 321,
		"path": "../public/assets/refresh-ccw-Du6aQWsq.js"
	},
	"/assets/refresh-cw-BixQGpAi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cd-aCrAMU6EgZjI9PfptWuAmiq0aHA\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 461,
		"path": "../public/assets/refresh-cw-BixQGpAi.js"
	},
	"/assets/reset-password-WdwfmFsT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"906-hbqT18SrpyevWSjiEHeSzSjPv5w\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 2310,
		"path": "../public/assets/reset-password-WdwfmFsT.js"
	},
	"/assets/routes-D58jeS3a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8fdf-h92fgXv+AfhbaJYfF2KWjJ4LUPk\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 36831,
		"path": "../public/assets/routes-D58jeS3a.js"
	},
	"/assets/prod-luxury-hamper-F1jQfTTi.png": {
		"type": "image/png",
		"etag": "\"bbc4c-2/Kohi7v650Xjo/yfn8tJNxcF8E\"",
		"mtime": "2026-08-29T12:39:47.181Z",
		"size": 769100,
		"path": "../public/assets/prod-luxury-hamper-F1jQfTTi.png"
	},
	"/assets/search-CGru17wC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-fuRpk3tHR4U49CYS/F/Sx/BN8mE\"",
		"mtime": "2026-08-29T12:39:47.166Z",
		"size": 174,
		"path": "../public/assets/search-CGru17wC.js"
	},
	"/assets/send-wUmZOZrO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-pXO8XOt+Bko21zgPjaccyrSUR5k\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 290,
		"path": "../public/assets/send-wUmZOZrO.js"
	},
	"/assets/settings-Coq6wa1l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"298-Cse30rHOHU/ZjqnHlDZEIfcg+S8\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 664,
		"path": "../public/assets/settings-Coq6wa1l.js"
	},
	"/assets/shield-check-D80VCg5S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-2N/vxZ+mNj17rkoby4D79auMKak\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 320,
		"path": "../public/assets/shield-check-D80VCg5S.js"
	},
	"/assets/shop-B9222HgH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-lVPi7u8cStFk7k7J6nYxHEoR5iw\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 142,
		"path": "../public/assets/shop-B9222HgH.js"
	},
	"/assets/shop._slug-CkLklFCF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e-EycfpSAQephucoHbO/RocVH8zTc\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 318,
		"path": "../public/assets/shop._slug-CkLklFCF.js"
	},
	"/assets/shop.index-C_He_Jdz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"111-86oQcidd/Fc1/N/DBGV+q69vKgo\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 273,
		"path": "../public/assets/shop.index-C_He_Jdz.js"
	},
	"/assets/shopping-bag-ox6bv2X2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-/kZXLUYfF07CdT/8FZYcNBbdaUM\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 340,
		"path": "../public/assets/shopping-bag-ox6bv2X2.js"
	},
	"/assets/sparkles-ikWX0cFw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-OVU5nhXCVed0Fl+5tZ+PQ7y6fOs\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 494,
		"path": "../public/assets/sparkles-ikWX0cFw.js"
	},
	"/assets/square-pen-CpL4xMXs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"252-O+l8TrX/a+l74181eNjPCfPfvDI\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 594,
		"path": "../public/assets/square-pen-CpL4xMXs.js"
	},
	"/assets/star-BGbiPqJb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-eeXarJEm/bRZ+fqNTNQnG83WGDY\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 472,
		"path": "../public/assets/star-BGbiPqJb.js"
	},
	"/assets/store-CgBtP89K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f2-8UmPfRoE0yFKDjap6IcA+lxRxew\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 498,
		"path": "../public/assets/store-CgBtP89K.js"
	},
	"/assets/submit-BLemGQM5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"144-yxtqmncT+/6btaym3CGqr/+dWg0\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 324,
		"path": "../public/assets/submit-BLemGQM5.js"
	},
	"/assets/tag-DW7TK7xw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"146-ZzeiLNpid+G8AH1mM4XrMLo6xdw\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 326,
		"path": "../public/assets/tag-DW7TK7xw.js"
	},
	"/assets/team-beekeepers-Cz22Ixdk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"349-CeWdO85f65ybxufWentnO0qsgbo\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 841,
		"path": "../public/assets/team-beekeepers-Cz22Ixdk.js"
	},
	"/assets/ticket-VPSQbmp3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c61-YuzmEbZYJCFbLJNHNSIuRB8b1bM\"",
		"mtime": "2026-08-29T12:39:47.167Z",
		"size": 3169,
		"path": "../public/assets/ticket-VPSQbmp3.js"
	},
	"/assets/track-order-CLYOjmTH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f80-5NMeFAuLxKwPCOUNgQnt+tuiNtU\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 8064,
		"path": "../public/assets/track-order-CLYOjmTH.js"
	},
	"/assets/styles-BbJ6ApCg.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"2897e-AamqOjM/hhKQjNZH3fqVd3kyiVw\"",
		"mtime": "2026-08-29T12:39:47.182Z",
		"size": 166270,
		"path": "../public/assets/styles-BbJ6ApCg.css"
	},
	"/assets/trash-2-B7WWZBAT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-PXCFHFV8FZpCrN3AMQSCkYUS3Do\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 328,
		"path": "../public/assets/trash-2-B7WWZBAT.js"
	},
	"/assets/team-beekeepers-TLpoAIrE.jpg": {
		"type": "image/jpeg",
		"etag": "\"36f1b-oMGJA9FFA9HcR9oUP6vHEydll8U\"",
		"mtime": "2026-08-29T12:39:47.184Z",
		"size": 225051,
		"path": "../public/assets/team-beekeepers-TLpoAIrE.jpg"
	},
	"/assets/trending-up-BKwPpe6p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"af-nyn/IupSJKF+1RL7ka72U2/K8Tc\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 175,
		"path": "../public/assets/trending-up-BKwPpe6p.js"
	},
	"/assets/triangle-alert-BRUYiEWr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-PcF3ginIIW3/rCAPZLKPiqrOFuU\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-BRUYiEWr.js"
	},
	"/assets/truck-hYDuOs60.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-sd5TzgR8DPmvj63imO2srh2fXmg\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 406,
		"path": "../public/assets/truck-hYDuOs60.js"
	},
	"/assets/tslib.es6-Tae09705.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42d-qJHuGuq51+EbLaebsBAkbj1JLbk\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 1069,
		"path": "../public/assets/tslib.es6-Tae09705.js"
	},
	"/assets/ui-BeNg7rZT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b14-U0yRRf5VcgL7vD6vV2T0KBBqboI\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 2836,
		"path": "../public/assets/ui-BeNg7rZT.js"
	},
	"/assets/upload-W4dbOY3x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e6-Mz2I/J2VPt095RmkElFwvP7hGqQ\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 230,
		"path": "../public/assets/upload-W4dbOY3x.js"
	},
	"/assets/useQuery-Cp9m1LWN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c09-MmdUKuYa7b8YhMKP6yDX+0q11xY\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 23561,
		"path": "../public/assets/useQuery-Cp9m1LWN.js"
	},
	"/assets/useRouter-DVsENc7m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-RXy+aSzXQ/Ou7MqebK00+gWmwOU\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 151,
		"path": "../public/assets/useRouter-DVsENc7m.js"
	},
	"/assets/users-D-NVw7Lp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-B5hZ7G15762WURuuKKX+UvzK0MQ\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 306,
		"path": "../public/assets/users-D-NVw7Lp.js"
	},
	"/assets/useStore-DWK8wJtK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a95-2iHXjkmQqeoruBHQ7UGG7zij6QY\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 19093,
		"path": "../public/assets/useStore-DWK8wJtK.js"
	},
	"/assets/users-round-Djeyq-SA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd-pDP16IuqmR7iu+VoXTUetS/ucUM\"",
		"mtime": "2026-08-29T12:39:47.168Z",
		"size": 253,
		"path": "../public/assets/users-round-Djeyq-SA.js"
	},
	"/assets/video-CnH7DqX_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"215-ieZ00+PFTS8lssaYNZ+EtV5kJhQ\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 533,
		"path": "../public/assets/video-CnH7DqX_.js"
	},
	"/assets/whatsapp-logo-Bfos9VAh.png": {
		"type": "image/png",
		"etag": "\"11b56-IXlEvNq0DUcMMWlzGlHQ/Fp3s5I\"",
		"mtime": "2026-08-29T12:39:47.184Z",
		"size": 72534,
		"path": "../public/assets/whatsapp-logo-Bfos9VAh.png"
	},
	"/assets/wishlist-B8gLBzOc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1639-iMm1+6CCwJBErB13fGlMLDoZo3c\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 5689,
		"path": "../public/assets/wishlist-B8gLBzOc.js"
	},
	"/assets/x-BJN2kJKt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-QPqo0QPndCaY40j07ujLjZGhE20\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 154,
		"path": "../public/assets/x-BJN2kJKt.js"
	},
	"/assets/youtube-DLfklMXi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"89f-SRtAYxdEbfikQT2MQYmRAbcMPhw\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 2207,
		"path": "../public/assets/youtube-DLfklMXi.js"
	},
	"/assets/zoom-in-BnC1DWYS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"777-9J5AbNarsVF6NsrXs/WY5R6LXUA\"",
		"mtime": "2026-08-29T12:39:47.169Z",
		"size": 1911,
		"path": "../public/assets/zoom-in-BnC1DWYS.js"
	},
	"/images/bg_illustrations/dipper.png": {
		"type": "image/png",
		"etag": "\"1f03c-uWj8mM2K2QmoshVvOwrGjyYfZ5g\"",
		"mtime": "2026-08-29T12:39:49.001Z",
		"size": 127036,
		"path": "../public/images/bg_illustrations/dipper.png"
	},
	"/images/bg_illustrations/dipper_alpha.png": {
		"type": "image/png",
		"etag": "\"37c8c-jLyomocrHG8BK2fgXVNHk0vd/ok\"",
		"mtime": "2026-08-29T12:39:49.023Z",
		"size": 228492,
		"path": "../public/images/bg_illustrations/dipper_alpha.png"
	},
	"/images/heritage/icon_wildflowers.png": {
		"type": "image/png",
		"etag": "\"7631c-HKkbJE0hWkatR5fVSLTZK0oW4JU\"",
		"mtime": "2026-08-29T12:39:49.071Z",
		"size": 484124,
		"path": "../public/images/heritage/icon_wildflowers.png"
	},
	"/images/bg_illustrations/bees.png": {
		"type": "image/png",
		"etag": "\"aa545-DiwLlUZ4j9qdBHIWcyonjevm3Qo\"",
		"mtime": "2026-08-29T12:39:48.992Z",
		"size": 697669,
		"path": "../public/images/bg_illustrations/bees.png"
	},
	"/images/bg_illustrations/floral.png": {
		"type": "image/png",
		"etag": "\"ab6de-+7qyn/fXbwLW5CuXSWpZRRCZGlw\"",
		"mtime": "2026-08-29T12:39:49.011Z",
		"size": 702174,
		"path": "../public/images/bg_illustrations/floral.png"
	},
	"/images/bg_illustrations/honeycomb.png": {
		"type": "image/png",
		"etag": "\"c4cc4-2t5MAvBpmg5vm1ETb27duufiB3M\"",
		"mtime": "2026-08-29T12:39:49.009Z",
		"size": 806084,
		"path": "../public/images/bg_illustrations/honeycomb.png"
	},
	"/images/trust_transparent/ethical_beekeeping.png": {
		"type": "image/png",
		"etag": "\"7449b-IDcsT/dCqIm1YbKRdq1iuf/JZdw\"",
		"mtime": "2026-08-29T12:39:48.992Z",
		"size": 476315,
		"path": "../public/images/trust_transparent/ethical_beekeeping.png"
	},
	"/images/heritage/icon_wildflowers_alpha.png": {
		"type": "image/png",
		"etag": "\"fdba5-ITQowJ1CY1gj9OKpx7fEH3GGJ+8\"",
		"mtime": "2026-08-29T12:39:49.091Z",
		"size": 1039269,
		"path": "../public/images/heritage/icon_wildflowers_alpha.png"
	},
	"/images/trust_transparent/lab_tested.png": {
		"type": "image/png",
		"etag": "\"62313-O5kT27As0LDLN1GwMLeJncqcmZk\"",
		"mtime": "2026-08-29T12:39:49.056Z",
		"size": 402195,
		"path": "../public/images/trust_transparent/lab_tested.png"
	},
	"/images/heritage/cinematic.png": {
		"type": "image/png",
		"etag": "\"10762f-shL+HtPJi3qB2+nh2bkfHo/r42Q\"",
		"mtime": "2026-08-29T12:39:49.072Z",
		"size": 1078831,
		"path": "../public/images/heritage/cinematic.png"
	},
	"/images/bg_illustrations/floral_alpha.png": {
		"type": "image/png",
		"etag": "\"127513-OX+sVoJhaggQB8pP3MuZZTjmweg\"",
		"mtime": "2026-08-29T12:39:49.023Z",
		"size": 1209619,
		"path": "../public/images/bg_illustrations/floral_alpha.png"
	},
	"/images/heritage/illus_wildflower.png": {
		"type": "image/png",
		"etag": "\"ad439-cJpkI2MAMGYlr3krDYSUMlLafUA\"",
		"mtime": "2026-08-29T12:39:49.098Z",
		"size": 709689,
		"path": "../public/images/heritage/illus_wildflower.png"
	},
	"/images/heritage/icon_honeycomb.png": {
		"type": "image/png",
		"etag": "\"88d37-gz+VAv0sYaOkbsf03Q0BnpkS3c0\"",
		"mtime": "2026-08-29T12:39:48.992Z",
		"size": 560439,
		"path": "../public/images/heritage/icon_honeycomb.png"
	},
	"/images/heritage/icon_honeycomb_alpha.png": {
		"type": "image/png",
		"etag": "\"108883-fxf08+L/KuOFrDLS0xgVEXdQW/8\"",
		"mtime": "2026-08-29T12:39:49.086Z",
		"size": 1083523,
		"path": "../public/images/heritage/icon_honeycomb_alpha.png"
	},
	"/images/bg_illustrations/bees_alpha.png": {
		"type": "image/png",
		"etag": "\"18920e-d4k9og1rxrJ7iYcFId41n8M9iok\"",
		"mtime": "2026-08-29T12:39:49.012Z",
		"size": 1610254,
		"path": "../public/images/bg_illustrations/bees_alpha.png"
	},
	"/images/trust_transparent/natural_floral.png": {
		"type": "image/png",
		"etag": "\"531ee-lpa6aQeBVeI3MibymmpxGMhrWoQ\"",
		"mtime": "2026-08-29T12:39:49.048Z",
		"size": 340462,
		"path": "../public/images/trust_transparent/natural_floral.png"
	},
	"/images/bg_illustrations/honeycomb_alpha.png": {
		"type": "image/png",
		"etag": "\"1c8d6d-/HZGWOZ7KTaIXKyKbQkKSGZCDPA\"",
		"mtime": "2026-08-29T12:39:49.041Z",
		"size": 1871213,
		"path": "../public/images/bg_illustrations/honeycomb_alpha.png"
	},
	"/images/trust/lab_tested.png": {
		"type": "image/png",
		"etag": "\"62313-O5kT27As0LDLN1GwMLeJncqcmZk\"",
		"mtime": "2026-08-29T12:39:49.039Z",
		"size": 402195,
		"path": "../public/images/trust/lab_tested.png"
	},
	"/images/trust/ethical_beekeeping.png": {
		"type": "image/png",
		"etag": "\"7449b-IDcsT/dCqIm1YbKRdq1iuf/JZdw\"",
		"mtime": "2026-08-29T12:39:48.993Z",
		"size": 476315,
		"path": "../public/images/trust/ethical_beekeeping.png"
	},
	"/images/heritage/illus_beekeeping.png": {
		"type": "image/png",
		"etag": "\"1cdfdd-8X/2hJ80iVLGAkUw3Bx74Ll8Gyo\"",
		"mtime": "2026-08-29T12:39:49.076Z",
		"size": 1892317,
		"path": "../public/images/heritage/illus_beekeeping.png"
	},
	"/images/heritage/illus_hive_to_home.png": {
		"type": "image/png",
		"etag": "\"1a13cc-FmGQ/9Zy3L2f19xArMSIbPHXhOE\"",
		"mtime": "2026-08-29T12:39:49.115Z",
		"size": 1709004,
		"path": "../public/images/heritage/illus_hive_to_home.png"
	},
	"/images/trust_transparent/rich_nutrients.png": {
		"type": "image/png",
		"etag": "\"433fc-zguLPPCX1qSNqL2CRqf0JUBA2b4\"",
		"mtime": "2026-08-29T12:39:49.055Z",
		"size": 275452,
		"path": "../public/images/trust_transparent/rich_nutrients.png"
	},
	"/images/trust_transparent/pure_no_additives.png": {
		"type": "image/png",
		"etag": "\"a5234-AvqmdpJk4F8kLEfJkEEny9rsABk\"",
		"mtime": "2026-08-29T12:39:49.048Z",
		"size": 676404,
		"path": "../public/images/trust_transparent/pure_no_additives.png"
	},
	"/images/trust/natural_floral.png": {
		"type": "image/png",
		"etag": "\"531ee-lpa6aQeBVeI3MibymmpxGMhrWoQ\"",
		"mtime": "2026-08-29T12:39:49.028Z",
		"size": 340462,
		"path": "../public/images/trust/natural_floral.png"
	},
	"/images/trust_transparent/raw_unprocessed.png": {
		"type": "image/png",
		"etag": "\"a92d1-0xVpBYjiYlncdAIIkvZDBxYwCOs\"",
		"mtime": "2026-08-29T12:39:49.063Z",
		"size": 692945,
		"path": "../public/images/trust_transparent/raw_unprocessed.png"
	},
	"/images/heritage/illus_pure.png": {
		"type": "image/png",
		"etag": "\"183b12-FDQ/WBpHP6rHT0kH8mn+uVAb+zo\"",
		"mtime": "2026-08-29T12:39:49.107Z",
		"size": 1587986,
		"path": "../public/images/heritage/illus_pure.png"
	},
	"/images/trust/rich_nutrients.png": {
		"type": "image/png",
		"etag": "\"433fc-zguLPPCX1qSNqL2CRqf0JUBA2b4\"",
		"mtime": "2026-08-29T12:39:49.058Z",
		"size": 275452,
		"path": "../public/images/trust/rich_nutrients.png"
	},
	"/images/trust/pure_no_additives.png": {
		"type": "image/png",
		"etag": "\"a5234-AvqmdpJk4F8kLEfJkEEny9rsABk\"",
		"mtime": "2026-08-29T12:39:49.121Z",
		"size": 676404,
		"path": "../public/images/trust/pure_no_additives.png"
	},
	"/images/trust/raw_unprocessed.png": {
		"type": "image/png",
		"etag": "\"a92d1-0xVpBYjiYlncdAIIkvZDBxYwCOs\"",
		"mtime": "2026-08-29T12:39:49.029Z",
		"size": 692945,
		"path": "../public/images/trust/raw_unprocessed.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_jtWgGH = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_jtWgGH
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
