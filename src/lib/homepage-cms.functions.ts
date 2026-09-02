import { supabase } from "@/integrations/supabase/client";

export type HomepageSection = {
  id: string;
  section_key: string;
  enabled: boolean;
  sort_order: number;
  settings: Record<string, any>;
};

export type HomepageCustomerStory = {
  id: string;
  type: "video" | "photo" | "review";
  customer_name: string;
  customer_city?: string | null;
  customer_state?: string | null;
  customer_photo?: string | null;
  media_url?: string | null;
  poster_image?: string | null;
  review_text?: string | null;
  rating: number;
  product_id?: string | null;
  product_name?: string | null;
  product_slug?: string | null;
  verified: boolean;
  published: boolean;
  sort_order: number;
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
  if (error) {
    console.error("[DEBUG] Supabase fetchAllAnnouncements Error:", error);
    throw error;
  }
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

// Homepage Customer Stories CRUD
export async function createHomepageCustomerStory(data: Omit<HomepageCustomerStory, "id">) {
  const { error } = await supabase.from("homepage_videos").insert([{
    title: data.customer_name,
    subtitle: [data.customer_city, data.customer_state].filter(Boolean).join(", "),
    badge: data.review_text,
    video_url: data.media_url,
    thumbnail_url: data.poster_image,
    product_slug: data.product_slug,
    link_url: String(data.rating || 5),
    status: data.published ? "published" : "draft",
    is_featured: data.verified,
    display_order: data.sort_order,
    placement: "testimonial"
  }]);
  if (error) throw error;
}

export async function updateHomepageCustomerStory(id: string, data: Partial<HomepageCustomerStory>) {
  const updates: any = {};
  if (data.customer_name !== undefined) updates.title = data.customer_name;
  if (data.customer_city !== undefined || data.customer_state !== undefined) {
    updates.subtitle = [data.customer_city, data.customer_state].filter(Boolean).join(", ");
  }
  if (data.review_text !== undefined) updates.badge = data.review_text;
  if (data.media_url !== undefined) updates.video_url = data.media_url;
  if (data.poster_image !== undefined) updates.thumbnail_url = data.poster_image;
  if (data.product_slug !== undefined) updates.product_slug = data.product_slug;
  if (data.rating !== undefined) updates.link_url = String(data.rating);
  if (data.published !== undefined) updates.status = data.published ? "published" : "draft";
  if (data.verified !== undefined) updates.is_featured = data.verified;
  if (data.sort_order !== undefined) updates.display_order = data.sort_order;

  const { error } = await supabase.from("homepage_videos").update(updates).eq("id", id).eq("placement", "testimonial");
  if (error) throw error;
}

export async function deleteHomepageCustomerStory(id: string) {
  const { error } = await supabase.from("homepage_videos").delete().eq("id", id).eq("placement", "testimonial");
  if (error) throw error;
}

export async function fetchAllHomepageCustomerStories(): Promise<HomepageCustomerStory[]> {
  const { data, error } = await supabase
    .from("homepage_videos")
    .select("*")
    .eq("placement", "testimonial")
    .order("display_order");
    
  if (error) throw error;
  
  if (!data || data.length === 0) {
    // Return initial DEMO content as requested
    return [
      {
        id: "demo-1",
        type: "photo",
        customer_name: "Zayn",
        customer_city: "Bhavnagar",
        customer_state: "Gujarat",
        review_text: "Bahut achha honey hai. Taste aur quality dono bahut genuine lage.",
        rating: 5,
        poster_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop", // placeholder photo
        verified: true,
        published: true,
        sort_order: 1
      },
      {
        id: "demo-2",
        type: "photo",
        customer_name: "Pooja Desai",
        customer_city: "Mumbai",
        customer_state: "Maharashtra",
        review_text: "I use this honey every morning in my tea. It's incredibly pure and has a very rich texture. Highly recommended!",
        rating: 5,
        poster_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop",
        verified: true,
        published: true,
        sort_order: 2
      },
      {
        id: "demo-3",
        type: "photo",
        customer_name: "Rahul Singh",
        customer_city: "Pune",
        customer_state: "Maharashtra",
        review_text: "I was skeptical about buying honey online, but Saurashtra Honey proved me wrong. Authentic and fresh.",
        rating: 5,
        poster_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop",
        verified: true,
        published: true,
        sort_order: 3
      }
    ];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    type: "photo",
    customer_name: row.title || "",
    customer_city: row.subtitle?.split(", ")[0] || "",
    customer_state: row.subtitle?.split(", ")[1] || "",
    review_text: row.badge || "",
    rating: parseInt(row.link_url || "5", 10) || 5,
    media_url: row.video_url,
    poster_image: row.thumbnail_url,
    product_slug: row.product_slug,
    verified: row.is_featured,
    published: row.status === "published",
    sort_order: row.display_order
  }));
}

export async function updateHomepageCustomerStoryOrder(updates: { id: string; sort_order: number }[]) {
  const promises = updates.map((u) =>
    supabase.from("homepage_videos").update({ display_order: u.sort_order }).eq("id", u.id).eq("placement", "testimonial")
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
