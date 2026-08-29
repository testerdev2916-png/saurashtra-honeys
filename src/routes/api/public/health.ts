import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Lightweight health endpoint for uptime monitors, load balancers, and CI
// smoke tests. Checks DB reachability using the publishable key so it never
// exposes admin credentials. Returns 200 when healthy, 503 otherwise.
export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        const started = Date.now();
        const report: {
          status: "ok" | "degraded";
          uptime_ms: number;
          checks: Record<string, { ok: boolean; latency_ms?: number; error?: string }>;
          version: string;
          timestamp: string;
        } = {
          status: "ok",
          uptime_ms: 0,
          checks: {},
          version: process.env.APP_VERSION ?? "dev",
          timestamp: new Date().toISOString(),
        };

        // DB check via public Data API
        const dbStart = Date.now();
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (!url || !key) throw new Error("missing_supabase_env");
          const res = await fetch(`${url}/rest/v1/app_settings?select=id&limit=1`, {
            headers: { apikey: key, Accept: "application/json" },
          });
          report.checks.database = { ok: res.ok, latency_ms: Date.now() - dbStart };
          if (!res.ok) report.checks.database.error = `http_${res.status}`;
        } catch (e) {
          report.checks.database = { ok: false, error: (e as Error).message };
        }

        report.uptime_ms = Date.now() - started;
        if (Object.values(report.checks).some((c) => !c.ok)) report.status = "degraded";
        return new Response(JSON.stringify(report, null, 2), {
          status: report.status === "ok" ? 200 : 503,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
