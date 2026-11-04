import React, { useEffect, useState } from "react";
import { HeroSlider, type HeroSlide } from "@/components/site/HeroSlider";
import { fetchHeroSlides, getDefaultHeroSlides } from "@/lib/hero-catalog";

export function PageHeroSlider({
  page,
  interval = 6000,
}: {
  page: "home" | "shop" | "our-story" | "journal" | "bulk-gifting" | "contact" | string;
  interval?: number;
}) {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getDefaultHeroSlides(page));

  useEffect(() => {
    void fetchHeroSlides(page).then(setSlides);
  }, [page]);

  const isHome = page.toLowerCase() === "home";
  const isShop = page.toLowerCase() === "shop";
  const isStory = page.toLowerCase() === "our-story";
  const is1920x700 = isHome || isStory;
  const isTextBakedIn = isHome || isShop || isStory;

  return (
    <HeroSlider
      slides={slides}
      interval={interval}
      size={is1920x700 ? "home" : "inner"}
      variant={isTextBakedIn ? "home" : "inner"}
    />
  );
}
