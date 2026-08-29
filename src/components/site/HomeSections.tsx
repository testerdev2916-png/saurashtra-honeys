import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Leaf,
  Sparkles,
  HeartHandshake,
  Award,
  FlaskConical,
  ArrowRight,
  Star,
  CheckCircle2,
  Check,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { PremiumMobileCarousel } from "@/components/site/PremiumMobileCarousel";
import { ProductCard } from "@/components/site/ProductCard";
import { HeroSlider, type HeroSlide } from "@/components/site/HeroSlider";
import { fetchPublicHeroRows, heroRowToSlide } from "@/lib/hero-catalog";
import { useServerFn } from "@tanstack/react-start";
import { type Product } from "@/lib/products";
import { type ShopCategory, fetchShopCategories } from "@/lib/category-catalog";
import { type BlogPost } from "@/lib/blog";
import * as Icons from "lucide-react";
import {
  fetchAllHomepageTrustItems,
  fetchAllHomepageCategories,
  fetchAllHomepageFeaturedProducts,
  type HomepageTrustItem,
} from "@/lib/homepage-cms.functions";

// Assets
import heroHoneyImg from "@/assets/hero-honey.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";

import prodAjwainImg from "@/assets/prod-ajwain.jpg";
import prodLycheeImg from "@/assets/prod-lychee.jpg";
import prodMultifloraImg from "@/assets/prod-multiflora.jpg";
import prodHoneycombImg from "@/assets/prod-honeycomb.jpg";
import prodGiftpackImg from "@/assets/prod-giftpack.jpg";
import prodLiquidImg from "@/assets/prod-liquid.jpg";

/* =========================================================================
   1. HERO SECTION (Reference: Top Left text + CTA + Trust Badges, Right Image)
   ========================================================================= */
export function HomeHero() {
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const getRows = useServerFn(fetchPublicHeroRows);

  React.useEffect(() => {
    void getRows({ data: { page: "home" } }).then((res: any) => {
      if (res && res.rows && res.rows.length > 0) {
        setSlides(res.rows.map((r: any) => heroRowToSlide(r)));
      }
    });
  }, [getRows]);

  if (!slides || slides.length === 0) return null;
  return <HeroSlider slides={slides} size="home" interval={5000} />;
}

/* =========================================================================
   2. MAIN TRUST STRIP (Horizontal 6-card row with thin orange icons)
   ========================================================================= */
