import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type HeroSlide = {
  image: string;
  mobileImage?: string | null;
  title: string;
  eyebrow?: string | null;
  description?: string | null;
  features?: string[];
  ctaText?: string | null;
  ctaTo?: string;
  ctaParams?: Record<string, string>;
  updatedAt?: string;
};

export function HeroSlider({
  slides,
  interval = 6000,
  size = "md",
  variant,
}: {
  slides: HeroSlide[];
  interval?: number;
  size?: "sm" | "md" | "home" | "inner";
  variant?: "home" | "inner";
}) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);
  
  const [loaded, setLoaded] = useState<Set<number>>(() => {
    const s = new Set([0]);
    if (slides && slides.length > 1) {
      s.add(1);
      s.add(slides.length - 1);
    }
    return s;
  });

  const go = (n: number, d: 1 | -1 = 1) => {
    if (!slides || slides.length <= 1) return;
    setDir(d);
    setI((n + slides.length) % slides.length);
  };
  const next = () => go(i + 1, 1);
  const prev = () => go(i - 1, -1);

  useEffect(() => {
    if (paused.current || !slides || slides.length <= 1) return;
    timer.current = setTimeout(() => go(i + 1, 1), interval);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, interval, slides?.length]);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    setLoaded((prev) => {
      const next = new Set(prev);
      next.add(i);
      if (slides.length > 1) {
        next.add((i + 1) % slides.length);
        next.add((i - 1 + slides.length) % slides.length);
      }
      return next.size > prev.size ? next : prev;
    });
  }, [i, slides?.length]);

  const effVariant = variant === "home" || size === "home" || size === "md" ? "home" : "inner";
  const aspectCls = effVariant === "home" 
    ? "aspect-square md:aspect-[192/70]" 
    : "aspect-square md:aspect-[16/5]";

  if (!slides || slides.length === 0) return null;

  return (
    <section
      className="relative w-full max-w-[100vw] overflow-x-hidden bg-[#120E0C]"
      onMouseEnter={() => { paused.current = true; if (timer.current) clearTimeout(timer.current); }}
      onMouseLeave={() => { paused.current = false; setI((v) => v); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
        touchX.current = null;
      }}
      aria-roledescription="carousel"
    >
      <div className={`relative w-full ${aspectCls}`}>

        {slides.map((s, idx) => {
          const isActive = idx === i;
          const offset = isActive ? "translate-x-0 opacity-100 z-10" : `${dir === 1 ? "translate-x-full" : "-translate-x-full"} opacity-0 z-0`;
          return (
            <div
              key={idx}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${offset}`}
            >
              <Link 
                to={s.ctaTo || "/"} 
                params={s.ctaParams as never}
                className="absolute inset-0 z-0 block cursor-pointer"
                aria-label={`Go to ${s.ctaTo || "/"}`}
              >
                {loaded.has(idx) && (
                  <picture className="w-full h-full block">
                    {s.mobileImage && (
                      <source 
                        key={`mob-${s.updatedAt || s.mobileImage}`}
                        media="(max-width: 767px)" 
                        srcSet={s.mobileImage} 
                        // @ts-ignore: fetchpriority is valid in newer React versions
                        fetchpriority={idx === 0 ? "high" : "auto"}
                      />
                    )}
                    <img
                      key={`desk-${s.updatedAt || s.image}`}
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover object-center"
                      loading={idx === 0 ? "eager" : "lazy"}
                      // @ts-ignore: fetchpriority is valid in newer React versions
                      fetchpriority={idx === 0 ? "high" : "auto"}
                    />
                  </picture>
                )}

                {/* Text Overlay (Only rendered if text fields are provided and not on homepage where text is baked into image) */}
                {effVariant !== 'home' && (s.eyebrow || s.description || s.ctaText) && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-t from-[#120E0C]/70 via-[#120E0C]/20 to-transparent pointer-events-none">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 mt-12 md:mt-0">
                      {s.eyebrow && (
                        <div className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-brand-orange drop-shadow-md">
                          {s.eyebrow}
                        </div>
                      )}
                      {idx === 0 ? (
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-cream drop-shadow-lg leading-tight md:leading-tight">
                          {s.title}
                        </h1>
                      ) : (
                        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-cream drop-shadow-lg leading-tight md:leading-tight">
                          {s.title}
                        </h2>
                      )}
                      {s.description && (
                        <p className="text-sm md:text-lg text-cream/90 drop-shadow-md max-w-2xl mx-auto leading-relaxed md:leading-relaxed">
                          {s.description}
                        </p>
                      )}
                      {s.ctaText && (
                        <div className="pt-4 md:pt-6">
                          <span className="inline-flex items-center gap-2 bg-brand-orange text-white rounded-full px-6 py-3.5 md:px-8 md:py-4 font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-md transition-transform pointer-events-auto hover:bg-brand-orange-hover hover:scale-[1.02]">
                            {s.ctaText}
                            <ArrowRight className="size-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            </div>
          );
        })}

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 size-[42px] md:size-10 rounded-full bg-cream/15 hover:bg-cream/35 text-cream backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="size-5 md:size-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 size-[42px] md:size-10 rounded-full bg-cream/15 hover:bg-cream/35 text-cream backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronRight className="size-5 md:size-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => go(idx, idx > i ? 1 : -1)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-6 bg-burnt-orange" : "w-1.5 bg-cream/40 hover:bg-cream/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
