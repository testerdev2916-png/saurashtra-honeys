import type { Product } from "@/lib/products";
import type { ShopCategory } from "@/lib/category-catalog";

import heroHoneyImg from "@/assets/hero-honey.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";
import prodGiftpackImg from "@/assets/prod-giftpack.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import teamBeekeepersImg from "@/assets/team-beekeepers.jpg";
import prodLiquidImg from "@/assets/prod-liquid.jpg";
import prodHoneycombImg from "@/assets/prod-honeycomb.jpg";

export type CategoryProcessStep = {
  stepNumber: string;
  title: string;
  description: string;
  image?: string;
};

export type CategoryCollectionMetadata = {
  slug: string;
  name: string;
  tagline: string;
  ctaText: string;
  heroImage: string;
  heroDescription: string;
  storyTitle: string;
  storySubtitle: string;
  storyDescription: string;
  storyImage: string;
  storyHighlights: {
    title: string;
    description: string;
  }[];
  processSteps: CategoryProcessStep[];
};

export const DEDICATED_COLLECTION_SLUGS = [
  "raw-honey",
  "beeswax",
  "bee-pollen",
  "beeswax-candles",
  "beauty",
  "gift-hampers",
];

export function getCategorySlug(nameOrSlug: string): string {
  const clean = nameOrSlug.toLowerCase().trim();
  if (
    clean === "raw honey" ||
    clean === "honey" ||
    clean === "raw-honey" ||
    clean === "single flora"
  ) {
    return "raw-honey";
  }
  if (
    clean === "beeswax" ||
    clean === "beeswax block" ||
    clean === "beeswax pellets" ||
    clean === "pure beeswax"
  ) {
    return "beeswax";
  }
  if (clean === "bee pollen" || clean === "bee-pollen" || clean === "pollen") {
    return "bee-pollen";
  }
  if (
    clean === "beeswax candle" ||
    clean === "beeswax candles" ||
    clean === "beeswax-candle" ||
    clean === "beeswax-candles" ||
    clean === "candles"
  ) {
    return "beeswax-candles";
  }
  if (
    clean === "beauty products" ||
    clean === "beeswax products" ||
    clean === "beauty" ||
    clean === "beauty & personal care" ||
    clean === "body-care" ||
    clean === "skin-care" ||
    clean === "lip-care"
  ) {
    return "beauty";
  }
  if (
    clean === "gift hampers" ||
    clean === "gift packs" ||
    clean === "gift-hampers" ||
    clean === "gift-packs" ||
    clean === "gift packs & combos"
  ) {
    return "gift-hampers";
  }
  return clean.replace(/\s+/g, "-");
}

