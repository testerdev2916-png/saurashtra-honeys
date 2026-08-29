import ajwain from "@/assets/prod-ajwain.jpg";
import fennel from "@/assets/prod-fennel.jpg";
import lychee from "@/assets/prod-lychee.jpg";
import multiflora from "@/assets/prod-multiflora.jpg";
import squeeze from "@/assets/prod-squeeze.jpg";
import honeycomb from "@/assets/prod-honeycomb.jpg";
import giftpack from "@/assets/prod-giftpack.jpg";
import beeswaxPellets from "@/assets/prod-beeswax-pellets.png";
import beePollen from "@/assets/prod-bee-pollen.png";
import beeswaxCandles from "@/assets/prod-beeswax-candles.png";
import beautyProducts from "@/assets/prod-beauty.png";
import luxuryHamper from "@/assets/prod-luxury-hamper.png";
import beeFarm from "@/assets/bee-farm.jpg";
import beeFlower from "@/assets/bee-flower.jpg";
import familyHoney from "@/assets/family-honey.jpg";
import honeyDrizzle from "@/assets/honey-drizzle.jpg";
import honeycombBees from "@/assets/honeycomb-bees.jpg";
import prodLiquid from "@/assets/prod-liquid.jpg";
import teamBeekeepers from "@/assets/team-beekeepers.jpg";

export type ProductVariant = {
  id?: string;
  label: string;
  price: number;
  mrp?: number;
  stock?: number;
  inStock?: boolean;
  isDefault?: boolean;
  sku?: string;
  weightG?: number;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  priceMax?: number;
  mrp?: number;
  rating: number;
  reviews: number;
  badge?: "BESTSELLER" | "NEW" | "PREMIUM";
  category:
    | "Honey"
    | "Beeswax"
    | "Bee Pollen"
    | "Beeswax Candle"
    | "Beeswax Products"
    | "Beauty Products"
    | string;
  sizes: string[];
  variants?: ProductVariant[];
  image: string;
  images?: string[];
  additionalImages?: string[];
  benefits: string[];
  description: string;
  flora?: string;
  attributes?: Record<string, string | string[]>;
  showOnHomepage?: boolean;
  updatedAt?: string;
};

export function getProductGallery(product: Product): string[] {
  const list = Array.isArray(product.images)
    ? Array.from(new Set(product.images.filter((u): u is string => typeof u === "string" && u.trim().length > 0)))
    : [];
  if (list.length > 0) {
    return list.slice(0, 9);
  }
  return product.image ? [product.image] : [];
}

export function getProductAdditionalImages(product: Product): string[] {
  const list = Array.isArray(product.additionalImages)
    ? Array.from(new Set(product.additionalImages.filter((u): u is string => typeof u === "string" && u.trim().length > 0)))
    : product.attributes && typeof product.attributes === "object" && Array.isArray((product.attributes as Record<string, unknown>).additional_images)
    ? Array.from(new Set(((product.attributes as Record<string, unknown>).additional_images as unknown[]).filter((u): u is string => typeof u === "string" && u.trim().length > 0)))
    : [];
  return list.slice(0, 8);
}

