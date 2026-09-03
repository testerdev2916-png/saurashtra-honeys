import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Enterprise security headers. CSP is intentionally permissive for inline
// analytics bootstrappers (GA4, Meta Pixel, Clarity) while still blocking
// the most dangerous vectors (framing, mixed content, MIME sniffing).
const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-DNS-Prefetch-Control": "on",
};

function applySecurityHeaders(response: Response): Response {
  // Avoid mutating immutable responses (e.g. redirects from certain runtimes)
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }

  // Prevent CDN (Netlify Edge) from caching dynamic SSR HTML or server function JSON
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("text/html") || contentType.includes("application/json")) {
    headers.set("Cache-Control", "public, max-age=0, s-maxage=0, must-revalidate, no-cache, no-store");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
// Inject public Supabase env vars into HTML so the client JS bundle can find them,
// even if the bundle was compiled without VITE_ env vars at build time.
async function injectEnvIntoHtml(response: Response): Promise<Response> {
  const ct = response.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return response;

  const html = await response.text();
  const envScript = `<script>window.__ENV={SUPABASE_URL:${JSON.stringify(process.env.SUPABASE_URL || "https://lxdkcqdkfuuqjudsysrr.supabase.co")},SUPABASE_PUBLISHABLE_KEY:${JSON.stringify(process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_E3rv2tJCU_jTt1wL_TyWDQ_u1_9ztgY")}}</script>`;
  const patched = html.replace("<head>", `<head>${envScript}`);

  const headers = new Headers(response.headers);
  headers.set("content-length", String(Buffer.byteLength(patched, "utf-8")));
  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const safe = await normalizeCatastrophicSsrResponse(response);
      const injected = await injectEnvIntoHtml(safe);
      return applySecurityHeaders(injected);
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }));
    }
  },
};
