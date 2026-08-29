import { n as supabase } from "./client-CiOF68Zx.mjs";
import { i as resolveImage, t as FALLBACK_IMAGE } from "./product-images-CLm3Xqgk.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hero-catalog-BOSpOcA3.js
var fetchPublicHeroRows = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ page: stringType() }).parse(d)).handler(createSsrRpc("8a9bdc3a4066487d682929386bc34b4795485f46a681c01fc836c02b2b401d06"));
function heroRowToSlide(r) {
	return {
		eyebrow: r.eyebrow || void 0,
		title: r.title || "Promotional Banner",
		description: r.subtitle || void 0,
		image: resolveImage(r.image_key, r.image_url, FALLBACK_IMAGE, r.updated_at),
		mobileImage: r.mobile_image_url ? `${r.mobile_image_url}${r.mobile_image_url.includes("?") ? "&" : "?"}v=${new Date(r.updated_at).getTime()}` : void 0,
		ctaText: r.cta_label || void 0,
		ctaTo: r.cta_href || "/shop",
		updatedAt: r.updated_at
	};
}
function getDefaultHeroSlides(p = "home") {
	return [];
}
async function fetchHeroSlides(page) {
	try {
		const { data, error } = await supabase.from("hero_slides").select("*").eq("page", page).eq("active", true).order("sort_order", { ascending: true });
		if (error || !data || data.length === 0) return getDefaultHeroSlides(page);
		return data.map((r) => heroRowToSlide(r));
	} catch {
		return getDefaultHeroSlides(page);
	}
}
//#endregion
export { heroRowToSlide as i, fetchPublicHeroRows as n, getDefaultHeroSlides as r, fetchHeroSlides as t };
