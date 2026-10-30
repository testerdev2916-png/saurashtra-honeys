import React, { useState, useEffect } from "react";
import { useSiteSettings } from "@/lib/site-settings";
import { useCompanySettings, DEFAULT_COMPANY_SETTINGS } from "@/lib/company-settings";

const DEFAULT_IMAGEKIT_LOGO =
  DEFAULT_COMPANY_SETTINGS.logo_url ||
  "https://ik.imagekit.io/spuuavgve/saurashtra-honey/logos/HONEY_BEE_FARM4_HO5d9ZgI3.png";
const LOCAL_FALLBACK_LOGO = "/saurashtra-honey-logo-complete.png";

function resolveLogoSources(customUrl?: string): string[] {
  const list: string[] = [];
  if (customUrl && typeof customUrl === "string" && customUrl.trim()) {
    const trimmed = customUrl.trim();
    if (!trimmed.includes("res.cloudinary.com/yzmffalu/")) {
      list.push(trimmed);
    }
  }
  list.push(DEFAULT_IMAGEKIT_LOGO);
  list.push(LOCAL_FALLBACK_LOGO);
  return Array.from(new Set(list));
}

function FallbackBeeIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="24" cy="24" r="22" fill="#FDF8F0" stroke="#C88A2B" strokeWidth="2" />
      <path
        d="M24 10C24 10 16 16 16 24C16 32 24 38 24 38C24 38 32 32 32 24C32 16 24 10 24 10Z"
        fill="#C88A2B"
        fillOpacity="0.15"
        stroke="#C88A2B"
        strokeWidth="2"
      />
      <circle cx="24" cy="18" r="4" fill="#C88A2B" />
      <path
        d="M18 24H30M19 28H29M21 32H27"
        stroke="#49301F"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BeeLogo({
  className = "max-h-[52px] w-auto object-contain shrink-0",
}: {
  className?: string;
}) {
  const company = useCompanySettings();
  const settings = useSiteSettings();
  const logoUrl = company?.logo_url || settings.company?.logo_url;
  const sources = resolveLogoSources(logoUrl);
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [sources[0]]);

  if (srcIndex >= sources.length) {
    return <FallbackBeeIcon className={className} />;
  }

  return (
    <img
      key={sources[srcIndex]}
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
  const company = useCompanySettings();
  const settings = useSiteSettings();
  const logoUrl = company?.logo_url || settings.company?.logo_url;
  const sources = resolveLogoSources(logoUrl);
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    setSrcIndex(0);
  }, [sources[0]]);

  if (srcIndex >= sources.length) {
    return <FallbackBeeIcon className="w-[100px] lg:w-[130px] h-auto object-contain" />;
  }

  return (
    <img
      key={sources[srcIndex]}
      src={sources[srcIndex]}
      alt="Saurashtra Honey Logo"
      className="w-auto max-w-[150px] lg:max-w-[260px] max-h-[68px] lg:max-h-[125px] object-contain"
      style={{
        backgroundColor: "transparent",
      }}
      loading="eager"
      decoding="async"
      onError={() => setSrcIndex((idx) => idx + 1)}
    />
  );
}
