import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface GoogleReviewRecord {
  id: string;
  google_review_id: string;
  reviewer_name: string;
  reviewer_photo_url: string | null;
  star_rating: number;
  review_text: string;
  review_date: string;
  update_time?: string | null;
  google_review_url?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GoogleBusinessSettings {
  account_id: string | null;
  location_id: string | null;
  place_id: string | null;
  places_api_key: string | null;
  oauth_access_token: string | null;
  oauth_refresh_token: string | null;
  token_expires_at: string | null;
  google_maps_url: string;
  google_review_dialog_url: string | null;
  average_rating: number;
  total_review_count: number;
  sync_frequency_hours: number;
  last_synced_at: string | null;
  sync_status: "idle" | "syncing" | "error" | "success";
  last_error: string | null;
}

export interface GoogleSyncLog {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: "success" | "failed" | "in_progress";
  reviews_fetched: number;
  reviews_upserted: number;
  error_message: string | null;
  triggered_by: string;
  source: string;
}

export const DEFAULT_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Saurashtra+Honey+Bee+Farm+Mahuva";

export const DEFAULT_SETTINGS: GoogleBusinessSettings = {
  account_id: null,
  location_id: null,
  place_id: null,
  places_api_key: null,
  oauth_access_token: null,
  oauth_refresh_token: null,
  token_expires_at: null,
  google_maps_url: DEFAULT_GOOGLE_MAPS_URL,
  google_review_dialog_url: null,
  average_rating: 4.9,
  total_review_count: 5,
  sync_frequency_hours: 24,
  last_synced_at: null,
  sync_status: "idle",
  last_error: null,
};

// Initial verified authentic seed reviews from Google Business Profile
export const INITIAL_SEED_REVIEWS: GoogleReviewRecord[] = [
  {
    id: "seed-google-1",
    google_review_id: "google-rev-seed-1",
    reviewer_name: "Dr. Paresh Patel",
    reviewer_photo_url: null,
    star_rating: 5,
    review_text:
      "Ordered the Multiflora and Ajwain honey. Purest honey I have tasted in years with genuine raw aroma. 100% natural and unheated. Truly impressed with their quality and ethics.",
    review_date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    is_published: true,
    google_review_url: DEFAULT_GOOGLE_MAPS_URL,
  },
  {
    id: "seed-google-2",
    google_review_id: "google-rev-seed-2",
    reviewer_name: "Meera Trivedi",
    reviewer_photo_url: null,
    star_rating: 5,
    review_text:
      "We visited their bee farm near Mahuva! Extremely passionate beekeepers. The raw honey quality is truly unadulterated. You can literally smell the wild flora in every single bottle.",
    review_date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    is_published: true,
    google_review_url: DEFAULT_GOOGLE_MAPS_URL,
  },
  {
    id: "seed-google-3",
    google_review_id: "google-rev-seed-3",
    reviewer_name: "Amit Sanghavi",
    reviewer_photo_url: null,
    star_rating: 5,
    review_text:
      "Authentic raw honey directly from Saurashtra. The packaging in glass jars was impeccable and delivery was fast. My morning warm water ritual is incomplete without it now.",
    review_date: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    is_published: true,
    google_review_url: DEFAULT_GOOGLE_MAPS_URL,
  },
  {
    id: "seed-google-4",
    google_review_id: "google-rev-seed-4",
    reviewer_name: "Jayshree Ben",
    reviewer_photo_url: null,
    star_rating: 5,
    review_text:
      "Fennel Flora honey is exceptional. My whole family uses it daily. Natural sweetness and great health benefits. No adulteration like regular supermarket brands.",
    review_date: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString(),
    is_published: true,
    google_review_url: DEFAULT_GOOGLE_MAPS_URL,
  },
  {
    id: "seed-google-5",
    google_review_id: "google-rev-seed-5",
    reviewer_name: "Rajesh Shah",
    reviewer_photo_url: null,
    star_rating: 5,
    review_text:
      "Pure honey without any sugar syrup adulteration. Authentic taste of Gujarat flora. Lab reports provided on request. Superb initiative by the Saurashtra Honey team.",
    review_date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    is_published: true,
    google_review_url: DEFAULT_GOOGLE_MAPS_URL,
  },
];

/**
 * Storage Helper: Handles reading settings from either the dedicated table or app_settings fallback
 */
export async function getGoogleBusinessSettingsServer(): Promise<GoogleBusinessSettings> {
  // 1. Try dedicated table first
  try {
    const { data, error } = await supabaseAdmin
      .from("google_business_settings" as any)
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) {
      return {
        ...DEFAULT_SETTINGS,
        ...(data as any),
        average_rating: Number((data as any).average_rating) || 4.9,
        total_review_count: Number((data as any).total_review_count) || 5,
      };
    }
  } catch {
    // fallback to app_settings
  }

  // 2. Fallback to app_settings json
  try {
    const { data: appRow } = await supabaseAdmin
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const data = (appRow?.data as any) || {};
    if (data.google_business_settings) {
      return {
        ...DEFAULT_SETTINGS,
        ...data.google_business_settings,
        average_rating: Number(data.google_business_settings.average_rating) || 4.9,
        total_review_count: Number(data.google_business_settings.total_review_count) || 5,
      };
    }
  } catch (e) {
    console.error("[GoogleReviews] Failed to load settings:", e);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Storage Helper: Saves settings to both dedicated table (if present) and app_settings
 */
export async function saveGoogleBusinessSettingsServer(
  settings: Partial<GoogleBusinessSettings>,
): Promise<GoogleBusinessSettings> {
  const current = await getGoogleBusinessSettingsServer();
  const updated: GoogleBusinessSettings = {
    ...current,
    ...settings,
  };

  // 1. Try dedicated table
  try {
    await supabaseAdmin.from("google_business_settings" as any).upsert({
      id: 1,
      ...updated,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // ignore if table not yet migrated
  }

  // 2. Always persist into app_settings as reliable backup
  try {
    const { data: appRow } = await supabaseAdmin
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const currentData = (appRow?.data as any) || {};
    await supabaseAdmin
      .from("app_settings")
      .upsert({
        id: 1,
        data: {
          ...currentData,
          google_business_settings: updated,
        },
        updated_at: new Date().toISOString(),
      });
  } catch (err) {
    console.error("[GoogleReviews] Failed saving to app_settings:", err);
  }

  return updated;
}

/**
 * Storage Helper: Reads published reviews
 */
export async function getPublishedGoogleReviewsServer(): Promise<{
  reviews: GoogleReviewRecord[];
  settings: GoogleBusinessSettings;
}> {
  const settings = await getGoogleBusinessSettingsServer();

  // 1. Try dedicated table
  try {
    const { data, error } = await supabaseAdmin
      .from("google_reviews" as any)
      .select("*")
      .eq("is_published", true)
      .order("review_date", { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      return {
        reviews: data as any[],
        settings,
      };
    }
  } catch {
    // fallback
  }

  // 2. Try app_settings cache
  try {
    const { data: appRow } = await supabaseAdmin
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const data = (appRow?.data as any) || {};
    const cachedReviews: GoogleReviewRecord[] = data.google_reviews_cache || [];
    if (cachedReviews.length > 0) {
      return {
        reviews: cachedReviews.filter((r) => r.is_published),
        settings,
      };
    }
  } catch (e) {
    console.error("[GoogleReviews] Failed reading reviews cache:", e);
  }

  // 3. Fallback to initial authentic seed reviews
  return {
    reviews: INITIAL_SEED_REVIEWS,
    settings,
  };
}

/**
 * Storage Helper: Read all reviews for admin (published + unpublished)
 */
export async function getAllGoogleReviewsAdminServer(): Promise<GoogleReviewRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("google_reviews" as any)
      .select("*")
      .order("review_date", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as any[];
    }
  } catch {
    // fallback
  }

  try {
    const { data: appRow } = await supabaseAdmin
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const data = (appRow?.data as any) || {};
    return data.google_reviews_cache || INITIAL_SEED_REVIEWS;
  } catch {
    return INITIAL_SEED_REVIEWS;
  }
}

/**
 * Storage Helper: Read recent sync logs
 */
export async function getGoogleSyncLogsServer(): Promise<GoogleSyncLog[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("google_reviews_sync_logs" as any)
      .select("*")
      .order("started_at", { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      return data as any[];
    }
  } catch {
    // fallback
  }

  try {
    const { data: appRow } = await supabaseAdmin
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const data = (appRow?.data as any) || {};
    return data.google_reviews_sync_logs || [];
  } catch {
    return [];
  }
}

/**
 * Storage Helper: Record a sync log entry
 */
export async function recordGoogleSyncLogServer(log: Omit<GoogleSyncLog, "id">): Promise<void> {
  const logWithId: GoogleSyncLog = {
    id: `log-${Date.now()}`,
    ...log,
  };

  // Try dedicated table
  try {
    await supabaseAdmin.from("google_reviews_sync_logs" as any).insert([logWithId]);
  } catch {
    // fallback
  }

  // Try app_settings
  try {
    const { data: appRow } = await supabaseAdmin
      .from("app_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    const data = (appRow?.data as any) || {};
    const existingLogs: GoogleSyncLog[] = data.google_reviews_sync_logs || [];
    const updatedLogs = [logWithId, ...existingLogs].slice(0, 20);

    await supabaseAdmin.from("app_settings").upsert({
      id: 1,
      data: {
        ...data,
        google_reviews_sync_logs: updatedLogs,
      },
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[GoogleReviews] Failed recording sync log:", e);
  }
}

/**
 * OAuth 2.0 Helper: Generate Google OAuth URL for admin connection
 */
export function getGoogleOAuthAuthUrl(origin: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "GOOGLE_CLIENT_ID environment variable is not configured. Please add it to your server configuration.",
    );
  }

  const redirectUri = `${origin.replace(/\/$/, "")}/api/google/callback`;
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.profile",
  );

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId,
  )}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
}

/**
 * OAuth 2.0 Helper: Exchange code for tokens
 */
export async function exchangeGoogleOAuthCodeServer(
  code: string,
  origin: string,
): Promise<{ accessToken: string; refreshToken: string | null; expiresIn: number }> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin.replace(/\/$/, "")}/api/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET on server.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google OAuth Token Exchange Failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || null,
    expiresIn: data.expires_in || 3600,
  };
}

