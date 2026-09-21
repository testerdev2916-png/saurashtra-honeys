import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);

function resolveImage(key, url, fallback="", updatedAt) {
  let cleanUrl = url?.trim();
  if (!cleanUrl && key?.trim() && key.includes('/')) cleanUrl = key.trim();
  let resultUrl = fallback;
  if (cleanUrl) {
    if (cleanUrl.includes('res.cloudinary.com')) {
      resultUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl.replace(/^\/+/, '')}`;
    } else if (/^https?:\/\//i.test(cleanUrl)) {
      resultUrl = cleanUrl;
    } else {
      let path = cleanUrl.replace(/^\/+/, '').split('?')[0].split('#')[0];
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      if (data && data.publicUrl) resultUrl = data.publicUrl;
    }
  }
  return resultUrl;
}

async function main() {
  const { data: r } = await supabase.from('products').select('*').eq('slug', 'ajwain-honey').single();
  const { data: dbVariants } = await supabase.from('product_variants').select('*').eq('product_id', r.id);

  const mappedVariants = dbVariants.map((v) => ({
    id: v.id,
    label: v.label,
    image: v.image_url ? resolveImage(v.image_url, null, "", r.updated_at) : undefined,
    images: Array.isArray(v.images) ? (v.images).filter((u) => typeof u === "string" && u.trim().length > 0).map((u) => resolveImage(u, null, "", r.updated_at)) : undefined,
  }));

  const rawImages = Array.isArray(r.images) ? (r.images).filter((u) => typeof u === "string" && u.trim().length > 0) : [];
  const galleryImages = rawImages.length > 0 ? Array.from(new Set(rawImages)).slice(0, 9).map(img => resolveImage(img, null, "", r.updated_at)) : [];
  const primaryImg = resolveImage(r.image_key, r.image_url, galleryImages && galleryImages.length > 0 ? galleryImages[0] : "", r.updated_at);
  const rawAdditional = Array.isArray(r.additional_images) ? (r.additional_images).filter((u) => typeof u === "string" && u.trim().length > 0) : [];
  const additionalImages = rawAdditional.length > 0 ? Array.from(new Set(rawAdditional)).slice(0, 8).map(img => resolveImage(img, null, "", r.updated_at)) : [];

  const p = {
    image: primaryImg,
    images: galleryImages,
    additionalImages: additionalImages
  };

  const activeVariant = mappedVariants.find(v => v.label === '50g');

  const variantImages = [];
  if (activeVariant.image) variantImages.push(activeVariant.image);
  if (activeVariant.image_url) variantImages.push(activeVariant.image_url);
  if (activeVariant.images && activeVariant.images.length > 0) variantImages.push(...activeVariant.images);

  const normalize = (url) => (url ? url.split("?")[0].trim() : "");
  
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
  if (p.images && p.images.length > 0) commonImages.push(...p.images);
  if (p.additionalImages && p.additionalImages.length > 0) commonImages.push(...p.additionalImages);

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

  const gallery = [...finalVariantImages, ...finalCommonImages].filter(u => typeof u === "string" && u.trim().length > 0);
  
  console.log("Gallery length:", gallery.length);
  console.log("Gallery contents:");
  gallery.forEach((u, i) => console.log(`[${i}] ${u}`));
}
main();
