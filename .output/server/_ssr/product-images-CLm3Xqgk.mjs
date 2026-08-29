import { _ as prod_multiflora_default, c as prod_bee_pollen_default, d as prod_fennel_default, f as prod_giftpack_default, g as prod_lychee_default, h as prod_luxury_hamper_default, i as honey_drizzle_default, l as prod_beeswax_candles_default, m as prod_liquid_default, n as bee_flower_default, o as prod_ajwain_default, p as prod_honeycomb_default, r as family_honey_default, s as prod_beauty_default, t as bee_farm_default, u as prod_beeswax_pellets_default, v as prod_squeeze_default, y as team_beekeepers_default } from "./team-beekeepers-DfClHD0g.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-images-CLm3Xqgk.js
var hero_honey_default = "/assets/hero-honey-_5XoWxQ5.jpg";
var imageMap = {
	"ajwain-honey": prod_ajwain_default,
	"prod-ajwain": prod_ajwain_default,
	"fennel-honey": prod_fennel_default,
	"prod-fennel": prod_fennel_default,
	"lychee-honey": prod_lychee_default,
	"prod-lychee": prod_lychee_default,
	"multiflora-honey": prod_multiflora_default,
	"prod-multiflora": prod_multiflora_default,
	"raw-honey-squeeze": prod_squeeze_default,
	"prod-squeeze": prod_squeeze_default,
	"honey-comb": prod_honeycomb_default,
	"prod-honeycomb": prod_honeycomb_default,
	"premium-gift-pack": prod_giftpack_default,
	"family-gift-pack": prod_giftpack_default,
	"prod-giftpack": prod_giftpack_default,
	"hero-honey": hero_honey_default,
	"bee-farm": bee_farm_default,
	"honey-drizzle": honey_drizzle_default,
	"family-honey": family_honey_default,
	"bee-flower": bee_flower_default,
	"prod-liquid": prod_liquid_default,
	"team-beekeepers": team_beekeepers_default,
	"prod-beeswax-pellets": prod_beeswax_pellets_default,
	"prod-bee-pollen": prod_bee_pollen_default,
	"prod-beeswax-candles": prod_beeswax_candles_default,
	"prod-beauty": prod_beauty_default,
	"prod-luxury-hamper": prod_luxury_hamper_default
};
var IMAGE_KEYS = Object.keys(imageMap);
var FALLBACK_IMAGE = hero_honey_default;
function resolveImage(key, url, fallback = FALLBACK_IMAGE, updatedAt) {
	let cleanUrl = url?.trim();
	if (!cleanUrl && key?.trim() && key.includes("/")) cleanUrl = key.trim();
	let resultUrl = fallback;
	if (cleanUrl) if (/^https?:\/\//i.test(cleanUrl)) resultUrl = cleanUrl;
	else {
		let path = cleanUrl.replace(/^\/+/, "");
		let bucket = "media";
		if (path.startsWith("media/")) path = path.substring(6);
		else if (path.startsWith("review-media/")) {
			bucket = "review-media";
			path = path.substring(13);
		}
		path = path.split("?")[0].split("#")[0];
		const { data } = supabase.storage.from(bucket).getPublicUrl(path);
		if (data && data.publicUrl) resultUrl = data.publicUrl;
	}
	else if (key && imageMap[key]) resultUrl = imageMap[key];
	if (updatedAt && resultUrl.includes("supabase.co")) {
		const ts = new Date(updatedAt).getTime();
		if (!isNaN(ts)) {
			const separator = resultUrl.includes("?") ? "&" : "?";
			resultUrl += `${separator}v=${ts}`;
		}
	}
	return resultUrl;
}
//#endregion
export { resolveImage as i, IMAGE_KEYS as n, hero_honey_default as r, FALLBACK_IMAGE as t };
