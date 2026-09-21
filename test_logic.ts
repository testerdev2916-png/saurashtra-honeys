function resolveImage(url) {
  if (!url) return "";
  let cleanUrl = url.trim();
  if (cleanUrl.includes('res.cloudinary.com')) return cleanUrl;
  if (/^https?:\/\//i.test(cleanUrl)) return cleanUrl;
  return "SUPABASE_URL";
}

const prod = {
  image_url: "https://res.cloudinary.com/yzmffalu/image/upload/f_auto,q_auto/v1788875497/saurashtra-honey/products/1788018254135_3_Benefits.png",
  images: [
    "",
    "",
    "https://res.cloudinary.com/yzmffalu/image/upload/f_auto,q_auto/v1788875497/saurashtra-honey/products/1788018254135_3_Benefits.png",
    "https://res.cloudinary.com/yzmffalu/image/upload/f_auto,q_auto/v1788875500/saurashtra-honey/products/1788018264223_4_Ingredients.png"
  ],
  additional_images: null
};

const variant = {
  image_url: "https://res.cloudinary.com/yzmffalu/image/upload/f_auto,q_auto/v1790001565/saurashtra-honey/products/ChatGPT%20Image%20Sep%2021%2C%202026%20at%2007_52_48%20PM_dg6k8erc2us_1790001562789.png",
  images: [
    "https://res.cloudinary.com/yzmffalu/image/upload/f_auto,q_auto/v1790001578/saurashtra-honey/products/ChatGPT%20Image%20Sep%2021%2C%202026%20at%2007_52_52%20PM_z84jvos47ch_1790001577400.png",
    "",
    "",
    ""
  ]
};

// product-catalog.ts logic
const rawImages = (prod.images).filter(u => typeof u === "string" && u.trim().length > 0);
const galleryImages = rawImages.map(img => resolveImage(img));
const primaryImg = resolveImage(prod.image_url);
const additionalImages = [];

const p = {
  image: primaryImg,
  images: galleryImages,
  additionalImages: additionalImages
};

const vImages = variant.images.filter(u => typeof u === "string" && u.trim().length > 0).map(img => resolveImage(img));
const activeVariant = {
  image: resolveImage(variant.image_url),
  image_url: variant.image_url, // wait, toProduct maps it to `image` not `image_url`
  images: vImages
};

// product.$slug.tsx logic
const normalize = (url) => url.split("?")[0].trim();

const variantImages = [];
if (activeVariant.image) variantImages.push(activeVariant.image);
if (activeVariant.image_url) variantImages.push(activeVariant.image_url);
if (activeVariant.images) variantImages.push(...activeVariant.images);

const seenVariant = new Set();
const finalVariantImages = [];
for (const url of variantImages) {
  if (!url || !url.trim()) continue;
  const norm = normalize(url);
  if (!seenVariant.has(norm)) {
    seenVariant.add(norm);
    finalVariantImages.push(url);
  }
}

const commonImages = [];
if (p.image) commonImages.push(p.image);
if (p.images) commonImages.push(...p.images);
if (p.additionalImages) commonImages.push(...p.additionalImages);

const seenCommon = new Set();
const finalCommonImages = [];
for (const url of commonImages) {
  if (!url || !url.trim()) continue;
  const norm = normalize(url);
  if (!seenCommon.has(norm) && !seenVariant.has(norm)) {
    seenCommon.add(norm);
    finalCommonImages.push(url);
  }
}

const gallery = [...finalVariantImages, ...finalCommonImages];
console.log("Gallery length:", gallery.length);
console.log(gallery);