export const products: Product[] = [
  {
    slug: "ajwain-honey",
    name: "Ajwain Honey",
    tagline: "Raw • Unfiltered • Unheated",
    price: 349,
    priceMax: 899,
    rating: 4.8,
    reviews: 256,
    badge: "BESTSELLER",
    category: "Honey",
    sizes: ["250g", "500g", "1kg"],
    image: ajwain,
    images: [ajwain, prodLiquid, beeFarm, teamBeekeepers],
    additionalImages: [beeFarm, honeyDrizzle, honeycombBees],
    flora: "Ajwain",
    benefits: [
      "Supports digestion & gut health",
      "Enhances immunity naturally",
      "Rich in antioxidants",
      "Natural source of energy",
    ],
    description:
      "Sourced from the nectar of Ajwain flowers, this honey is rich in antioxidants and known to support digestion, immunity and overall wellness.",
  },
  {
    slug: "fennel-honey",
    name: "Fennel Honey",
    tagline: "Raw • Unfiltered • Unheated",
    price: 349,
    priceMax: 899,
    rating: 4.7,
    reviews: 184,
    category: "Honey",
    sizes: ["250g", "500g", "1kg"],
    image: fennel,
    images: [fennel, prodLiquid, beeFlower, honeycombBees],
    additionalImages: [beeFlower, honeycombBees, teamBeekeepers],
    flora: "Fennel",
    benefits: ["Good for metabolism", "Bloating relief", "Cooling properties", "Natural sweetness"],
    description:
      "Collected from fennel blossoms of Saurashtra, this honey supports gut health with a subtle, refreshing flavour.",
  },
  {
    slug: "lychee-honey",
    name: "Lychee Honey",
    tagline: "Raw • Unfiltered • Unheated",
    price: 399,
    priceMax: 999,
    rating: 4.8,
    reviews: 142,
    badge: "PREMIUM",
    category: "Honey",
    sizes: ["250g", "500g", "1kg"],
    image: lychee,
    images: [lychee, prodLiquid, beeFlower, familyHoney],
    additionalImages: [familyHoney, beeFlower, honeyDrizzle],
    flora: "Lychee",
    benefits: [
      "Natural energy booster",
      "Immunity support",
      "Delicate floral notes",
      "Kids-friendly",
    ],
    description:
      "Harvested from lychee orchards in bloom — smooth, mildly fruity honey that families love.",
  },
  {
    slug: "multiflora-honey",
    name: "Multiflora Honey",
    tagline: "Raw • Unfiltered • Unheated",
    price: 299,
    priceMax: 799,
    rating: 4.6,
    reviews: 312,
    category: "Honey",
    sizes: ["250g", "500g", "1kg"],
    image: multiflora,
    images: [multiflora, prodLiquid, beeFarm, honeycombBees],
    additionalImages: [beeFarm, honeycombBees, honeyDrizzle],
    flora: "Multiflora",
    benefits: ["Daily wellness", "Balanced natural taste", "Rich in enzymes", "Everyday use"],
    description:
      "A wholesome blend from diverse wildflowers of Saurashtra — the perfect everyday jar.",
  },
  {
    slug: "raw-honey-squeeze",
    name: "Raw Honey (Squeeze)",
    tagline: "Raw • Unfiltered • Squeeze Bottle",
    price: 249,
    priceMax: 449,
    rating: 4.5,
    reviews: 208,
    badge: "NEW",
    category: "Honey",
    sizes: ["250ml", "500ml"],
    image: squeeze,
    images: [squeeze, prodLiquid, teamBeekeepers, beeFarm],
    additionalImages: [teamBeekeepers, beeFarm, honeycombBees],
    benefits: [
      "Convenient squeeze bottle",
      "Wholesome & versatile",
      "Everyday use",
      "Travel-friendly",
    ],
    description:
      "Our signature raw honey in a mess-free squeeze bottle — perfect for kitchens, tea and toast.",
  },
  {
    slug: "honey-comb",
    name: "Honey Comb",
    tagline: "100% Natural • Raw & Unprocessed",
    price: 499,
    rating: 4.9,
    reviews: 87,
    badge: "PREMIUM",
    category: "Honey",
    sizes: ["250g", "500g"],
    image: honeycomb,
    images: [honeycomb, honeycombBees, beeFarm],
    additionalImages: [honeycombBees, beeFarm, teamBeekeepers],
    benefits: [
      "Straight from the hive",
      "Chewable wax + honey",
      "Rich in enzymes",
      "Nothing added",
    ],
    description: "Raw honey comb straight from the frame — an unforgettable taste experience.",
  },
  {
    slug: "premium-gift-pack",
    name: "Premium Gift Pack",
    tagline: "Three curated single flora honeys",
    price: 749,
    rating: 4.8,
    reviews: 64,
    category: "Honey",
    sizes: ["3 × 250g"],
    image: giftpack,
    benefits: [
      "Elegant packaging",
      "Three flora variety",
      "Perfect for gifting",
      "Personalisation available",
    ],
    description:
      "A curated trio of our best single-flora honeys in a luxury gift box — Ajwain, Fennel and Lychee.",
  },
  {
    slug: "family-gift-pack",
    name: "Family Gift Pack",
    tagline: "Three larger jars for the whole family",
    price: 1149,
    rating: 4.7,
    reviews: 41,
    category: "Honey",
    sizes: ["3 × 500g"],
    image: giftpack,
    benefits: [
      "Larger 500g jars",
      "Multiflora + Ajwain + Lychee",
      "Great for celebrations",
      "Made-to-order",
    ],
    description:
      "A healthy choice for the whole family — three larger jars of our most-loved honeys in premium packaging.",
  },
  {
    slug: "honey-beeswax-lip-balm",
    name: "Honey & Beeswax Lip Balm",
    tagline: "Intensive Lip Care • 100% Natural",
    price: 199,
    mrp: 249,
    rating: 4.9,
    reviews: 142,
    badge: "BESTSELLER",
    category: "Beauty Products",
    sizes: ["20g"],
    image: giftpack,
    benefits: [
      "Soothes chapped lips",
      "Long-lasting hydration",
      "100% natural ingredients",
      "Non-greasy formula",
    ],
    description:
      "Deeply moisturizing lip balm made with pure Saurashtra honey, natural beeswax and cold-pressed oils.",
    attributes: { Form: "Balm" },
  },
  {
    slug: "raw-honey-facial-polish",
    name: "Raw Honey Facial Polish",
    tagline: "Gentle Exfoliation & Glow",
    price: 449,
    priceMax: 799,
    mrp: 549,
    rating: 4.8,
    reviews: 89,
    badge: "PREMIUM",
    category: "Honey",
    sizes: ["50g", "100g"],
    image: ajwain,
    benefits: [
      "Gently exfoliates",
      "Boosts natural glow",
      "Rich in enzymes",
      "Suitable for all skin types",
    ],
    description:
      "Gentle facial scrub combining raw crystallized honey and botanical powders to buff away dull skin.",
    attributes: { Form: "Scrub" },
  },
  {
    slug: "royal-jelly-hair-mask",
    name: "Royal Jelly Hair Mask",
    tagline: "Deep Conditioning & Shine",
    price: 599,
    mrp: 699,
    rating: 4.7,
    reviews: 63,
    badge: "NEW",
    category: "Honey",
    sizes: ["100g"],
    image: lychee,
    benefits: ["Deeply conditions", "Adds natural shine", "Strengthens roots", "Sulfate-free"],
    description:
      "Restorative hair treatment infused with raw honey and royal jelly to nourish dry, damaged hair.",
    attributes: { Form: "Mask" },
  },
  {
    slug: "beeswax-body-butter",
    name: "Beeswax Body Butter",
    tagline: "24-Hour Rich Moisture",
    price: 399,
    priceMax: 699,
    mrp: 499,
    rating: 4.8,
    reviews: 115,
    category: "Beauty Products",
    sizes: ["50g", "100g"],
    image: fennel,
    benefits: [
      "24-hour moisture",
      "Protective moisture barrier",
      "Natural honey aroma",
      "Absorbs smoothly",
    ],
    description:
      "Rich body butter crafted with unrefined beeswax and honey to protect and soften dry skin.",
    attributes: { Form: "Butter" },
  },
  {
    slug: "pure-beeswax-block",
    name: "100% Pure Beeswax Block",
    tagline: "Natural Unrefined Wax • Multi-Purpose",
    price: 299,
    priceMax: 899,
    mrp: 349,
    rating: 4.8,
    reviews: 98,
    badge: "BESTSELLER",
    category: "Beeswax",
    sizes: ["100g", "250g", "500g"],
    image: honeycomb,
    benefits: [
      "100% pure & unrefined",
      "Natural honey aroma",
      "Great for DIY skincare",
      "Clean burn for candles",
    ],
    description:
      "Pure aromatic beeswax blocks from our Saurashtra apiaries, ideal for DIY cosmetics, candles and salves.",
  },
  {
    slug: "raw-bee-pollen-granules",
    name: "Raw Bee Pollen Granules",
    tagline: "Superfood • Amino Acids & Vitamins",
    price: 499,
    priceMax: 949,
    mrp: 599,
    rating: 4.9,
    reviews: 76,
    badge: "PREMIUM",
    category: "Bee Pollen",
    sizes: ["100g", "250g"],
    image: multiflora,
    benefits: [
      "Rich in protein & vitamins",
      "Daily superfood boost",
      "Sustainably harvested",
      "Mild sweet floral taste",
    ],
    description:
      "Multi-floral bee pollen granules harvested sustainably from Saurashtra wildflowers. Packed with protein and vitamins.",
  },
  {
    slug: "hand-rolled-beeswax-candle",
    name: "Hand-Rolled Beeswax Candle",
    tagline: "Natural Honey Aroma • Clean Burning",
    price: 249,
    priceMax: 449,
    mrp: 299,
    rating: 4.8,
    reviews: 54,
    badge: "NEW",
    category: "Beeswax Candles",
    sizes: ["Small", "Large"],
    image: giftpack,
    benefits: [
      "100% cotton wick",
      "Non-toxic & clean burning",
      "Subtle honey aroma",
      "Long burn time",
    ],
    description:
      "Hand-rolled natural beeswax candles that burn cleanly while releasing a subtle warm honey fragrance.",
    attributes: { "Candle Type": "Pillar" },
  },
  {
    slug: "natural-beeswax-wood-polish",
    name: "Natural Beeswax Wood & Leather Polish",
    tagline: "100% Natural Condition & Protect",
    price: 349,
    priceMax: 599,
    mrp: 399,
    rating: 4.7,
    reviews: 42,
    category: "Beeswax",
    sizes: ["50g", "100g"],
    image: honeycomb,
    benefits: [
      "Protects wood & leather",
      "No synthetic chemicals",
      "Easy application",
      "Water-repellent barrier",
    ],
    description:
      "Natural beeswax condition balm formulated to protect, seal and shine fine wood and leather goods.",
    attributes: { Form: "Polish" },
  },
  {
    slug: "soft-skin-gel",
    name: "Soft Skin Gel",
    tagline: "100% Natural • Gentle Moisturizing Gel",
    price: 299,
    mrp: 399,
    rating: 4.9,
    reviews: 42,
    badge: "NEW",
    category: "Beauty Products",
    sizes: ["50g"],
    image: giftpack,
    benefits: [
      "Lightweight formula",
      "Infused with raw honey and botanical extracts",
      "All-day hydration and softness",
      "Non-comedogenic",
    ],
    description:
      "Deeply moisturizing soft skin gel made with raw honey and botanical extracts for daily nourishment.",
    attributes: { Form: "Gel" },
  },
  // ==========================================
  // NEW EXPANDED CATEGORIES
  // ==========================================
  
  // BEESWAX
  {
    slug: "natural-beeswax-pellets",
    name: "Natural Beeswax Pellets",
    tagline: "100% Pure • Easy to Melt",
    price: 349,
    mrp: 449,
    rating: 4.8,
    reviews: 112,
    badge: "BESTSELLER",
    category: "Beeswax",
    sizes: ["250g", "500g", "1kg"],
    image: beeswaxPellets,
    benefits: ["Easy to measure & melt", "Perfect for DIY cosmetics", "Clean natural aroma", "Sustainably sourced"],
    description: "Premium cosmetic-grade beeswax pellets. Ideal for crafting your own lip balms, lotions, and candles with a naturally sweet honey scent.",
  },
  {
    slug: "premium-filtered-beeswax",
    name: "Premium Filtered Beeswax",
    tagline: "Cosmetic Grade • Triple Filtered",
    price: 499,
    mrp: 599,
    rating: 4.9,
    reviews: 84,
    category: "Beeswax",
    sizes: ["500g"],
    image: beeswaxPellets,
    benefits: ["Triple filtered for purity", "Cosmetic grade", "No debris or impurities", "Rich golden color"],
    description: "Our highest quality triple-filtered beeswax. Perfect for professional cosmetic formulations and high-end candle making.",
  },
  {
    slug: "handmade-beeswax-sheet",
    name: "Handmade Beeswax Sheet",
    tagline: "Natural Foundation • DIY Candle Making",
    price: 199,
    rating: 4.7,
    reviews: 45,
    badge: "NEW",
    category: "Beeswax",
    sizes: ["Pack of 5", "Pack of 10"],
    image: beeswaxPellets,
    benefits: ["Ready to roll into candles", "Beautiful honeycomb texture", "Fun for kids' crafts", "100% natural"],
    description: "Textured beeswax sheets perfect for rolling your own pillar candles at home. A wonderful craft activity with a beautiful, functional result.",
  },

  // BEE POLLEN
  {
    slug: "bee-pollen-100g",
    name: "Bee Pollen 100g",
    tagline: "Nature's Multivitamin • Raw Superfood",
    price: 399,
    mrp: 499,
    rating: 4.9,
    reviews: 231,
    badge: "BESTSELLER",
    category: "Bee Pollen",
    sizes: ["100g"],
    image: beePollen,
    benefits: ["Rich in amino acids", "Natural energy booster", "Immune system support", "Add to smoothies or yogurt"],
    description: "Golden granules of pure bee pollen, packed with vitamins, minerals, and protein. A perfect daily superfood supplement.",
  },
  {
    slug: "bee-pollen-250g",
    name: "Bee Pollen 250g",
    tagline: "Nature's Multivitamin • Value Pack",
    price: 799,
    mrp: 999,
    rating: 4.9,
    reviews: 156,
    badge: "PREMIUM",
    category: "Bee Pollen",
    sizes: ["250g"],
    image: beePollen,
    benefits: ["Rich in amino acids", "Natural energy booster", "Immune system support", "Great value size"],
    description: "Our premium raw bee pollen in a larger value size. Sustainably harvested to ensure the bees have plenty left for themselves.",
  },

  // BEESWAX CANDLES
  {
    slug: "handmade-beeswax-pillar-candle",
    name: "Handmade Beeswax Pillar Candle",
    tagline: "Long Burning • Air Purifying",
    price: 599,
    rating: 4.8,
    reviews: 92,
    badge: "BESTSELLER",
    category: "Beeswax Candles",
    sizes: ["Medium", "Large"],
    image: beeswaxCandles,
    benefits: ["Burns longer than soy/paraffin", "Naturally purifies air", "Warm golden glow", "Subtle honey fragrance"],
    description: "An elegant, hand-poured solid beeswax pillar candle. Casts a beautiful warm light while naturally neutralizing airborne allergens.",
  },
  {
    slug: "pure-beeswax-tea-light-candle",
    name: "Pure Beeswax Tea Light Candle",
    tagline: "Natural Ambiance • Pack of 12",
    price: 349,
    mrp: 450,
    rating: 4.7,
    reviews: 124,
    category: "Beeswax Candles",
    sizes: ["Pack of 12"],
    image: beeswaxCandles,
    benefits: ["Perfect for daily use", "Cotton wicks", "No toxic soot", "Cozy atmosphere"],
    description: "A set of 12 pure beeswax tea lights. Perfect for dinner tables, baths, or meditation spaces. Clean-burning and natural.",
  },
  {
    slug: "decorative-beeswax-candle",
    name: "Decorative Beeswax Candle",
    tagline: "Sculptural Art • 100% Pure Wax",
    price: 499,
    rating: 4.9,
    reviews: 38,
    badge: "PREMIUM",
    category: "Beeswax Candles",
    sizes: ["Standard"],
    image: beeswaxCandles,
    benefits: ["Beautiful intricate design", "Perfect for gifting", "Natural honey scent", "Clean burn"],
    description: "A stunning sculptural candle cast from pure beeswax. Serves as a beautiful decor piece until you're ready to enjoy its warm light.",
  },
  {
    slug: "rolled-beeswax-candle",
    name: "Rolled Beeswax Candle",
    tagline: "Honeycomb Texture • Hand-Rolled",
    price: 299,
    rating: 4.6,
    reviews: 67,
    category: "Beeswax Candles",
    sizes: ["Pair"],
    image: beeswaxCandles,
    benefits: ["Distinctive honeycomb texture", "Drip-resistant", "Hand-rolled with care", "Natural aroma"],
    description: "A pair of taper candles meticulously hand-rolled from pure beeswax sheets. Their distinctive honeycomb texture adds rustic elegance to any setting.",
  },

  // BEAUTY PRODUCTS
  {
    slug: "honey-face-wash",
    name: "Honey Face Wash",
    tagline: "Gentle Cleansing • Raw Honey Infused",
    price: 449,
    mrp: 549,
    rating: 4.8,
    reviews: 189,
    badge: "BESTSELLER",
    category: "Beauty Products",
    sizes: ["150ml"],
    image: beautyProducts,
    benefits: ["Maintains skin's natural moisture", "Antibacterial properties", "Soothes redness", "Sulfate-free formula"],
    description: "A luxurious, gentle daily cleanser infused with our raw honey. Leaves skin feeling fresh, clean, and deeply hydrated without tightness.",
  },
  {
    slug: "honey-soap",
    name: "Honey Soap",
    tagline: "Artisan Crafted • Nourishing Bar",
    price: 199,
    rating: 4.7,
    reviews: 215,
    category: "Beauty Products",
    sizes: ["100g"],
    image: beautyProducts,
    benefits: ["Cold-processed artisan soap", "Rich creamy lather", "Gentle on sensitive skin", "No synthetic fragrances"],
    description: "Handcrafted cold-process soap made with raw honey and nourishing plant oils. A luxurious bathing experience that softens the skin.",
  },
  {
    slug: "honey-moisturizing-cream",
    name: "Honey Moisturizing Cream",
    tagline: "Deep Hydration • 24hr Moisture",
    price: 699,
    mrp: 899,
    rating: 4.9,
    reviews: 142,
    badge: "PREMIUM",
    category: "Beauty Products",
    sizes: ["50g"],
    image: beautyProducts,
    benefits: ["Locks in moisture all day", "Rich in antioxidants", "Improves skin elasticity", "Velvety smooth finish"],
    description: "An ultra-rich, deeply penetrating face cream formulated with raw honey, royal jelly, and botanical oils to restore and protect your skin.",
  },
  {
    slug: "honey-body-lotion",
    name: "Honey Body Lotion",
    tagline: "Silky Smooth • Daily Nourishment",
    price: 549,
    rating: 4.8,
    reviews: 96,
    category: "Beauty Products",
    sizes: ["250ml"],
    image: beautyProducts,
    benefits: ["Fast absorbing", "Non-greasy hydration", "Subtle natural scent", "Soothes dry patches"],
    description: "A lightweight yet deeply hydrating body lotion infused with natural honey extracts. Absorbs instantly to leave skin soft and glowing.",
  },
  {
    slug: "beeswax-hand-cream",
    name: "Beeswax Hand Cream",
    tagline: "Intensive Repair • Protective Barrier",
    price: 349,
    rating: 4.7,
    reviews: 178,
    badge: "NEW",
    category: "Beauty Products",
    sizes: ["50g"],
    image: beautyProducts,
    benefits: ["Heals cracked hands", "Creates a protective seal", "Withstands hand washing", "Nourishes cuticles"],
    description: "A heavy-duty restorative hand cream. Natural beeswax creates a breathable protective barrier that locks in moisture and heals over-worked hands.",
  },

  // GIFT HAMPERS
  {
    slug: "premium-honey-gift-box",
    name: "Premium Honey Gift Box",
    tagline: "Luxury Tasting Collection",
    price: 1299,
    mrp: 1499,
    rating: 4.9,
    reviews: 64,
    badge: "PREMIUM",
    category: "Gift Hampers",
    sizes: ["Standard"],
    image: luxuryHamper,
    benefits: ["Exquisite wooden box", "4 rare single-flora honeys", "Includes wooden dipper", "Perfect corporate gift"],
    description: "An elegant presentation of our finest, rarest single-flora honeys. Packaged in a handcrafted wooden box with a traditional wooden dipper.",
  },
  {
    slug: "luxury-honey-hamper",
    name: "Luxury Honey Hamper",
    tagline: "The Ultimate Bee Experience",
    price: 2499,
    mrp: 2999,
    rating: 5.0,
    reviews: 28,
    category: "Gift Hampers",
    sizes: ["Large"],
    image: luxuryHamper,
    benefits: ["Complete collection", "Includes honey, pollen & candles", "Premium woven basket", "Unforgettable unboxing"],
    description: "Our most opulent offering. A beautifully curated woven basket containing our finest honey, fresh bee pollen, and hand-poured beeswax candles.",
  },
  {
    slug: "wellness-gift-box",
    name: "Wellness Gift Box",
    tagline: "Health & Immunity Support",
    price: 1599,
    rating: 4.8,
    reviews: 45,
    badge: "BESTSELLER",
    category: "Gift Hampers",
    sizes: ["Standard"],
    image: luxuryHamper,
    benefits: ["Focuses on health benefits", "Includes pollen & raw honey", "Immunity boosting", "Thoughtful care package"],
    description: "Give the gift of health. This thoughtfully assembled box includes our most potent raw honeys and nutrient-dense bee pollen to support overall wellness.",
  },
  {
    slug: "festival-honey-gift-hamper",
    name: "Festival Honey Gift Hamper",
    tagline: "Celebrate with Nature's Sweetness",
    price: 1899,
    mrp: 2199,
    rating: 4.9,
    reviews: 82,
    category: "Gift Hampers",
    sizes: ["Standard"],
    image: luxuryHamper,
    benefits: ["Festive premium packaging", "Variety of flavors", "Includes beeswax tea lights", "Perfect for Diwali or weddings"],
    description: "Designed specifically for festive celebrations. A joyous collection of sweet honey varieties paired with natural beeswax tea lights to illuminate the occasion.",
  }
];

