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
  const isJournal = page.toLowerCase() === "journal" || page.toLowerCase() === "blog";
  // Home is 1920x700. Journal, Our Story, and Shop use 1920x600 (16/5 aspect ratio)
  const is1920x700 = isHome;
  const isTextBakedIn = isHome || isShop || isStory || isJournal;

  return (
    <HeroSlider
      slides={slides}
      interval={interval}
      size={is1920x700 ? "home" : "inner"}
      variant={isTextBakedIn ? "home" : "inner"}
    />
  );
}
