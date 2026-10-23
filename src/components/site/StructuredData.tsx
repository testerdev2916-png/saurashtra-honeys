// Injects JSON-LD structured data into the document at server render time (SSR)
// and browser hydration.

export function StructuredData({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function breadcrumbLd(items: { name: string; url: string }[], origin = "https://saurastrahoney.com") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => {
      const fullUrl = it.url.startsWith("http")
        ? it.url
        : `${origin}${it.url.startsWith("/") ? "" : "/"}${it.url}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: fullUrl,
      };
    }),
  };
}

export function productLd(p: {
  name: string; description: string; image: string; slug: string; price: number;
  rating?: number; reviews?: number;
}, origin = "https://saurastrahoney.com") {
  const fullImage = p.image?.startsWith("http")
    ? p.image
    : `${origin}${p.image?.startsWith("/") ? "" : "/"}${p.image || "saurashtra-honey-logo-complete.png"}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: fullImage,
    sku: p.slug,
    brand: { "@type": "Brand", name: "Saurashtra Honey" },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${origin}/product/${p.slug}`,
      seller: {
        "@type": "Organization",
        name: "Saurashtra Honey"
      }
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

export function organizationLd(origin = "https://saurastrahoney.com", logoUrl = "https://saurastrahoney.com/saurashtra-honey-logo-complete.png") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Saurashtra Honey",
    url: origin,
    logo: logoUrl.startsWith("http") ? logoUrl : `${origin}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`,
    description: "Raw, unfiltered honey straight from the wildflower farms of Saurashtra.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 9664637665",
      contactType: "customer service",
      email: "hello@saurastrahoney.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Gujarati"]
    },
    sameAs: [
      "https://www.instagram.com/saurashtra_honey",
      "https://www.facebook.com/Saurashtrahoneybeefarm/",
      "https://www.youtube.com/@saurashtrahoney2059"
    ],
  };
}
