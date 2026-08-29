import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramSettings {
  is_enabled: boolean;
  post_count: number;
  instagram_token: string | null;
  last_synced: string | null;
}

export interface InstagramCache {
  posts: InstagramPost[];
}

const defaultSettings: InstagramSettings = {
  is_enabled: false,
  post_count: 6,
  instagram_token: null,
  last_synced: null,
};

async function fetchFromInstagramAPI(token: string, limit: number): Promise<InstagramPost[]> {
  const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${token}&limit=${limit}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Instagram API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return (data.data || []).map((item: any) => ({
    id: item.id,
    media_type: item.media_type,
    media_url: item.media_url,
    thumbnail_url: item.thumbnail_url,
    permalink: item.permalink,
    caption: item.caption,
    timestamp: item.timestamp,
  }));
}

async function performSync(supabaseClient: any) {
  // Get settings
  const { data: settingsRow } = await supabaseClient
    .from("app_settings")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
    
  const data = (settingsRow?.data as any) || {};
  const settings: InstagramSettings = { ...defaultSettings, ...(data.instagram_settings || {}) };

  if (!settings.instagram_token) {
    throw new Error("Instagram is not connected.");
  }

  // Fetch from API
  const posts = await fetchFromInstagramAPI(settings.instagram_token, 20); // Fetch a few extra to have a buffer
  
  // Cache the posts
  const cache: InstagramCache = { posts };
  settings.last_synced = new Date().toISOString();

  // Update DB
  const newData = { ...data, instagram_settings: settings, instagram_cache: cache };
  const { error } = await supabaseClient
    .from("app_settings")
    .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() });
    
  if (error) throw error;
  
  return { ok: true, count: posts.length };
}

export const syncInstagramPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Must be admin to trigger manually
    const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!role) throw new Error("Forbidden");

    return await performSync(context.supabase);
  });

export const getInstagramSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!role) throw new Error("Forbidden");

    const { data: settingsRow } = await context.supabase
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const data = (settingsRow?.data as any) || {};
    return { ...(defaultSettings as any), ...(data.instagram_settings || {}) } as InstagramSettings;
  });

export const saveInstagramSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { is_enabled: boolean; post_count: number; instagram_token: string | null }) => input)
  .handler(async ({ data: input, context }) => {
    const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!role) throw new Error("Forbidden");

    const { data: settingsRow } = await context.supabase
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const existingData = (settingsRow?.data as any) || {};
    const currentSettings = existingData.instagram_settings || {};
    
    const newSettings = {
      ...currentSettings,
      is_enabled: input.is_enabled,
      post_count: input.post_count,
      instagram_token: input.instagram_token,
    };

    const newData = { ...existingData, instagram_settings: newSettings };
    
    // If token was wiped, also clear the cache
    if (!input.instagram_token) {
      newData.instagram_cache = { posts: [] };
      newSettings.last_synced = null;
    }

    const { error } = await context.supabase
      .from("app_settings")
      .upsert({ id: 1, data: newData, updated_by: context.userId, updated_at: new Date().toISOString() });
      
    if (error) throw error;
    
    // Log audit
    await context.supabase.rpc("log_audit", { _action: "instagram.settings_updated", _entity_type: "app_settings", _entity_id: "1", _metadata: {} });
    
    return { ok: true };
  });

export const getPublicInstagramFeed = createServerFn({ method: "GET" })
  .handler(async () => {
    // Uses the public anonymous client because this is hit by website visitors
    const { supabase } = await import("@/integrations/supabase/client");
    
    const { data: settingsRow } = await supabase
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
      
    if (!settingsRow || !settingsRow.data) {
      return { settings: defaultSettings, posts: [] };
    }

    const settings: InstagramSettings = { ...defaultSettings, ...((settingsRow.data as any).instagram_settings || {}) };
    const cache: InstagramCache = (settingsRow.data as any).instagram_cache || { posts: [] };

    // Lazy sync logic
    if (settings.is_enabled && settings.instagram_token) {
      const ONE_DAY = 24 * 60 * 60 * 1000;
      const lastSyncedTime = settings.last_synced ? new Date(settings.last_synced).getTime() : 0;
      const isStale = Date.now() - lastSyncedTime > ONE_DAY;

      if (isStale) {
        // Fire and forget - don't block the frontend response
        performSync(supabase).catch(err => {
          console.error("Background Instagram Sync Failed:", err);
        });
      }
    }

    // Limit returned posts based on settings
    const activePosts = cache.posts.slice(0, settings.post_count || 6);

    return { settings, posts: activePosts };
  });
