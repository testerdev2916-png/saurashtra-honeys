import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2, Quote } from "lucide-react";
import type { GoogleReviewRecord } from "@/lib/google-reviews.server";

// Official Google G Logo
function GoogleGIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function formatRelativeReviewDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  } catch {
    return "Recent review";
  }
}

function getInitials(name: string): string {
  if (!name) return "SH";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface GoogleReviewsSectionProps {
  reviews?: GoogleReviewRecord[];
  settings?: {
    google_maps_url?: string;
    google_review_dialog_url?: string | null;
    average_rating?: number;
    total_review_count?: number;
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
}

export function GoogleReviewsSection({
  reviews = [],
  settings = {},
}: GoogleReviewsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const avgRating = Number(settings.average_rating || 4.9).toFixed(1);
  const totalCount = settings.total_review_count || (reviews.length > 0 ? reviews.length : 124);
  const mapsUrl =
    settings.google_maps_url ||
    "https://www.google.com/maps/search/?api=1&query=Saurashtra+Honey+Bee+Farm+Mahuva";
  const writeReviewUrl =
    settings.google_review_dialog_url ||
    mapsUrl;

  const eyebrow = settings.eyebrow || "VERIFIED GOOGLE REVIEWS";
  const heading = settings.heading || "What Our Customers Say";
  const description =
    settings.description ||
    "Authentic reviews from verified customers on Google. Real experiences with our pure, raw, and unheated honey.";

  return (
    <section
      aria-label="Google Customer Reviews"
      className="py-16 sm:py-24 bg-[#FDFBF7] border-y border-[#EBE5D8] overflow-hidden relative"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3A2B]/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-[12px] uppercase tracking-[3px] text-brand-orange font-bold">
              <GoogleGIcon className="w-4 h-4 shrink-0" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[42px] md:text-[50px] font-medium text-espresso leading-[1.15]">
              {heading}
            </h2>
            <p className="text-[15px] sm:text-[17px] text-[#6B6257] leading-[1.6]">
              {description}
            </p>
          </div>

          {/* Aggregate Rating Badge & Navigation */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Google Rating Overview Pill */}
            <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-[#EBE5D8] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <GoogleGIcon className="w-6 h-6 shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-espresso leading-none">{avgRating}</span>
                  <div className="flex text-[#D97706]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5">
                  Based on {totalCount}+ Google reviews
                </span>
              </div>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={scrollPrev}
                aria-label="Previous customer review"
                className="w-11 h-11 rounded-full border border-[#DCD5C5] bg-white flex items-center justify-center hover:bg-cream hover:border-brand-orange/40 transition-all text-espresso shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next customer review"
                className="w-11 h-11 rounded-full border border-[#DCD5C5] bg-white flex items-center justify-center hover:bg-cream hover:border-brand-orange/40 transition-all text-espresso shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="overflow-hidden w-full -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6 py-2">
            {reviews.map((rev) => {
              const isLong = (rev.review_text || "").length > 180;
              const isExpanded = expandedReviews[rev.id] || false;
              const displayText =
                isLong && !isExpanded
                  ? `${rev.review_text.substring(0, 180)}...`
                  : rev.review_text;

              return (
                <div
                  key={rev.id || rev.google_review_id}
                  className="flex-[0_0_86%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.33333%-16px)] min-w-0"
                >
                  <div className="h-full flex flex-col justify-between bg-white rounded-[22px] sm:rounded-[26px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#EBE5D8] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:border-brand-orange/30 transition-all duration-300">
                    <div>
                      {/* Top: Stars + Verified Google badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-[#D97706]">
                            {[...Array(rev.star_rating || 5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-[12px] font-bold text-espresso ml-1">
                            {(rev.star_rating || 5).toFixed(1)}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1B3A2B] bg-[#EBF3ED] px-2.5 py-1 rounded-full border border-[#D2E4D6]">
                          <GoogleGIcon className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>

                      {/* Review Text */}
                      {rev.review_text && (
                        <blockquote className="text-[14px] sm:text-[15px] text-[#2C221E] leading-[1.65] font-normal mb-5 relative">
                          "{displayText}"
                          {isLong && (
                            <button
                              onClick={() => toggleExpand(rev.id)}
                              className="ml-1.5 text-[12px] font-semibold text-brand-orange hover:underline focus:outline-none"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}
                        </blockquote>
                      )}
                    </div>

                    {/* Bottom: Reviewer details */}
                    <div className="mt-auto pt-4 border-t border-[#F0EBE0] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {rev.reviewer_photo_url ? (
                          <img
                            src={rev.reviewer_photo_url}
                            alt={rev.reviewer_name}
                            className="w-10 h-10 rounded-full object-cover border border-[#EBE5D8] shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1B3A2B] text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-wider">
                            {getInitials(rev.reviewer_name)}
                          </div>
                        )}
                        <div className="min-w-0 flex flex-col">
                          <span className="font-bold text-[14px] text-espresso capitalize truncate">
                            {rev.reviewer_name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {formatRelativeReviewDate(rev.review_date)}
                          </span>
                        </div>
                      </div>

                      {/* Link to view on Google if available */}
                      {(rev.google_review_url || mapsUrl) && (
                        <a
                          href={rev.google_review_url || mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${rev.reviewer_name}'s review on Google`}
                          className="w-8 h-8 rounded-full bg-[#F8F5EF] flex items-center justify-center text-[#6B6257] hover:text-[#1B3A2B] hover:bg-[#EBE5D8] transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex sm:hidden justify-center gap-3 mt-6">
          <button
            onClick={scrollPrev}
            aria-label="Previous customer review"
            className="w-10 h-10 rounded-full border border-[#DCD5C5] bg-white flex items-center justify-center hover:bg-cream text-espresso shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next customer review"
            className="w-10 h-10 rounded-full border border-[#DCD5C5] bg-white flex items-center justify-center hover:bg-cream text-espresso shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom CTA Strip: "Read All Reviews on Google" & "Write a Review" */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#1B3A2B] text-white hover:bg-[#12281D] font-medium text-[13px] sm:text-[14px] tracking-wide transition-all shadow-sm hover:shadow-md"
          >
            <GoogleGIcon className="w-4 h-4" />
            <span>Read All Reviews on Google</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-espresso border border-[#DCD5C5] hover:border-brand-orange hover:bg-cream font-medium text-[13px] sm:text-[14px] tracking-wide transition-all shadow-sm"
          >
            <Star className="w-4 h-4 text-[#D97706] fill-current" />
            <span>Write a Review on Google</span>
          </a>
        </div>
      </div>
    </section>
  );
}
