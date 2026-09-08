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

export const companySettingsQueryOptions = {
  queryKey: ["company-settings"],
  queryFn: async (): Promise<CompanySettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value, updated_at")
      .eq("key", "company")
      .maybeSingle();

    if (error || !data?.value) return null;
    const val = data.value as CompanySettings;
    if (data.updated_at) {
      val.updated_at = data.updated_at;
    }
    return val;
  },
  // staleTime removed so that queries fetch fresh data instantly on navigation
};

/**
 * Returns the dynamic company settings once loaded (undefined until then).
 * Consumers should fall back to their own bundled defaults while this is
 * undefined/empty, so there is no layout shift while the fetch is in flight.
 */
export function useCompanySettings(): CompanySettings | undefined {
  const { data } = useQuery(companySettingsQueryOptions);
  return data ?? undefined;
}

/** Convenience hook for just the logo URL (empty/missing -> undefined). */
export function useCompanyLogoUrl(): string | undefined {
  const settings = useCompanySettings();
  const url = settings?.logo_url?.trim();
  return url ? url : undefined;
}

/** Central helper for getting the cache-busted favicon URL */
export function getFaviconUrl(settings?: CompanySettings | null): string {
  const rawUrl = settings?.favicon_url?.trim() || "/favicon-v2.ico";
  if (rawUrl === "/favicon-v2.ico") return rawUrl;
  
  const sep = rawUrl.includes("?") ? "&" : "?";
  const ts = settings?.updated_at ? new Date(settings.updated_at).getTime() : Date.now();
  return `${rawUrl}${sep}v=${ts}`;
}
