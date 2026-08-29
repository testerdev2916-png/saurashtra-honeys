import React, { useEffect, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface PremiumMobileCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  slideClassName?: string;
  containerClassName?: string;
}

export function PremiumMobileCarousel<T>({
  items,
  renderItem,
  slideClassName = "flex-[0_0_86vw]",
  containerClassName = "pb-4",
}: PremiumMobileCarouselProps<T>) {
  if (!items || items.length === 0) return null;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      duration: 60, // Smooth 600ms ease-in-out transition
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
        playOnInit: false,
      }),
    ]
  );

  // Resume autoplay logic after 5 seconds of no interaction
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    const initTimeout = setTimeout(() => {
      autoplay.play();
    }, 3000);

    const resumeAutoplay = () => {
      autoplay.play();
    };

    let timeoutId: NodeJS.Timeout;
    const onInteract = () => {
      autoplay.stop();
      clearTimeout(timeoutId);
      clearTimeout(initTimeout);
      timeoutId = setTimeout(resumeAutoplay, 5000);
    };

    emblaApi.on("pointerDown", onInteract);
    emblaApi.on("pointerUp", onInteract);

    return () => {
      emblaApi.off("pointerDown", onInteract);
      emblaApi.off("pointerUp", onInteract);
      clearTimeout(timeoutId);
      clearTimeout(initTimeout);
    };
  }, [emblaApi]);

  return (
    <div
      className={`overflow-hidden w-full -mx-4 px-4 sm:mx-0 sm:px-0 ${containerClassName}`}
      ref={emblaRef}
    >
      <div
        className="flex touch-pan-y cursor-grab active:cursor-grabbing pb-2"
        style={{ marginLeft: "-16px" }}
      >
        {items.map((item, idx) => (
          <div key={idx} className={`${slideClassName} min-w-0 pl-[16px]`}>
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
    </div>
  );
}
