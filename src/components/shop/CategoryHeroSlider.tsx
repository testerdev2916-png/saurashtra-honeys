import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { supabase } from "@/integrations/supabase/client";

export interface CategoryHeroSlide {
  id: string;
  category_slug: string;
  image_url: string;
  mobile_image_url: string | null;
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  active: boolean;
}

interface Props {
  categorySlug: string;
  categoryName?: string;
}

export function CategoryHeroSlider({ categorySlug, categoryName }: Props) {
  const [slides, setSlides] = useState<CategoryHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSlides() {
      try {
        const { data, error } = await supabase
          .from("category_hero_slides")
          .select("*")
          .eq("category_slug", categorySlug)
          .eq("active", true)
          .order("sort_order", { ascending: true })
          .limit(3);

        if (error) {
          console.error("Error fetching category hero slides:", error);
        } else {
          setSlides(data || []);
        }
      } catch (err) {
        console.error("Error connecting to Supabase for category hero slides:", err);
      } finally {
        setLoading(false);
      }
    }
    
    void loadSlides();
  }, [categorySlug]);

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

  if (loading) return null;

  if (slides.length === 0) {
    return (
      <section className="relative bg-cream-deep/40 py-16 sm:py-24 overflow-hidden">
        <div className="container-page relative z-10 text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso font-medium mb-4">
            {categoryName || categorySlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </h1>
        </div>
      </section>
    );
  }

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
              key={s.id || idx} 
              className="relative flex-none w-full aspect-[4/5] md:aspect-[16/5] min-w-0"
              role="group" 
              aria-roledescription="slide"
            >
              <picture className="w-full h-full block">
                {s.mobile_image_url && (
                  <source 
                    media="(max-width: 767px)" 
                    srcSet={s.mobile_image_url} 
                    // @ts-ignore
                    fetchpriority={idx === 0 ? "high" : "auto"}
                  />
                )}
                <img
                  src={s.image_url}
                  alt={s.title || `Hero banner for ${categorySlug}`}
                  className="w-full h-full object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                  // @ts-ignore
                  fetchpriority={idx === 0 ? "high" : "auto"}
                />
              </picture>

              {/* Text Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 bg-black/10">
                {s.title && (
                  <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-serif font-medium mb-3 md:mb-4 drop-shadow-md">
                    {s.title}
                  </h2>
                )}
                {s.subtitle && (
                  <p className="text-white/90 text-sm md:text-lg lg:text-xl max-w-2xl font-medium drop-shadow mb-6 md:mb-8">
                    {s.subtitle}
                  </p>
                )}
                {s.cta_label && s.cta_href && (
                  <Link 
                    to={s.cta_href} 
                    className="bg-brand-orange text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-white hover:text-brand-orange transition-all duration-300 shadow-lg"
                  >
                    {s.cta_label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === selectedIndex 
                  ? "w-8 h-2 bg-brand-orange" 
                  : "w-2 h-2 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