export const findProduct = (slug: string) => products.find((p) => p.slug === slug);

export function getProductVariants(product: Product): ProductVariant[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants;
  }
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["Standard"];
  const multipliers: Record<string, { factor: number; mrpFactor: number; weight: number }> = {
    "250g": { factor: 1, mrpFactor: 1.15, weight: 250 },
    "500g": { factor: 1.716, mrpFactor: 1.15, weight: 500 }, // e.g. 349 -> 599
    "1kg": { factor: 2.862, mrpFactor: 1.15, weight: 1000 }, // e.g. 349 -> 999
    "250ml": { factor: 1, mrpFactor: 1.15, weight: 250 },
    "500ml": { factor: 1.803, mrpFactor: 1.15, weight: 500 }, // e.g. 249 -> 449
    "100g": { factor: 0.6, mrpFactor: 1.15, weight: 100 },
  };

  return sizes.map((s, idx) => {
    const mult = multipliers[s] || { factor: idx === 0 ? 1 : idx === 1 ? 1.7 : 2.5, mrpFactor: 1.15, weight: 250 };
    const price = Math.round(product.price * mult.factor);
    const mrp = product.mrp ? Math.round(product.mrp * mult.factor) : Math.round(price * mult.mrpFactor);
    return {
      id: `${product.slug}-${s.toLowerCase()}`,
      label: s,
      price,
      mrp,
      stock: 50,
      inStock: true,
      isDefault: idx === 0,
      sku: `SH-${product.slug.toUpperCase().slice(0, 4)}-${s.toUpperCase()}`,
      weightG: mult.weight,
    };
  });
}

export function getDefaultVariant(product: Product): ProductVariant {
  const vars = getProductVariants(product);
  return (
    vars.find((v) => v.isDefault && v.inStock !== false && (v.stock === undefined || v.stock > 0)) ||
    vars.find((v) => v.inStock !== false && (v.stock === undefined || v.stock > 0)) ||
    vars.find((v) => v.isDefault) ||
    vars[0] || {
      label: product.sizes?.[0] || "Standard",
      price: product.price,
      mrp: product.mrp,
      inStock: true,
    }
  );
}

export function getVariantByLabel(product: Product, label?: string): ProductVariant {
  const vars = getProductVariants(product);
  if (label) {
    const found = vars.find((v) => v.label.toLowerCase() === label.toLowerCase());
    if (found) return found;
  }
  return getDefaultVariant(product);
}

