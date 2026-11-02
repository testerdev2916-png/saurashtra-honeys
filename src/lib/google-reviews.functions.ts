import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  GoogleReviewRecord,
  GoogleBusinessSettings,
  GoogleSyncLog,
} from "./google-reviews.server";

/**
 * Public: Get verified Google reviews for Homepage display
 * High performance, reading from cached Supabase storage.
 */
export const getPublicGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    reviews: GoogleReviewRecord[];
    settings: {
      google_maps_url: string;
      google_review_dialog_url: string | null;
      average_rating: number;
      total_review_count: number;
      last_synced_at: string | null;
    };
  }> => {
    const { getPublishedGoogleReviewsServer } = await import("./google-reviews.server");
    const { reviews, settings } = await getPublishedGoogleReviewsServer();

    return {
      reviews,
      settings: {
        google_maps_url: settings.google_maps_url,
        google_review_dialog_url: settings.google_review_dialog_url,
        average_rating: settings.average_rating || 4.9,
        total_review_count: settings.total_review_count || reviews.length,
        last_synced_at: settings.last_synced_at,
      },
    };
  },
);

/**
 * Admin: Get Google Reviews management status, settings, logs, and reviews list
 */
export const getAdminGoogleReviewsStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({
      context,
    }): Promise<{
      settings: GoogleBusinessSettings;
      logs: GoogleSyncLog[];
      reviews: GoogleReviewRecord[];
    }> => {
      const { data: isStaff } = await context.supabase.rpc("is_staff", {
        _user_id: context.userId,
      });
      if (!isStaff) throw new Error("Forbidden: Staff access required");

      const {
        getGoogleBusinessSettingsServer,
        getGoogleSyncLogsServer,
        getAllGoogleReviewsAdminServer,
      } = await import("./google-reviews.server");

      const [settings, logs, reviews] = await Promise.all([
        getGoogleBusinessSettingsServer(),
        getGoogleSyncLogsServer(),
        getAllGoogleReviewsAdminServer(),
      ]);

      return {
        // Mask secret tokens for security
        settings: {
          ...settings,
          oauth_access_token: settings.oauth_access_token ? "••••••••••••••••" : null,
          oauth_refresh_token: settings.oauth_refresh_token ? "••••••••••••••••" : null,
          places_api_key: settings.places_api_key
            ? `${settings.places_api_key.substring(0, 6)}••••••••`
            : null,
        },
        logs,
        reviews,
      };
    },
  );

/**
 * Admin: Trigger manual synchronization from Google
 */
export const syncGoogleReviewsManual = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden: Staff access required");

    const { performGoogleReviewsSyncServer } = await import("./google-reviews.server");
    const result = await performGoogleReviewsSyncServer("admin_manual");

    return result;
  });

/**
 * Admin: Update Google Business Settings (Place ID, URLs, etc.)
 */
export const updateGoogleReviewsSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      place_id: z.string().optional().nullable(),
      places_api_key: z.string().optional().nullable(),
      google_maps_url: z.string().url().optional(),
      google_review_dialog_url: z.string().url().optional().nullable(),
      average_rating: z.number().min(1).max(5).optional(),
      total_review_count: z.number().min(0).optional(),
      sync_frequency_hours: z.number().min(1).max(168).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden: Staff access required");

    const { saveGoogleBusinessSettingsServer, getGoogleBusinessSettingsServer } = await import(
      "./google-reviews.server"
    );

    // Keep existing secret keys if input contains masked bullets
    const current = await getGoogleBusinessSettingsServer();
    const cleanApiKey =
      data.places_api_key && data.places_api_key.includes("••••")
        ? current.places_api_key
        : data.places_api_key;

    const updated = await saveGoogleBusinessSettingsServer({
      ...data,
      places_api_key: cleanApiKey !== undefined ? cleanApiKey : current.places_api_key,
    });

    return { ok: true, settings: updated };
  });

/**
 * Admin: Toggle visibility of a specific Google Review
 */
export const toggleGoogleReviewVisibility = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      google_review_id: z.string(),
      is_published: z.boolean(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden: Staff access required");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Try dedicated table
    try {
      await supabaseAdmin
        .from("google_reviews" as any)
        .update({ is_published: data.is_published, updated_at: new Date().toISOString() })
        .eq("google_review_id", data.google_review_id);
    } catch {
      // fallback
    }

    // 2. Also update app_settings cache
    try {
      const { data: appRow } = await supabaseAdmin
        .from("app_settings")
        .select("data")
        .eq("id", 1)
        .maybeSingle();

      const appData = (appRow?.data as any) || {};
      const cache: any[] = appData.google_reviews_cache || [];
      const updatedCache = cache.map((r) =>
        r.google_review_id === data.google_review_id
          ? { ...r, is_published: data.is_published }
          : r,
      );

      await supabaseAdmin.from("app_settings").upsert({
        id: 1,
        data: {
          ...appData,
          google_reviews_cache: updatedCache,
        },
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("[GoogleReviews] Failed to update visibility in app_settings:", e);
    }

    return { ok: true };
  });

/**
 * Admin: Generate Google OAuth 2.0 Authorization URL
 */
export const getGoogleOAuthStartUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      origin: z.string().url(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { data: isStaff } = await context.supabase.rpc("is_staff", {
      _user_id: context.userId,
    });
    if (!isStaff) throw new Error("Forbidden: Staff access required");

    const { getGoogleOAuthAuthUrl } = await import("./google-reviews.server");
    const url = getGoogleOAuthAuthUrl(data.origin);
    return { url };
  });