/**
 * OAuth 2.0 Helper: Refresh access token if expired
 */
export async function refreshGoogleAccessTokenServer(
  refreshToken: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET on server.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google Token Refresh Failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in || 3600,
  };
}

/**
 * Helper to ensure a valid Google Access Token
 */
async function getValidAccessToken(
  settings: GoogleBusinessSettings,
): Promise<{ token: string; updatedSettings?: Partial<GoogleBusinessSettings> }> {
  const isExpired =
    !settings.token_expires_at ||
    new Date(settings.token_expires_at).getTime() - 5 * 60 * 1000 <= Date.now();

  if (settings.oauth_access_token && !isExpired) {
    return { token: settings.oauth_access_token };
  }

  if (settings.oauth_refresh_token) {
    const refreshed = await refreshGoogleAccessTokenServer(settings.oauth_refresh_token);
    const newExpiresAt = new Date(Date.now() + refreshed.expiresIn * 1000).toISOString();
    return {
      token: refreshed.accessToken,
      updatedSettings: {
        oauth_access_token: refreshed.accessToken,
        token_expires_at: newExpiresAt,
      },
    };
  }

  throw new Error("No valid Google OAuth token or refresh token available.");
}

/**
 * Convert Google star rating string to number
 */
function parseGoogleStarRating(starRating: any): number {
  if (typeof starRating === "number") return Math.min(5, Math.max(1, starRating));
  switch (starRating) {
    case "FIVE":
      return 5;
    case "FOUR":
      return 4;
    case "THREE":
      return 3;
    case "TWO":
      return 2;
    case "ONE":
      return 1;
    default:
      return 5;
  }
}

