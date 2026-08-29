type OAuthDebugValue = string | number | boolean | null | undefined;

const INTENT_TTL_MS = 10 * 60 * 1000;
const INTENT_PREFIX = "oauth_intent:";
const LATEST_INTENT_KEY = "oauth_intent_latest";

type OAuthIntent = {
  id: string;
  target: string;
  createdAt: number;
};

function storage() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function randomId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

export function safeRedirectPath(path: string | null | undefined): string {
  if (!path) return "/account";
  if (!path.startsWith("/") || path.startsWith("//")) return "/account";
  try {
    const parsed = new URL(path, "https://saurashtra-honey.local");
    if (parsed.origin !== "https://saurashtra-honey.local") return "/account";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/account";
  }
}

export function isLocalOAuthOrigin(origin: string): boolean {
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "http:" && (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]");
  } catch {
    return false;
  }
}

export function createOAuthIntent(targetPath: string): OAuthIntent {
  const intent = {
    id: randomId(),
    target: safeRedirectPath(targetPath),
    createdAt: Date.now(),
  };
  const s = storage();
  if (s) {
    s.setItem(`${INTENT_PREFIX}${intent.id}`, JSON.stringify(intent));
    s.setItem(LATEST_INTENT_KEY, intent.id);
  }
  return intent;
}

export function buildOAuthCallbackUrl(origin: string, intentId: string): string {
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("oauth_intent", intentId);
  return url.toString();
}

export function consumeOAuthIntent(intentId: string | null):
  | { ok: true; target: string }
  | { ok: false; reason: "missing" | "not_found" | "mismatch" | "expired" | "invalid" } {
  if (!intentId) return { ok: false, reason: "missing" };
  const s = storage();
  if (!s) return { ok: false, reason: "not_found" };
  const latest = s.getItem(LATEST_INTENT_KEY);
  if (latest !== intentId) return { ok: false, reason: "mismatch" };
  const raw = s.getItem(`${INTENT_PREFIX}${intentId}`);
  if (!raw) return { ok: false, reason: "not_found" };
  try {
    const intent = JSON.parse(raw) as Partial<OAuthIntent>;
    if (intent.id !== intentId || typeof intent.target !== "string" || typeof intent.createdAt !== "number") {
      return { ok: false, reason: "invalid" };
    }
    if (Date.now() - intent.createdAt > INTENT_TTL_MS) return { ok: false, reason: "expired" };
    return { ok: true, target: safeRedirectPath(intent.target) };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

export function clearOAuthIntent(intentId: string | null | undefined) {
  const s = storage();
  if (!s || !intentId) return;
  s.removeItem(`${INTENT_PREFIX}${intentId}`);
  if (s.getItem(LATEST_INTENT_KEY) === intentId) s.removeItem(LATEST_INTENT_KEY);
}

function currentSafeUrlParts() {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  return {
    origin: url.origin,
    pathname: url.pathname,
    searchKeys: Array.from(url.searchParams.keys()).sort().join(",") || "none",
    hashKeys: url.hash ? Array.from(new URLSearchParams(url.hash.slice(1)).keys()).sort().join(",") || "present" : "none",
  };
}

export function oauthDebug(event: string, details: Record<string, OAuthDebugValue> = {}) {
  if (typeof window === "undefined") return;
  const safeDetails = Object.fromEntries(
    Object.entries(details).map(([key, value]) => [key, typeof value === "string" && value.length > 160 ? `${value.slice(0, 160)}…` : value]),
  );
  console.info("[oauth-flow]", event, { ...currentSafeUrlParts(), ...safeDetails });
}