export function HomeTrustStrip({ settings }: { settings?: Record<string, any> }) {
  const [dbItems, setDbItems] = React.useState<HomepageTrustItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAllHomepageTrustItems()
      .then(data => setDbItems(data))
      .catch(err => console.warn("Failed to fetch trust items, using fallback", err))
      .finally(() => setLoading(false));
  }, []);

  const fallbackItems = [
    { label: "100% Pure No Additives", img: "/images/trust/pure_no_additives.png" },
    { label: "Raw & Unprocessed", img: "/images/trust/raw_unprocessed.png" },
    { label: "Natural Floral Sources", img: "/images/trust/natural_floral.png" },
    { label: "Rich in Nutrients", img: "/images/trust/rich_nutrients.png" },
    { label: "Lab Tested", img: "/images/trust/lab_tested.png" },
    { label: "Ethical Beekeeping", img: "/images/trust/ethical_beekeeping.png" },
  ];

  const items = dbItems.length > 0
    ? dbItems.map(item => {
        const matched = fallbackItems.find(f => f.label.toLowerCase() === item.title.toLowerCase());
        return {
          label: item.title,
          img: matched ? matched.img : "/images/trust/pure_no_additives.png" // fallback image
        };
      })
    : fallbackItems;

  if (loading) return null;

  return (
    <section className="bg-cream-deep/40 border-y border-border/80 py-8 sm:py-10">
      <div className="container-page">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {items.map(({ label, img }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-2 group"
            >
              <div className="size-28 sm:size-36 lg:size-40 mb-5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                <img src={img} alt={label} className="w-full h-full object-contain" loading="lazy" />
              </div>
              <span className="text-xs sm:text-[13px] font-bold text-espresso leading-snug group-hover:text-brand-orange transition-colors">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   2.5 INFINITE MARQUEE STRIP
   ========================================================================= */
export function HomeMarqueeStrip() {
  const block = (
    <div className="flex items-center space-x-8 sm:space-x-12 px-4 sm:px-6 text-[11px] sm:text-xs font-semibold tracking-[0.15em] text-white uppercase">
      <span>FROM THE HIVE</span>
      <span className="text-white text-[10px]">●</span>
      <span>PURE BY NATURE</span>
      <span className="text-white text-[10px]">●</span>
      <span>RAW &amp; UNPROCESSED</span>
      <span className="text-white text-[10px]">●</span>
      <span>FARM TO JAR</span>
      <span className="text-white text-[10px]">●</span>
      <span>NATURAL FLORAL SOURCES</span>
      <span className="text-white text-[10px]">●</span>
      <span>ETHICAL BEEKEEPING</span>
      <span className="text-white text-[10px]">●</span>
    </div>
  );

  return (
    <div className="w-full bg-[#B96F12] py-4 sm:py-5 overflow-hidden ticker-wrap">
      <div className="flex w-max items-center animate-ticker">
        {/* Render enough blocks to cover large ultra-wide screens */}
        <div className="flex items-center">
          {block}{block}{block}
        </div>
        <div className="flex items-center">
          {block}{block}{block}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. SHOP BY CATEGORY (6 circular cards with images)
   ========================================================================= */
export function HomeShopByCategory({ 
  settings, 
  initialCategories 
}: { 
  settings?: Record<string, any>;
  initialCategories?: any[];
}) {
  const [displayCats, setDisplayCats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  React.useEffect(() => {
    const processCategories = (allCats: any[]) => {
      const FALLBACK_IMAGE_BY_SLUG: Record<string, string> = {
        honey: heroHoneyImg,
        beeswax: prodHoneycombImg,
        "bee-pollen": beeFarmImg,
        "beeswax-candle": honeycombBeesImg,
        "beeswax-products": prodGiftpackImg,
        "beauty-products": prodLycheeImg,
        "all-products": heroProductsImg,
      };
      const baseCats = allCats.map(cat => ({
        name: cat.name,
        img: cat.image_url || FALLBACK_IMAGE_BY_SLUG[cat.slug] || heroHoneyImg,
        filter: cat.name,
        slug: cat.slug,
        updatedAt: cat.updatedAt
      }));
      setDisplayCats([...baseCats, ...baseCats, ...baseCats]);
      setLoading(false);
    };

    if (initialCategories && initialCategories.length > 0) {
      processCategories(initialCategories);
    } else {
      fetchShopCategories()
        .then(processCategories)
        .catch((err) => {
          console.error("Failed to load categories on homepage:", err);
          setLoading(false);
        });
    }
  }, [initialCategories]);

  if (loading) return null;

  const s_eyebrow = settings?.eyebrow ?? "DISCOVER";
  const s_heading = settings?.heading ?? "Explore Our World";
  const s_desc = settings?.description ?? "Discover every expression of pure honey—from everyday favourites to rare treasures, thoughtfully crafted by nature.";
  const s_cta_text = settings?.cta_text ?? "VIEW ALL CATEGORIES";
  const s_cta_url = settings?.cta_url ?? "/shop";

  return (
    <section className="pt-24 pb-20 bg-[#F8F5EF] overflow-hidden relative">
      {/* PREMIUM VINTAGE ANIMATED BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] sm:opacity-[0.18] z-0">
        <img loading="lazy" src="/images/bg_illustrations/floral_alpha.png" alt="" className="absolute -top-[10%] -left-[10%] sm:-left-[5%] w-[400px] sm:w-[500px] max-w-[70vw] object-contain animate-float-1" />
        <img loading="lazy" src="/images/bg_illustrations/honeycomb_alpha.png" alt="" className="absolute top-[15%] -right-[15%] sm:right-[5%] w-[350px] sm:w-[400px] max-w-[60vw] object-contain animate-float-2" />
        <img loading="lazy" src="/images/bg_illustrations/bees_alpha.png" alt="" className="absolute bottom-[25%] left-[5%] sm:left-[15%] w-[200px] sm:w-[300px] max-w-[40vw] object-contain animate-float-3" />
        <img loading="lazy" src="/images/bg_illustrations/dipper_alpha.png" alt="" className="absolute -bottom-[5%] -right-[10%] sm:-right-[5%] w-[350px] sm:w-[450px] max-w-[60vw] object-contain animate-float-4" />
      </div>

      <div className="container-page mb-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {s_eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {s_heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
            {s_desc}
          </p>
          <Link
            to={s_cta_url as any}
            className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group"
          >
            <span>{s_cta_text}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[1696px] mx-auto relative group px-4">
        {/* Unified Mobile and Desktop View */}
        {/* Navigation Arrows (Visible on all sizes, optimized for mobile) */}
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-2 sm:-left-4 lg:-left-6 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-border/80 shadow-md flex items-center justify-center text-espresso opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream-deep hover:border-burnt-orange"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-2 sm:-right-4 lg:-right-6 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-border/80 shadow-md flex items-center justify-center text-espresso opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream-deep hover:border-burnt-orange"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Carousel Container */}
        <div className="overflow-visible w-full px-4 sm:px-0" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-[24px] py-6 touch-pan-y cursor-grab active:cursor-grabbing">
            {displayCats.map((cat, idx) => (
              <div 
                key={idx} 
                className="flex-[0_0_80vw] sm:flex-[0_0_calc(100%/2.5-16px)] lg:flex-[0_0_calc(100%/3.5-18px)] xl:flex-[0_0_calc(100%/4.5-19.2px)] min-w-0"
              >
                <Link
                  to={
                    cat.filter && cat.filter.toLowerCase() !== "all products" && cat.filter.toLowerCase() !== "all"
                      ? `/shop/${cat.filter.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
                      : "/shop"
                  }
                  className="group/card relative flex flex-col shrink-0 overflow-hidden bg-white rounded-[16px] sm:rounded-[22px] shadow-[0_8px_20px_rgba(0,0,0,0.05)] sm:shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(217,119,6,0.15)] transition-all duration-300 w-full aspect-square"
                >
                  <div className="absolute inset-0 w-full h-full bg-[#F8F5EF]/50 overflow-hidden">
                    <img 
                      key={cat.updatedAt || cat.img}
                      src={cat.img} 
                      alt={cat.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = prodLiquidImg;
                      }}
                      className="w-full h-full object-cover pointer-events-none transform transition-transform duration-300 ease-out group-hover/card:scale-105"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   4. BEST SELLERS (4 or 5 horizontal cards using ProductCard)
   ========================================================================= */
export function HomeBestSellers({
  products,
  onQuickView,
  settings,
}: {
  products: Product[];
  onQuickView?: (p: Product) => void;
  settings?: Record<string, any>;
}) {
  const [displayList, setDisplayList] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // ONLY display products where show_on_homepage = true
    const homepageProducts = products.filter(p => p.showOnHomepage === true);
    setDisplayList(homepageProducts);
    setLoading(false);
  }, [products]);

  if (loading) return null;

  const bs_eyebrow = settings?.eyebrow ?? "CURATED FOR YOU";
  const bs_heading = settings?.heading ?? "Our Finest Picks";
  const bs_desc = settings?.description ?? "A handpicked selection of our most loved honey and bee-crafted essentials, chosen for their exceptional purity and quality.";
  const bs_cta_text = settings?.cta_text ?? "VIEW ALL PRODUCTS";
  const bs_cta_url = settings?.cta_url ?? "/shop";

  return (
    <section className="pt-[100px] pb-14 sm:pb-20 bg-cream-deep/30 border-y border-border/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {bs_eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {bs_heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
            {bs_desc}
          </p>
          <Link
            to={bs_cta_url as any}
            className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group"
          >
            <span>{bs_cta_text}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </Link>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden mt-2">
          <PremiumMobileCarousel
            items={displayList}
            slideClassName="flex-[0_0_86vw] min-w-0"
            renderItem={(product) => (
              <ProductCard p={product} onQuickView={onQuickView} />
            )}
          />
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayList.map((product) => (
            <ProductCard
              key={product.slug}
              p={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* =========================================================================
   6. WHY CHOOSE SAURASHTRA HONEY (Asymmetrical editorial 3-column layout)
   ========================================================================= */
export function HomeWhyChoose({ settings }: { settings?: Record<string, any> }) {
  const benefits = [
    "Pure & Unadulterated Honey",
    "Ethically Sourced & Sustainably Harvested",
    "Lab Tested for Moisture, HMF & Purity",
    "No Artificial Flavours or Preservatives",
  ];

  const wc_eyebrow = settings?.eyebrow ?? "OUR HERITAGE";
  const wc_heading = settings?.heading ?? "Where Purity Begins";
  const wc_desc = settings?.description ?? "Every drop reflects generations of beekeeping, sustainable farming, and an unwavering commitment to quality.";
  const wc_cta_text = settings?.cta_text ?? "KNOW MORE ABOUT US";
  const wc_cta_url = settings?.cta_url ?? "/our-story";

  return (
    <section id="why-saurashtra-honey" className="py-16 sm:py-24 bg-cream">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {wc_eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {wc_heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
            {wc_desc}
          </p>
          <Link
            to={wc_cta_url as any}
            className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group"
          >
            <span>{wc_cta_text}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </Link>
        </div>

        {/* Mobile View: Text First, Images Below */}
        <div className="flex flex-col gap-8 lg:hidden">
          <div className="p-8 rounded-[24px] bg-white border border-[#2B2118]/10 space-y-4 shadow-sm text-center">
            <div className="inline-flex items-center justify-center size-12 rounded-full bg-[#D97706]/10 text-[#D97706] mb-2">
              <Sparkles className="size-6" />
            </div>
            <h3 className="font-serif text-[26px] font-medium text-[#2B2118] leading-tight">
              Naturally Sweet.
              <br />
              Truly Wholesome.
            </h3>
            <p className="text-[15px] text-[#6B6257] leading-relaxed px-2">
              Experience the authentic aroma and floral notes of honey
              straight from the comb. No processing, no overheating—just 100%
              natural goodness.
            </p>
          </div>

          <div className="px-2">
            <ul className="space-y-4">
              {benefits.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white/50 p-4 rounded-[16px] border border-[#2B2118]/5 shadow-sm">
                  <CheckCircle2 className="size-[22px] text-[#D97706] shrink-0 mt-[2px]" />
                  <span className="text-[15px] font-medium text-[#2B2118]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2 px-2">
            <div className="rounded-[24px] overflow-hidden aspect-[4/5] shadow-sm">
              <img
                src={honeyDrizzleImg}
                alt="Raw honey pouring"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="rounded-[24px] overflow-hidden aspect-[4/5] shadow-sm">
              <img
                src={beeFlowerImg}
                alt="Honey bee collecting nectar"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-12 gap-10 items-stretch">
          {/* Left Col (4 cols) */}
          <div className="col-span-4 flex flex-col justify-center space-y-6">
            <ul className="space-y-3.5 pt-1">
              {benefits.map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-[15px] font-semibold text-espresso">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Col (4 cols): Tall honey-drizzle photo card */}
          <div className="col-span-4">
            <div className="h-full rounded-3xl overflow-hidden shadow-lift border border-border/80 bg-cream-deep min-h-[340px] sm:min-h-[440px]">
              <img
                src={honeyDrizzleImg}
                alt="Raw honey pouring"
                loading="lazy"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Right Col (4 cols): Top card + bottom bee-flower photo */}
          <div className="col-span-4 flex flex-col justify-between gap-8">
            <div className="p-8 rounded-3xl bg-cream-deep/60 border border-border/80 space-y-4">
              <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-brand-orange/15 text-brand-orange">
                <Sparkles className="size-6" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso leading-snug">
                Naturally Sweet.
                <br />
                Truly Wholesome.
              </h3>
              <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed">
                Experience the authentic aroma and floral notes of honey
                straight from the comb. No processing, no overheating—just 100%
                natural goodness.
              </p>
            </div>

            <div className="flex-1 rounded-3xl overflow-hidden shadow-lift border border-border/80 bg-cream-deep min-h-[220px]">
              <img
                src={beeFlowerImg}
                alt="Honey bee collecting nectar from wild flora"
                loading="lazy"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. FARM / BEEKEEPING BANNER (Wide dark-overlay banner)
   ========================================================================= */
export function HomeFarmBanner({ settings }: { settings?: Record<string, any> }) {
  const storyPoints = [
    {
      title: "From Hive to Home",
      desc: "Carefully harvested honey, brought directly from nature to your home.",
      img: "/images/heritage/illus_hive_to_home.png"
    },
    {
      title: "Wildflower Richness",
      desc: "Naturally influenced by the diverse flowers surrounding our hives.",
      img: "/images/heritage/illus_wildflower.png"
    },
    {
      title: "Pure by Nature",
      desc: "No unnecessary additives — just naturally pure honey.",
      img: "/images/heritage/illus_pure.png"
    },
    {
      title: "Responsible Beekeeping",
      desc: "Thoughtful beekeeping practices that respect bees and their natural environment.",
      img: "/images/heritage/illus_beekeeping.png"
    }
  ];

  const fb_cta_text = settings?.cta_text ?? "EXPLORE OUR HIVE";
  const fb_cta_url = settings?.cta_url ?? "/bee-farming";

  return (
    <section className="relative overflow-hidden bg-[#F8F5EF] py-20 sm:py-32">
      {/* 3. Large Heritage Illustrations (Parallax Background) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] sm:opacity-[0.20] z-0">
        <img loading="lazy" 
          src="/images/bg_illustrations/floral_alpha.png" 
          alt="" 
          className="absolute top-[20%] -left-[10%] sm:-left-[5%] w-[450px] sm:w-[600px] max-w-[60vw] object-contain animate-float-1" 
        />
        <img loading="lazy" 
          src="/images/bg_illustrations/honeycomb_alpha.png" 
          alt="" 
          className="absolute top-[40%] -right-[15%] sm:-right-[5%] w-[400px] sm:w-[500px] max-w-[60vw] object-contain animate-float-2" 
        />
      </div>

      <div className="container-page relative z-10">
        {/* 1. Cinematic Visual with Heading */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            OUR JOURNEY
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            The Journey Behind Every Drop
          </h2>
          <p className="text-[17px] md:text-[19px] text-[#6B6257] max-w-[760px] leading-[1.7]">
            From the wildflowers of Saurashtra to the hands of our beekeepers, every drop follows a journey rooted in nature, care, and patience. We preserve what nature creates — pure, authentic honey, just as it was meant to be.
          </p>
        </div>
        <div className="w-full max-w-5xl mx-auto mb-20 sm:mb-28 rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-espresso/5 bg-[#F8F5EF] p-2 sm:p-4 border border-border/40">
          <div className="rounded-xl sm:rounded-[24px] overflow-hidden relative group">
            <img 
              src="/images/heritage/cinematic.png" 
              alt="Authentic Indian Beekeeping"
              className="w-full h-auto aspect-[4/3] sm:aspect-[21/9] object-cover transform transition-transform duration-[20s] ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {/* 2. Four Heritage Story Points */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8 sm:gap-8 max-w-7xl mx-auto mb-16 sm:mb-28">
          {storyPoints.map((point, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="h-[90px] sm:h-[150px] aspect-square mb-4 sm:mb-6 transition-transform duration-700 hover:-translate-y-2 flex items-center justify-center">
                <img loading="lazy" src={point.img} alt={point.title} className="w-full h-full object-contain" />
              </div>
              <h3 className="font-serif text-[16px] sm:text-[22px] text-espresso mb-2 sm:mb-3 font-[500] leading-tight">{point.title}</h3>
              <p className="text-[12px] sm:text-[15px] text-espresso/70 leading-relaxed max-w-[280px]">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 4. Center CTA */}
        <div className="flex justify-center">
          <Link
            to={fb_cta_url as any}
            className="inline-flex items-center gap-3 text-[13px] sm:text-[14px] font-bold tracking-[0.2em] text-[#D97706] hover:text-[#B46204] uppercase group transition-colors"
          >
            <span>{fb_cta_text}</span>
            <ArrowRight className="size-4 sm:size-5 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* =========================================================================
   8. STATISTICS STRIP (5 items horizontal grid below farm banner)
   ========================================================================= */
export function HomeStatsStrip({ settings }: { settings?: Record<string, any> }) {
  const defaultStats = [
    { value: "15+ Years", label: "Beekeeping Experience" },
    { value: "2000+", label: "Happy Customers Across India" },
    { value: "500+", label: "Bee Boxes Under Care" },
    { value: "100%", label: "Lab Tested For Purity" },
    { value: "0%", label: "Additives Always Pure" },
  ];
  const stats: { value: string; label: string }[] =
    Array.isArray(settings?.stats) && settings.stats.length > 0
      ? settings.stats
      : defaultStats;

  return (
    <section className="bg-cream-deep/50 border-b border-border/80 py-10 sm:py-12">
      <div className="container-page">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stats.map(({ value, label }, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-cream/70 border border-border/60 shadow-xs"
            >
              <div className="font-serif text-2xl sm:text-3xl font-bold text-brand-orange">
                {value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-espresso/80 mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. TESTIMONIALS (3 horizontal customer review cards with round avatars)
   ========================================================================= */
export function HomeTestimonials({
  reviews,
  settings,
}: {
  reviews?: {
    id: string;
    author_name: string;
    content: string;
    rating: number;
    location?: string;
  }[];
  settings?: Record<string, any>;
}) {
  const fallbackTestimonials = [
    {
      id: "t1",
      author_name: "Neha Shah",
      location: "Ahmedabad, Gujarat",
      content:
        "The Ajwain flora honey is incredible. You can actually smell and taste the difference from commercial store brands. My family loves it!",
      rating: 5,
      avatar: familyHoneyImg,
    },
    {
      id: "t2",
      author_name: "Karan Mehta",
      location: "Rajkot, Gujarat",
      content:
        "Finally found an authentic raw honey brand from Gujarat. Every bottle comes with NABL test purity reports. Super trustworthy!",
      rating: 5,
      avatar: honeyDrizzleImg,
    },
    {
      id: "t3",
      author_name: "Ritika Verma",
      location: "Surat, Gujarat",
      content:
        "The raw honeycomb was a hit with my kids! Truly unfiltered, natural sweetness without any artificial aftertaste.",
      rating: 5,
      avatar: beeFlowerImg,
    },
  ];

  const items =
    reviews && reviews.length >= 3
      ? reviews.slice(0, 3).map((r, i) => ({
          id: r.id,
          author_name: r.author_name,
          location: r.location || "Gujarat, India",
          content: r.content,
          rating: r.rating || 5,
          avatar: fallbackTestimonials[i % fallbackTestimonials.length]?.avatar,
        }))
      : fallbackTestimonials;

  const tm_eyebrow = settings?.eyebrow ?? "TRUSTED BY MANY";
  const tm_heading = settings?.heading ?? "Loved Across India";
  const tm_desc = settings?.description ?? "Real experiences shared by customers who choose purity every day.";

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {tm_eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {tm_heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7]">
            {tm_desc}
          </p>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden mt-2">
          <PremiumMobileCarousel
            items={items}
            slideClassName="flex-[0_0_86vw] min-w-0"
            renderItem={(item) => (
              <div className="flex flex-col justify-between p-7 rounded-[22px] bg-white border border-border/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] h-full">
                <div>
                  <div
                    className="flex items-center gap-1 text-brand-orange mb-4"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {[...Array(item.rating)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="size-4 fill-brand-orange text-brand-orange"
                      />
                    ))}
                  </div>

                  <blockquote className="text-[14px] text-espresso/90 leading-relaxed italic mb-6">
                    &ldquo;{item.content}&rdquo;
                  </blockquote>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                  <div className="size-12 rounded-full overflow-hidden border-2 border-brand-orange/40 shrink-0 bg-cream">
                    <img
                      src={item.avatar}
                      alt={item.author_name}
                      loading="lazy"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-[14px] text-espresso">
                      {item.author_name}
                    </div>
                    <div className="text-[12px] text-muted-foreground">
                      {item.location}
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-cream-deep/40 border border-border/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div
                  className="flex items-center gap-1 text-brand-orange mb-4"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {[...Array(item.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="size-4 fill-brand-orange text-brand-orange"
                    />
                  ))}
                </div>

                <blockquote className="text-sm sm:text-base text-espresso/90 leading-relaxed italic mb-6">
                  &ldquo;{item.content}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                <div className="size-12 rounded-full overflow-hidden border-2 border-brand-orange/40 shrink-0 bg-cream">
                  <img
                    src={item.avatar}
                    alt={item.author_name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm sm:text-base text-espresso">
                    {item.author_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   10. JOURNAL PREVIEW (3 article cards from blogPosts)
   ========================================================================= */
export function HomeJournalPreview({ posts, settings }: { posts: BlogPost[], settings?: Record<string, any> }) {
  const displayPosts = posts.slice(0, 3);

  const jp_eyebrow = settings?.eyebrow ?? "JOIN OUR JOURNEY";
  const jp_heading = settings?.heading ?? "Follow Our Hive";
  const jp_desc = settings?.description ?? "Stay connected for new harvests, behind-the-scenes moments, and everyday inspiration from our farms.";
  const jp_cta_text = settings?.cta_text ?? "READ OUR STORIES";
  const jp_cta_url = settings?.cta_url ?? "/blog";

  return (
    <section className="py-16 sm:py-24 bg-cream-deep/25 border-t border-border/80">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {jp_eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {jp_heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
            {jp_desc}
          </p>
          <Link
            to={jp_cta_url as any}
            className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group"
          >
            <span>{jp_cta_text}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </Link>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden mt-2">
          <PremiumMobileCarousel
            items={displayPosts}
            slideClassName="flex-[0_0_86vw] min-w-0"
            renderItem={(post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-[22px] overflow-hidden bg-white border border-border/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 h-full"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="block overflow-hidden aspect-[16/10]"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center pointer-events-none"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2.5">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                      {post.category}
                    </span>
                    <h3 className="font-serif text-[18px] font-bold leading-snug text-espresso">
                      <Link to="/blog/$slug" params={{ slug: post.slug }}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="inline-flex items-center gap-2 text-[12px] font-bold tracking-widest text-brand-orange hover:text-[#B46204] transition-colors"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            )}
          />
        </div>

        {/* Desktop/Tablet View */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8">
          {displayPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-3xl overflow-hidden bg-cream border border-border/80 shadow-xs hover:shadow-lift transition-all duration-300"
            >
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="block overflow-hidden aspect-[16/10]"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </Link>
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-2.5">
                  <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand-orange">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-espresso group-hover:text-brand-orange transition-colors">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-espresso/75 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest text-brand-orange hover:text-[#B46204] transition-colors group-hover:translate-x-1 duration-300"
                  >
                    <span>READ ARTICLE</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


import { Instagram } from "lucide-react";

export function HomeInstagramPreview({ feed, settings }: { feed: any, settings?: Record<string, any> }) {
  const isEnabled = feed?.settings?.is_enabled;
  const posts = feed?.posts || [];

  const eyebrow = settings?.eyebrow ?? "JOIN OUR JOURNEY";
  const heading = settings?.heading ?? "Follow Our Hive";
  const desc = settings?.description ?? "Stay connected for new harvests, behind-the-scenes moments, and everyday inspiration from our farms.";
  
  if (!isEnabled || posts.length === 0) {
    // Fallback state
    return (
      <section className="py-16 sm:py-24 bg-cream-deep/25 border-t border-border/80">
        <div className="container-page text-center">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] mx-auto leading-[1.7] mb-[36px]">
            Follow us on Instagram for the latest updates.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group"
          >
            <span>FOLLOW US ON INSTAGRAM</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-cream-deep/25 border-t border-border/80">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {heading}
          </h2>
          <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
            {desc}
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-bold tracking-wider text-[#D97706] hover:text-[#B46204] uppercase group"
          >
            <Instagram className="size-4" />
            <span>FOLLOW US ON INSTAGRAM</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {posts.map((post: any) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative rounded-2xl overflow-hidden aspect-square bg-white border border-border/80 shadow-xs hover:shadow-lift transition-all duration-300"
            >
              <img
                src={post.media_type === "VIDEO" && post.thumbnail_url ? post.thumbnail_url : post.media_url}
                alt={post.caption || "Instagram post"}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="text-white size-8 opacity-90" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
