import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, X } from "lucide-react";

export const FILTER_OPTIONS = {
  honeyType: ["Ajwain", "Multiflora", "Neem", "Fennel", "Wild Forest", "Organic"],
  packSize: ["250g", "500g", "1kg"],
  availability: ["In Stock", "Out of Stock"],
  rating: ["★★★★★", "★★★★☆"],
  discount: ["10% Off or more", "20% Off or more", "30% Off or more"],
};

export type FilterState = {
  honeyType: string[];
  packSize: string[];
  availability: string[];
  rating: string[];
  discount: string[];
};

export const defaultFilters: FilterState = {
  honeyType: [],
  packSize: [],
  availability: [],
  rating: [],
  discount: [],
};

function FilterSections({ filters, setFilters }: { filters: FilterState; setFilters: React.Dispatch<React.SetStateAction<FilterState>> }) {
  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const renderSection = (title: string, category: keyof FilterState, options: string[]) => (
    <div className="py-5 border-b border-[#2B2118]/10 last:border-0">
      <h4 className="font-serif text-[15px] font-bold text-[#2B2118] mb-3">{title}</h4>
      <div className="space-y-2.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={filters[category].includes(opt)}
              onCheckedChange={() => toggleFilter(category, opt)}
              className="border-[#D97706]/30 data-[state=checked]:bg-[#D97706] data-[state=checked]:border-[#D97706] rounded-[4px] w-[18px] h-[18px]"
            />
            <span className="text-[14px] text-[#6B6257] group-hover:text-[#2B2118] transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-1">
      {renderSection("Honey Type", "honeyType", FILTER_OPTIONS.honeyType)}
      {renderSection("Pack Size", "packSize", FILTER_OPTIONS.packSize)}
      {renderSection("Availability", "availability", FILTER_OPTIONS.availability)}
      {renderSection("Rating", "rating", FILTER_OPTIONS.rating)}
      {renderSection("Discount", "discount", FILTER_OPTIONS.discount)}
    </div>
  );
}

export function DesktopFilterSheet({ 
  children, 
  filters, 
  setFilters, 
  onApply 
}: { 
  children: React.ReactNode;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[380px] sm:w-[400px] p-0 border-l border-[#2B2118]/10 flex flex-col bg-[#FDFBF7]">
        <SheetHeader className="px-6 py-5 border-b border-[#2B2118]/10 flex flex-row items-center justify-between">
          <SheetTitle className="font-serif text-xl font-bold text-[#2B2118] flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-[#D97706]" /> Filters
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          <FilterSections filters={filters} setFilters={setFilters} />
        </div>

        <div className="p-6 border-t border-[#2B2118]/10 bg-white grid grid-cols-2 gap-4">
          <button onClick={handleReset} className="px-4 py-3.5 rounded-full border border-[#2B2118]/20 text-[#2B2118] font-bold text-[13px] tracking-widest uppercase hover:bg-[#F8F5EF] transition-colors">
            Reset
          </button>
          <button onClick={handleApply} className="px-4 py-3.5 rounded-full bg-[#2B2118] text-white font-bold text-[13px] tracking-widest uppercase hover:bg-[#D97706] transition-colors shadow-md hover:shadow-lg">
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileFilterDrawer({ 
  children, 
  filters, 
  setFilters, 
  onApply 
}: { 
  children: React.ReactNode;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-[#FDFBF7]/95 backdrop-blur-xl border-t border-[#2B2118]/10 rounded-t-[28px] max-h-[85vh]">
        <DrawerHeader className="text-left px-6 py-4 border-b border-[#2B2118]/10">
          <DrawerTitle className="font-serif text-xl font-bold text-[#2B2118] flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-[#D97706]" /> Filters
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FilterSections filters={filters} setFilters={setFilters} />
        </div>

        <div className="p-5 pb-8 border-t border-[#2B2118]/10 bg-white/80 backdrop-blur-md grid grid-cols-2 gap-3">
          <button onClick={handleReset} className="px-4 py-3.5 rounded-[16px] border border-[#2B2118]/20 text-[#2B2118] font-bold text-[13px] tracking-widest uppercase active:scale-95 transition-transform">
            Reset
          </button>
          <button onClick={handleApply} className="px-4 py-3.5 rounded-[16px] bg-[#D97706] text-white font-bold text-[13px] tracking-widest uppercase shadow-md active:scale-95 transition-transform">
            Apply Filters
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
