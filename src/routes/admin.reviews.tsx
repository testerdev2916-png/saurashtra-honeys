import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { listAdminReviews, moderateReview, deleteReview } from "@/lib/admin-catalog.functions";
import {
  getAdminGoogleReviewsStatus,
  syncGoogleReviewsManual,
  updateGoogleReviewsSettings,
  toggleGoogleReviewVisibility,
  getGoogleOAuthStartUrl,
  addGoogleReviewAdmin,
  deleteGoogleReviewAdmin,
} from "@/lib/google-reviews.functions";
import type {
  GoogleReviewRecord,
  GoogleBusinessSettings,
  GoogleSyncLog,
} from "@/lib/google-reviews.server";
import {
  BtnGhost,
  BtnPrimary,
  Card,
  Field,
  PageHeader,
  StatusPill,
  TableWrap,
  Td,
  Th,
  inp,
} from "@/components/admin/ui";
import {
  Check,
  RefreshCcw,
  Trash2,
  X,
  Star,
  ExternalLink,
  Globe,
  Settings,
  Activity,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  tab: z.enum(["products", "google"]).optional(),
  connected: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/admin/reviews")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ReviewsPage,
});

type ProductReview = {
  id: string;
  product_slug: string;
  author_name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  media_urls: string[] | null;
  status: string;
  created_at: string;
  featured_on_homepage?: boolean;
};

const PRODUCT_STATUSES = ["all", "pending", "approved", "rejected"] as const;

