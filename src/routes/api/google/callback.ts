import { createFileRoute } from "@tanstack/react-router";
import {
  exchangeGoogleOAuthCodeServer,
  saveGoogleBusinessSettingsServer,
  performGoogleReviewsSyncServer,
} from "@/lib/google-reviews.server";

export const Route = createFileRoute("/api/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        const origin = url.origin;

        if (error) {
          console.error("[GoogleOAuth] Authorization error:", error);
          return Response.redirect(
            `${origin}/admin/reviews?tab=google&error=${encodeURIComponent(error)}`,
            302,
          );
        }

        if (!code) {
          return Response.redirect(
            `${origin}/admin/reviews?tab=google&error=${encodeURIComponent("No authorization code returned")}`,
            302,
          );
        }

        try {
          // 1. Exchange code for access & refresh tokens
          const { accessToken, refreshToken, expiresIn } = await exchangeGoogleOAuthCodeServer(
            code,
            origin,
          );

          const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

          // 2. Discover Google Business Account & Location IDs
          let accountId: string | null = null;
          let locationId: string | null = null;

          try {
            const accountsRes = await fetch(
              "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              },
            );

            if (accountsRes.ok) {
              const accountsData = await accountsRes.json();
              const firstAccount = accountsData.accounts?.[0];
              if (firstAccount?.name) {
                accountId = firstAccount.name.replace("accounts/", "");

                // Fetch locations under this account
                const locationsRes = await fetch(
                  `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
                  {
                    headers: { Authorization: `Bearer ${accessToken}` },
                  },
                );

                if (locationsRes.ok) {
                  const locationsData = await locationsRes.json();
                  const firstLoc = locationsData.locations?.[0];
                  if (firstLoc?.name) {
                    locationId = firstLoc.name
                      .replace("locations/", "")
                      .replace(`accounts/${accountId}/locations/`, "");
                  }
                }
              }
            }
          } catch (discErr) {
            console.warn("[GoogleOAuth] Account/Location discovery note:", discErr);
          }

          // 3. Save tokens and IDs
          await saveGoogleBusinessSettingsServer({
            oauth_access_token: accessToken,
            oauth_refresh_token: refreshToken,
            token_expires_at: tokenExpiresAt,
            ...(accountId ? { account_id: accountId } : {}),
            ...(locationId ? { location_id: locationId } : {}),
            sync_status: "idle",
            last_error: null,
          });

          // 4. Trigger initial review sync in background
          if (accountId && locationId) {
            void performGoogleReviewsSyncServer("oauth_initial");
          }

          return Response.redirect(`${origin}/admin/reviews?tab=google&connected=true`, 302);
        } catch (err: any) {
          console.error("[GoogleOAuth] Callback handling failed:", err);
          return Response.redirect(
            `${origin}/admin/reviews?tab=google&error=${encodeURIComponent(err?.message || "Token exchange failed")}`,
            302,
          );
        }
      },
    },
  },
});

