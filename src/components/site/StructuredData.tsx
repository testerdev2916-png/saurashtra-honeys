// Injects JSON-LD structured data into the document at server render time (SSR)
// and browser hydration.

export function StructuredData({ data }: { data: unknown }) {
  if (!data) return null;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function breadcrumbLd(
  items: { name: string; url: string }[],
  origin = "https://saurashtrahoney.com",
) {
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

export function productLd(
  p: {
    name: string;
    description: string;
    image: string;
    slug: string;
    price: number;
    rating?: number;
    reviews?: number;
  },
  origin = "https://saurashtrahoney.com",
) {
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
      priceValidUntil: "2027-12-31",
      seller: {
        "@type": "Organization",
        name: "Saurashtra Honey",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating || 4.9,
      reviewCount: p.reviews || 48,
    },
  };
}

export function websiteLd(origin = "https://saurashtrahoney.com") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Saurashtra Honey",
    url: origin,
    potentialAction: {
      "@type": "SearchAction",
      target: `${origin}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessLd(origin = "https://saurashtrahoney.com") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Saurashtra Honey Bee Farm",
    image: `${origin}/saurashtra-honey-logo-complete.png`,
    telephone: "+91 9664637665",
    email: "saurashtra.honey@gmail.com",
    url: origin,
    address: {
      "@type": "PostalAddress",
      streetAddress: "At. Farm, Nicha Kotda, Ta. Mahuva",
      addressLocality: "Bhavnagar",
      addressRegion: "Gujarat",
      postalCode: "364130",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "21.0914",
      longitude: "71.7615",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    priceRange: "₹₹",
  };
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function organizationLd(
  origin = "https://saurashtrahoney.com",
  logoUrl = "https://saurashtrahoney.com/saurashtra-honey-logo-complete.png",
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Saurashtra Honey",
    url: origin,
    logo: logoUrl.startsWith("http")
      ? logoUrl
      : `${origin}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`,
    description: "Raw, unfiltered honey straight from the wildflower farms of Saurashtra.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 9664637665",
      contactType: "customer service",
      email: "hello@saurashtrahoney.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
    sameAs: [
      "https://www.instagram.com/saurashtra_honey",
      "https://www.facebook.com/Saurashtrahoneybeefarm/",
      "https://www.youtube.com/@saurashtrahoney2059",
    ],
  };
}
