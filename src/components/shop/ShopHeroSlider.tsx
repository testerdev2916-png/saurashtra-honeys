import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { fetchHeroSlides, getDefaultHeroSlides } from "@/lib/hero-catalog";
import type { HeroSlide } from "@/components/site/HeroSlider";

export function ShopHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getDefaultHeroSlides("shop"));
  
  useEffect(() => {
    void fetchHeroSlides("shop").then((loaded) => {
      if (loaded && loaded.length > 0) {
        setSlides(loaded);
      }
    });
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", duration: 50 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const paused = useRef(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!slides || slides.length === 0) return null;

  return (
    <section 
      className="relative w-full max-w-[100vw] overflow-hidden bg-[#FDFBF7] group/section"
      onMouseEnter={() => {
        paused.current = true;
        const auto = emblaApi?.plugins()?.autoplay;
        if (auto) auto.stop();
      }}
      onMouseLeave={() => {
        paused.current = false;
        const auto = emblaApi?.plugins()?.autoplay;
        if (auto) auto.play();
      }}
      aria-roledescription="carousel"
    >
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((s, idx) => (
            <div 
              key={idx} 
              className="relative flex-none w-full aspect-[4/5] md:aspect-[16/5] min-w-0"
              role="group" 
              aria-roledescription="slide"
            >
              <picture className="w-full h-full block">
                {s.mobileImage && (
                  <source 
                    media="(max-width: 767px)" 
                    srcSet={s.mobileImage} 
                    // @ts-ignore
                    fetchpriority={idx === 0 ? "high" : "auto"}
                  />
                )}
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                  // @ts-ignore
                  fetchpriority={idx === 0 ? "high" : "auto"}
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white backdrop-blur flex items-center justify-center text-[#2B2118] shadow-sm transition-all hover:scale-105 opacity-0 md:opacity-100 group-hover/section:opacity-100 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5 md:size-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white backdrop-blur flex items-center justify-center text-[#2B2118] shadow-sm transition-all hover:scale-105 opacity-0 md:opacity-100 group-hover/section:opacity-100 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5 md:size-6" />
          </button>
          
          {/* Pagination Dots */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === selectedIndex 
                    ? "w-8 md:w-10 h-1.5 md:h-2 bg-white md:bg-[#3B5241]" 
                    : "w-1.5 h-1.5 md:w-2 md:h-2 bg-white/50 md:bg-[#3B5241]/30 hover:bg-white/80 md:hover:bg-[#3B5241]/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
