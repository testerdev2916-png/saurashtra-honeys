import React, { useRef } from "react";
import { type ShopCategory } from "@/lib/category-catalog";
import heroProductsImg from "@/assets/hero-products.jpg"; // Fallback image for All Honey

interface CategoryThumbnailNavProps {
  categories: ShopCategory[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export function CategoryThumbnailNav({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryThumbnailNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Normalize the active category for strict comparison
  const normalizedActive =
    activeCategory.toLowerCase() === "all products" ||
    activeCategory.toLowerCase() === "all"
      ? "all products"
      : activeCategory.toLowerCase();

  // Combine All Honey + Supabase Categories
  // The backend already filters by active, and includes All Products as the first item.
  const displayCategories = categories;

  return (
    <section className="bg-[#F8F5EF] pt-8 pb-6 border-b border-border/60 overflow-hidden select-none">
      <div className="container-page">
        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-4 md:justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayCategories.map((cat) => {
            const isSelected = cat.name.toLowerCase() === normalizedActive;

            return (
              <button
                key={cat.slug}
                onClick={() => {
                  onSelectCategory(cat.name);
                }}
                className={`flex flex-col items-center gap-3 shrink-0 snap-start group outline-none`}
              >
                {/* Thumbnail Container */}
                <div
                  className={`
                    w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-2xl overflow-hidden transition-all duration-300 relative
                    ${
                      isSelected
                        ? "shadow-[0_8px_20px_rgba(217,119,6,0.15)] ring-2 ring-brand-orange ring-offset-2 ring-offset-[#F8F5EF]"
                        : "shadow-sm border border-border/80 group-hover:shadow-md group-hover:border-brand-orange/40"
                    }
                  `}
                >
                  <img
                    key={`${cat.slug}-${cat.updated_at ?? cat.image_url ?? "fallback"}`}
                    src={cat.image_url || undefined}
                    alt={cat.name}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isSelected ? "scale-105" : "group-hover:scale-105"
                    }`}
                    draggable={false}
                    onError={(event) => {
                      console.error("[CATEGORY IMAGE FAILED]", { slug: cat.slug, name: cat.name, src: event.currentTarget.src });
                    }}
                  />
                  {/* Subtle white overlay for unselected to make active pop more */}
                  <div 
                    className={`absolute inset-0 bg-white/20 transition-opacity duration-300 ${
                      isSelected ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                    }`} 
                  />
                </div>

                {/* Category Label */}
                <span
                  className={`font-serif text-[13px] md:text-[15px] tracking-wide transition-colors duration-300 ${
                    isSelected ? "text-brand-orange font-bold" : "text-espresso group-hover:text-brand-orange/80"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
