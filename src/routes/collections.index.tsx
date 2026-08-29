import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { getCategoryMetadata, DEDICATED_COLLECTION_SLUGS } from "@/lib/collection-helpers";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Artisanal Collections — Pure Raw Honey & Bee Products | Saurashtra Honey" },
      {
        name: "description",
        content:
          "Explore our dedicated artisanal collections — Raw Honey, Beeswax, Bee Pollen, Beeswax Candles, Beauty & Personal Care, and Luxury Gift Hampers.",
      },
    ],
  }),
  component: CollectionsIndexPage,
});

function CollectionsIndexPage() {
  const collections = DEDICATED_COLLECTION_SLUGS.map((slug) =>
    getCategoryMetadata(slug)
  );

  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: "Collections", url: "/collections" },
        ])}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-[#1A140F] border-b border-white/10 pt-6 pb-3 px-4">
        <div className="container-page flex items-center gap-2 text-xs md:text-sm tracking-wide text-cream/70 font-sans">
          <Link to="/" className="hover:text-gold transition-colors duration-200">
            Home
          </Link>
          <ChevronRight className="size-3.5 text-cream/40" />
          <Link to="/shop" className="hover:text-gold transition-colors duration-200 font-medium">
            Shop
          </Link>
          <ChevronRight className="size-3.5 text-cream/40" />
          <span className="text-gold font-semibold tracking-wider uppercase">
            Collections
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-[#1A140F] text-cream py-16 sm:py-24 text-center">
        <div className="container-page max-w-3xl px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs tracking-[0.25em] uppercase text-gold font-medium mb-6">
            <Sparkles className="size-3.5 text-gold" />
            <span>Saurashtra Honey • Catalog</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-4">
            Artisanal Collections
          </h1>
          <p className="text-cream/80 text-base sm:text-lg leading-relaxed font-light">
            Every collection is harvested with care from our apiaries across Saurashtra. Explore our range of pure honeys, natural beeswax, superfood bee pollen, and luxury gifts.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20 sm:py-28 bg-[#F8F5EF]">
        <div className="container-page px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col) => (
              <Link
                key={col.slug}
                to="/collections/$slug"
                params={{ slug: col.slug }}
                className="group relative rounded-[28px] overflow-hidden bg-white border border-border/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)] hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F5EF]">
                  <img
                    src={col.heroImage}
                    alt={col.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-bold">
                      COLLECTION
                    </span>
                    <h2 className="font-serif text-2xl font-medium text-white group-hover:text-gold transition-colors duration-300">
                      {col.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <p className="text-espresso/75 text-sm leading-relaxed mb-6">
                    {col.heroDescription}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#D97706] group-hover:translate-x-1 transition-transform duration-300">
                    <span>Explore Collection</span>
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
