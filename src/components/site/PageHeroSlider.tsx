import React, { useEffect, useState } from "react";
import { HeroSlider, type HeroSlide } from "@/components/site/HeroSlider";
import { fetchHeroSlides, getDefaultHeroSlides } from "@/lib/hero-catalog";

export function PageHeroSlider({
  page,
  interval = 6000,
}: {
  page: "home" | "shop" | "our-story" | "bee-farming" | "blog" | "bulk-orders" | "contact" | string;
  interval?: number;
}) {
  const [slides, setSlides] = useState<HeroSlide[]>(() =>
    getDefaultHeroSlides(page)
  );

  useEffect(() => {
    void fetchHeroSlides(page).then(setSlides);
  }, [page]);

  const isHome = page.toLowerCase() === "home";

  return (
    <HeroSlider
      slides={slides}
      interval={interval}
      size={isHome ? "home" : "inner"}
      variant={isHome ? "home" : "inner"}
    />
  );
}
