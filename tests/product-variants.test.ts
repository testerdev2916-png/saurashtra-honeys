import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { config } from "dotenv";
config();
import {
  normalizeSizeKey,
  formatSizeDisplay,
  cleanProductName,
  getVariantByLabel,
  sortVariantsBySize,
  getVariantPackaging,
  resolveActiveImage,
  type Product,
} from "../src/lib/products.ts";
import { fetchProducts, fetchProduct } from "../src/lib/product-catalog.ts";

describe("Product Variants & Dynamic Size Selection", () => {
  it("normalizes variant keys accurately for case/unit/spacing variations", () => {
    assert.equal(normalizeSizeKey("250 GM"), "250g");
    assert.equal(normalizeSizeKey("250g"), "250g");
    assert.equal(normalizeSizeKey("250 gm"), "250g");
    assert.equal(normalizeSizeKey("500 GM"), "500g");
    assert.equal(normalizeSizeKey("1 KG"), "1kg");
    assert.equal(normalizeSizeKey("1kg"), "1kg");
    assert.equal(normalizeSizeKey("28 KG"), "28kg");
  });

  it("formats size display labels cleanly with uppercase units", () => {
    assert.equal(formatSizeDisplay("250g"), "250 GM");
    assert.equal(formatSizeDisplay("250gm"), "250 GM");
    assert.equal(formatSizeDisplay("250 GM"), "250 GM");
    assert.equal(formatSizeDisplay("500g"), "500 GM");
    assert.equal(formatSizeDisplay("1kg"), "1 KG");
    assert.equal(formatSizeDisplay("28kg"), "28 KG");
    assert.equal(formatSizeDisplay("350g"), "350 GM");
    assert.equal(formatSizeDisplay("250"), "250 GM");
    assert.equal(formatSizeDisplay("500g + Dipper"), "500g + Dipper");
  });

  it("cleans product names by removing redundant trailing weight suffixes", () => {
    assert.equal(cleanProductName("Multiflora Honey -250GM"), "Multiflora Honey");
    assert.equal(cleanProductName("Multiflora Honey -500GM"), "Multiflora Honey");
    assert.equal(cleanProductName("Multiflora Honey -1KG"), "Multiflora Honey");
    assert.equal(cleanProductName("Multiflora Honey -28Kg"), "Multiflora Honey");
    assert.equal(cleanProductName("Ajwain Honey 250 "), "Ajwain Honey");
    assert.equal(cleanProductName("Ajwain Honey 500 GM "), "Ajwain Honey");
    assert.equal(cleanProductName("Fennel Honey-250GM"), "Fennel Honey");
    assert.equal(cleanProductName("Pure Honey  Gulkand"), "Pure Honey  Gulkand");
  });

  it("resolves variant by label dynamically with normalized matching", () => {
    const testProduct: Product = {
      slug: "multiflora-honey-250GM",
      name: "Multiflora Honey",
      tagline: "Pure raw honey",
      price: 190,
      mrp: 220,
      rating: 4.9,
      reviews: 120,
      category: "Honey",
      flora: "Multiflora",
      sizes: ["250g", "500g", "1kg", "28kg"],
      variants: [
        { id: "v-250", label: "250g", price: 190, mrp: 220, stock: 400, inStock: true, isDefault: true },
        { id: "v-500", label: "500g", price: 350, mrp: 400, stock: 400, inStock: true },
        { id: "v-1k", label: "1kg", price: 650, mrp: 700, stock: 400, inStock: true },
        { id: "v-28k", label: "28kg", price: 7000, mrp: 7500, stock: 400, inStock: true },
      ],
      image: "",
      benefits: [],
      description: "",
    };

    // Exact label
    const v250 = getVariantByLabel(testProduct, "250g");
    assert.equal(v250.price, 190);
    assert.equal(v250.mrp, 220);

    // Formatted label "500 GM" matches "500g"
    const v500 = getVariantByLabel(testProduct, "500 GM");
    assert.equal(v500.price, 350);
    assert.equal(v500.mrp, 400);

    // Formatted label "1 KG" matches "1kg"
    const v1k = getVariantByLabel(testProduct, "1 KG");
    assert.equal(v1k.price, 650);
    assert.equal(v1k.mrp, 700);

    // Formatted label "28 KG" matches "28kg"
    const v28k = getVariantByLabel(testProduct, "28 KG");
    assert.equal(v28k.price, 7000);
    assert.equal(v28k.mrp, 7500);
  });

  it("fetches published products from database with all sizes and variants", async () => {
    const products = await fetchProducts();
    assert.ok(products.length > 0, "Expected published products to be fetched");

    const multi = products.find((p) => p.flora === "Multiflora" && p.showOnHomepage);
    assert.ok(multi, "Expected Multiflora Honey to be present on homepage");
    assert.ok(multi.sizes.length >= 3, `Expected at least 3 sizes for Multiflora Honey, got: ${multi.sizes.join(", ")}`);
    assert.ok(multi.sizes.includes("250g"));
    assert.ok(multi.sizes.includes("500g"));
    assert.ok(multi.sizes.includes("1kg"));

    // Check dynamic price resolution on the fetched product
    const v500 = getVariantByLabel(multi, "500g");
    assert.equal(v500.price, 350);
    assert.equal(v500.mrp, 400);

    const v1kg = getVariantByLabel(multi, "1kg");
    assert.equal(v1kg.price, 650);
    assert.equal(v1kg.mrp, 700);
  });

  it("displays only one size for single-size products like Pure Honey Gulkand", async () => {
    const products = await fetchProducts();
    const gulkand = products.find((p) => p.name.includes("Gulkand"));
    assert.ok(gulkand, "Expected Pure Honey Gulkand to be present");
    assert.equal(gulkand.sizes.length, 1, `Expected exactly 1 size for Gulkand, got: ${gulkand.sizes}`);
    assert.equal(gulkand.sizes[0], "350g");
  });

  it("resolves alias slugs correctly to base product with all variants", async () => {
    const aliased = await fetchProduct("multiflora-honey-500GM");
    assert.ok(aliased, "Expected alias multiflora-honey-500GM to resolve");
    assert.ok(aliased.sizes.includes("250g"));
    assert.ok(aliased.sizes.includes("500g"));
    assert.ok(aliased.sizes.includes("1kg"));
  });

  it("accurately assigns packaging labels (28kg -> Plastic Bucket, 1kg -> Plastic Jar, 250g/500g -> Glass Jar)", () => {
    assert.equal(getVariantPackaging("28kg"), "Plastic Bucket");
    assert.equal(getVariantPackaging("28 KG"), "Plastic Bucket");
    assert.equal(getVariantPackaging("10kg"), "Plastic Bucket");
    assert.notEqual(getVariantPackaging("28kg"), "Plastic Jar");
    assert.notEqual(getVariantPackaging("28kg"), "Glass Jar");

    assert.equal(getVariantPackaging("1kg"), "Plastic Jar");
    assert.equal(getVariantPackaging("1 KG"), "Plastic Jar");

    assert.equal(getVariantPackaging("500g"), "Glass Jar");
    assert.equal(getVariantPackaging("500 GM"), "Glass Jar");
    assert.equal(getVariantPackaging("250g"), "Glass Jar");
    assert.equal(getVariantPackaging("250 GM"), "Glass Jar");
    assert.equal(getVariantPackaging("350g"), "Glass Jar");
  });

  it("verifies live variants have valid ImageKit packaging images for all sizes", async () => {
    const products = await fetchProducts();
    const multi = products.find((p) => p.flora === "Multiflora" && p.showOnHomepage);
    assert.ok(multi, "Expected Multiflora Honey to be found");

    const v250 = getVariantByLabel(multi, "250g");
    const v500 = getVariantByLabel(multi, "500g");
    const v1kg = getVariantByLabel(multi, "1kg");
    const v28kg = getVariantByLabel(multi, "28kg");

    assert.equal(v250.packaging, "Glass Jar");
    assert.equal(v500.packaging, "Glass Jar");
    assert.equal(v1kg.packaging, "Plastic Jar");
    assert.equal(v28kg.packaging, "Plastic Bucket");

    const img250 = resolveActiveImage(multi, v250);
    const img500 = resolveActiveImage(multi, v500);
    const img1kg = resolveActiveImage(multi, v1kg);
    const img28kg = resolveActiveImage(multi, v28kg);

    assert.ok(img250.includes("5_7LQIRcqFer"), `Expected 250g jar image, got ${img250}`);
    assert.ok(img500.includes("3_ccoQw3oqa"), `Expected 500g jar image, got ${img500}`);
    assert.ok(img1kg.includes("1_fIrYppI9P"), `Expected 1kg plastic jar image, got ${img1kg}`);
    assert.ok(img28kg.includes("2_GuyHNq6MQl"), `Expected 28kg plastic bucket image, got ${img28kg}`);
    assert.notEqual(img28kg, img1kg, "28kg bucket image must NOT be the same as 1kg jar image");
    assert.notEqual(img28kg, img500, "28kg bucket image must NOT be the same as 500g jar image");
  });

  it("verifies dynamic variant pricing, discounts, and packaging across Ajwain Honey", async () => {
    const products = await fetchProducts();
    const ajwain = products.find((p) => p.slug === "ajwain-honey-500" || (p.flora === "Ajwain" && p.variants && p.variants.length > 1));
    assert.ok(ajwain, "Expected master Ajwain Honey to be found");

    const v250 = getVariantByLabel(ajwain, "250g");
    const v500 = getVariantByLabel(ajwain, "500g");
    const v1kg = getVariantByLabel(ajwain, "1kg");
    const v28kg = getVariantByLabel(ajwain, "28kg");

    assert.equal(v250.price, 190);
    assert.equal(v250.mrp, 220);
    assert.equal(Math.round(((v250.mrp! - v250.price) / v250.mrp!) * 100), 14); // 14% OFF
    assert.equal(v250.packaging, "Glass Jar");

    assert.equal(v500.price, 350);
    assert.equal(v500.mrp, 400);
    assert.equal(Math.round(((v500.mrp! - v500.price) / v500.mrp!) * 100), 13); // 13% OFF
    assert.equal(v500.packaging, "Glass Jar");

    assert.equal(v1kg.price, 600);
    assert.equal(v1kg.mrp, 650);
    assert.equal(Math.round(((v1kg.mrp! - v1kg.price) / v1kg.mrp!) * 100), 8); // 8% OFF
    assert.equal(v1kg.packaging, "Plastic Jar");

    assert.equal(v28kg.price, 6720);
    assert.equal(v28kg.mrp, 7000);
    assert.equal(Math.round(((v28kg.mrp! - v28kg.price) / v28kg.mrp!) * 100), 4); // 4% OFF
    assert.equal(v28kg.packaging, "Plastic Bucket");
  });

  it("verifies dynamic variant pricing, discounts, and packaging across Fennel Honey", async () => {
    const products = await fetchProducts();
    const fennel = products.find((p) => p.slug === "fennel-honey-250GM" || (p.flora === "Fennel" && p.variants && p.variants.length > 1));
    assert.ok(fennel, "Expected master Fennel Honey to be found");

    const v250 = getVariantByLabel(fennel, "250g");
    const v500 = getVariantByLabel(fennel, "500g");
    const v28kg = getVariantByLabel(fennel, "28kg");

    assert.equal(v250.price, 190);
    assert.equal(v250.mrp, 220);
    assert.equal(v250.packaging, "Glass Jar");

    assert.equal(v500.price, 350);
    assert.equal(v500.mrp, 400);
    assert.equal(v500.packaging, "Glass Jar");

    assert.equal(v28kg.price, 7000);
    assert.equal(v28kg.mrp, 7500);
    assert.equal(v28kg.packaging, "Plastic Bucket");
  });

  it("verifies Bee Wax variants (1kg and 10kg bucket)", async () => {
    const products = await fetchProducts();
    const wax = products.find((p) => p.slug === "Bee Wax");
    assert.ok(wax, "Expected Bee Wax to be found");
    assert.ok(wax.variants && wax.variants.length >= 2, "Expected at least 2 variants for Bee Wax");

    const v1kg = getVariantByLabel(wax, "1kg");
    const v10kg = getVariantByLabel(wax, "10kg");

    assert.equal(v1kg.price, 450);
    assert.equal(v1kg.mrp, 500);
    assert.equal(v1kg.packaging, "Plastic Jar");

    assert.equal(v10kg.price, 3500);
    assert.equal(v10kg.mrp, 4000);
    assert.equal(v10kg.packaging, "Plastic Bucket");
  });

  it("deduplicates alias products in fetchProducts so Shop page has clean cards", async () => {
    const products = await fetchProducts();
    const slugs = products.map((p) => p.slug);
    // Master products must be present
    assert.ok(slugs.includes("multiflora-honey-250GM"));
    assert.ok(slugs.includes("ajwain-honey-500"));
    assert.ok(slugs.includes("fennel-honey-250GM"));
    assert.ok(slugs.includes("Bee Wax"));

    // Redundant alias products should be omitted from list
    assert.ok(!slugs.includes("multiflora-honey-1KG"));
    assert.ok(!slugs.includes("multiflora-honey-500GM"));
    assert.ok(!slugs.includes("ajwain-honey-1 kg"));
    assert.ok(!slugs.includes("fennel-honey-500GM"));
    assert.ok(!slugs.includes("Bee Wax-10Kg"));
  });

  it("synchronizes the entire gallery and thumbnails when switching variants for Multiflora Honey", async () => {
    const p = await fetchProduct("multiflora-honey-250GM");
    assert.ok(p, "Expected Multiflora Honey to be found");

    const v250 = getVariantByLabel(p, "250g");
    const v500 = getVariantByLabel(p, "500g");
    const v1kg = getVariantByLabel(p, "1kg");
    const v28kg = getVariantByLabel(p, "28kg");

    // 250g gallery: Front & Back
    assert.equal(v250.images?.length, 2, "250g must have 2 images (front and back)");
    assert.ok(v250.images![0].includes("5_7LQIRcqFer"), "250g image 1 must be front label");
    assert.ok(v250.images![1].includes("6_lhCFbDrYG"), "250g image 2 must be back label");

    // 500g gallery: Front & Back (must NOT retain 250g back label!)
    assert.equal(v500.images?.length, 2, "500g must have 2 images (front and back)");
    assert.ok(v500.images![0].includes("3_ccoQw3oqa"), "500g image 1 must be front label");
    assert.ok(v500.images![1].includes("4_bSus_02ot"), "500g image 2 must be back label");
    assert.ok(!v500.images!.some((img) => img.includes("6_lhCFbDrYG")), "500g gallery must NOT contain 250g images");

    // 1kg gallery: Front & Back (must NOT retain 250g or 500g images!)
    assert.equal(v1kg.images?.length, 2, "1kg must have 2 images (front and back)");
    assert.ok(v1kg.images![0].includes("1_fIrYppI9P"), "1kg image 1 must be front label");
    assert.ok(v1kg.images![1].includes("2_j9611EO6XS"), "1kg image 2 must be back label");
    assert.ok(!v1kg.images!.some((img) => img.includes("6_lhCFbDrYG")), "1kg gallery must NOT contain 250g images");

    // 28kg gallery: 28kg plastic bucket
    assert.equal(v28kg.images?.length, 1, "28kg must have 1 bucket image");
    assert.ok(v28kg.images![0].includes("2_GuyHNq6MQl"), "28kg image must be 28kg bucket");
    assert.ok(!v28kg.images!.some((img) => img.includes("6_lhCFbDrYG")), "28kg gallery must NOT contain 250g images");
  });

  it("synchronizes the entire gallery and thumbnails when switching variants for Ajwain Honey", async () => {
    const p = await fetchProduct("ajwain-honey-500");
    assert.ok(p, "Expected Ajwain Honey to be found");

    const v250 = getVariantByLabel(p, "250g");
    const v500 = getVariantByLabel(p, "500g");
    const v1kg = getVariantByLabel(p, "1kg");
    const v28kg = getVariantByLabel(p, "28kg");

    // 250g gallery
    assert.equal(v250.images?.length, 2);
    assert.ok(v250.images![0].includes("250G_AJWAIN_FLORA_HONEY_FRONT"));
    assert.ok(v250.images![1].includes("250G_AJWAIN_FLORA_HONEY_BACK"));

    // 500g gallery
    assert.equal(v500.images?.length, 2);
    assert.ok(v500.images![0].includes("AJWAIN_FLORA_HONEY_FRONT"));
    assert.ok(v500.images![1].includes("AJAWIN_FLORA_HONEY_BACK"));
    assert.ok(!v500.images!.some((img) => img.includes("250G_AJWAIN")), "500g gallery must NOT contain 250g images");

    // 1kg gallery
    assert.equal(v1kg.images?.length, 2);
    assert.ok(v1kg.images![0].includes("1KG_AJWAIN_FLORA_HONEY_FRONT"));
    assert.ok(v1kg.images![1].includes("1KG_AJWAIN_HONEY_BACK"));

    // 28kg gallery
    assert.equal(v28kg.images?.length, 1);
    assert.ok(v28kg.images![0].includes("1_T0GoQWaaK0"));
  });

  it("synchronizes the entire gallery and thumbnails when switching variants for Fennel Honey and Bee Wax", async () => {
    const fennel = await fetchProduct("fennel-honey-250GM");
    assert.ok(fennel, "Expected Fennel Honey to be found");

    const f250 = getVariantByLabel(fennel, "250g");
    const f500 = getVariantByLabel(fennel, "500g");
    const f28kg = getVariantByLabel(fennel, "28kg");

    assert.equal(f250.images?.length, 2);
    assert.ok(f250.images![0].includes("250G_FENNEL_FLORA_HONEY_FRONT"));
    assert.ok(f250.images![1].includes("250G_FENNEL_FLORA_HONEY_BACK"));

    assert.equal(f500.images?.length, 2);
    assert.ok(f500.images![0].includes("FENNEL_FLORA_HONEY_FRONT"));
    assert.ok(f500.images![1].includes("FENNEL_FLORA_HONEY_BACK"));

    assert.equal(f28kg.images?.length, 1);
    assert.ok(f28kg.images![0].includes("3_fbzPJ5gqY"));

    const wax = await fetchProduct("Bee Wax");
    assert.ok(wax, "Expected Bee Wax to be found");
    const w1kg = getVariantByLabel(wax, "1kg");
    const w10kg = getVariantByLabel(wax, "10kg");

    assert.equal(w1kg.images?.length, 1);
    assert.equal(w10kg.images?.length, 2);
    assert.ok(w10kg.images![0].includes("Bulk_YMGQvQAcZ"));
  });

  it("generates separate product cards for each weight variant with correct default selection and all pills", async () => {
    const products = await fetchProducts();
    const multi = products.find((p) => p.flora === "Multiflora" && p.showOnHomepage);
    assert.ok(multi, "Multiflora Honey product should exist");

    // Helper imitating shop cards expansion
    function expandToShopCards(productList: Product[]) {
      type ShopCardItem = {
        cardKey: string;
        product: Product;
        initialSize: string;
        effectivePrice: number;
        effectiveMrp?: number;
        displayName: string;
        availableSizes: string[];
      };
      const cards: ShopCardItem[] = [];
      for (const p of productList) {
        const vars = p.variants && p.variants.length > 0 ? p.variants : [];
        const hasMultiple = vars.length > 1 || (p.sizes && p.sizes.length > 1);
        const baseName = cleanProductName(p.name);

        if (hasMultiple && vars.length > 0) {
          for (const v of vars) {
            cards.push({
              cardKey: `${p.slug}-${normalizeSizeKey(v.label) || v.label}`,
              product: p,
              initialSize: v.label,
              effectivePrice: v.price,
              effectiveMrp: v.mrp,
              displayName: `${baseName} – ${formatSizeDisplay(v.label)}`,
              availableSizes: vars.map((x) => x.label),
            });
          }
        } else {
          cards.push({
            cardKey: p.slug,
            product: p,
            initialSize: p.sizes?.[0] || "",
            effectivePrice: p.price,
            effectiveMrp: p.mrp,
            displayName: baseName,
            availableSizes: p.sizes || [],
          });
        }
      }
      return cards;
    }

    const cards = expandToShopCards(products);
    const multiCards = cards.filter((c) => c.product.slug === multi.slug);

    // Multiflora Honey has 4 variants -> 4 separate cards
    assert.equal(multiCards.length, 4, "Multiflora should produce exactly 4 cards");
    assert.equal(multiCards[0].displayName, "Multiflora Honey – 250 GM");
    assert.equal(multiCards[0].initialSize, "250g");
    assert.equal(multiCards[1].displayName, "Multiflora Honey – 500 GM");
    assert.equal(multiCards[1].initialSize, "500g");
    assert.equal(multiCards[2].displayName, "Multiflora Honey – 1 KG");
    assert.equal(multiCards[2].initialSize, "1kg");
    assert.equal(multiCards[3].displayName, "Multiflora Honey – 28 KG");
    assert.equal(multiCards[3].initialSize, "28kg");

    // Every card has ALL available weight options as selectable pills
    for (const card of multiCards) {
      assert.deepEqual(
        card.availableSizes.map(formatSizeDisplay),
        ["250 GM", "500 GM", "1 KG", "28 KG"],
        "Every Multiflora card must provide all 4 variant pills",
      );
    }

    // Verify Ajwain Honey produces 4 cards
    const ajwain = products.find((p) => p.flora === "Ajwain" && p.showOnHomepage);
    assert.ok(ajwain, "Ajwain Honey product should exist");
    const ajwainCards = cards.filter((c) => c.product.slug === ajwain.slug);
    assert.equal(ajwainCards.length, 4, "Ajwain should produce 4 separate cards");
    assert.equal(ajwainCards[0].displayName, "Ajwain Honey – 250 GM");
    assert.equal(ajwainCards[3].displayName, "Ajwain Honey – 28 KG");

    // Verify Fennel Honey produces 3 cards (250g, 500g, 28kg)
    const fennel = products.find((p) => p.flora === "Fennel" && p.showOnHomepage);
    assert.ok(fennel, "Fennel Honey product should exist");
    const fennelCards = cards.filter((c) => c.product.slug === fennel.slug);
    assert.equal(fennelCards.length, 3, "Fennel should produce 3 separate cards");
    assert.equal(fennelCards[0].displayName, "Fennel Honey – 250 GM");
    assert.equal(fennelCards[2].displayName, "Fennel Honey – 28 KG");

    // Verify single-size product (Pure Honey Gulkand) produces exactly 1 card without suffix
    const gulkand = products.find((p) => p.name.includes("Gulkand"));
    if (gulkand) {
      const gulkandCards = cards.filter((c) => c.product.slug === gulkand.slug);
      assert.equal(gulkandCards.length, 1, "Gulkand should produce 1 card");
      assert.ok(!gulkandCards[0].displayName.includes("–"), "Single-size card must not include a trailing size suffix");
    }
  });

  it("dynamically updates individual card metadata when switching pills", async () => {
    const p = await fetchProduct("multiflora-honey-250GM");
    assert.ok(p, "Expected Multiflora product to exist");

    function getCardState(product: Product, selectedSize: string) {
      const variant = getVariantByLabel(product, selectedSize);
      const activePrice = variant.price;
      const activeMrp = variant.mrp;
      const packaging = variant.packaging || getVariantPackaging(variant || selectedSize);
      const image = resolveActiveImage(product, variant);
      const displayName = `${cleanProductName(product.name)} – ${formatSizeDisplay(selectedSize)}`;
      return { variant, activePrice, activeMrp, packaging, image, displayName };
    }

    // State on 250 GM card
    const state250 = getCardState(p, "250g");
    assert.equal(state250.displayName, "Multiflora Honey – 250 GM");
    assert.equal(state250.activePrice, 190);
    assert.equal(state250.packaging, "Glass Jar");
    assert.ok(state250.image.includes("5_7LQIRcqFer"));

    // Customer switches 250 GM card to 1 KG
    const stateSwitchedTo1kg = getCardState(p, "1kg");
    assert.equal(stateSwitchedTo1kg.displayName, "Multiflora Honey – 1 KG");
    assert.equal(stateSwitchedTo1kg.activePrice, 650);
    assert.equal(stateSwitchedTo1kg.packaging, "Plastic Jar");
    assert.ok(stateSwitchedTo1kg.image.includes("1_fIrYppI9P"));

    // Customer switches to 28 KG
    const stateSwitchedTo28kg = getCardState(p, "28kg");
    assert.equal(stateSwitchedTo28kg.displayName, "Multiflora Honey – 28 KG");
    assert.equal(stateSwitchedTo28kg.activePrice, 7000);
    assert.equal(stateSwitchedTo28kg.packaging, "Plastic Bucket");
    assert.ok(stateSwitchedTo28kg.image.includes("2_GuyHNq6MQl"));
  });

  it("sorts expanded cards correctly by effective variant price", async () => {
    const products = await fetchProducts();
    const multi = products.find((p) => p.flora === "Multiflora" && p.showOnHomepage);
    assert.ok(multi);

    const vars = multi.variants || [];
    const multiCards = vars.map((v) => ({
      name: `${cleanProductName(multi.name)} – ${formatSizeDisplay(v.label)}`,
      effectivePrice: v.price,
    }));

    // Price Ascending: 250g (190) -> 500g (350) -> 1kg (650) -> 28kg (7000)
    const asc = [...multiCards].sort((a, b) => a.effectivePrice - b.effectivePrice);
    assert.equal(asc[0].name, "Multiflora Honey – 250 GM");
    assert.equal(asc[3].name, "Multiflora Honey – 28 KG");

    // Price Descending: 28kg (7000) -> 1kg (650) -> 500g (350) -> 250g (190)
    const desc = [...multiCards].sort((a, b) => b.effectivePrice - a.effectivePrice);
    assert.equal(desc[0].name, "Multiflora Honey – 28 KG");
    assert.equal(desc[3].name, "Multiflora Honey – 250 GM");
  });

  it("stores shared content (How to Use, Ingredients, Process, Farm, Certificates, Lifestyle) with 250 GM variant and shares across Multiflora Honey sizes", async () => {
    // 1. Fetch 250 GM variant directly
    const p250 = await fetchProduct("multiflora-honey-250GM");
    assert.ok(p250, "Expected multiflora-honey-250GM to exist");
    assert.ok(p250.sharedContent, "Expected sharedContent to be present on 250 GM variant");
    assert.equal(p250.sharedContent.sourceVariant, "250 GM");
    assert.ok(p250.sharedContent.story_description?.includes("Multiflora Honey is a naturally sourced"));
    assert.ok(p250.sharedContent.what_makes_special && p250.sharedContent.what_makes_special.length > 0);
    assert.ok(p250.sharedContent.infographics, "Expected infographics on 250 GM variant");
    assert.ok(p250.sharedContent.infographics.howToUse?.includes("3_HC7BJal6E"));
    assert.ok(p250.sharedContent.infographics.ingredients?.includes("2_cIZjSdzrVm"));
    assert.ok(p250.sharedContent.infographics.ourProcess?.includes("5_HyAoNB9B0"));
    assert.ok(p250.sharedContent.infographics.ourFarm?.includes("6_Ix51y_0X3"));
    assert.ok(p250.sharedContent.infographics.certificates?.includes("7_w2_WJV7_B"));
    assert.ok(p250.sharedContent.infographics.lifestyle?.includes("4_VJqxZP_QFB"));

    // 2. Fetch 500 GM variant directly via slug
    const p500 = await fetchProduct("multiflora-honey-500GM");
    assert.ok(p500, "Expected multiflora-honey-500GM to resolve");
    assert.equal(p500.sharedContent?.sourceVariant, "250 GM");
    assert.equal(p500.sharedContent.story_description, p250.sharedContent.story_description);
    assert.deepEqual(p500.sharedContent.infographics, p250.sharedContent.infographics);

    // 3. Fetch 1 KG variant directly via slug
    const p1kg = await fetchProduct("multiflora-honey-1KG");
    assert.ok(p1kg, "Expected multiflora-honey-1KG to resolve");
    assert.equal(p1kg.sharedContent?.sourceVariant, "250 GM");
    assert.equal(p1kg.sharedContent.story_description, p250.sharedContent.story_description);
    assert.deepEqual(p1kg.sharedContent.infographics, p250.sharedContent.infographics);

    // 4. Fetch 28 KG variant directly via slug
    const p28kg = await fetchProduct("multiflora-honey-28 Kg");
    assert.ok(p28kg, "Expected multiflora-honey-28 Kg to resolve");
    assert.equal(p28kg.sharedContent?.sourceVariant, "250 GM");
    assert.equal(p28kg.sharedContent.story_description, p250.sharedContent.story_description);
    assert.deepEqual(p28kg.sharedContent.infographics, p250.sharedContent.infographics);

    // 5. Keep variant-specific data strictly separate
    const v250 = getVariantByLabel(p250, "250g");
    const v500 = getVariantByLabel(p250, "500g");
    const v1kg = getVariantByLabel(p250, "1kg");
    const v28kg = getVariantByLabel(p250, "28kg");

    assert.equal(v250.price, 190);
    assert.equal(v500.price, 350);
    assert.equal(v1kg.price, 650);
    assert.equal(v28kg.price, 7000);

    assert.equal(v250.packaging, "Glass Jar");
    assert.equal(v500.packaging, "Glass Jar");
    assert.equal(v1kg.packaging, "Plastic Jar");
    assert.equal(v28kg.packaging, "Plastic Bucket");

    assert.notEqual(v250.image_url, v1kg.image_url);
    assert.notEqual(v1kg.image_url, v28kg.image_url);
  });

  it("automatically fetches and displays shared 250 GM content across Ajwain Honey variants", async () => {
    // 1. Fetch 250 GM Ajwain variant directly
    const ajw250 = await fetchProduct("ajwain-honey");
    assert.ok(ajw250, "Expected ajwain-honey to exist");
    assert.equal(ajw250.sharedContent?.sourceVariant, "250 GM");
    assert.ok(ajw250.sharedContent.story_description?.includes("Ajwain Honey is a distinctive floral honey"));
    assert.ok(ajw250.sharedContent.infographics?.howToUse?.includes("3_qvQR-sZFa"));
    assert.ok(ajw250.sharedContent.infographics?.ingredients?.includes("2_AFTXXnznu"));
    assert.ok(ajw250.sharedContent.infographics?.ourProcess?.includes("5_tbV1gdagY"));
    assert.ok(ajw250.sharedContent.infographics?.ourFarm?.includes("6_OrEaNYIfK"));
    assert.ok(ajw250.sharedContent.infographics?.certificates?.includes("7_ALY8EtVL9B"));
    assert.ok(ajw250.sharedContent.infographics?.lifestyle?.includes("4_G_lfbuXdl"));

    // 2. Fetch 500 GM Ajwain variant
    const ajw500 = await fetchProduct("ajwain-honey-500");
    assert.ok(ajw500, "Expected ajwain-honey-500 to resolve");
    assert.equal(ajw500.sharedContent?.sourceVariant, "250 GM");
    assert.equal(ajw500.sharedContent.story_description, ajw250.sharedContent.story_description);
    assert.deepEqual(ajw500.sharedContent.infographics, ajw250.sharedContent.infographics);

    // 3. Fetch 1 KG Ajwain variant
    const ajw1kg = await fetchProduct("ajwain-honey-1 kg");
    assert.ok(ajw1kg, "Expected ajwain-honey-1 kg to resolve");
    assert.equal(ajw1kg.sharedContent?.sourceVariant, "250 GM");
    assert.equal(ajw1kg.sharedContent.story_description, ajw250.sharedContent.story_description);
    assert.deepEqual(ajw1kg.sharedContent.infographics, ajw250.sharedContent.infographics);

    // 4. Fetch 28 KG Ajwain variant
    const ajw28kg = await fetchProduct("ajwain-honey-28KG");
    assert.ok(ajw28kg, "Expected ajwain-honey-28KG to resolve");
    assert.equal(ajw28kg.sharedContent?.sourceVariant, "250 GM");
    assert.equal(ajw28kg.sharedContent.story_description, ajw250.sharedContent.story_description);
    assert.deepEqual(ajw28kg.sharedContent.infographics, ajw250.sharedContent.infographics);

    // 5. Verify packaging separation
    const v250 = getVariantByLabel(ajw250, "250g");
    const v500 = getVariantByLabel(ajw250, "500g");
    const v1kg = getVariantByLabel(ajw250, "1kg");
    const v28kg = getVariantByLabel(ajw250, "28kg");

    assert.equal(v250.price, 190);
    assert.equal(v500.price, 350);
    assert.equal(v1kg.price, 600);
    assert.equal(v28kg.price, 6720);

    assert.equal(v250.packaging, "Glass Jar");
    assert.equal(v500.packaging, "Glass Jar");
    assert.equal(v1kg.packaging, "Plastic Jar");
    assert.equal(v28kg.packaging, "Plastic Bucket");
  });

  it("automatically fetches and displays shared 250 GM content across Fennel Honey variants", async () => {
    const fen250 = await fetchProduct("fennel-honey-250GM");
    assert.ok(fen250, "Expected fennel-honey-250GM to exist");
    assert.equal(fen250.sharedContent?.sourceVariant, "250 GM");
    assert.ok(fen250.sharedContent.story_description?.includes("Fennel Honey is a distinctive floral honey"));
    assert.ok(fen250.sharedContent.infographics?.howToUse?.includes("3_40tE4Ib7i"));
    assert.ok(fen250.sharedContent.infographics?.ingredients?.includes("2_BVWKSWrT6"));
    assert.ok(fen250.sharedContent.infographics?.ourProcess?.includes("5_YX14iCCDx"));
    assert.ok(fen250.sharedContent.infographics?.certificates?.includes("7_O5GDjHf-Iq"));
    assert.ok(fen250.sharedContent.infographics?.lifestyle?.includes("4_9LRK4Dxe_"));

    // 500 GM Fennel variant inherits shared content from 250 GM
    const fen500 = await fetchProduct("fennel-honey-500GM");
    assert.ok(fen500);
    assert.equal(fen500.sharedContent?.sourceVariant, "250 GM");
    assert.equal(fen500.sharedContent.story_description, fen250.sharedContent.story_description);
    assert.deepEqual(fen500.sharedContent.infographics, fen250.sharedContent.infographics);

    // 28 KG Fennel variant inherits shared content from 250 GM
    const fen28kg = await fetchProduct("fennel-honey-28KG");
    assert.ok(fen28kg);
    assert.equal(fen28kg.sharedContent?.sourceVariant, "250 GM");
    assert.equal(fen28kg.sharedContent.story_description, fen250.sharedContent.story_description);
    assert.deepEqual(fen28kg.sharedContent.infographics, fen250.sharedContent.infographics);
  });

  it("ensures combo products and gift hampers remain independent and never inherit from 250 GM honey", async () => {
    const products = await fetchProducts();
    const combosAndHampers = products.filter(
      (p) =>
        p.category === "Gift Hamper" ||
        p.name.toLowerCase().includes("combo") ||
        p.name.toLowerCase().includes("hamper") ||
        p.slug.toLowerCase().includes("combo") ||
        p.slug.toLowerCase().includes("hamper"),
    );

    assert.ok(combosAndHampers.length >= 4, "Expected at least 4 combo or hamper products");

    for (const item of combosAndHampers) {
      assert.notEqual(
        item.sharedContent?.sourceSlug,
        "multiflora-honey-250GM",
        `Expected ${item.name} not to inherit from Multiflora 250GM`,
      );
      assert.notEqual(
        item.sharedContent?.sourceSlug,
        "ajwain-honey",
        `Expected ${item.name} not to inherit from Ajwain 250GM`,
      );
      assert.notEqual(
        item.sharedContent?.sourceSlug,
        "fennel-honey-250GM",
        `Expected ${item.name} not to inherit from Fennel 250GM`,
      );
    }
  });

  it("handles products without a 250 GM variant gracefully without throwing or assuming existence", async () => {
    // Pure Honey Gulkand (350g only)
    const gulkand = await fetchProduct("Pure Honey gulkand");
    assert.ok(gulkand, "Expected Pure Honey Gulkand to load");
    assert.equal(gulkand.sizes.length, 1);
    assert.equal(gulkand.sizes[0], "350g");

    // Bee Wax (1kg, 10kg)
    const beeWax = await fetchProduct("Bee Wax");
    assert.ok(beeWax, "Expected Bee Wax to load");
    assert.ok(beeWax.sizes.includes("1kg"));
    assert.ok(beeWax.sizes.includes("10kg"));
    assert.equal(beeWax.sharedContent?.sourceSlug, "Bee Wax");
  });
});

