import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { ArrowRight, Package, Gift, Sparkles, Tag, ShieldCheck, HeartHandshake, Award } from "lucide-react";

// Photographic assets
import heroProductsImg from "@/assets/hero-products.jpg";
import giftPackImg from "@/assets/prod-giftpack.jpg";
import heroHoneyImg from "@/assets/hero-honey.jpg";
import ajwainImg from "@/assets/prod-ajwain.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";

export const Route = createFileRoute("/bulk-gifting")({
  head: () => ({
    meta: [
      {
        title: "B2B Ecosystem — Wholesale, Corporate Gifts & Private Label | Saurashtra Honey",
      },
      {
        name: "description",
        content: "Discover our premium B2B services: Wholesale Bulk Orders, Corporate Gifting, Luxury Hampers, and White Label Manufacturing of pure natural honey.",
      },
      { property: "og:title", content: "B2B Ecosystem — Saurashtra Honey" },
      { property: "og:description", content: "Partner with a trusted premium honey manufacturer." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BulkGiftingHubPage,
});

function BulkGiftingHubPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, duration: 60 },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        playOnInit: false,
      }),
    ]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins().autoplay;
    
    // Initial wait before first movement
    const initTimeout = setTimeout(() => {
      if (autoplay) autoplay.play();
    }, 3000);

    const resumeAutoplay = () => {
      if (autoplay) autoplay.play();
    };

    let timeoutId: NodeJS.Timeout;
    const onInteract = () => {
      if (autoplay) autoplay.stop();
      clearTimeout(timeoutId);
      clearTimeout(initTimeout);
      timeoutId = setTimeout(resumeAutoplay, 5000);
    };

    emblaApi.on("pointerDown", onInteract);
    emblaApi.on("pointerUp", onInteract);
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });

    return () => {
      emblaApi.off("pointerDown", onInteract);
      emblaApi.off("pointerUp", onInteract);
      clearTimeout(timeoutId);
      clearTimeout(initTimeout);
    };
  }, [emblaApi]);

  const serviceCards = [
    {
      title: "Bulk Orders",
      desc: "Premium wholesale honey solutions for retailers, restaurants and distributors.",
      img: heroProductsImg,
      Icon: Package,
      href: "/bulk-orders",
      cta: "Explore Bulk Solutions"
    },
    {
      title: "Corporate Gifting",
      desc: "Luxury gifting solutions crafted to impress employees and clients.",
      img: giftPackImg,
      Icon: Gift,
      href: "/corporate-gifting",
      cta: "View Gifting Solutions"
    },
    {
      title: "Gift Hampers",
      desc: "Curated honey gift hampers for festive, wedding and special occasions.",
      img: heroHoneyImg,
      Icon: Sparkles,
      href: "/gift-hampers",
      cta: "Explore Hampers"
    },
    {
      title: "Private Labeling",
      desc: "Launch your own premium honey brand with complete private labeling support.",
      img: ajwainImg,
      Icon: Tag,
      href: "/private-label",
      cta: "Build Your Brand"
    },
  ];

  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Bulk & Gifting", url: "/bulk-gifting" },
        ])}
      />

      <PageHeroSlider page="bulk-orders" />

      {/* Overview Intro */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706] mb-4">
            BUSINESS PARTNERSHIPS
          </div>
          <h2 className="font-serif text-[34px] sm:text-[44px] md:text-[56px] text-[#2B2118] font-[500] leading-tight mb-6 max-w-4xl mx-auto">
            A Trusted Manufacturer of 100% Pure Natural Honey
          </h2>
          <p className="text-[#6B6257] text-[16px] sm:text-[18px] max-w-2xl mx-auto leading-relaxed">
            We provide end-to-end premium honey solutions for businesses worldwide. 
            Select a service below to explore dedicated offerings, minimum order quantities, and custom solutions tailored for your business.
          </p>
        </div>
      </section>

      {/* Services Grid (Premium Editorial) */}
      <section className="py-24 sm:py-32 bg-[#F8F5EF] border-t border-border/60">
        <div className="container-page md:hidden">
          <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4 py-4">
              {serviceCards.map((card) => (
                <div key={card.title} className="flex-[0_0_82vw] pl-4 min-w-0">
                  <Link 
                    to={card.href}
                    className="group flex flex-col rounded-[26px] overflow-hidden bg-white border border-[#2B2118]/5 shadow-[0_4px_24px_rgba(43,33,24,0.04)] active:shadow-[0_12px_40px_rgba(43,33,24,0.08)] transition-all duration-[300ms] ease-out active:scale-[1.02] h-auto"
                  >
                    <div className="h-[230px] w-full overflow-hidden relative shrink-0 bg-[#FDFBF7]">
                      <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-active:scale-[1.04]"
                      />
                    </div>
                    <div className="p-[22px] flex flex-col flex-1">
                      <card.Icon className="size-[22px] text-[#D97706] mb-[14px] shrink-0" strokeWidth={1.5} />
                      <h3 className="font-serif text-[34px] font-medium leading-[1.1] text-[#2B2118] mb-[12px]">
                        {card.title}
                      </h3>
                      <p className="text-[#4A453E] text-[17px] leading-[1.6] line-clamp-3 mb-auto">
                        {card.desc}
                      </p>
                      <div className="mt-[18px] flex items-center text-[18px] font-semibold text-[#D97706] transition-colors">
                        {card.cta} 
                        <ArrowRight className="ml-1.5 size-4 transition-transform duration-[300ms] ease-out group-active:translate-x-1.5" strokeWidth={2.5} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {serviceCards.map((_, i) => (
              <button 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? "bg-[#D97706] w-4" : "bg-[#D97706]/20 w-1.5"}`} 
                onClick={() => emblaApi?.scrollTo(i)} 
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="container-page hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-8 max-w-[1400px] mx-auto">
            {serviceCards.map((card) => (
              <Link 
                key={card.title} 
                to={card.href}
                className="group flex flex-col rounded-[26px] overflow-hidden bg-white border border-[#2B2118]/5 shadow-[0_4px_24px_rgba(43,33,24,0.04)] hover:shadow-[0_12px_40px_rgba(43,33,24,0.08)] transition-all duration-[300ms] ease-out hover:-translate-y-2 lg:h-[480px]"
              >
                <div className="h-[220px] w-full overflow-hidden relative shrink-0 bg-[#FDFBF7]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-[26px] flex flex-col flex-1">
                  <card.Icon className="size-6 text-[#D97706] mb-4 shrink-0" strokeWidth={1.5} />
                  <h3 className="font-serif text-[32px] xl:text-[34px] font-medium leading-[1.1] text-[#2B2118] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-[#6B6257] text-[17px] xl:text-[18px] leading-[1.4] line-clamp-2 mb-auto">
                    {card.desc}
                  </p>
                  <div className="mt-6 flex items-center text-[15px] xl:text-[16px] font-semibold text-[#D97706] group-hover:text-[#B57420] transition-colors">
                    {card.cta} 
                    <ArrowRight className="ml-1.5 size-4 transition-transform duration-[300ms] ease-out group-hover:translate-x-1.5" strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Certifications Snippet */}
      <section className="py-20 bg-[#2B2118] text-[#FDFBF7]">
        <div className="container-page text-center">
          <h2 className="font-serif text-[28px] sm:text-[36px] mb-12">Why Businesses Trust Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <ShieldCheck className="size-10 text-[#D97706] mb-4" strokeWidth={1} />
              <div className="font-bold text-[18px] mb-2">100% Lab Tested</div>
              <p className="text-[#FDFBF7]/70 text-[14px]">Every batch is independently certified for purity.</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="size-10 text-[#D97706] mb-4" strokeWidth={1} />
              <div className="font-bold text-[18px] mb-2">Premium Quality</div>
              <p className="text-[#FDFBF7]/70 text-[14px]">Raw, unfiltered, and packed with natural enzymes.</p>
            </div>
            <div className="flex flex-col items-center">
              <HeartHandshake className="size-10 text-[#D97706] mb-4" strokeWidth={1} />
              <div className="font-bold text-[18px] mb-2">End-to-End Support</div>
              <p className="text-[#FDFBF7]/70 text-[14px]">From harvesting to bespoke packaging, we handle it all.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