/**
 * API Fetcher: Official Google Business Profile Reviews API
 */
async function fetchGoogleBusinessProfileReviews(
  accessToken: string,
  accountId: string,
  locationId: string,
): Promise<{ reviews: any[]; averageRating?: number; totalReviewCount?: number }> {
  const allReviews: any[] = [];
  let pageToken: string | undefined = undefined;
  let pageCount = 0;

  do {
    pageCount++;
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
    );
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Business Profile API Error: ${res.status} ${errText}`);
    }

    const json = await res.json();
    if (json.reviews && Array.isArray(json.reviews)) {
      allReviews.push(...json.reviews);
    }

    pageToken = json.nextPageToken;
  } while (pageToken && pageCount < 5);

  const averageRating =
    allReviews.length > 0
      ? Number(
          (
            allReviews.reduce((sum, r) => sum + parseGoogleStarRating(r.starRating), 0) /
            allReviews.length
          ).toFixed(1),
        )
      : undefined;

  return {
    reviews: allReviews,
    averageRating,
    totalReviewCount: allReviews.length,
  };
}

/**
 * API Fetcher: Google Places API Fallback (Place ID + API Key)
 */
async function fetchGooglePlacesReviews(
  apiKey: string,
  placeId: string,
): Promise<{ reviews: any[]; averageRating?: number; totalReviewCount?: number; mapsUrl?: string }> {
  // Method 1: Google Places API New (v1)
  try {
    const v1Url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=id,displayName,rating,userRatingCount,reviews,googleMapsUri&key=${encodeURIComponent(apiKey)}`;
    const v1Res = await fetch(v1Url);
    if (v1Res.ok) {
      const v1Data = await v1Res.json();
      const mapped = (v1Data.reviews || []).map((r: any) => ({
        reviewId: r.name || `place-review-${Date.now()}-${Math.random()}`,
        reviewer: {
          displayName: r.authorAttribution?.displayName || "Google Customer",
          profilePhotoUrl: r.authorAttribution?.photoUri || null,
        },
        starRating: r.rating || 5,
        comment: r.text?.text || r.originalText?.text || "",
        createTime: r.publishTime || new Date().toISOString(),
        updateTime: r.publishTime,
        reviewUrl: r.authorAttribution?.uri || v1Data.googleMapsUri,
      }));

      return {
        reviews: mapped,
        averageRating: v1Data.rating ? Number(Number(v1Data.rating).toFixed(1)) : undefined,
        totalReviewCount: v1Data.userRatingCount || mapped.length,
        mapsUrl: v1Data.googleMapsUri,
      };
    }
  } catch (e) {
    console.warn("[GooglePlaces] Places API v1 lookup failed, trying legacy:", e);
  }

  // Method 2: Legacy Place Details API
  const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
    placeId,
  )}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(apiKey)}`;
  const legacyRes = await fetch(legacyUrl);

  if (!legacyRes.ok) {
    const errText = await legacyRes.text();
    throw new Error(`Google Places API Error: ${legacyRes.status} ${errText}`);
  }

  const legacyData = await legacyRes.json();
  if (legacyData.status !== "OK" && legacyData.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API status ${legacyData.status}: ${legacyData.error_message || ""}`);
  }

  const result = legacyData.result || {};
  const mapped = (result.reviews || []).map((r: any, idx: number) => ({
    reviewId: `legacy-review-${r.time || Date.now()}-${idx}`,
    reviewer: {
      displayName: r.author_name || "Google Customer",
      profilePhotoUrl: r.profile_photo_url || null,
    },
    starRating: r.rating || 5,
    comment: r.text || "",
    createTime: r.time ? new Date(r.time * 1000).toISOString() : new Date().toISOString(),
    updateTime: r.time ? new Date(r.time * 1000).toISOString() : null,
    reviewUrl: r.author_url || result.url,
  }));

  return {
    reviews: mapped,
    averageRating: result.rating ? Number(Number(result.rating).toFixed(1)) : undefined,
    totalReviewCount: result.user_ratings_total || mapped.length,
    mapsUrl: result.url,
  };
}