const CATEGORY_METADATA_MAP: Record<string, CategoryCollectionMetadata> = {
  "raw-honey": {
    slug: "raw-honey",
    name: "RAW HONEY",
    tagline: "“Pure. Unprocessed. Straight from the hive.”",
    ctaText: "Explore Raw Honey",
    heroImage: heroHoneyImg,
    heroDescription:
      "Harvested directly from the floral farms of Saurashtra, our raw honey is unheated, unpasteurised, and bursting with living enzymes, natural pollens, and authentic regional terroir.",
    storyTitle: "From Hive to Home",
    storySubtitle: "Artisanal Harvesting & Floral Traceability",
    storyDescription:
      "Our raw honey is collected directly from our sustainable apiaries and carefully handled at low temperatures to preserve its natural character, delicate aroma, and rich medicinal properties. Never ultra-filtered, never blended with syrups.",
    storyImage: beeFarmImg,
    storyHighlights: [
      {
        title: "100% Unheated & Unfiltered",
        description: "Preserving live enzymes, beneficial yeasts, and natural phytonutrients.",
      },
      {
        title: "Single-Flora & Multiflora Harvests",
        description: "Distinct floral notes from Ajwain, Fennel, Lychee, and seasonal blooms.",
      },
      {
        title: "Direct from Apiary to Jar",
        description: "Sustainably managed colonies without antibiotics or chemical additives.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Floral Apiaries",
        description:
          "Hives placed in pristine mustard, ajwain, and fennel orchards across Saurashtra.",
        image: beeFarmImg,
      },
      {
        stepNumber: "02",
        title: "Cold Extraction",
        description:
          "Gentle centrifugal extraction without heat to safeguard live nutrients and pollen grains.",
        image: teamBeekeepersImg,
      },
      {
        stepNumber: "03",
        title: "Jarred at the Source",
        description:
          "Directly bottled and sealed in glass jars to retain natural freshness and aroma.",
        image: prodLiquidImg,
      },
    ],
  },
  beeswax: {
    slug: "beeswax",
    name: "BEESWAX",
    tagline: "“Natural. Protective. Pure hive wax.”",
    ctaText: "Explore Beeswax",
    heroImage: honeycombBeesImg,
    heroDescription:
      "Our pure beeswax is naturally secreted by honeybees to construct honeycomb cells. Filtered gently without chemicals, it retains its sweet honey aroma and golden natural color.",
    storyTitle: "The Architect of the Hive",
    storySubtitle: "Pure, Chemical-Free Natural Wax",
    storyDescription:
      "Beeswax is a marvel of nature—it takes bees consuming roughly six to eight pounds of honey to produce just one pound of wax. We harvest only clean cappings from our combs, melting and purifying them with steam and natural filtration.",
    storyImage: honeycombBeesImg,
    storyHighlights: [
      {
        title: "100% Natural Hive Cappings",
        description: "Harvested from mature, healthy honeycomb frames without chemical solvents.",
      },
      {
        title: "Sweet Honey & Floral Scent",
        description: "Naturally fragrant with aromatic propolis and residual wildflower nectar.",
      },
      {
        title: "Multi-Purpose Botanical Wax",
        description: "Ideal for artisanal salves, wood and leather polishes, and eco-crafting.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Comb Cappings",
        description:
          "Carefully harvested wax cappings from mature, honey-filled frames during harvest.",
        image: honeycombBeesImg,
      },
      {
        stepNumber: "02",
        title: "Steam Purification",
        description:
          "Gently melted and strained using fine cloth filtration without bleaching.",
        image: prodHoneycombImg,
      },
      {
        stepNumber: "03",
        title: "Golden Blocks & Pellets",
        description:
          "Poured into pristine molds ready for cosmetic or household crafting.",
        image: honeycombBeesImg,
      },
    ],
  },
  "bee-pollen": {
    slug: "bee-pollen",
    name: "BEE POLLEN",
    tagline: "“Nature’s ultimate superfood.”",
    ctaText: "Explore Bee Pollen",
    heroImage: beeFlowerImg,
    heroDescription:
      "Gathered by worker bees from wildflowers across Saurashtra, raw bee pollen is a nutrient-dense botanical powerhouse loaded with amino acids, vitamins, and antioxidants.",
    storyTitle: "Wildcrafted Energy from Nature",
    storySubtitle: "The Complete Botanical Protein",
    storyDescription:
      "Each granule of bee pollen represents thousands of flower visits. Our sustainable traps collect just a fraction of the hive’s daily harvest, ensuring our colonies thrive while bringing you one of the most complete superfoods on Earth.",
    storyImage: beeFlowerImg,
    storyHighlights: [
      {
        title: "Rich in Complete Amino Acids",
        description: "Contains bioavailable proteins, B-vitamins, and trace minerals.",
      },
      {
        title: "Gently Air-Dried for Bioavailability",
        description: "Dehydrated at room temperature to preserve delicate vitamins and enzymes.",
      },
      {
        title: "Sourced from Multi-Floral Blooms",
        description: "A colorful spectrum of golden, orange, and emerald granules from wild flora.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Wildflower Foraging",
        description:
          "Bees collect golden pollen grains from diverse regional blossoms across Saurashtra.",
        image: beeFlowerImg,
      },
      {
        stepNumber: "02",
        title: "Ethical Harvesting",
        description:
          "Gentle hive entrance collectors harvest surplus pollen without stressing the colony.",
        image: beeFarmImg,
      },
      {
        stepNumber: "03",
        title: "Low-Temp Preservation",
        description:
          "Slowly dehydrated in dehumidified air to keep vitamins active and crunchy.",
        image: beeFlowerImg,
      },
    ],
  },
  "beeswax-candles": {
    slug: "beeswax-candles",
    name: "BEESWAX CANDLES",
    tagline: "“Warm ambiance. Clean, purifying light.”",
    ctaText: "Explore Candles",
    heroImage: honeyDrizzleImg,
    heroDescription:
      "Hand-poured from 100% pure beeswax with natural cotton wicks, our artisanal candles burn cleaner, longer, and emit a subtle natural honey scent that purifies the air.",
    storyTitle: "Artisanal Glow & Clean Combustion",
    storySubtitle: "Negative Ions & Natural Aromatherapy",
    storyDescription:
      "Unlike paraffin candles that release toxins, pure beeswax naturally emits negative ions when burned, helping to neutralize airborne allergens and dust. Each candle is handcrafted to bring the warm glow and scent of a summer hive into your home.",
    storyImage: honeyDrizzleImg,
    storyHighlights: [
      {
        title: "100% Cotton Lead-Free Wicks",
        description: "Carefully sized wicks for an even, smokeless golden flame.",
      },
      {
        title: "Zero Paraffin or Artificial Fragrances",
        description: "No petroleum derivatives, phthalates, or synthetic perfumes.",
      },
      {
        title: "Long-Lasting Golden Flame",
        description: "Dense natural wax that burns up to three times longer than paraffin.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Pure Beeswax Selection",
        description:
          "Using only filtered golden wax from our seasonal honey harvests.",
        image: honeycombBeesImg,
      },
      {
        stepNumber: "02",
        title: "Hand-Pouring & Dipping",
        description:
          "Crafted in small batches with precision cotton wicks for balanced burning.",
        image: honeyDrizzleImg,
      },
      {
        stepNumber: "03",
        title: "Slow Curing",
        description:
          "Aged to ensure a steady, smokeless, and therapeutic burn time.",
        image: honeyDrizzleImg,
      },
    ],
  },
  beauty: {
    slug: "beauty",
    name: "BEAUTY & PERSONAL CARE",
    tagline: "“Honey-infused skin & body rituals.”",
    ctaText: "Explore Beauty & Care",
    heroImage: familyHoneyImg,
    heroDescription:
      "Harnessing the antimicrobial and intense humectant properties of raw honey and beeswax, our wellness rituals deeply nourish, restore, and protect sensitive skin naturally.",
    storyTitle: "Apiary-Born Dermatological Care",
    storySubtitle: "Natural Humectants & Protective Barriers",
    storyDescription:
      "For millennia, honey has been revered for its regenerative skincare properties. We combine our raw honey, propolis, and beeswax with cold-pressed botanical oils to create luxurious formulations that seal in moisture and soothe everyday skin stress.",
    storyImage: familyHoneyImg,
    storyHighlights: [
      {
        title: "Natural Antimicrobial & Soothing",
        description: "Calms dry, chapped, or irritated skin with active hive nutrients.",
      },
      {
        title: "No Parabens, Sulfates, or Mineral Oils",
        description: "Clean, biocompatible skincare formulated with pure natural oils.",
      },
      {
        title: "Enriched with Propolis & Beeswax",
        description: "Creates a breathable moisture barrier that protects against environmental elements.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Active Hive Ingredients",
        description:
          "Formulating with raw honey, beeswax, and antioxidant-rich botanicals.",
        image: familyHoneyImg,
      },
      {
        stepNumber: "02",
        title: "Gentle Artisanal Blending",
        description:
          "Cold-crafted at body temperature to preserve delicate skin enzymes.",
        image: honeyDrizzleImg,
      },
      {
        stepNumber: "03",
        title: "Pure Daily Rituals",
        description:
          "Tested for gentleness on all skin types, from dry hands to delicate lips.",
        image: familyHoneyImg,
      },
    ],
  },
  "gift-hampers": {
    slug: "gift-hampers",
    name: "GIFT HAMPERS",
    tagline: "“Curated luxury from the hive.”",
    ctaText: "Explore Gift Hampers",
    heroImage: prodGiftpackImg,
    heroDescription:
      "Elevate your gifting with our handcrafted honey gift boxes. Thoughtfully paired single-flora honeys, wooden dippers, and beeswax candles in eco-luxury packaging.",
    storyTitle: "The Art of Thoughtful Gifting",
    storySubtitle: "Sustainable Luxury & Festive Traditions",
    storyDescription:
      "Whether for festive celebrations, weddings, or corporate milestones, our gift hampers showcase the finest harvest of Saurashtra. Packaged in sustainable wood and custom presentation boxes, every gift tells a story of nature and craftsmanship.",
    storyImage: prodGiftpackImg,
    storyHighlights: [
      {
        title: "Eco-Friendly Custom Boxes",
        description: "Crafted from sustainable materials with elegant foil and ribbon detailing.",
      },
      {
        title: "Includes Artisanal Wooden Dippers",
        description: "Authentic honey accessories paired with single-flora jars.",
      },
      {
        title: "Customizable for Corporate Gifting",
        description: "Tailored selections and personalized notes for weddings and business partners.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Tasting Curation",
        description:
          "Handpicked selections of contrasting honey origins and floral profiles.",
        image: prodGiftpackImg,
      },
      {
        stepNumber: "02",
        title: "Handmade Accessories",
        description:
          "Paired with seasoned wooden dippers and beeswax candles.",
        image: prodHoneycombImg,
      },
      {
        stepNumber: "03",
        title: "Luxury Boxing",
        description:
          "Finished with gold-foil accents and sustainable presentation ribbons.",
        image: prodGiftpackImg,
      },
    ],
  },
};

