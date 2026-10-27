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
});
