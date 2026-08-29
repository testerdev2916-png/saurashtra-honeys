import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SectionEyebrow } from "@/components/site/Layout";
import { resolveImage } from "@/lib/product-images";
import { useSiteSettings } from "@/lib/site-settings";
import {
  DEFAULT_SUPPLY_SERVICES,
  listPublicSupplyServices,
  type SupplyServiceRow,
} from "@/lib/supply-services-catalog";
import {
  Store,
  Factory,
  Gift,
  Users2,
  Building2,
  Briefcase,
  Award,
  Package,
  Truck,
  ShieldCheck,
  MessageCircle,
  X,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Store,
  Factory,
  Gift,
  Users2,
  Building2,
  Briefcase,
  Award,
  Package,
  Truck,
  ShieldCheck,
};

export function WhoWeSupplySection() {
  const [items, setItems] = useState<SupplyServiceRow[]>(DEFAULT_SUPPLY_SERVICES);
  const [selected, setSelected] = useState<SupplyServiceRow | null>(null);
  const { whatsapp } = useSiteSettings();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listPublicSupplyServices();
        if (!cancelled && res?.rows && res.rows.length > 0) {
          setItems(res.rows);
        }
      } catch {
        // Retain default items on error
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const waNumber = (whatsapp?.number || "919687328404").replace(/\D/g, "");

  return (
    <section className="container-page py-11 md:py-24">
      <div className="text-center max-w-xl mx-auto">
        <SectionEyebrow>Who We Supply</SectionEyebrow>
        <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-espresso">
          Trusted by Businesses Across India
        </h2>
      </div>

      {/* 4 Interactive Cards */}
      <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => {
          const IconComponent = ICON_MAP[item.icon_name] || Store;
          const imgUrl = resolveImage(item.image_key, item.image_url);
          return (
            <button
              key={item.id || item.title}
              type="button"
              onClick={() => setSelected(item)}
              className="group text-left rounded-2xl overflow-hidden border border-border/80 shadow-soft bg-white cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-burnt-orange/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnt-orange focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={imgUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 size-9 rounded-full bg-white/90 flex items-center justify-center text-burnt-orange shadow-sm">
                  <IconComponent className="size-4" />
                </div>
              </div>
              <div className="p-4">
                <div className="font-bold text-sm text-espresso group-hover:text-burnt-orange transition-colors">
                  {item.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground font-medium leading-relaxed">
                  {item.short_description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Premium Detail Modal (Desktop: centered modal, Mobile: bottom sheet style) */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white sm:rounded-3xl max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-h-[85vh] max-sm:rounded-t-3xl max-sm:border-t [&>button.absolute]:hidden shadow-2xl">
          {selected && (
            <div className="flex flex-col max-h-[85vh] sm:max-h-[80vh]">
              {/* Header Image Area */}
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-cream shrink-0">
                <img loading="lazy"
                  src={resolveImage(selected.image_key, selected.image_url)}
                  alt={selected.detail_title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 z-10 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-white/95 flex items-center justify-center text-burnt-orange shadow-md">
                    {(() => {
                      const IconComponent = ICON_MAP[selected.icon_name] || Store;
                      return <IconComponent className="size-5" />;
                    })()}
                  </div>
                  <div className="text-white">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-cream/80">
                      Supply Service Details
                    </div>
                    <div className="font-serif text-lg md:text-xl font-bold leading-tight drop-shadow-sm">
                      {selected.detail_title}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3.5 right-3.5 size-8 md:size-9 rounded-full bg-white/90 border border-border/80 shadow-sm flex items-center justify-center text-espresso hover:bg-burnt-orange hover:text-white transition-colors cursor-pointer z-20"
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                <DialogTitle className="font-serif text-2xl md:text-3xl font-bold text-espresso">
                  {selected.detail_title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs md:text-sm font-semibold text-burnt-orange">
                  {selected.subtitle}
                </DialogDescription>

                <p className="mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {selected.full_description}
                </p>

                {/* Key Points / Features */}
                {selected.key_points && selected.key_points.length > 0 && (
                  <div className="mt-5">
                    <div className="text-xs font-bold uppercase tracking-widest text-espresso/70">
                      What We Offer
                    </div>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-2.5">
                      {selected.key_points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="size-4 text-burnt-orange shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm font-medium text-espresso/90">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Footer */}
                <div className="mt-7 pt-5 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-4 text-burnt-orange shrink-0" />
                    <span>Pan-India B2B Supply • Confidential Enquiry</span>
                  </div>

                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(selected.cta_message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 bg-burnt-orange hover:bg-terracotta text-white rounded-xl px-6 py-3.5 text-xs md:text-sm font-bold tracking-widest transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                  >
                    <MessageCircle className="size-4 md:size-5 fill-current" />
                    {selected.cta_text}
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