export function getCategoryMetadata(
  slug: string,
  dbCategories?: ShopCategory[]
): CategoryCollectionMetadata {
  const normalized = getCategorySlug(slug);
  const found = CATEGORY_METADATA_MAP[normalized];
  if (found) {
    const dbCat = dbCategories?.find(
      (c) => getCategorySlug(c.slug) === normalized || getCategorySlug(c.name) === normalized
    );
    if (dbCat && dbCat.image_url) {
      return {
        ...found,
        heroImage: dbCat.image_url,
      };
    }
    return found;
  }

  // Fallback for custom Admin categories created in Supabase DB
  const dbCat = dbCategories?.find(
    (c) =>
      c.slug.toLowerCase() === slug.toLowerCase() ||
      c.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  const displayName = dbCat ? dbCat.name.toUpperCase() : slug.replace(/-/g, " ").toUpperCase();
  const heroImg = dbCat?.image_url || heroHoneyImg;

  return {
    slug: normalized,
    name: displayName,
    tagline: "“Artisanal bee products from the floral farms of Saurashtra.”",
    ctaText: `Explore ${dbCat?.name || "Collection"}`,
    heroImage: heroImg,
    heroDescription:
      "Crafted with uncompromising quality and natural purity. Each item in this collection embodies our dedication to sustainable beekeeping and authentic flavor.",
    storyTitle: "Crafted by Nature & Tradition",
    storySubtitle: "Saurashtra Honey Artisanal Excellence",
    storyDescription:
      "Our collections bring the purest harvest of our apiaries directly to your home. Every product is carefully processed without harsh chemicals or high heat, honoring the natural balance of the hive.",
    storyImage: beeFarmImg,
    storyHighlights: [
      {
        title: "100% Pure & Sustainably Sourced",
        description: "Harvested from regional apiaries with complete traceability.",
      },
      {
        title: "Artisanal Craftsmanship",
        description: "Prepared in small batches to preserve live nutrients and aroma.",
      },
      {
        title: "No Synthetic Additives",
        description: "Clean formulations without artificial preservatives or adulteration.",
      },
    ],
    processSteps: [
      {
        stepNumber: "01",
        title: "Ethical Harvest",
        description: "Sustainably collected from thriving regional apiaries.",
        image: beeFarmImg,
      },
      {
        stepNumber: "02",
        title: "Gentle Processing",
        description: "Carefully handled at low temperatures to keep nutrients intact.",
        image: teamBeekeepersImg,
      },
      {
        stepNumber: "03",
        title: "Quality Jarring",
        description: "Sealed fresh at the source in eco-friendly packaging.",
        image: prodLiquidImg,
      },
    ],
  };
}

export function getCategoryProducts(slug: string, allProducts: Product[]): Product[] {
  const normSlug = getCategorySlug(slug);

  return allProducts.filter((p) => {
    const pCat = (p.category || "").toLowerCase().trim();
    const pName = (p.name || "").toLowerCase().trim();

    if (normSlug === "raw-honey") {
      if (pCat === "honey" || pCat === "raw honey" || pCat === "single flora") return true;
      if (
        pCat.includes("honey") &&
        !pCat.includes("candle") &&
        !pCat.includes("comb") &&
        !pCat.includes("hamper") &&
        !pCat.includes("gift") &&
        !pCat.includes("beauty")
      ) {
        return true;
      }
      return false;
    }

    if (normSlug === "beeswax") {
      if (
        pCat === "beeswax" ||
        pCat === "beeswax block" ||
        pCat === "beeswax pellets" ||
        pCat === "beeswax products"
      ) {
        return true;
      }
      if (
        (pName.includes("beeswax") || pName.includes("wax")) &&
        !pName.includes("candle") &&
        !pName.includes("balm") &&
        !pName.includes("cream") &&
        !pName.includes("butter") &&
        !pName.includes("lip")
      ) {
        return true;
      }
      return false;
    }

    if (normSlug === "bee-pollen") {
      if (pCat === "bee pollen" || pCat.includes("pollen")) return true;
      if (pName.includes("pollen")) return true;
      return false;
    }

    if (normSlug === "beeswax-candles") {
      if (
        pCat === "beeswax candle" ||
        pCat === "beeswax candles" ||
        pCat.includes("candle")
      ) {
        return true;
      }
      if (pName.includes("candle")) return true;
      return false;
    }

    if (normSlug === "beauty") {
      if (
        pCat === "beauty products" ||
        pCat === "beeswax products" ||
        pCat === "beauty" ||
        pCat.includes("care") ||
        pCat.includes("beauty")
      ) {
        return true;
      }
      if (
        pName.includes("balm") ||
        pName.includes("cream") ||
        pName.includes("lotion") ||
        pName.includes("soap") ||
        pName.includes("scrub") ||
        pName.includes("salve") ||
        pName.includes("butter") ||
        pName.includes("mask") ||
        pName.includes("polish")
      ) {
        return true;
      }
      return false;
    }

    if (normSlug === "gift-hampers") {
      if (
        pCat === "gift hampers" ||
        pCat === "gift packs" ||
        pCat.includes("gift") ||
        pCat.includes("hamper") ||
        pCat.includes("combo")
      ) {
        return true;
      }
      if (
        pName.includes("gift") ||
        pName.includes("hamper") ||
        pName.includes("pack") ||
        pName.includes("combo") ||
        pName.includes("trio")
      ) {
        return true;
      }
      return false;
    }

    // Dynamic Admin Category Match:
    const pCatSlug = getCategorySlug(pCat);
    if (pCatSlug === normSlug || pCat === slug.toLowerCase().trim()) {
      return true;
    }

    return false;
  });
}
