import React, { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { QuickView } from "@/components/site/QuickView";
import {
  getCategoryMetadata,
  getCategoryProducts,
  getCategorySlug,
  DEDICATED_COLLECTION_SLUGS,
} from "@/lib/collection-helpers";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import {
  fetchShopCategories,
  DEFAULT_SHOP_CATEGORIES,
  type ShopCategory,
} from "@/lib/category-catalog";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import {
  ArrowDown,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/collections/$slug")({
  loader: async ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const meta = getCategoryMetadata(loaderData?.slug || "raw-honey");
    return {
      meta: [
        { title: `${meta.name} — Pure & Artisanal | Saurashtra Honey` },
        { name: "description", content: meta.heroDescription.slice(0, 155) },
        { property: "og:title", content: `${meta.name} — Saurashtra Honey` },
        { property: "og:description", content: meta.tagline },
        { property: "og:type", content: "website" },
        { property: "og:image", content: meta.heroImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: meta.heroImage },
      ],
      links: [
        {
          rel: "canonical",
          href: `https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app/collections/${getCategorySlug(loaderData?.slug || "raw-honey")}`,
        },
      ],
    };
  },
  component: CategoryCollectionPage,
});

function CategoryCollectionPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>(DEFAULT_SHOP_CATEGORIES);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Scroll to top when category slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // Load latest database products and categories from Supabase
  useEffect(() => {
    void fetchProducts().then((r) => {
      const mergedMap = new Map<string, Product>();
      if (r && r.length > 0) {
        r.forEach((p) => {
          mergedMap.set(p.slug, p);
        });
      }
      setProducts(Array.from(mergedMap.values()));
    });

    void fetchShopCategories().then((r) => {
      if (r && r.length > 0) {
        setCategories(r);
      }
    });
  }, []);

  const metadata = useMemo(() => {
    return getCategoryMetadata(slug, categories);
  }, [slug, categories]);

  const filteredProducts = useMemo(() => {
    return getCategoryProducts(slug, products);
  }, [slug, products]);

  const otherCollections = useMemo(() => {
    const currentSlug = getCategorySlug(slug);
    return DEDICATED_COLLECTION_SLUGS.filter((s) => s !== currentSlug)
      .slice(0, 4)
      .map((s) => getCategoryMetadata(s, categories));
  }, [slug, categories]);

  const handleScrollToProducts = () => {
    const el = document.getElementById("collection-products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: metadata.name, url: `/collections/${getCategorySlug(slug)}` },
        ])}
      />

      {/* =========================================================================
          0. BREADCRUMB NAVIGATION
          ========================================================================= */}
      <div className="bg-[#1A140F] border-b border-white/10 pt-6 pb-3 px-4">
        <div className="container-page flex items-center gap-2 text-xs md:text-sm tracking-wide text-cream/70 font-sans">
          <Link
            to="/"
            className="hover:text-gold transition-colors duration-200"
          >
            Home
          </Link>
          <ChevronRight className="size-3.5 text-cream/40" />
          <Link
            to="/shop"
            className="hover:text-gold transition-colors duration-200 font-medium"
          >
            Shop
          </Link>
          <ChevronRight className="size-3.5 text-cream/40" />
          <span className="text-gold font-semibold tracking-wider uppercase">
            {metadata.name}
          </span>
        </div>
      </div>

      {/* =========================================================================
          1. CATEGORY HERO (FULL-WIDTH EDITORIAL BANNER)
          ========================================================================= */}
      <section className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#1A140F] text-cream group">
        {/* Background Image with luxury slow zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={metadata.heroImage}
            alt={metadata.name}
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out opacity-40 md:opacity-50"
          />
          {/* Warm Espresso Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A140F] via-[#1A140F]/70 to-[#1A140F]/30" />
        </div>

        {/* Hero Content */}
        <div className="container-page relative z-10 py-16 sm:py-24 text-center flex flex-col items-center max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs tracking-[0.25em] uppercase text-gold font-medium mb-6">
            <Sparkles className="size-3.5 text-gold animate-pulse" />
            <span>Saurashtra Honey • Collection</span>
          </div>

          <h1 className="font-serif text-[40px] sm:text-[60px] lg:text-[72px] font-medium leading-[1.08] text-white tracking-tight mb-4">
            {metadata.name}
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-gold/90 mb-6 font-light">
            {metadata.tagline}
          </p>

          <p className="text-cream/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light mb-10">
            {metadata.heroDescription}
          </p>

          {/* Luxury CTA Button */}
          <button
            type="button"
            onClick={handleScrollToProducts}
            className="group/btn inline-flex items-center gap-3 bg-gold text-espresso font-semibold text-sm sm:text-base px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(217,119,6,0.3)] hover:bg-[#F59E0B] hover:shadow-[0_15px_40px_rgba(217,119,6,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span>{metadata.ctaText}</span>
            <ArrowDown className="size-4 group-hover/btn:translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          2. PRODUCT COLLECTION (GRID)
          ========================================================================= */}
      <section
        id="collection-products"
        className="py-16 sm:py-24 bg-[#F8F5EF] scroll-mt-20"
      >
        <div className="container-page px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-espresso/10 pb-6 mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D97706] mb-2">
                PURE ARTISANAL HARVEST
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-espresso">
                The {metadata.name} Collection
              </h2>
            </div>
            <div className="text-sm text-espresso/70 font-medium">
              Showing <span className="text-espresso font-semibold">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </div>
          </div>

          {/* Product Grid:
              Desktop: 4 products per row
              Tablet: 3 products per row (md:grid-cols-3)
              Mobile: 2 products per row where possible (grid-cols-2) */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.slug} className="h-full">
                  <ProductCard
                    p={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State for brand new collection */
            <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm max-w-2xl mx-auto my-8">
              <p className="font-serif text-2xl text-espresso mb-3">
                New Harvest Arriving Soon
              </p>
              <p className="text-espresso/70 text-sm sm:text-base mb-6">
                We are currently curating and bottling artisanal items for this collection. Please check back soon or explore our complete catalog.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-espresso text-cream px-6 py-3 rounded-full text-sm font-medium hover:bg-espresso/90 transition-all duration-300"
              >
                <span>View All Products</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          3. CATEGORY STORY SECTION (EDITORIAL FEATURE)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="container-page px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Lifestyle/Farm Image */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] aspect-[4/3] sm:aspect-[16/11] group">
                <img
                  src={metadata.storyImage}
                  alt={metadata.storyTitle}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                {/* Floating Botanical Stamp/Badge */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 flex items-center justify-center">
                      <Leaf className="size-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gold">
                        SAURASHTRA ORIGIN
                      </p>
                      <p className="text-xs sm:text-sm text-white/90 font-medium">
                        {metadata.storySubtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Story Text */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
              <div className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#D97706] mb-3">
                EDITORIAL FEATURE
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-espresso leading-tight mb-6">
                “{metadata.storyTitle}”
              </h2>

              <p className="text-espresso/80 text-base sm:text-lg leading-relaxed font-light mb-8">
                {metadata.storyDescription}
              </p>

              {/* 3 Luxury Highlights */}
              <div className="space-y-4 sm:space-y-5">
                {metadata.storyHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8F5EF]/70 border border-espresso/5 hover:bg-[#F8F5EF] transition-colors duration-300"
                  >
                    <div className="size-10 rounded-xl bg-white shadow-xs border border-border flex items-center justify-center shrink-0 text-[#D97706]">
                      {idx === 0 && <Leaf className="size-5" />}
                      {idx === 1 && <ShieldCheck className="size-5" />}
                      {idx === 2 && <Sparkles className="size-5" />}
                    </div>
                    <div>
                      <h4 className="font-serif text-base sm:text-lg font-medium text-espresso mb-0.5">
                        {hl.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-espresso/70">
                        {hl.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CATEGORY-SPECIFIC CONTENT (3-STEP ARTISANAL PROCESS)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#F8F5EF] border-t border-espresso/5">
        <div className="container-page px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs tracking-[0.25em] uppercase font-semibold text-[#D97706] mb-3">
              THE ARTISANAL METHOD
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-espresso leading-tight mb-4">
              How We Craft Our {metadata.name}
            </h2>
            <p className="text-espresso/70 text-sm sm:text-base">
              Every step of our process honors the natural balance of the hive and the rich floral heritage of Saurashtra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {metadata.processSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="group bg-white rounded-[28px] p-6 sm:p-8 border border-border/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Step Image Thumbnail */}
                  {step.image && (
                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#F8F5EF]">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#D97706]/30">
                      {step.stepNumber}
                    </span>
                    <CheckCircle2 className="size-5 text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-espresso mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-espresso/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. EXPLORE MORE COLLECTIONS
          ========================================================================= */}
      <section className="py-20 bg-[#1A140F] text-cream">
        <div className="container-page px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">
                DISCOVER SAURASHTRA HONEY
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white">
                Explore More Collections
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCollections.map((col) => (
              <Link
                key={col.slug}
                to="/collections/$slug"
                params={{ slug: col.slug }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/4] bg-espresso/40 block shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
              >
                <img
                  src={col.heroImage}
                  alt={col.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A140F] via-[#1A140F]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-semibold mb-1">
                    COLLECTION
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white group-hover:text-gold transition-colors duration-300">
                    {col.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-cream/80 mt-2 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Explore Products</span>
                    <ArrowRight className="size-3.5 text-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. QUICKVIEW MODAL
          ========================================================================= */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </SiteLayout>
  );
}
