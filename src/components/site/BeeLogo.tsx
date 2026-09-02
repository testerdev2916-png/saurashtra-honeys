import React, { useState } from "react";
import { useSiteSettings } from "@/lib/site-settings";

function FallbackBeeIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="24" r="22" fill="#FDF8F0" stroke="#C88A2B" strokeWidth="2" />
      <path d="M24 10C24 10 16 16 16 24C16 32 24 38 24 38C24 38 32 32 32 24C32 16 24 10 24 10Z" fill="#C88A2B" fillOpacity="0.15" stroke="#C88A2B" strokeWidth="2" />
      <circle cx="24" cy="18" r="4" fill="#C88A2B" />
      <path d="M18 24H30M19 28H29M21 32H27" stroke="#49301F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BeeLogo({ className = "max-h-[52px] w-auto object-contain shrink-0" }: { className?: string }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const settings = useSiteSettings();
  const logoUrl = settings.company?.logo_url;
  const sources = logoUrl ? [logoUrl, "/saurashtra-honey-logo-complete.png"] : ["/saurashtra-honey-logo-complete.png"];

  if (srcIndex >= sources.length) {
    return <FallbackBeeIcon className={className} />;
  }

  return (
    <img
      src={sources[srcIndex]}
      alt="Saurashtra Honey Bee Farm"
      className={className}
      style={{
        filter: "none",
        opacity: 1,
        mixBlendMode: "normal",
        WebkitMask: "none",
        mask: "none",
        backgroundColor: "transparent",
      }}
      loading="eager"
      decoding="async"
      onError={() => setSrcIndex((idx) => idx + 1)}
    />
  );
}

export function BrandMark() {
  const [srcIndex, setSrcIndex] = useState(0);
  const settings = useSiteSettings();
  const logoUrl = settings.company?.logo_url;
  const sources = logoUrl ? [logoUrl, "/saurashtra-honey-logo-complete.png"] : ["/saurashtra-honey-logo-complete.png"];

  if (srcIndex >= sources.length) {
    return <FallbackBeeIcon className="w-[100px] lg:w-[130px] h-auto object-contain" />;
  }

  return (
    <img
      src={sources[srcIndex]}
      alt="Saurashtra Honey Logo"
      className="w-[100px] lg:w-[130px] h-auto object-contain"
      style={{
        backgroundColor: "transparent",
      }}
      loading="eager"
      decoding="async"
      onError={() => setSrcIndex((idx) => idx + 1)}
    />
  );
}
