import { supabase } from "@/integrations/supabase/client";

export type HomepageSection = {
  id: string;
  section_key: string;
  enabled: boolean;
  sort_order: number;
  settings: Record<string, any>;
};

export type HomepageCategorySelection = {
  id: string;
  category_slug: string;
  enabled: boolean;
  sort_order: number;
};

export type HomepageFeaturedProduct = {
  id: string;
  product_slug: string;
  enabled: boolean;
  sort_order: number;
};

export type HomepageTrustItem = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  enabled: boolean;
  sort_order: number;
};

export type AnnouncementItem = {
  id: string;
  text: string;
  icon: string | null;
  link: string | null;
  open_in_new_tab: boolean;
  enabled: boolean;
  sort_order: number;
};

/**
 * Fetches the ordered list of all homepage sections
 */
export async function fetchHomepageSections(): Promise<HomepageSection[]> {
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching homepage sections:", error);
    return [];
  }
  return (data || []) as HomepageSection[];
}

/**
 * Fetches selected categories for the homepage
 */
export async function fetchHomepageCategories(): Promise<HomepageCategorySelection[]> {
  const { data, error } = await supabase
    .from("homepage_category_selection")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching homepage categories:", error);
    return [];
  }
  return data as HomepageCategorySelection[];
}

/**
 * Fetches featured products for the homepage
 */
export async function fetchHomepageFeaturedProducts(): Promise<HomepageFeaturedProduct[]> {
  const { data, error } = await supabase
    .from("homepage_featured_products")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching homepage featured products:", error);
    return [];
  }
  return data as HomepageFeaturedProduct[];
}

/**
 * Fetches trust items for the homepage
 */
export async function fetchHomepageTrustItems(): Promise<HomepageTrustItem[]> {
  const { data, error } = await supabase
    .from("homepage_trust_items")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching homepage trust items:", error);
    return [];
  }
  return data as HomepageTrustItem[];
}

/**
 * Fetches announcement items
 */
export async function fetchAnnouncements(): Promise<AnnouncementItem[]> {
  const { data, error } = await supabase
    .from("announcement_items")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
  return data as AnnouncementItem[];
}

/**
 * Fetches public site settings (e.g. footer copyright, social links, contact info)
 */
export async function fetchPublicSiteSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("is_public", true);

  if (error) {
    if (error.code !== '42501') {
      console.error("Error fetching site settings:", error);
    }
    return {};
  }
  
  const settings: Record<string, any> = {};
  for (const row of data || []) {
    settings[row.key] = row.value;
  }
  return settings;
}

// ------------------------------------------------------------------
// ADMIN UPDATE FUNCTIONS
// ------------------------------------------------------------------

export async function updateSectionOrder(updates: { id: string; sort_order: number }[]) {
  // Using Promise.all for simple sequential updates instead of RPC for simplicity
  const promises = updates.map((u) =>
    supabase.from("homepage_sections").update({ sort_order: u.sort_order }).eq("id", u.id)
  );
  await Promise.all(promises);
}

export async function toggleSectionVisibility(id: string, enabled: boolean) {
  const { error } = await supabase.from("homepage_sections").update({ enabled }).eq("id", id);
  if (error) throw error;
}

export async function updateSectionSettings(id: string, settings: Record<string, any>) {
  const { error } = await supabase.from("homepage_sections").update({ settings }).eq("id", id);
  if (error) throw error;
}

// Announcements CRUD
export async function createAnnouncement(data: Omit<AnnouncementItem, "id">) {
  const { error } = await supabase.from("announcement_items").insert([data]);
  if (error) throw error;
}

export async function updateAnnouncement(id: string, data: Partial<AnnouncementItem>) {
  const { error } = await supabase.from("announcement_items").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcement_items").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAllAnnouncements(): Promise<AnnouncementItem[]> {
  const { data, error } = await supabase.from("announcement_items").select("*").order("sort_order");
  if (error) throw error;
  return data as AnnouncementItem[];
}

export async function updateAnnouncementOrder(updates: { id: string; sort_order: number }[]) {
  const promises = updates.map((u) =>
    supabase.from("announcement_items").update({ sort_order: u.sort_order }).eq("id", u.id)
  );
  await Promise.all(promises);
}

// Homepage Categories CRUD
export async function createHomepageCategory(data: Omit<HomepageCategorySelection, "id">) {
  const { error } = await supabase.from("homepage_category_selection").insert([data]);
  if (error) throw error;
}

export async function deleteHomepageCategory(id: string) {
  const { error } = await supabase.from("homepage_category_selection").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAllHomepageCategories(): Promise<HomepageCategorySelection[]> {
  const { data, error } = await supabase.from("homepage_category_selection").select("*").order("sort_order");
  if (error) throw error;
  return data as HomepageCategorySelection[];
}

export async function updateHomepageCategoryOrder(updates: { id: string; sort_order: number }[]) {
  const promises = updates.map((u) =>
    supabase.from("homepage_category_selection").update({ sort_order: u.sort_order }).eq("id", u.id)
  );
  await Promise.all(promises);
}

// Homepage Featured Products CRUD
export async function createHomepageFeaturedProduct(data: Omit<HomepageFeaturedProduct, "id">) {
  const { error } = await supabase.from("homepage_featured_products").insert([data]);
  if (error) throw error;
}

export async function deleteHomepageFeaturedProduct(id: string) {
  const { error } = await supabase.from("homepage_featured_products").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAllHomepageFeaturedProducts(): Promise<HomepageFeaturedProduct[]> {
  const { data, error } = await supabase.from("homepage_featured_products").select("*").order("sort_order");
  if (error) throw error;
  return data as HomepageFeaturedProduct[];
}

export async function updateHomepageFeaturedProductOrder(updates: { id: string; sort_order: number }[]) {
  const promises = updates.map((u) =>
    supabase.from("homepage_featured_products").update({ sort_order: u.sort_order }).eq("id", u.id)
  );
  await Promise.all(promises);
}

// Homepage Trust Items CRUD
export async function createHomepageTrustItem(data: Omit<HomepageTrustItem, "id">) {
  const { error } = await supabase.from("homepage_trust_items").insert([data]);
  if (error) throw error;
}

export async function updateHomepageTrustItem(id: string, data: Partial<HomepageTrustItem>) {
  const { error } = await supabase.from("homepage_trust_items").update(data).eq("id", id);
  if (error) throw error;
}

export async function deleteHomepageTrustItem(id: string) {
  const { error } = await supabase.from("homepage_trust_items").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAllHomepageTrustItems(): Promise<HomepageTrustItem[]> {
  const { data, error } = await supabase.from("homepage_trust_items").select("*").order("sort_order");
  if (error) throw error;
  return data as HomepageTrustItem[];
}

export async function updateHomepageTrustItemOrder(updates: { id: string; sort_order: number }[]) {
  const promises = updates.map((u) =>
    supabase.from("homepage_trust_items").update({ sort_order: u.sort_order }).eq("id", u.id)
  );
  await Promise.all(promises);
}

// ------------------------------------------------------------------
// AUDIT LOGGING
// ------------------------------------------------------------------

export async function logAudit({
  data,
}: {
  data: {
    action: string;
    entity_type?: string;
    entity_id?: string;
    metadata?: Record<string, any>;
  };
}): Promise<void> {
  try {
    await supabase.rpc("log_audit", {
      _action: data.action,
      _entity_type: data.entity_type ?? null,
      _entity_id: data.entity_id ?? null,
      _metadata: data.metadata ?? {},
    } as any);
  } catch (err) {
    // Audit failures must never break admin actions
    console.warn("[logAudit] failed:", err);
  }
}
