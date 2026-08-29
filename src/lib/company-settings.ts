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
};

export const companySettingsQueryOptions = {
  queryKey: ["company-settings"],
  queryFn: async (): Promise<CompanySettings | null> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "company")
      .maybeSingle();

    if (error || !data?.value) return null;
    return data.value as CompanySettings;
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
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
