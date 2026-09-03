import { Link } from "@tanstack/react-router";
import { IllustratedBrandSection } from "./IllustratedBrandSection";
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
  Play,
  Pause,
  ImageIcon as PhotoIcon,
  Video as VideoIcon,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useCallback, useEffect, useState, Fragment } from "react";
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
export function HomeMarqueeStrip({ settings }: { settings?: Record<string, any> }) {
  const marqueeText = settings?.marquee_text || "FROM THE HIVE • PURE BY NATURE • RAW & UNPROCESSED • FARM TO JAR • NATURAL FLORAL SOURCES • ETHICAL BEEKEEPING";
  const items = marqueeText.split("•").map((s: string) => s.trim()).filter(Boolean);

  const block = (
    <div className="flex items-center space-x-8 sm:space-x-12 px-4 sm:px-6 text-[11px] sm:text-xs font-semibold tracking-[0.15em] text-white uppercase">
      {items.map((item: string, idx: number) => (
        <Fragment key={idx}>
          <span>{item}</span>
          <span className="text-white text-[10px]">●</span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-announcement py-4 sm:py-5 overflow-hidden ticker-wrap">
      <div className="flex w-max items-center animate-ticker" style={{ animationDuration: '95s' }}>
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
    <section className="pt-16 sm:pt-24 pb-16 sm:pb-20 bg-[#F8F5EF] overflow-hidden relative">
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
          <h2 className="font-serif text-[28px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {s_heading}
          </h2>
          <p className="text-[15px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
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

      <div className="w-full max-w-[1696px] mx-auto px-4 group">
        <div className="relative w-full">
          {/* Navigation Arrows (Visible on all sizes, optimized for mobile) */}
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-[8px] sm:left-[12px] top-1/2 -translate-y-1/2 z-20 w-[36px] h-[36px] rounded-full bg-white/95 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#2B2118] opacity-100 transition-all duration-300 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-[8px] sm:right-[12px] top-1/2 -translate-y-1/2 z-20 w-[36px] h-[36px] rounded-full bg-white/95 border-none shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#2B2118] opacity-100 transition-all duration-300 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden md:overflow-visible relative w-full" ref={emblaRef}>
            <div className="flex gap-[12px] md:gap-[24px] py-6 touch-pan-y cursor-grab active:cursor-grabbing">
            {displayCats.map((cat, idx) => (
              <div 
                key={idx} 
                className="flex-[0_0_calc(50%_-_6px)] md:flex-[0_0_calc(100%/2.5_-_16px)] lg:flex-[0_0_calc(100%/3.5_-_18px)] xl:flex-[0_0_calc(100%/4.5_-_19.2px)] min-w-0"
              >
                <Link
                  to={(
                    cat.filter && cat.filter.toLowerCase() !== "all products" && cat.filter.toLowerCase() !== "all"
                      ? `/shop/${cat.filter.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
                      : "/shop"
                  ) as any}
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

  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 60,
  });

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
    <section className="pt-20 sm:pt-[100px] pb-12 sm:pb-20 bg-cream-deep/30 border-y border-border/60">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {bs_eyebrow}
          </div>
          <h2 className="font-serif text-[28px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {bs_heading}
          </h2>
          <p className="text-[15px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
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
          <div className="overflow-hidden w-full relative" ref={emblaRef}>
            <div className="flex gap-[12px] touch-pan-y cursor-grab active:cursor-grabbing pb-4">
              {displayList.map((product) => (
                <div key={product.slug} className="flex-[0_0_calc(50%_-_6px)] min-w-0">
                  <ProductCard p={product} onQuickView={onQuickView} />
                </div>
              ))}
            </div>
          </div>
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


/* =========================================================================
   7. FARM / BEEKEEPING BANNER (Wide dark-overlay banner)
   ========================================================================= */
export function HomeFarmBanner({ settings }: { settings?: Record<string, any> }) {
  const storyPoints = [
    {
      title: settings?.point1_title ?? "From Hive to Home",
      desc: settings?.point1_desc ?? "Carefully harvested honey, brought directly from nature to your home.",
      img: settings?.point1_icon ?? "/images/heritage/illus_hive_to_home.png"
    },
    {
      title: settings?.point2_title ?? "Wildflower Richness",
      desc: settings?.point2_desc ?? "Naturally influenced by the diverse flowers surrounding our hives.",
      img: settings?.point2_icon ?? "/images/heritage/illus_wildflower.png"
    },
    {
      title: settings?.point3_title ?? "Pure by Nature",
      desc: settings?.point3_desc ?? "No unnecessary additives — just naturally pure honey.",
      img: settings?.point3_icon ?? "/images/heritage/illus_pure.png"
    },
    {
      title: settings?.point4_title ?? "Responsible Beekeeping",
      desc: settings?.point4_desc ?? "Thoughtful beekeeping practices that respect bees and their natural environment.",
      img: settings?.point4_icon ?? "/images/heritage/illus_beekeeping.png"
    }
  ];

  const fb_eyebrow = settings?.eyebrow ?? "OUR JOURNEY";
  const fb_heading = settings?.heading ?? "The Journey Behind Every Drop";
  const fb_desc = settings?.description ?? "From the wildflowers of Saurashtra to the hands of our beekeepers, every drop follows a journey rooted in nature, care, and patience. We preserve what nature creates — pure, authentic honey, just as it was meant to be.";
  const cinematicImg = settings?.cinematic_image ?? "/images/heritage/cinematic.png";

  const fb_cta_text = settings?.cta_text ?? "EXPLORE OUR HIVE";
  const fb_cta_url = settings?.cta_url ?? "/bee-farming";

  return (
    <section className="relative overflow-hidden bg-[#F8F5EF] py-16 sm:py-32">
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
            {fb_eyebrow}
          </div>
          <h2 className="font-serif text-[28px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {fb_heading}
          </h2>
          <p className="text-[15px] md:text-[19px] text-[#6B6257] max-w-[760px] leading-[1.7]">
            {fb_desc}
          </p>
        </div>
        <div className="w-full max-w-5xl mx-auto mb-20 sm:mb-28 rounded-[20px] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-espresso/5 bg-[#F8F5EF] p-2 sm:p-4 border border-border/40">
          <div className="rounded-xl sm:rounded-[24px] overflow-hidden relative group">
            <img 
              src={cinematicImg} 
              alt={fb_heading}
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
    <section className="bg-cream-deep/50 border-b border-border/80 py-8 sm:py-12">
      <div className="container-page px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 text-center">
          {stats.map(({ value, label }, idx) => {
            const isLastOdd = idx === stats.length - 1 && stats.length % 2 !== 0;
            return (
              <div
                key={idx}
                className={`p-3 sm:p-4 rounded-[20px] bg-cream/70 border border-border/60 shadow-xs flex flex-col items-center justify-center ${
                  isLastOdd
                    ? "col-span-2 w-[calc(50%-0.375rem)] mx-auto md:col-span-1 md:w-full md:mx-0"
                    : ""
                }`}
              >
                <div className="font-serif text-xl sm:text-3xl font-bold text-brand-orange">
                  {value}
                </div>
                <div className="text-[11px] sm:text-sm font-semibold text-espresso/80 mt-1 leading-snug">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. CUSTOMER STORIES (Replaces Testimonials - Carousel with Videos/Photos/Reviews)
   ========================================================================= */

export function HomeCustomerStories({
  stories = [],
  settings,
}: {
  stories?: {
    id: string;
    type: "video" | "photo" | "review";
    customer_name: string;
    customer_city?: string | null;
    customer_state?: string | null;
    customer_photo?: string | null;
    media_url?: string | null;
    poster_image?: string | null;
    review_text?: string | null;
    rating: number;
    verified?: boolean;
  }[];
  settings?: Record<string, any>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const photoStories = stories.filter((s) => s.type === "photo");

  const cs_eyebrow = settings?.eyebrow ?? "FROM OUR HIVE TO YOUR HOME";
  const cs_heading = settings?.heading ?? "REAL PEOPLE. REAL HONEY.";
  const cs_desc = settings?.description ?? "Real experiences shared by people who choose Saurashtra Honey.";

  return (
    <section className="py-16 sm:py-28 bg-[#FDFBF7] border-y border-border/40 overflow-hidden relative">
      <div className="container-page relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="flex flex-col gap-4">
          <div className="text-[12px] uppercase tracking-[4px] text-brand-orange font-bold">
            {cs_eyebrow}
          </div>
          <h2 className="font-serif text-[32px] sm:text-[44px] md:text-[56px] font-medium text-espresso leading-[1.1]">
            {cs_heading}
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#6B6257] leading-[1.6] max-w-2xl">
            {cs_desc}
          </p>
        </div>
        
        {/* Navigation Buttons */}
        {photoStories.length > 0 && (
          <div className="hidden md:flex gap-3 pb-2">
            <button 
              onClick={scrollPrev} 
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center hover:bg-cream hover:border-brand-orange/30 transition-all text-espresso"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext} 
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center hover:bg-cream hover:border-brand-orange/30 transition-all text-espresso"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex gap-[12px] sm:gap-6">
            {photoStories.length === 0 ? (
              <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-brand-orange/40 mb-4">
                  <PhotoIcon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso mb-2">No testimonials yet</h3>
                <p className="text-muted-foreground">Admin: Add customer photo testimonials in the dashboard to populate this section.</p>
              </div>
            ) : (
              photoStories.map((story) => (
                <div
                  key={story.id}
                  // Mobile: exactly 2 cards side-by-side. Tablet: 2 cards. Desktop: 3 cards.
                  className="flex-[0_0_calc(50%_-_6px)] sm:flex-[0_0_calc(50%_-_12px)] lg:flex-[0_0_calc(33.33333%_-_16px)] min-w-0"
                >
                  <div className="w-full h-full flex flex-col bg-white rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-border/50">
                    
                    {/* CUSTOMER PHOTO */}
                    <div className="w-full aspect-[4/5] bg-cream relative">
                      {story.poster_image ? (
                        <img
                          src={story.poster_image}
                          alt={`Photo shared by ${story.customer_name} from ${story.customer_city || "their city"}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <PhotoIcon className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                    
                    {/* REVIEW CONTENT */}
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <div className="flex gap-0.5 text-brand-orange">
                          {[...Array(story.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-[12px] sm:w-[14px] md:w-[16px] h-[12px] sm:h-[14px] md:h-[16px] fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] sm:text-[13px] font-bold text-espresso tracking-wide">
                          {(story.rating || 5).toFixed(1)}
                        </span>
                      </div>
                      
                      {/* Customer Review Quote */}
                      {story.review_text && (
                        <blockquote className="text-[13px] sm:text-[16px] md:text-[18px] font-medium text-espresso leading-[1.6] mb-4 sm:mb-6 line-clamp-6">
                          "{story.review_text}"
                        </blockquote>
                      )}
                      
                      <div className="mt-auto pt-3 sm:pt-4 border-t border-border/40">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="font-bold text-[14px] sm:text-[16px] text-espresso capitalize">
                            {story.customer_name}
                          </span>
                          {story.verified && (
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold tracking-wide text-green-700 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-green-200/50 uppercase">
                              <CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        {(story.customer_city || story.customer_state) && (
                          <div className="text-[12px] sm:text-[14px] text-muted-foreground mt-1 capitalize truncate">
                            {[story.customer_city, story.customer_state].filter(Boolean).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Mobile Navigation (optional, visual cue) */}
        {photoStories.length > 0 && (
          <div className="flex md:hidden justify-center gap-3 mt-8">
            <button 
              onClick={scrollPrev} 
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-cream text-espresso"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollNext} 
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:bg-cream text-espresso"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
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
    <section className="py-12 sm:py-24 bg-cream-deep/25 border-t border-border/80">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {jp_eyebrow}
          </div>
          <h2 className="font-serif text-[28px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {jp_heading}
          </h2>
          <p className="text-[15px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
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
            slideClassName="flex-[0_0_85vw] min-w-0"
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
      <section className="py-12 sm:py-24 bg-cream-deep/25 border-t border-border/80">
        <div className="container-page text-center">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {eyebrow}
          </div>
          <h2 className="font-serif text-[28px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {heading}
          </h2>
          <p className="text-[15px] md:text-[21px] text-[#6B6257] max-w-[700px] mx-auto leading-[1.7] mb-[36px]">
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
    <section className="py-12 sm:py-24 bg-cream-deep/25 border-t border-border/80">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {eyebrow}
          </div>
          <h2 className="font-serif text-[28px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {heading}
          </h2>
          <p className="text-[15px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
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

/* =========================================================================
   10. HERITAGE DOCUMENTARY VIDEO (NEW)
   ========================================================================= */
function HeritageVideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [showFallbackPlay, setShowFallbackPlay] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          video.play().then(() => {
            setIsPlaying(true);
            setShowFallbackPlay(false);
          }).catch(err => {
            console.warn("Autoplay prevented:", err);
            setShowFallbackPlay(true);
          });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setProgress((video.currentTime / video.duration) * 100 || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else {
      videoRef.current.play().catch(() => setShowFallbackPlay(true));
      setShowFallbackPlay(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!isPlaying) videoRef.current.play().catch(() => {});
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) document.exitFullscreen();
      else containerRef.current.requestFullscreen();
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    videoRef.current.currentTime = (x / rect.width) * videoRef.current.duration;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full group bg-black cursor-pointer overflow-hidden rounded-[20px] sm:rounded-[24px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        muted={isMuted}
        loop
        className="w-full h-full object-cover"
      />
      
      {showFallbackPlay && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10 transition-opacity">
          <button className="size-20 md:size-24 bg-[#D97706] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <Icons.Play className="size-8 md:size-10 ml-2" fill="currentColor" />
          </button>
        </div>
      )}

      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 z-20 flex flex-col justify-end gap-3 md:gap-4
          ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        <div 
          className="w-full h-1.5 md:h-2 bg-white/30 rounded-full cursor-pointer overflow-hidden group/progress"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-[#D97706] transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="flex items-center justify-between">
          <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-[#D97706] transition-colors">
            {isPlaying ? <Icons.Pause className="size-5 md:size-6" fill="currentColor" /> : <Icons.Play className="size-5 md:size-6" fill="currentColor" />}
          </button>
          <div className="flex items-center gap-4">
            <button onClick={toggleMute} className="text-white hover:text-[#D97706] transition-colors">
              {isMuted ? <Icons.VolumeX className="size-5 md:size-6" /> : <Icons.Volume2 className="size-5 md:size-6" />}
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-[#D97706] transition-colors">
              <Icons.Maximize className="size-5 md:size-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeHeritageVideo({ settings }: { settings?: Record<string, any> }) {
  const [data, setData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let ignore = false;
    import("@/lib/heritage").then(({ fetchActiveHeritageVideo }) => {
      fetchActiveHeritageVideo()
        .then(res => { if (!ignore) setData(res); })
        .catch(err => { if (!ignore) console.warn("Failed to fetch heritage section", err); })
        .finally(() => { if (!ignore) setLoading(false); });
    });
    return () => { ignore = true; };
  }, []);

  const wc_eyebrow = data?.eyebrow ?? settings?.eyebrow ?? "OUR HERITAGE";
  const wc_heading = data?.title === "Where Purity Begins" ? "The Journey Behind Every Creation" : (data?.title ?? settings?.heading ?? "The Journey Behind Every Creation");
  
  if (!loading && (!data || !data.is_active || !data.video_url)) return null;

  return (
    <section className="py-12 sm:py-24 bg-cream">
      <div className="container-page max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {wc_eyebrow}
          </div>
          <h2 className="font-serif text-[32px] md:text-[40px] lg:text-[48px] font-[500] text-[#2B2118] leading-tight">
            {wc_heading}
          </h2>
          <p className="text-[15px] md:text-[18px] text-[#6B6257] max-w-[650px] sm:max-w-[700px] leading-[1.6] mt-7 sm:mt-8">
            A slow journey from hive to finished product — capturing the raw materials, traditional processes and human hands behind everything we create, just as nature intended.
          </p>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-10 flex justify-center mx-auto">
        <div className="w-full max-w-[1280px] h-auto aspect-[16/9] shadow-2xl border border-border/80 relative rounded-[20px] sm:rounded-[24px]">
          {data?.video_url && (
            <HeritageVideoPlayer src={data.video_url} poster={data.poster_url || undefined} />
          )}
        </div>
      </div>

      {/* =========================================================================
          ILLUSTRATED BRAND SECTION (Shared Component)
         ========================================================================= */}
      <IllustratedBrandSection className="mt-8 sm:mt-12" settings={settings} />
    </section>
  );
}
