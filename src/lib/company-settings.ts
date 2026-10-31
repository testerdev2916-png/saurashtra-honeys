import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Public, unauthenticated reader for the `site_settings` row where key = "company".
 * This is the same row the Admin Settings "Company" panel writes to
 * (src/routes/admin.settings.tsx -> src/lib/admin-cms.functions.ts).
 *
 * The `site_settings` table grants SELECT to `anon` (see migration
 * 20260724042913_..._) so no authentication is required to read it.
 */
export type CompanySettings = {
  name?: string;
  tagline?: string;
  logo_url?: string;
  favicon_url?: string;
  updated_at?: string;
};

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: "Saurashtra Honey",
  tagline: "Pure • Traceable • Lab-tested",
  logo_url: "https://ik.imagekit.io/spuuavgve/saurashtra-honey/settings/HONEY_BEE_FARM4_YYsCk0gs-.png",
  favicon_url: "https://ik.imagekit.io/spuuavgve/saurashtra-honey/settings/fevicon_for_bees_-x3rE7x9g.png",
};

export const companySettingsQueryOptions = {
  queryKey: ["company-settings"],
  queryFn: async (): Promise<CompanySettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value, updated_at")
      .eq("key", "company")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT_COMPANY_SETTINGS;
    const val = { ...DEFAULT_COMPANY_SETTINGS, ...(data.value as CompanySettings) };
    if (data.updated_at) {
      val.updated_at = data.updated_at;
    }
    if (val.logo_url?.includes("res.cloudinary.com/yzmffalu/")) {
      val.logo_url = DEFAULT_COMPANY_SETTINGS.logo_url;
    }
    if (val.favicon_url?.includes("res.cloudinary.com/yzmffalu/")) {
      val.favicon_url = DEFAULT_COMPANY_SETTINGS.favicon_url;
    }
    return val;
  },
  staleTime: 1000 * 60 * 5,
  initialData: DEFAULT_COMPANY_SETTINGS,
};

/**
 * Returns the dynamic company settings once loaded (falls back to DEFAULT_COMPANY_SETTINGS).
 * There is no layout shift or missing branding while the fetch is in flight.
 */
export function useCompanySettings(): CompanySettings {
  const { data } = useQuery(companySettingsQueryOptions);
  return data ?? DEFAULT_COMPANY_SETTINGS;
}

/** Convenience hook for just the logo URL (falls back to default ImageKit logo). */
export function useCompanyLogoUrl(): string {
  const settings = useCompanySettings();
  const url = settings?.logo_url?.trim();
  return url || DEFAULT_COMPANY_SETTINGS.logo_url!;
}

/** Central helper for getting the cache-busted favicon URL */
export function getFaviconUrl(settings?: CompanySettings | null): string {
  let rawUrl =
    settings?.favicon_url?.trim() || DEFAULT_COMPANY_SETTINGS.favicon_url || "/favicon-v2.ico";
  if (rawUrl.includes("res.cloudinary.com/yzmffalu/")) {
    rawUrl = DEFAULT_COMPANY_SETTINGS.favicon_url || "/favicon-v2.ico";
  }
  if (rawUrl === "/favicon-v2.ico") return rawUrl;

  const sep = rawUrl.includes("?") ? "&" : "?";
  const ts = settings?.updated_at ? new Date(settings.updated_at).getTime() : 2;
  return `${rawUrl}${sep}v=${ts}`;
}
