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
});
