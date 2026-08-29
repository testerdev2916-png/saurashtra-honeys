import { Link } from "@tanstack/react-router";
import { useCompare } from "@/lib/compare";
import { GitCompare, X } from "lucide-react";

export function CompareBar() {
  const { slugs, remove, clear, count } = useCompare();
  if (count === 0) return null;
  return (
    <div className="fixed bottom-16 md:bottom-4 inset-x-2 md:inset-x-auto md:right-4 z-40 max-w-xl md:w-auto md:min-w-[440px] bg-forest-dark text-cream rounded-2xl shadow-lift px-4 py-3 flex items-center gap-3">
      <GitCompare className="size-5 text-gold shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] tracking-widest font-bold text-gold">COMPARE ({count}/4)</div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {slugs.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 text-[11px] bg-cream/10 rounded px-2 py-0.5">
              {s}
              <button aria-label={`Remove ${s}`} onClick={() => remove(s)} className="hover:text-gold"><X className="size-3" /></button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <Link to="/compare" className="bg-gold-deep text-cream rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:bg-gold hover:text-forest-dark">COMPARE</Link>
        <button onClick={clear} className="text-[10px] text-cream/60 hover:text-cream">Clear all</button>
      </div>
    </div>
  );
}
