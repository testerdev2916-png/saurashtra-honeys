import { createFileRoute } from "@tanstack/react-router";
import { performGoogleReviewsSyncServer } from "@/lib/google-reviews.server";

async function handleSyncRequest(request: Request) {
  const url = new URL(request.url);
  const secret =
    request.headers.get("Authorization")?.replace("Bearer ", "") ||
    url.searchParams.get("secret");

  const validSecret =
    process.env.CRON_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  // Protect the cron endpoint from unauthorized external calls
  if (validSecret && secret !== validSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid cron secret" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await performGoogleReviewsSyncServer("cron");
  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/cron/sync-google-reviews")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return handleSyncRequest(request);
      },
      POST: async ({ request }: { request: Request }) => {
        return handleSyncRequest(request);
      },
    },
  },
});

