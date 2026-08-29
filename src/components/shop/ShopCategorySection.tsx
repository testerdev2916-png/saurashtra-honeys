import React, { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { fetchShopCategories, type ShopCategory } from "@/lib/category-catalog";

import heroProductsImg from "@/assets/hero-products.jpg";
import heroHoneyImg from "@/assets/hero-honey.jpg";
import prodHoneycombImg from "@/assets/prod-honeycomb.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import prodGiftpackImg from "@/assets/prod-giftpack.jpg";
import prodLycheeImg from "@/assets/prod-lychee.jpg";

export function ShopCategorySection({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const [categories, setCategories] = useState<{name: string, img: string, filter: string, slug: string, updatedAt?: string}[]>([]);

  useEffect(() => {
    void fetchShopCategories().then((cats) => {
      const FALLBACK_IMAGE_BY_SLUG: Record<string, string> = {
        honey: heroHoneyImg,
        beeswax: prodHoneycombImg,
        "bee-pollen": beeFarmImg,
        "beeswax-candle": honeycombBeesImg,
        "beeswax-products": prodGiftpackImg,
        "beauty-products": prodLycheeImg,
        "all-products": heroProductsImg,
      };
      
      const formatted = cats.map(c => {
        if (!c.image_url) {
          console.warn("[CATEGORY IMAGE MISSING]", { slug: c.slug, name: c.name, image_url: c.image_url, source: "ShopCategorySection" });
        } else {
          console.debug("[CATEGORY IMAGE]", { slug: c.slug, name: c.name, image_url: c.image_url });
        }
        return {
          name: c.name,
          img: c.image_url || "",
          filter: c.name.toLowerCase(),
          slug: c.slug,
          updatedAt: c.updated_at
        };
      });
      setCategories(formatted);
    });
  }, []);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: "start",
    },
    [
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const displayCats = [
    ...categories,
    ...categories,
    ...categories,
  ];

  return (
    <section className="pt-24 pb-16 bg-[#F8F5EF] overflow-hidden flex flex-col items-center">
      <div className="container-page text-center mb-[70px]">
        <div className="text-[12px] font-medium tracking-[5px] uppercase text-[#D97706] mb-3">
          DISCOVER BY CATEGORY
        </div>
        <h2 className="font-serif text-[58px] font-[500] text-[#2B2118] leading-tight">
          Shop by Category
        </h2>
      </div>

      <div className="w-full max-w-[1596px] mx-auto relative pb-10 group px-4">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-8 sm:left-12 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-[#3B2E24] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/70 hidden sm:flex"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-8 sm:right-12 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-center text-[#3B2E24] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/70 hidden sm:flex"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Embla Carousel Container */}
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex gap-[24px] py-6 touch-pan-y cursor-grab active:cursor-grabbing">
            {displayCats.map((cat, idx) => {
              const isActive =
                activeCategory === cat.name ||
                (cat.name === "All Products" &&
                  (activeCategory === "All Products" ||
                    activeCategory === "All" ||
                    activeCategory === "all")) ||
                activeCategory.toLowerCase() === cat.filter.toLowerCase();
              return (
                <div
                  key={idx}
                  className="flex-[0_0_48%] md:flex-[0_0_31%] lg:flex-[0_0_23%] xl:flex-[0_0_18.5%] min-w-0"
                >
                  <Link
                    to="/shop"
                    search={cat.filter ? ({ category: cat.filter } as never) : ({ category: "All Products" } as never)}
                    className={`group relative flex flex-col shrink-0 cursor-pointer overflow-hidden bg-white
                      rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]
                      transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                      w-full aspect-[3/4]
                      ${
                        isActive
                          ? "ring-2 ring-[#D97706] ring-offset-2 ring-offset-[#F8F5EF]"
                          : ""
                      }
                      hover:scale-[1.03]
                    `}
                  >
                    {/* Image Section (80%) */}
                    <div className="h-[80%] w-full overflow-hidden bg-[#F8F5EF]/50">
                      <img
                        key={cat.updatedAt || cat.img}
                        src={cat.img}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transform transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] pointer-events-none"
                        onError={(event) => {
                          console.error("[CATEGORY IMAGE FAILED]", { slug: cat.slug, name: cat.name, src: event.currentTarget.src });
                        }}
                      />
                    </div>

                    {/* Text Section (20%) */}
                    <div className="h-[20%] w-full bg-white flex items-center justify-center p-4">
                      <h3
                        className={`font-serif text-[clamp(14px,1.5vw,18px)] font-medium transition-colors duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isActive
                            ? "text-[#D97706]"
                            : "text-[#3B2E24] group-hover:text-[#D97706]"
                        }`}
                      >
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
