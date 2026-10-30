import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Reserved test domains as per RFC 2606 and common test patterns
const HARDCODED_BLOCKED_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "example.edu",
  "test.com",
  "test.org",
  "test.net",
  "sample.com",
  "invalid",
  "localhost",
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "yopmail.com",
  "throwawaymail.com",
  "sharklasers.com",
  "trashmail.com",
  "dispostable.com",
]);

// Cache for database-backed blocklist (refreshed every 60 seconds)
let dbBlocklistCache: {
  emails: Set<string>;
  domains: Set<string>;
  phones: Set<string>;
  cachedAt: number;
} | null = null;

const CACHE_TTL_MS = 60 * 1000;

export async function getBlockedEntities(
  supabase: SupabaseClient<Database>,
  forceRefresh = false,
): Promise<{ emails: Set<string>; domains: Set<string>; phones: Set<string> }> {
  const now = Date.now();
  if (!forceRefresh && dbBlocklistCache && now - dbBlocklistCache.cachedAt < CACHE_TTL_MS) {
    return dbBlocklistCache;
  }

  const emails = new Set<string>();
  const domains = new Set<string>(HARDCODED_BLOCKED_DOMAINS);
  const phones = new Set<string>();

  try {
    const { data, error } = await supabase
      .from("security_blocked_entities" as unknown as "orders")
      .select("type, value");

    if (!error && Array.isArray(data)) {
      for (const item of data as unknown as Array<{ type: string; value: string }>) {
        const val = (item.value || "").trim().toLowerCase();
        if (!val) continue;
        if (item.type === "email") emails.add(val);
        else if (item.type === "domain") domains.add(val);
        else if (item.type === "phone") phones.add(val.replace(/\s+/g, ""));
      }
    }
  } catch {
    // Graceful fallback to hardcoded list if table is pending migration
  }

  dbBlocklistCache = { emails, domains, phones, cachedAt: now };
  return dbBlocklistCache;
}

export interface EmailValidationResult {
  valid: boolean;
  isBlocked: boolean;
  isTestDomain: boolean;
  reason?: string;
  normalizedEmail: string;
}

/**
 * Validates an email address against blocked domains, disposable emails, and test domain rules.
 */
export async function validateEmailForCheckout(
  supabase: SupabaseClient<Database>,
  rawEmail: string,
): Promise<EmailValidationResult> {
  if (!rawEmail || typeof rawEmail !== "string") {
    return {
      valid: false,
      isBlocked: false,
      isTestDomain: false,
      reason: "Email is required",
      normalizedEmail: "",
    };
  }

  const normalized = rawEmail.trim().toLowerCase();
  const atIndex = normalized.lastIndexOf("@");
  if (atIndex === -1 || atIndex === 0 || atIndex === normalized.length - 1) {
    return {
      valid: false,
      isBlocked: false,
      isTestDomain: false,
      reason: "Invalid email format",
      normalizedEmail: normalized,
    };
  }

  const domain = normalized.slice(atIndex + 1);

  // Check hardcoded or DB blocklist
  const { emails, domains } = await getBlockedEntities(supabase);

  if (emails.has(normalized)) {
    return {
      valid: false,
      isBlocked: true,
      isTestDomain: false,
      reason: "This email address is restricted from placing orders.",
      normalizedEmail: normalized,
    };
  }

  if (domains.has(domain)) {
    return {
      valid: false,
      isBlocked: true,
      isTestDomain: HARDCODED_BLOCKED_DOMAINS.has(domain),
      reason: `Email domain @${domain} is not permitted for customer orders. Please use a valid personal or business email address.`,
      normalizedEmail: normalized,
    };
  }

  // Detect suspicious test patterns like test.guest.claim... or dummy addresses
  if (
    normalized.startsWith("test.guest.claim") ||
    normalized.startsWith("fake.") ||
    normalized.startsWith("dummy.") ||
    domain.endsWith(".test") ||
    domain.endsWith(".example")
  ) {
    return {
      valid: false,
      isBlocked: true,
      isTestDomain: true,
      reason: "Test or automated email addresses are not permitted for live orders.",
      normalizedEmail: normalized,
    };
  }

  return {
    valid: true,
    isBlocked: false,
    isTestDomain: false,
    normalizedEmail: normalized,
  };
}

/**
 * In-memory sliding window rate limiter
 */
interface RateLimitBucket {
  timestamps: number[];
}
const rateLimitStore = new Map<string, RateLimitBucket>();

// Clean up old buckets periodically
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 3600000);
    if (bucket.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 300000); // every 5 minutes
if (typeof cleanupTimer.unref === "function") {
  cleanupTimer.unref();
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  let bucket = rateLimitStore.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitStore.set(key, bucket);
  }

  // Filter timestamps within window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= maxRequests) {
    const oldest = bucket.timestamps[0];
    const resetMs = Math.max(0, oldest + windowMs - now);
    return { allowed: false, remaining: 0, resetMs };
  }

  bucket.timestamps.push(now);
  const remaining = maxRequests - bucket.timestamps.length;
  return { allowed: true, remaining, resetMs: windowMs };
}

/**
 * Resets rate limit for a key (used in automated tests)
 */
export function resetRateLimitForTest(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Security audit event logger
 */
export interface SecurityEventPayload {
  eventType:
    | "otp.sent"
    | "otp.verified"
    | "otp.failed"
    | "otp.rate_limit_exceeded"
    | "order.blocked_fake_email"
    | "order.blocked_unverified_cod"
    | "order.price_tamper_prevented"
    | "order.rate_limit_exceeded";
  severity?: "info" | "warning" | "critical";
  actorId?: string | null;
  phone?: string | null;
  email?: string | null;
  ipAddress?: string | null;
  metadata?: Record<string, unknown>;
}

export async function logSecurityEvent(
  supabase: SupabaseClient<Database>,
  event: SecurityEventPayload,
): Promise<void> {
  const payload = {
    event_type: event.eventType,
    severity: event.severity || "info",
    actor_id: event.actorId || null,
    phone: event.phone || null,
    email: event.email || null,
    ip_address: event.ipAddress || null,
    metadata: event.metadata || {},
    created_at: new Date().toISOString(),
  };

  // Log to console in structured format
  console.log(`[SECURITY AUDIT] ${event.severity?.toUpperCase() || "INFO"} | ${event.eventType} | ${event.email || event.phone || event.actorId || "anon"}`);

  // Insert to database if table exists
  try {
    await supabase.from("security_audit_events" as unknown as "orders").insert(payload as never);
  } catch {
    // Graceful fallback if migration pending
  }
}