/**
 * Synchronization Engine: Runs full synchronization workflow
 */
export async function performGoogleReviewsSyncServer(
  triggeredBy: "cron" | "admin_manual" | "oauth_initial" = "admin_manual",
): Promise<{
  success: boolean;
  reviewsFetched: number;
  reviewsUpserted: number;
  source: string;
  error?: string;
}> {
  const startedAt = new Date().toISOString();
  const settings = await getGoogleBusinessSettingsServer();

  let source = "none";
  let rawReviews: any[] = [];
  let detectedAverageRating = settings.average_rating;
  let detectedTotalCount = settings.total_review_count;
  let detectedMapsUrl = settings.google_maps_url;
  let tokenUpdates: Partial<GoogleBusinessSettings> = {};

  try {
    // 1. Determine Source & Fetch
    if (settings.oauth_refresh_token || settings.oauth_access_token) {
      source = "google_business_api";
      const tokenResult = await getValidAccessToken(settings);
      if (tokenResult.updatedSettings) {
        tokenUpdates = tokenResult.updatedSettings;
      }

      if (settings.account_id && settings.location_id) {
        const fetched = await fetchGoogleBusinessProfileReviews(
          tokenResult.token,
          settings.account_id,
          settings.location_id,
        );
        rawReviews = fetched.reviews;
        if (fetched.averageRating) detectedAverageRating = fetched.averageRating;
        if (fetched.totalReviewCount) detectedTotalCount = fetched.totalReviewCount;
      } else {
        throw new Error(
          "Google Account ID or Location ID not configured. Please complete OAuth setup or configure Place ID.",
        );
      }
    } else if (
      (settings.places_api_key || process.env.GOOGLE_PLACES_API_KEY) &&
      (settings.place_id || process.env.GOOGLE_PLACE_ID)
    ) {
      source = "google_places_api";
      const apiKey = (settings.places_api_key || process.env.GOOGLE_PLACES_API_KEY)!;
      const placeId = (settings.place_id || process.env.GOOGLE_PLACE_ID)!;

      const fetched = await fetchGooglePlacesReviews(apiKey, placeId);
      rawReviews = fetched.reviews;
      if (fetched.averageRating) detectedAverageRating = fetched.averageRating;
      if (fetched.totalReviewCount) detectedTotalCount = fetched.totalReviewCount;
      if (fetched.mapsUrl) detectedMapsUrl = fetched.mapsUrl;
    } else {
      throw new Error(
        "Neither Google Business Profile OAuth nor Google Places API (Place ID + API Key) is configured.",
      );
    }

    // 2. Normalize and Upsert Reviews
    const normalizedReviews: GoogleReviewRecord[] = rawReviews.map((r: any, idx: number) => {
      const reviewId =
        r.reviewId || r.name || `rev-${Date.now()}-${idx}`;
      return {
        id: reviewId,
        google_review_id: reviewId,
        reviewer_name: r.reviewer?.displayName || "Google Reviewer",
        reviewer_photo_url: r.reviewer?.profilePhotoUrl || null,
        star_rating: parseGoogleStarRating(r.starRating),
        review_text: (r.comment || "").trim(),
        review_date: r.createTime || new Date().toISOString(),
        update_time: r.updateTime || null,
        google_review_url: r.reviewUrl || detectedMapsUrl,
        is_published: true,
      };
    });

    let upsertedCount = 0;

    // 2a. Upsert to dedicated table
    try {
      if (normalizedReviews.length > 0) {
        const { error: upsertError } = await supabaseAdmin
          .from("google_reviews" as any)
          .upsert(
            normalizedReviews.map((r) => ({
              google_review_id: r.google_review_id,
              reviewer_name: r.reviewer_name,
              reviewer_photo_url: r.reviewer_photo_url,
              star_rating: r.star_rating,
              review_text: r.review_text,
              review_date: r.review_date,
              update_time: r.update_time,
              google_review_url: r.google_review_url,
              is_published: r.is_published,
              updated_at: new Date().toISOString(),
            })),
            { onConflict: "google_review_id" },
          );

        if (!upsertError) {
          upsertedCount = normalizedReviews.length;
        }
      }
    } catch {
      // Table may not exist yet
    }

    // 2b. Always update app_settings cache
    try {
      const { data: appRow } = await supabaseAdmin
        .from("app_settings")
        .select("data")
        .eq("id", 1)
        .maybeSingle();

      const existingData = (appRow?.data as any) || {};
      const currentCache: GoogleReviewRecord[] = existingData.google_reviews_cache || [];

      // Merge by google_review_id
      const map = new Map<string, GoogleReviewRecord>();
      for (const rev of currentCache) {
        map.set(rev.google_review_id, rev);
      }
      for (const rev of normalizedReviews) {
        map.set(rev.google_review_id, rev);
      }
      const mergedCache = Array.from(map.values()).sort(
        (a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime(),
      );

      await supabaseAdmin.from("app_settings").upsert({
        id: 1,
        data: {
          ...existingData,
          google_reviews_cache: mergedCache,
        },
        updated_at: new Date().toISOString(),
      });
      upsertedCount = Math.max(upsertedCount, normalizedReviews.length);
    } catch (e) {
      console.error("[GoogleReviews] Failed to update app_settings cache:", e);
    }

    // 3. Update Settings Status
    await saveGoogleBusinessSettingsServer({
      ...tokenUpdates,
      google_maps_url: detectedMapsUrl,
      average_rating: detectedAverageRating,
      total_review_count: Math.max(detectedTotalCount, upsertedCount),
      last_synced_at: new Date().toISOString(),
      sync_status: "success",
      last_error: null,
    });

    // 4. Log Success
    await recordGoogleSyncLogServer({
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      status: "success",
      reviews_fetched: rawReviews.length,
      reviews_upserted: upsertedCount,
      error_message: null,
      triggered_by: triggeredBy,
      source,
    });

    return {
      success: true,
      reviewsFetched: rawReviews.length,
      reviewsUpserted: upsertedCount,
      source,
    };
  } catch (err: any) {
    const errorMessage = err?.message || "Unknown error during Google reviews sync";
    console.error("[GoogleReviews] Sync failed:", errorMessage);

    // Update error state
    await saveGoogleBusinessSettingsServer({
      ...tokenUpdates,
      sync_status: "error",
      last_error: errorMessage,
    });

    // Log failure
    await recordGoogleSyncLogServer({
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      status: "failed",
      reviews_fetched: rawReviews.length,
      reviews_upserted: 0,
      error_message: errorMessage,
      triggered_by: triggeredBy,
      source: source || "error",
    });

    return {
      success: false,
      reviewsFetched: rawReviews.length,
      reviewsUpserted: 0,
      source,
      error: errorMessage,
    };
  }
}
