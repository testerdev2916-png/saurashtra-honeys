// Injects JSON-LD structured data into the document head at render time.
// Uses a stable id per instance so React can update / remove cleanly.
import { useEffect, useId } from "react";

export function StructuredData({ data }: { data: unknown }) {
  const rid = useId();
  const id = `ld-${rid.replace(/[:]/g, "")}`;
  useEffect(() => {
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = id;
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(data);
    return () => { el?.remove(); };
  }, [id, data]);
  return null;
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function productLd(p: {
  name: string; description: string; image: string; slug: string; price: number;
  rating?: number; reviews?: number;
}, origin = "") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: origin + p.image,
    sku: p.slug,
    brand: { "@type": "Brand", name: "Saurashtra Honey" },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${origin}/product/${p.slug}`,
    },
    ...(p.rating && p.reviews ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.rating,
        reviewCount: p.reviews,
      },
    } : {}),
  };
}

export function organizationLd(origin = "") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Saurashtra Honey",
    url: origin || undefined,
    logo: origin + "/favicon.ico",
    sameAs: [],
  };
}
