import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background w-full max-w-full overflow-x-clip">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0 w-full max-w-full min-w-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[17px] sm:text-[19px] md:text-[20px] lg:text-[24px] font-semibold tracking-[0.14em] uppercase text-burnt-orange leading-snug">
      {children}
    </div>
  );
}