function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function ReviewsPage() {
  const search = Route.useSearch();
  const [activeTab, setActiveTab] = useState<"products" | "google">(
    search.tab === "google" ? "google" : "products",
  );

  // ─── Product Reviews State ──────────────────────────────────────────────────
  const listProductReviews = useServerFn(listAdminReviews);
  const moderate = useServerFn(moderateReview);
  const del = useServerFn(deleteReview);
  const [productRows, setProductRows] = useState<ProductReview[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productStatus, setProductStatus] = useState<(typeof PRODUCT_STATUSES)[number]>("pending");

  // ─── Google Reviews State ───────────────────────────────────────────────────
  const getGoogleStatus = useServerFn(getAdminGoogleReviewsStatus);
  const syncGoogleNow = useServerFn(syncGoogleReviewsManual);
  const saveGoogleSettings = useServerFn(updateGoogleReviewsSettings);
  const toggleVisibilityFn = useServerFn(toggleGoogleReviewVisibility);
  const getOAuthUrlFn = useServerFn(getGoogleOAuthStartUrl);
  const addReviewFn = useServerFn(addGoogleReviewAdmin);
  const deleteReviewFn = useServerFn(deleteGoogleReviewAdmin);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [syncingNow, setSyncingNow] = useState(false);
  const [googleSettings, setGoogleSettings] = useState<GoogleBusinessSettings | null>(null);
  const [googleLogs, setGoogleLogs] = useState<GoogleSyncLog[]>([]);
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewRecord[]>([]);

  // Add Review Modal state (100% Free manual review management)
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingNewReview, setSavingNewReview] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    reviewer_name: "",
    star_rating: 5,
    review_text: "",
    review_date: new Date().toISOString().split("T")[0],
    google_review_url: "",
  });

  // Settings form local edit state
  const [settingsForm, setSettingsForm] = useState({
    place_id: "",
    places_api_key: "",
    google_maps_url: "",
    google_review_dialog_url: "",
    average_rating: 4.9,
    total_review_count: 0,
    sync_frequency_hours: 24,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Check URL feedback params on initial load
  useEffect(() => {
    if (search.connected === "true") {
      toast.success("Google Business Profile successfully connected!");
    } else if (search.error) {
      toast.error(`Google connection error: ${decodeURIComponent(search.error)}`);
    }
  }, [search.connected, search.error]);

  // Load product reviews
  async function loadProductReviews() {
    setProductLoading(true);
    try {
      const r = await listProductReviews({ data: { status: productStatus } });
      setProductRows(r.rows as unknown as ProductReview[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProductLoading(false);
    }
  }

  // Load Google reviews and settings
  async function loadGoogleReviews() {
    setGoogleLoading(true);
    try {
      const res = await getGoogleStatus();
      setGoogleSettings(res.settings);
      setGoogleLogs(res.logs);
      setGoogleReviews(res.reviews);
      setSettingsForm({
        place_id: res.settings.place_id || "",
        places_api_key: res.settings.places_api_key || "",
        google_maps_url: res.settings.google_maps_url || "",
        google_review_dialog_url: res.settings.google_review_dialog_url || "",
        average_rating: res.settings.average_rating || 4.9,
        total_review_count: res.settings.total_review_count || 0,
        sync_frequency_hours: res.settings.sync_frequency_hours || 24,
      });
    } catch (e) {
      toast.error(`Failed to load Google Reviews: ${(e as Error).message}`);
    } finally {
      setGoogleLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "products") {
      void loadProductReviews();
    } else {
      void loadGoogleReviews();
    }
  }, [activeTab, productStatus]);

  // Product review actions
  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const { error } = await (supabase.from("reviews") as any)
        .update({ featured_on_homepage: !current })
        .eq("id", id);
      if (error) throw error;
      setProductRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, featured_on_homepage: !current } : r)),
      );
      toast.success(
        current ? "Removed from homepage testimonials" : "Featured on homepage testimonials",
      );
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  // Google review manual sync
  const handleManualSync = async () => {
    setSyncingNow(true);
    try {
      const res = await syncGoogleNow();
      if (res.success) {
        toast.success(
          `Sync completed! Fetched ${res.reviewsFetched} reviews, upserted ${res.reviewsUpserted} via ${res.source}.`,
        );
        await loadGoogleReviews();
      } else {
        toast.error(`Sync error: ${res.error || "Failed to sync"}`);
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSyncingNow(false);
    }
  };

  // Google OAuth connect
  const handleConnectGoogleOAuth = async () => {
    try {
      const origin = window.location.origin;
      const res = await getOAuthUrlFn({ data: { origin } });
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e) {
      toast.error(`OAuth Initiation failed: ${(e as Error).message}`);
    }
  };

  // Save Google settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await saveGoogleSettings({
        data: {
          place_id: settingsForm.place_id.trim() || null,
          places_api_key: settingsForm.places_api_key.trim() || null,
          google_maps_url: settingsForm.google_maps_url.trim() || undefined,
          google_review_dialog_url: settingsForm.google_review_dialog_url.trim() || null,
          average_rating: Number(settingsForm.average_rating) || 4.9,
          total_review_count: Number(settingsForm.total_review_count) || 0,
          sync_frequency_hours: Number(settingsForm.sync_frequency_hours) || 24,
        },
      });
      toast.success("Google Business settings saved successfully!");
      await loadGoogleReviews();
    } catch (err) {
      toast.error(`Failed to save settings: ${(err as Error).message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  // Toggle single review visibility
  const handleToggleGoogleVisibility = async (reviewId: string, current: boolean) => {
    try {
      await toggleVisibilityFn({
        data: {
          google_review_id: reviewId,
          is_published: !current,
        },
      });
      setGoogleReviews((prev) =>
        prev.map((r) =>
          r.google_review_id === reviewId ? { ...r, is_published: !current } : r,
        ),
      );
      toast.success(!current ? "Review published on website" : "Review hidden from website");
    } catch (e) {
      toast.error("Failed to update visibility");
    }
  };

  // Add Google Review manually (100% Free, Zero Google Cloud Billing required)
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.reviewer_name.trim() || !newReviewForm.review_text.trim()) {
      toast.error("Please enter reviewer name and review content.");
      return;
    }
    setSavingNewReview(true);
    try {
      const res = await addReviewFn({
        data: {
          reviewer_name: newReviewForm.reviewer_name.trim(),
          star_rating: Number(newReviewForm.star_rating) || 5,
          review_text: newReviewForm.review_text.trim(),
          review_date: new Date(newReviewForm.review_date).toISOString(),
          google_review_url: newReviewForm.google_review_url.trim() || null,
        },
      });
      if (res.ok) {
        toast.success("Google review added successfully!");
        setShowAddModal(false);
        setNewReviewForm({
          reviewer_name: "",
          star_rating: 5,
          review_text: "",
          review_date: new Date().toISOString().split("T")[0],
          google_review_url: "",
        });
        await loadGoogleReviews();
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSavingNewReview(false);
    }
  };

  // Delete single review
  const handleDeleteGoogleReview = async (reviewId: string) => {
    if (!confirm("Delete this review from your website?")) return;
    try {
      await deleteReviewFn({ data: { google_review_id: reviewId } });
      toast.success("Review deleted");
      await loadGoogleReviews();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews Management"
        subtitle="Manage product feedback & verified Google Business reviews"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "google" && (
              <>
                <BtnPrimary onClick={() => setShowAddModal(true)}>
                  <Plus className="size-3.5" /> ADD REVIEW
                </BtnPrimary>
                <BtnGhost onClick={handleManualSync} disabled={syncingNow}>
                  {syncingNow ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> SYNCING...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="size-3.5" /> SYNC API
                    </>
                  )}
                </BtnGhost>
              </>
            )}
            <BtnGhost
              onClick={() => {
                if (activeTab === "products") void loadProductReviews();
                else void loadGoogleReviews();
              }}
            >
              <RefreshCcw className="size-3.5" /> REFRESH
            </BtnGhost>
          </div>
        }
      />

      {/* Main Tab Navigation */}
      <div className="flex border-b border-border bg-white rounded-t-2xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
            activeTab === "products"
              ? "border-forest-dark text-forest-dark"
              : "border-transparent text-muted-foreground hover:text-forest-dark"
          }`}
        >
          <Star className="size-4" />
          Product Reviews
        </button>

        <button
          onClick={() => setActiveTab("google")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
            activeTab === "google"
              ? "border-brand-orange text-brand-orange"
              : "border-transparent text-muted-foreground hover:text-forest-dark"
          }`}
        >
          <GoogleGIcon className="size-4" />
          Google Business Reviews
          {googleSettings && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-brand-orange/10 text-brand-orange font-bold">
              {googleSettings.average_rating?.toFixed(1) || "4.9"} ★
            </span>
          )}
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: PRODUCT REVIEWS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <Card className="p-4 flex flex-wrap gap-2">
            {PRODUCT_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setProductStatus(s)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all ${
                  productStatus === s
                    ? "bg-forest-dark text-cream shadow-sm"
                    : "bg-white text-forest-dark border border-border hover:border-gold-deep"
                }`}
              >
                {s}
              </button>
            ))}
          </Card>

          <div className="grid gap-3">
            {productLoading && (
              <div className="text-center py-12 text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Loading reviews...
              </div>
            )}
            {!productLoading && productRows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-white rounded-2xl border border-border">
                No product reviews found.
              </div>
            )}
            {!productLoading &&
              productRows.map((r) => (
                <Card key={r.id} className="p-5">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-0.5">
                          {r.product_slug}
                        </span>
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase rounded px-2 py-0.5 ${
                            r.status === "approved"
                              ? "bg-forest text-cream"
                              : r.status === "rejected"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-cream text-forest-dark border border-border"
                          }`}
                        >
                          {r.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-medium text-forest-dark">
                        {r.author_name ?? "Anonymous"} —{" "}
                        <span className="text-gold-deep">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>
                      </div>
                      {r.title && (
                        <div className="mt-1 font-serif text-lg text-forest-dark">{r.title}</div>
                      )}
                      {r.body && (
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                          {r.body}
                        </p>
                      )}
                      {r.media_urls && r.media_urls.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {r.media_urls.map((u, i) => (
                            <a key={i} href={u} target="_blank" rel="noreferrer">
                              <img
                                src={u}
                                alt=""
                                className="size-16 rounded-lg object-cover border border-border"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {r.status !== "approved" && (
                        <button
                          onClick={async () => {
                            try {
                              await moderate({ data: { id: r.id, status: "approved" } });
                              toast.success("Approved");
                              void loadProductReviews();
                            } catch (e) {
                              toast.error((e as Error).message);
                            }
                          }}
                          className="inline-flex items-center gap-1 bg-forest text-cream rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:bg-forest-dark"
                        >
                          <Check className="size-3.5" /> APPROVE
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          onClick={async () => {
                            try {
                              await moderate({ data: { id: r.id, status: "rejected" } });
                              toast.success("Rejected");
                              void loadProductReviews();
                            } catch (e) {
                              toast.error((e as Error).message);
                            }
                          }}
                          className="inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:border-destructive hover:text-destructive"
                        >
                          <X className="size-3.5" /> REJECT
                        </button>
                      )}
                      {r.status === "approved" && (
                        <button
                          onClick={() => toggleFeatured(r.id, !!r.featured_on_homepage)}
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest transition-colors ${
                            r.featured_on_homepage
                              ? "bg-gold/20 text-gold-deep border border-gold-deep hover:bg-gold/30"
                              : "border border-border hover:border-gold-deep hover:text-gold-deep"
                          }`}
                        >
                          <Star
                            className={`size-3.5 ${r.featured_on_homepage ? "fill-gold-deep" : ""}`}
                          />
                          {r.featured_on_homepage ? "FEATURED" : "FEATURE"}
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this review?")) return;
                          try {
                            await del({ data: { id: r.id } });
                            toast.success("Deleted");
                            void loadProductReviews();
                          } catch (e) {
                            toast.error((e as Error).message);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-destructive text-[11px] font-bold tracking-widest hover:underline"
                      >
                        <Trash2 className="size-3.5" /> DELETE
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: GOOGLE BUSINESS REVIEWS
      ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === "google" && (
        <div className="space-y-6">
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Connection Status Card */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Google Connection
                  </span>
                  <GoogleGIcon className="size-5" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`size-2.5 rounded-full ${
                      googleSettings?.oauth_refresh_token
                        ? "bg-green-500"
                        : googleSettings?.place_id
                          ? "bg-blue-500"
                          : "bg-amber-500"
                    }`}
                  />
                  <span className="font-semibold text-sm text-forest-dark">
                    {googleSettings?.oauth_refresh_token
                      ? "OAuth Active (Business Profile)"
                      : googleSettings?.place_id
                        ? "Connected via Place ID"
                        : "Ready (Verified Seed Active)"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  {googleSettings?.oauth_refresh_token
                    ? "Official Google Business Profile API connected. Auto-refresh enabled."
                    : googleSettings?.place_id
                      ? `Syncing via Place ID: ${googleSettings.place_id}`
                      : "Using authentic farm seed reviews. Connect OAuth or Place ID to sync live Google edits."}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <button
                  onClick={handleConnectGoogleOAuth}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-dark hover:text-brand-orange transition-colors"
                >
                  <ShieldCheck className="size-3.5" />
                  {googleSettings?.oauth_refresh_token
                    ? "Reconnect Google Account"
                    : "Connect Google Account"}
                </button>
              </div>
            </Card>

            {/* Ratings Overview Card */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Storefront Rating
                  </span>
                  <Sparkles className="size-5 text-gold-deep" />
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-3xl font-medium text-forest-dark">
                    {googleSettings?.average_rating?.toFixed(1) || "4.9"}
                  </span>
                  <div className="flex text-gold-deep">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Based on{" "}
                  <strong className="text-forest-dark">
                    {googleSettings?.total_review_count || googleReviews.length}
                  </strong>{" "}
                  verified customer reviews on Google Maps.
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center gap-3 text-xs">
                {googleSettings?.google_maps_url && (
                  <a
                    href={googleSettings.google_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-brand-orange hover:underline"
                  >
                    <Globe className="size-3.5" /> View on Maps <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </Card>

            {/* Synchronization Card */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Sync Schedule
                  </span>
                  <Activity className="size-5 text-forest" />
                </div>

                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Last synchronized:</span>
                  <div className="font-semibold text-sm text-forest-dark">
                    {googleSettings?.last_synced_at
                      ? new Date(googleSettings.last_synced_at).toLocaleString()
                      : "Seed reviews active"}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  Schedule: Every {googleSettings?.sync_frequency_hours || 24} hours via GoDaddy cron.
                  {googleSettings?.last_error && (
                    <div className="mt-1 text-destructive font-medium truncate">
                      Last error: {googleSettings.last_error}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <button
                  onClick={handleManualSync}
                  disabled={syncingNow}
                  className="w-full inline-flex items-center justify-center gap-2 bg-cream text-forest-dark border border-border hover:border-gold-deep rounded-lg py-1.5 text-xs font-bold transition-all disabled:opacity-60"
                >
                  {syncingNow ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <RefreshCcw className="size-3.5" />
                  )}
                  {syncingNow ? "Syncing with Google..." : "Run Sync Now"}
                </button>
              </div>
            </Card>
          </div>

          {/* Google Business Profile & Places Settings Form */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Settings className="size-4 text-forest-dark" />
              <h2 className="font-serif text-lg font-medium text-forest-dark">
                Google Business Profile & Places Configuration
              </h2>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Google Place ID (Instant Places API Fallback)">
                  <input
                    type="text"
                    value={settingsForm.place_id}
                    onChange={(e) => setSettingsForm({ ...settingsForm, place_id: e.target.value })}
                    placeholder="e.g. ChIJ... (From Google Place ID Finder)"
                    className={inp}
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Find your Place ID using the Google Place ID Finder or Google Maps search.
                  </span>
                </Field>

                <Field label="Google Places API Key (Server-side)">
                  <input
                    type="password"
                    value={settingsForm.places_api_key}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, places_api_key: e.target.value })
                    }
                    placeholder="AIzaSy... (Kept secure on server)"
                    className={inp}
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Google Cloud Places API Key. Stored strictly server-side.
                  </span>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Google Maps Listing URL">
                  <input
                    type="url"
                    value={settingsForm.google_maps_url}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, google_maps_url: e.target.value })
                    }
                    placeholder="https://www.google.com/maps/search/?api=1&query=..."
                    className={inp}
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Customer CTA link for "Read All Reviews on Google".
                  </span>
                </Field>

                <Field label="Direct 'Leave a Review' URL">
                  <input
                    type="url"
                    value={settingsForm.google_review_dialog_url}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, google_review_dialog_url: e.target.value })
                    }
                    placeholder="https://search.google.com/local/writereview?placeid=..."
                    className={inp}
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Direct popup link for customer "Write a Review" button.
                  </span>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <Field label="Average Rating (Display Override)">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={settingsForm.average_rating}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        average_rating: parseFloat(e.target.value) || 4.9,
                      })
                    }
                    className={inp}
                  />
                </Field>

                <Field label="Total Review Count (Display Override)">
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.total_review_count}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        total_review_count: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className={inp}
                  />
                </Field>

                <Field label="Sync Frequency (Hours)">
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settingsForm.sync_frequency_hours}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        sync_frequency_hours: parseInt(e.target.value, 10) || 24,
                      })
                    }
                    className={inp}
                  />
                </Field>
              </div>

              <div className="flex justify-end pt-3">
                <BtnPrimary type="submit" disabled={savingSettings}>
                  {savingSettings ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                  SAVE SETTINGS
                </BtnPrimary>
              </div>
            </form>
          </Card>

          {/* Synchronized Reviews List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-medium text-forest-dark">
                Synchronized Google Reviews ({googleReviews.length})
              </h2>
              <span className="text-xs text-muted-foreground">
                Toggle visibility to hide spam or unwanted feedback from the storefront
              </span>
            </div>

            <div className="grid gap-3">
              {googleLoading && (
                <div className="text-center py-12 text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Loading synchronized reviews...
                </div>
              )}

              {!googleLoading && googleReviews.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-white rounded-2xl border border-border">
                  No Google reviews synchronized yet. Click "SYNC GOOGLE REVIEWS" to fetch live data.
                </div>
              )}

              {!googleLoading &&
                googleReviews.map((rev) => (
                  <Card key={rev.id || rev.google_review_id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                          {rev.reviewer_photo_url ? (
                            <img
                              src={rev.reviewer_photo_url}
                              alt=""
                              className="size-7 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="size-7 rounded-full bg-forest-dark text-cream font-bold text-[10px] flex items-center justify-center">
                              {rev.reviewer_name?.substring(0, 2).toUpperCase() || "SH"}
                            </div>
                          )}
                          <span className="font-bold text-sm text-forest-dark">
                            {rev.reviewer_name}
                          </span>
                          <span className="text-gold-deep font-bold text-xs">
                            {"★".repeat(rev.star_rating)}
                            {"☆".repeat(5 - rev.star_rating)} ({rev.star_rating}.0)
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(rev.review_date).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase rounded px-2 py-0.5 ${
                              rev.is_published
                                ? "bg-forest/15 text-forest"
                                : "bg-destructive/15 text-destructive"
                            }`}
                          >
                            {rev.is_published ? "PUBLISHED" : "HIDDEN"}
                          </span>
                        </div>

                        {rev.review_text && (
                          <p className="text-sm text-forest-dark/90 leading-relaxed whitespace-pre-wrap">
                            "{rev.review_text}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rev.google_review_url && (
                          <a
                            href={rev.google_review_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-forest-dark"
                          >
                            <ExternalLink className="size-3" /> View on Google
                          </a>
                        )}

                        <button
                          onClick={() =>
                            handleToggleGoogleVisibility(rev.google_review_id, rev.is_published)
                          }
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                            rev.is_published
                              ? "border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                              : "bg-forest text-cream hover:bg-forest-dark"
                          }`}
                        >
                          {rev.is_published ? (
                            <>
                              <EyeOff className="size-3" /> HIDE
                            </>
                          ) : (
                            <>
                              <Eye className="size-3" /> PUBLISH
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteGoogleReview(rev.google_review_id)}
                          className="inline-flex items-center gap-1 text-destructive rounded-lg px-2 py-1.5 text-[11px] font-bold hover:bg-destructive/10 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

          {/* Sync History Logs */}
          <div className="space-y-3 pt-4">
            <h2 className="font-serif text-lg font-medium text-forest-dark">
              Recent Synchronization Logs
            </h2>

            <TableWrap>
              <thead>
                <tr>
                  <Th>Timestamp</Th>
                  <Th>Status</Th>
                  <Th>Source</Th>
                  <Th>Triggered By</Th>
                  <Th>Fetched / Upserted</Th>
                  <Th>Message</Th>
                </tr>
              </thead>
              <tbody>
                {googleLogs.length === 0 ? (
                  <tr>
                    <Td colSpan={6} className="text-center py-6 text-muted-foreground">
                      No synchronization events recorded yet.
                    </Td>
                  </tr>
                ) : (
                  googleLogs.map((log) => (
                    <tr key={log.id} className="border-t border-border">
                      <Td className="whitespace-nowrap font-mono text-xs">
                        {new Date(log.started_at).toLocaleString()}
                      </Td>
                      <Td>
                        <StatusPill s={log.status} />
                      </Td>
                      <Td className="text-xs uppercase font-medium">{log.source}</Td>
                      <Td className="text-xs uppercase">{log.triggered_by}</Td>
                      <Td className="text-xs font-semibold">
                        {log.reviews_fetched} / {log.reviews_upserted}
                      </Td>
                      <Td className="text-xs text-muted-foreground max-w-xs truncate">
                        {log.error_message || "Completed successfully"}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </TableWrap>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          ADD GOOGLE REVIEW MODAL (100% Free, Zero Google Cloud Billing required)
      ──────────────────────────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <GoogleGIcon className="size-5" />
                <h3 className="font-serif text-lg font-medium text-forest-dark">
                  Add Verified Google Review
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-forest-dark"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Add genuine customer reviews directly to your website. They will display with the official Google logo, star ratings, and verified badge on your homepage.
            </p>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <Field label="Customer / Reviewer Name *">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newReviewForm.reviewer_name}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, reviewer_name: e.target.value })
                  }
                  className={inp}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Star Rating *">
                  <select
                    value={newReviewForm.star_rating}
                    onChange={(e) =>
                      setNewReviewForm({
                        ...newReviewForm,
                        star_rating: parseInt(e.target.value, 10),
                      })
                    }
                    className={inp}
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </Field>

                <Field label="Review Date">
                  <input
                    type="date"
                    value={newReviewForm.review_date}
                    onChange={(e) =>
                      setNewReviewForm({ ...newReviewForm, review_date: e.target.value })
                    }
                    className={inp}
                  />
                </Field>
              </div>

              <Field label="Review Content *">
                <textarea
                  required
                  rows={4}
                  placeholder="Paste what the customer wrote on Google..."
                  value={newReviewForm.review_text}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, review_text: e.target.value })
                  }
                  className={inp}
                />
              </Field>

              <Field label="Google Review Link (Optional)">
                <input
                  type="url"
                  placeholder="https://maps.app.goo.gl/... (optional direct link)"
                  value={newReviewForm.google_review_url}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, google_review_url: e.target.value })
                  }
                  className={inp}
                />
              </Field>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <BtnGhost type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </BtnGhost>
                <BtnPrimary type="submit" disabled={savingNewReview}>
                  {savingNewReview ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  ADD TO WEBSITE
                </BtnPrimary>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
