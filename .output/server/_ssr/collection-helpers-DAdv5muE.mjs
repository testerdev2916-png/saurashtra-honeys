import { i as __toESM } from "../_runtime.mjs";
import { a as honeycomb_bees_default, f as prod_giftpack_default, i as honey_drizzle_default, m as prod_liquid_default, n as bee_flower_default, p as prod_honeycomb_default, r as family_honey_default, t as bee_farm_default, y as team_beekeepers_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as useAuth } from "./auth-L3PDI3kX.mjs";
import { r as hero_honey_default } from "./product-images-CLm3Xqgk.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collection-helpers-DAdv5muE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var KEY = "sh_wishlist_v1";
function readLocal() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function writeLocal(list) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(list));
	} catch {}
}
function WishlistProvider({ children }) {
	const { user, loading } = useAuth();
	const [slugs, setSlugs] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const mergedRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSlugs(new Set(readLocal()));
	}, []);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			setSlugs(new Set(readLocal()));
			return;
		}
		if (mergedRef.current === user.id) return;
		mergedRef.current = user.id;
		(async () => {
			try {
				const local = readLocal();
				const { data } = await supabase.from("wishlists").select("product_slug").eq("user_id", user.id);
				const dbSlugs = (data ?? []).map((r) => r.product_slug);
				const combined = Array.from(/* @__PURE__ */ new Set([...local, ...dbSlugs]));
				setSlugs(new Set(combined));
				writeLocal(combined);
				for (const s of local) if (!dbSlugs.includes(s)) {
					await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", s);
					await supabase.from("wishlists").insert({
						user_id: user.id,
						product_slug: s
					});
				}
			} catch (err) {
				console.warn("Wishlist sync error (using local cache):", err);
			}
		})();
	}, [user, loading]);
	const persist = (0, import_react.useCallback)(async (next, added, removed) => {
		const list = [...next];
		setSlugs(new Set(list));
		writeLocal(list);
		if (user) try {
			if (added) {
				await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", added);
				await supabase.from("wishlists").insert({
					user_id: user.id,
					product_slug: added
				});
			}
			if (removed) await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", removed);
		} catch (err) {
			console.warn("Wishlist Supabase sync error:", err);
		}
	}, [user]);
	const value = (0, import_react.useMemo)(() => ({
		slugs,
		count: slugs.size,
		has: (s) => slugs.has(s),
		toggle: async (s) => {
			const next = new Set(slugs);
			if (next.has(s)) {
				next.delete(s);
				await persist(next, null, s);
				return false;
			}
			next.add(s);
			await persist(next, s, null);
			return true;
		},
		remove: async (s) => {
			if (!slugs.has(s)) return;
			const next = new Set(slugs);
			next.delete(s);
			await persist(next, null, s);
		},
		clear: async () => {
			setSlugs(/* @__PURE__ */ new Set());
			writeLocal([]);
			if (user) try {
				await supabase.from("wishlists").delete().eq("user_id", user.id);
			} catch (err) {
				console.warn("Wishlist clear error:", err);
			}
		}
	}), [
		slugs,
		persist,
		user
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
var FALLBACK = {
	slugs: /* @__PURE__ */ new Set(),
	count: 0,
	has: () => false,
	toggle: async () => false,
	remove: async () => {},
	clear: async () => {}
};
function useWishlist() {
	return (0, import_react.useContext)(Ctx) ?? FALLBACK;
}
var companySettingsQueryOptions = {
	queryKey: ["company-settings"],
	queryFn: async () => {
		const { data, error } = await supabase.from("site_settings").select("value").eq("key", "company").maybeSingle();
		if (error || !data?.value) return null;
		return data.value;
	},
	staleTime: 1e3 * 60 * 5
};
/**
* Returns the dynamic company settings once loaded (undefined until then).
* Consumers should fall back to their own bundled defaults while this is
* undefined/empty, so there is no layout shift while the fetch is in flight.
*/
function useCompanySettings() {
	const { data } = useQuery(companySettingsQueryOptions);
	return data ?? void 0;
}
/** Convenience hook for just the logo URL (empty/missing -> undefined). */
function useCompanyLogoUrl() {
	const url = useCompanySettings()?.logo_url?.trim();
	return url ? url : void 0;
}
var DEDICATED_COLLECTION_SLUGS = [
	"raw-honey",
	"beeswax",
	"bee-pollen",
	"beeswax-candles",
	"beauty",
	"gift-hampers"
];
function getCategorySlug(nameOrSlug) {
	const clean = nameOrSlug.toLowerCase().trim();
	if (clean === "raw honey" || clean === "honey" || clean === "raw-honey" || clean === "single flora") return "raw-honey";
	if (clean === "beeswax" || clean === "beeswax block" || clean === "beeswax pellets" || clean === "pure beeswax") return "beeswax";
	if (clean === "bee pollen" || clean === "bee-pollen" || clean === "pollen") return "bee-pollen";
	if (clean === "beeswax candle" || clean === "beeswax candles" || clean === "beeswax-candle" || clean === "beeswax-candles" || clean === "candles") return "beeswax-candles";
	if (clean === "beauty products" || clean === "beeswax products" || clean === "beauty" || clean === "beauty & personal care" || clean === "body-care" || clean === "skin-care" || clean === "lip-care") return "beauty";
	if (clean === "gift hampers" || clean === "gift packs" || clean === "gift-hampers" || clean === "gift-packs" || clean === "gift packs & combos") return "gift-hampers";
	return clean.replace(/\s+/g, "-");
}
var CATEGORY_METADATA_MAP = {
	"raw-honey": {
		slug: "raw-honey",
		name: "RAW HONEY",
		tagline: "“Pure. Unprocessed. Straight from the hive.”",
		ctaText: "Explore Raw Honey",
		heroImage: hero_honey_default,
		heroDescription: "Harvested directly from the floral farms of Saurashtra, our raw honey is unheated, unpasteurised, and bursting with living enzymes, natural pollens, and authentic regional terroir.",
		storyTitle: "From Hive to Home",
		storySubtitle: "Artisanal Harvesting & Floral Traceability",
		storyDescription: "Our raw honey is collected directly from our sustainable apiaries and carefully handled at low temperatures to preserve its natural character, delicate aroma, and rich medicinal properties. Never ultra-filtered, never blended with syrups.",
		storyImage: bee_farm_default,
		storyHighlights: [
			{
				title: "100% Unheated & Unfiltered",
				description: "Preserving live enzymes, beneficial yeasts, and natural phytonutrients."
			},
			{
				title: "Single-Flora & Multiflora Harvests",
				description: "Distinct floral notes from Ajwain, Fennel, Lychee, and seasonal blooms."
			},
			{
				title: "Direct from Apiary to Jar",
				description: "Sustainably managed colonies without antibiotics or chemical additives."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Floral Apiaries",
				description: "Hives placed in pristine mustard, ajwain, and fennel orchards across Saurashtra.",
				image: bee_farm_default
			},
			{
				stepNumber: "02",
				title: "Cold Extraction",
				description: "Gentle centrifugal extraction without heat to safeguard live nutrients and pollen grains.",
				image: team_beekeepers_default
			},
			{
				stepNumber: "03",
				title: "Jarred at the Source",
				description: "Directly bottled and sealed in glass jars to retain natural freshness and aroma.",
				image: prod_liquid_default
			}
		]
	},
	beeswax: {
		slug: "beeswax",
		name: "BEESWAX",
		tagline: "“Natural. Protective. Pure hive wax.”",
		ctaText: "Explore Beeswax",
		heroImage: honeycomb_bees_default,
		heroDescription: "Our pure beeswax is naturally secreted by honeybees to construct honeycomb cells. Filtered gently without chemicals, it retains its sweet honey aroma and golden natural color.",
		storyTitle: "The Architect of the Hive",
		storySubtitle: "Pure, Chemical-Free Natural Wax",
		storyDescription: "Beeswax is a marvel of nature—it takes bees consuming roughly six to eight pounds of honey to produce just one pound of wax. We harvest only clean cappings from our combs, melting and purifying them with steam and natural filtration.",
		storyImage: honeycomb_bees_default,
		storyHighlights: [
			{
				title: "100% Natural Hive Cappings",
				description: "Harvested from mature, healthy honeycomb frames without chemical solvents."
			},
			{
				title: "Sweet Honey & Floral Scent",
				description: "Naturally fragrant with aromatic propolis and residual wildflower nectar."
			},
			{
				title: "Multi-Purpose Botanical Wax",
				description: "Ideal for artisanal salves, wood and leather polishes, and eco-crafting."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Comb Cappings",
				description: "Carefully harvested wax cappings from mature, honey-filled frames during harvest.",
				image: honeycomb_bees_default
			},
			{
				stepNumber: "02",
				title: "Steam Purification",
				description: "Gently melted and strained using fine cloth filtration without bleaching.",
				image: prod_honeycomb_default
			},
			{
				stepNumber: "03",
				title: "Golden Blocks & Pellets",
				description: "Poured into pristine molds ready for cosmetic or household crafting.",
				image: honeycomb_bees_default
			}
		]
	},
	"bee-pollen": {
		slug: "bee-pollen",
		name: "BEE POLLEN",
		tagline: "“Nature’s ultimate superfood.”",
		ctaText: "Explore Bee Pollen",
		heroImage: bee_flower_default,
		heroDescription: "Gathered by worker bees from wildflowers across Saurashtra, raw bee pollen is a nutrient-dense botanical powerhouse loaded with amino acids, vitamins, and antioxidants.",
		storyTitle: "Wildcrafted Energy from Nature",
		storySubtitle: "The Complete Botanical Protein",
		storyDescription: "Each granule of bee pollen represents thousands of flower visits. Our sustainable traps collect just a fraction of the hive’s daily harvest, ensuring our colonies thrive while bringing you one of the most complete superfoods on Earth.",
		storyImage: bee_flower_default,
		storyHighlights: [
			{
				title: "Rich in Complete Amino Acids",
				description: "Contains bioavailable proteins, B-vitamins, and trace minerals."
			},
			{
				title: "Gently Air-Dried for Bioavailability",
				description: "Dehydrated at room temperature to preserve delicate vitamins and enzymes."
			},
			{
				title: "Sourced from Multi-Floral Blooms",
				description: "A colorful spectrum of golden, orange, and emerald granules from wild flora."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Wildflower Foraging",
				description: "Bees collect golden pollen grains from diverse regional blossoms across Saurashtra.",
				image: bee_flower_default
			},
			{
				stepNumber: "02",
				title: "Ethical Harvesting",
				description: "Gentle hive entrance collectors harvest surplus pollen without stressing the colony.",
				image: bee_farm_default
			},
			{
				stepNumber: "03",
				title: "Low-Temp Preservation",
				description: "Slowly dehydrated in dehumidified air to keep vitamins active and crunchy.",
				image: bee_flower_default
			}
		]
	},
	"beeswax-candles": {
		slug: "beeswax-candles",
		name: "BEESWAX CANDLES",
		tagline: "“Warm ambiance. Clean, purifying light.”",
		ctaText: "Explore Candles",
		heroImage: honey_drizzle_default,
		heroDescription: "Hand-poured from 100% pure beeswax with natural cotton wicks, our artisanal candles burn cleaner, longer, and emit a subtle natural honey scent that purifies the air.",
		storyTitle: "Artisanal Glow & Clean Combustion",
		storySubtitle: "Negative Ions & Natural Aromatherapy",
		storyDescription: "Unlike paraffin candles that release toxins, pure beeswax naturally emits negative ions when burned, helping to neutralize airborne allergens and dust. Each candle is handcrafted to bring the warm glow and scent of a summer hive into your home.",
		storyImage: honey_drizzle_default,
		storyHighlights: [
			{
				title: "100% Cotton Lead-Free Wicks",
				description: "Carefully sized wicks for an even, smokeless golden flame."
			},
			{
				title: "Zero Paraffin or Artificial Fragrances",
				description: "No petroleum derivatives, phthalates, or synthetic perfumes."
			},
			{
				title: "Long-Lasting Golden Flame",
				description: "Dense natural wax that burns up to three times longer than paraffin."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Pure Beeswax Selection",
				description: "Using only filtered golden wax from our seasonal honey harvests.",
				image: honeycomb_bees_default
			},
			{
				stepNumber: "02",
				title: "Hand-Pouring & Dipping",
				description: "Crafted in small batches with precision cotton wicks for balanced burning.",
				image: honey_drizzle_default
			},
			{
				stepNumber: "03",
				title: "Slow Curing",
				description: "Aged to ensure a steady, smokeless, and therapeutic burn time.",
				image: honey_drizzle_default
			}
		]
	},
	beauty: {
		slug: "beauty",
		name: "BEAUTY & PERSONAL CARE",
		tagline: "“Honey-infused skin & body rituals.”",
		ctaText: "Explore Beauty & Care",
		heroImage: family_honey_default,
		heroDescription: "Harnessing the antimicrobial and intense humectant properties of raw honey and beeswax, our wellness rituals deeply nourish, restore, and protect sensitive skin naturally.",
		storyTitle: "Apiary-Born Dermatological Care",
		storySubtitle: "Natural Humectants & Protective Barriers",
		storyDescription: "For millennia, honey has been revered for its regenerative skincare properties. We combine our raw honey, propolis, and beeswax with cold-pressed botanical oils to create luxurious formulations that seal in moisture and soothe everyday skin stress.",
		storyImage: family_honey_default,
		storyHighlights: [
			{
				title: "Natural Antimicrobial & Soothing",
				description: "Calms dry, chapped, or irritated skin with active hive nutrients."
			},
			{
				title: "No Parabens, Sulfates, or Mineral Oils",
				description: "Clean, biocompatible skincare formulated with pure natural oils."
			},
			{
				title: "Enriched with Propolis & Beeswax",
				description: "Creates a breathable moisture barrier that protects against environmental elements."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Active Hive Ingredients",
				description: "Formulating with raw honey, beeswax, and antioxidant-rich botanicals.",
				image: family_honey_default
			},
			{
				stepNumber: "02",
				title: "Gentle Artisanal Blending",
				description: "Cold-crafted at body temperature to preserve delicate skin enzymes.",
				image: honey_drizzle_default
			},
			{
				stepNumber: "03",
				title: "Pure Daily Rituals",
				description: "Tested for gentleness on all skin types, from dry hands to delicate lips.",
				image: family_honey_default
			}
		]
	},
	"gift-hampers": {
		slug: "gift-hampers",
		name: "GIFT HAMPERS",
		tagline: "“Curated luxury from the hive.”",
		ctaText: "Explore Gift Hampers",
		heroImage: prod_giftpack_default,
		heroDescription: "Elevate your gifting with our handcrafted honey gift boxes. Thoughtfully paired single-flora honeys, wooden dippers, and beeswax candles in eco-luxury packaging.",
		storyTitle: "The Art of Thoughtful Gifting",
		storySubtitle: "Sustainable Luxury & Festive Traditions",
		storyDescription: "Whether for festive celebrations, weddings, or corporate milestones, our gift hampers showcase the finest harvest of Saurashtra. Packaged in sustainable wood and custom presentation boxes, every gift tells a story of nature and craftsmanship.",
		storyImage: prod_giftpack_default,
		storyHighlights: [
			{
				title: "Eco-Friendly Custom Boxes",
				description: "Crafted from sustainable materials with elegant foil and ribbon detailing."
			},
			{
				title: "Includes Artisanal Wooden Dippers",
				description: "Authentic honey accessories paired with single-flora jars."
			},
			{
				title: "Customizable for Corporate Gifting",
				description: "Tailored selections and personalized notes for weddings and business partners."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Tasting Curation",
				description: "Handpicked selections of contrasting honey origins and floral profiles.",
				image: prod_giftpack_default
			},
			{
				stepNumber: "02",
				title: "Handmade Accessories",
				description: "Paired with seasoned wooden dippers and beeswax candles.",
				image: prod_honeycomb_default
			},
			{
				stepNumber: "03",
				title: "Luxury Boxing",
				description: "Finished with gold-foil accents and sustainable presentation ribbons.",
				image: prod_giftpack_default
			}
		]
	}
};
function getCategoryMetadata(slug, dbCategories) {
	const normalized = getCategorySlug(slug);
	const found = CATEGORY_METADATA_MAP[normalized];
	if (found) {
		const dbCat = dbCategories?.find((c) => getCategorySlug(c.slug) === normalized || getCategorySlug(c.name) === normalized);
		if (dbCat && dbCat.image_url) return {
			...found,
			heroImage: dbCat.image_url
		};
		return found;
	}
	const dbCat = dbCategories?.find((c) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
	const displayName = dbCat ? dbCat.name.toUpperCase() : slug.replace(/-/g, " ").toUpperCase();
	const heroImg = dbCat?.image_url || "/assets/hero-honey-_5XoWxQ5.jpg";
	return {
		slug: normalized,
		name: displayName,
		tagline: "“Artisanal bee products from the floral farms of Saurashtra.”",
		ctaText: `Explore ${dbCat?.name || "Collection"}`,
		heroImage: heroImg,
		heroDescription: "Crafted with uncompromising quality and natural purity. Each item in this collection embodies our dedication to sustainable beekeeping and authentic flavor.",
		storyTitle: "Crafted by Nature & Tradition",
		storySubtitle: "Saurashtra Honey Artisanal Excellence",
		storyDescription: "Our collections bring the purest harvest of our apiaries directly to your home. Every product is carefully processed without harsh chemicals or high heat, honoring the natural balance of the hive.",
		storyImage: bee_farm_default,
		storyHighlights: [
			{
				title: "100% Pure & Sustainably Sourced",
				description: "Harvested from regional apiaries with complete traceability."
			},
			{
				title: "Artisanal Craftsmanship",
				description: "Prepared in small batches to preserve live nutrients and aroma."
			},
			{
				title: "No Synthetic Additives",
				description: "Clean formulations without artificial preservatives or adulteration."
			}
		],
		processSteps: [
			{
				stepNumber: "01",
				title: "Ethical Harvest",
				description: "Sustainably collected from thriving regional apiaries.",
				image: bee_farm_default
			},
			{
				stepNumber: "02",
				title: "Gentle Processing",
				description: "Carefully handled at low temperatures to keep nutrients intact.",
				image: team_beekeepers_default
			},
			{
				stepNumber: "03",
				title: "Quality Jarring",
				description: "Sealed fresh at the source in eco-friendly packaging.",
				image: prod_liquid_default
			}
		]
	};
}
function getCategoryProducts(slug, allProducts) {
	const normSlug = getCategorySlug(slug);
	return allProducts.filter((p) => {
		const pCat = (p.category || "").toLowerCase().trim();
		const pName = (p.name || "").toLowerCase().trim();
		if (normSlug === "raw-honey") {
			if (pCat === "honey" || pCat === "raw honey" || pCat === "single flora") return true;
			if (pCat.includes("honey") && !pCat.includes("candle") && !pCat.includes("comb") && !pCat.includes("hamper") && !pCat.includes("gift") && !pCat.includes("beauty")) return true;
			return false;
		}
		if (normSlug === "beeswax") {
			if (pCat === "beeswax" || pCat === "beeswax block" || pCat === "beeswax pellets" || pCat === "beeswax products") return true;
			if ((pName.includes("beeswax") || pName.includes("wax")) && !pName.includes("candle") && !pName.includes("balm") && !pName.includes("cream") && !pName.includes("butter") && !pName.includes("lip")) return true;
			return false;
		}
		if (normSlug === "bee-pollen") {
			if (pCat === "bee pollen" || pCat.includes("pollen")) return true;
			if (pName.includes("pollen")) return true;
			return false;
		}
		if (normSlug === "beeswax-candles") {
			if (pCat === "beeswax candle" || pCat === "beeswax candles" || pCat.includes("candle")) return true;
			if (pName.includes("candle")) return true;
			return false;
		}
		if (normSlug === "beauty") {
			if (pCat === "beauty products" || pCat === "beeswax products" || pCat === "beauty" || pCat.includes("care") || pCat.includes("beauty")) return true;
			if (pName.includes("balm") || pName.includes("cream") || pName.includes("lotion") || pName.includes("soap") || pName.includes("scrub") || pName.includes("salve") || pName.includes("butter") || pName.includes("mask") || pName.includes("polish")) return true;
			return false;
		}
		if (normSlug === "gift-hampers") {
			if (pCat === "gift hampers" || pCat === "gift packs" || pCat.includes("gift") || pCat.includes("hamper") || pCat.includes("combo")) return true;
			if (pName.includes("gift") || pName.includes("hamper") || pName.includes("pack") || pName.includes("combo") || pName.includes("trio")) return true;
			return false;
		}
		if (getCategorySlug(pCat) === normSlug || pCat === slug.toLowerCase().trim()) return true;
		return false;
	});
}
//#endregion
export { getCategorySlug as a, useWishlist as c, getCategoryProducts as i, WishlistProvider as n, useCompanyLogoUrl as o, getCategoryMetadata as r, useCompanySettings as s, DEDICATED_COLLECTION_SLUGS as t };
