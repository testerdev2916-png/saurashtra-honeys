import { supabase } from "@/integrations/supabase/client";

export interface PageSection {
  page_slug: string;
  section_key: string;
  settings: Record<string, any>;
  enabled: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchPageSections(page_slug: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page_slug", page_slug)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updatePageSectionSettings(page_slug: string, section_key: string, settings: Record<string, any>) {
  // Upsert the record
  const { error } = await supabase
    .from("page_content")
    .upsert(
      { page_slug, section_key, settings },
      { onConflict: 'page_slug,section_key' }
    );

  if (error) throw error;
}

export async function togglePageSectionVisibility(page_slug: string, section_key: string, enabled: boolean) {
  const { error } = await supabase
    .from("page_content")
    .upsert(
      { page_slug, section_key, enabled },
      { onConflict: 'page_slug,section_key' }
    );

  if (error) throw error;
}
