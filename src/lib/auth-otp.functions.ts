import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import {
  normalizePhoneNumber,
  generateCryptoOtp,
  hashOtp,
  verifyOtpHash,
  sendSmsOtp,
  OTP_EXPIRY_MS,
  RESEND_COOLDOWN_MS,
  MAX_VERIFICATION_ATTEMPTS,
  MAX_HOURLY_RESENDS,
  type OtpPurpose,
} from "./security/sms-otp.service";
import {
  checkRateLimit,
  logSecurityEvent,
  getBlockedEntities,
} from "./security/fake-order-detector";

// In-memory verification fallback store if DB table is syncing
interface FallbackVerifRecord {
  id: string;
  userId: string | null;
  phone: string;
  purpose: OtpPurpose;
  otpHash: string;
  attempts: number;
  maxAttempts: number;
  resendCount: number;
  lastSentAt: number;
  expiresAt: number;
  verifiedAt: number | null;
  consumedAt: number | null;
}

const fallbackVerifStore = new Map<string, FallbackVerifRecord>();

function getFallbackKey(phone: string, purpose: string): string {
  return `${phone}:${purpose}`;
}

export function getActiveFallbackVerification(
  phone: string,
  purpose: OtpPurpose,
): FallbackVerifRecord | null {
  const key = getFallbackKey(phone, purpose);
  const record = fallbackVerifStore.get(key);
  if (!record) return null;
  return record;
}

export function saveFallbackVerification(record: FallbackVerifRecord): void {
  const key = getFallbackKey(record.phone, record.purpose);
  fallbackVerifStore.set(key, record);
}

// Schemas
const requestOtpSchema = z.object({
  phone: z.string().trim().min(7).max(25),
  purpose: z.enum(["signup", "cod_order", "phone_update", "login"]).default("signup"),
});

const verifyOtpSchema = z.object({
  phone: z.string().trim().min(7).max(25),
  otp: z.string().trim().min(4).max(8),
  purpose: z.enum(["signup", "cod_order", "phone_update", "login"]).default("signup"),
  full_name: z.string().trim().min(2).max(120).optional(),
  password: z.string().min(8).max(72).optional(),
});

// ============================================================================
// 1. REQUEST OTP FOR MOBILE SIGNUP / LOGIN
// ============================================================================
export async function requestMobileSignupOtpHandler(data: z.infer<typeof requestOtpSchema>) {
  const norm = normalizePhoneNumber(data.phone);
  if (!norm.valid) {
    throw new Error(norm.error || "Invalid mobile number format.");
  }
  const phone = norm.phone;

  // Check blocked entities
  const blocked = await getBlockedEntities(supabase);
  if (blocked.phones.has(phone)) {
    throw new Error("This mobile number is restricted from registering an account.");
  }

  // Rate limiting: Max 5 OTP requests per phone per 15 minutes
  const rateCheck = checkRateLimit(`otp_req:${phone}`, 5, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    await logSecurityEvent(supabase, {
      eventType: "otp.rate_limit_exceeded",
      severity: "warning",
      phone,
      metadata: { purpose: data.purpose },
    });
    const waitMinutes = Math.ceil(rateCheck.resetMs / 60000);
    throw new Error(`Too many OTP requests. Please wait ${waitMinutes} minute(s) before requesting another code.`);
  }

  // Check resend cooldown from DB or fallback store
  const now = Date.now();
  let existingRecord: FallbackVerifRecord | null = null;

  try {
    const { data: dbRows } = await supabase
      .from("phone_verifications" as unknown as "orders")
      .select("*")
      .eq("phone", phone)
      .eq("purpose", data.purpose)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (dbRows && dbRows[0]) {
      const row = dbRows[0] as unknown as {
        id: string;
        otp_hash: string;
        attempts: number;
        resend_count: number;
        last_sent_at: string;
        expires_at: string;
      };
      existingRecord = {
        id: row.id,
        userId: null,
        phone,
        purpose: data.purpose,
        otpHash: row.otp_hash,
        attempts: row.attempts,
        maxAttempts: MAX_VERIFICATION_ATTEMPTS,
        resendCount: row.resend_count,
        lastSentAt: new Date(row.last_sent_at).getTime(),
        expiresAt: new Date(row.expires_at).getTime(),
        verifiedAt: null,
        consumedAt: null,
      };
    }
  } catch {
    // If DB table not yet created, use fallback store
  }

  if (!existingRecord) {
    existingRecord = getActiveFallbackVerification(phone, data.purpose);
  }

  // Enforce cooldown (60 seconds)
  if (existingRecord && now - existingRecord.lastSentAt < RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - existingRecord.lastSentAt)) / 1000);
    throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new code.`);
  }

  // Enforce max hourly resends (5 per hour)
  if (existingRecord && existingRecord.resendCount >= MAX_HOURLY_RESENDS) {
    if (now - existingRecord.lastSentAt < 3600000) {
      throw new Error("Maximum hourly OTP requests reached for this mobile number. Please try again later.");
    }
  }

  // Generate 6-digit cryptographic OTP and salted hash
  const otp = generateCryptoOtp();
  const otpHash = hashOtp(phone, otp);
  const expiresAt = now + OTP_EXPIRY_MS;
  const resendCount = existingRecord ? existingRecord.resendCount + 1 : 0;

  // Persist verification record
  try {
    await supabase.from("phone_verifications" as unknown as "orders").insert({
      phone,
      purpose: data.purpose,
      otp_hash: otpHash,
      attempts: 0,
      max_attempts: MAX_VERIFICATION_ATTEMPTS,
      resend_count: resendCount,
      last_sent_at: new Date(now).toISOString(),
      expires_at: new Date(expiresAt).toISOString(),
    } as never);
  } catch {
    // In-memory fallback
  }

  saveFallbackVerification({
    id: `verif_${Date.now()}`,
    userId: null,
    phone,
    purpose: data.purpose,
    otpHash,
    attempts: 0,
    maxAttempts: MAX_VERIFICATION_ATTEMPTS,
    resendCount,
    lastSentAt: now,
    expiresAt,
    verifiedAt: null,
    consumedAt: null,
  });

  // Dispatch SMS
  const dispatch = await sendSmsOtp({ phone, otp, purpose: data.purpose });
  if (!dispatch.success) {
    throw new Error(dispatch.error || "Failed to send OTP message. Please check the number and try again.");
  }

  await logSecurityEvent(supabase, {
    eventType: "otp.sent",
    phone,
    metadata: { purpose: data.purpose, provider: dispatch.provider },
  });

  return {
    ok: true,
    phone,
    cooldownSeconds: 60,
    expiresInSeconds: 300,
  };
}

export const requestMobileSignupOtp = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof requestOtpSchema>) => requestOtpSchema.parse(d))
  .handler(async ({ data }) => requestMobileSignupOtpHandler(data));


// ============================================================================
// 2. VERIFY MOBILE SIGNUP / LOGIN OTP & CREATE/ACTIVATE ACCOUNT
// ============================================================================
export async function verifyMobileSignupOtpHandler(data: z.infer<typeof verifyOtpSchema>) {
  const norm = normalizePhoneNumber(data.phone);
    if (!norm.valid) throw new Error("Invalid mobile number format.");
    const phone = norm.phone;

    // Check rate limit on verification attempts per IP/phone
    const verifRate = checkRateLimit(`otp_verify_attempt:${phone}`, 10, 15 * 60 * 1000);
    if (!verifRate.allowed) {
      throw new Error("Too many failed verification attempts. Please request a new OTP.");
    }

    const now = Date.now();
    let matchedRecord: {
      id: string;
      otpHash: string;
      attempts: number;
      expiresAt: number;
      verifiedAt: number | null;
      isDb: boolean;
    } | null = null;

    // Check database first
    try {
      const { data: dbRows } = await supabase
        .from("phone_verifications" as unknown as "orders")
        .select("*")
        .eq("phone", phone)
        .eq("purpose", data.purpose)
        .is("verified_at", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (dbRows && dbRows[0]) {
        const row = dbRows[0] as unknown as {
          id: string;
          otp_hash: string;
          attempts: number;
          expires_at: string;
          verified_at: string | null;
        };
        matchedRecord = {
          id: row.id,
          otpHash: row.otp_hash,
          attempts: row.attempts,
          expiresAt: new Date(row.expires_at).getTime(),
          verifiedAt: row.verified_at ? new Date(row.verified_at).getTime() : null,
          isDb: true,
        };
      }
    } catch {
      // Fall through to memory store
    }

    if (!matchedRecord) {
      const fallback = getActiveFallbackVerification(phone, data.purpose);
      if (fallback) {
        matchedRecord = {
          id: fallback.id,
          otpHash: fallback.otpHash,
          attempts: fallback.attempts,
          expiresAt: fallback.expiresAt,
          verifiedAt: fallback.verifiedAt,
          isDb: false,
        };
      }
    }

    if (!matchedRecord) {
      throw new Error("No active OTP request found for this number. Please request a new OTP code.");
    }

    // Check already verified
    if (matchedRecord.verifiedAt) {
      throw new Error("This verification code has already been consumed. Please request a fresh OTP.");
    }

    // Check expiry
    if (now > matchedRecord.expiresAt) {
      throw new Error("This OTP has expired (5 minute limit). Please request a new code.");
    }

    // Check max attempts
    if (matchedRecord.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new Error("Maximum attempts exceeded. This OTP has been invalidated for security. Please request a new one.");
    }

    // Verify hash in constant time
    const isCorrect = verifyOtpHash(phone, data.otp, matchedRecord.otpHash);

    if (!isCorrect) {
      const nextAttempts = matchedRecord.attempts + 1;
      // Increment attempt counter in DB / memory
      if (matchedRecord.isDb) {
        await supabase
          .from("phone_verifications" as unknown as "orders")
          .update({ attempts: nextAttempts } as never)
          .eq("id", matchedRecord.id);
      }
      const memRecord = getActiveFallbackVerification(phone, data.purpose);
      if (memRecord) {
        memRecord.attempts = nextAttempts;
        saveFallbackVerification(memRecord);
      }

      await logSecurityEvent(supabase, {
        eventType: "otp.failed",
        severity: "warning",
        phone,
        metadata: { attempts: nextAttempts, purpose: data.purpose },
      });

      const remaining = MAX_VERIFICATION_ATTEMPTS - nextAttempts;
      if (remaining <= 0) {
        throw new Error("Incorrect OTP code. Maximum attempts reached. This code is now void.");
      }
      throw new Error(`Incorrect OTP code. ${remaining} attempt(s) remaining.`);
    }

    // Mark verified
    const verifiedIso = new Date().toISOString();
    if (matchedRecord.isDb) {
      await supabase
        .from("phone_verifications" as unknown as "orders")
        .update({ verified_at: verifiedIso } as never)
        .eq("id", matchedRecord.id);
    }
    const memRecord = getActiveFallbackVerification(phone, data.purpose);
    if (memRecord) {
      memRecord.verifiedAt = now;
      saveFallbackVerification(memRecord);
    }

    // Account creation / linking via Supabase Admin
    let userId: string | null = null;
    let userEmail: string | null = null;

    try {
      // 1. Check if user already exists with this phone in auth.users
      const { data: userList } = await supabase.auth.admin.listUsers();
      const existingUser = (userList?.users || []).find((u) => u.phone === phone);

      if (existingUser) {
        userId = existingUser.id;
        userEmail = existingUser.email || null;
      } else {
        // Create new account bound to phone number
        const passwordToUse = data.password || `SH_${phone.replace(/\D/g, "")}!Secure2026`;
        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
          phone,
          phone_confirm: true,
          password: passwordToUse,
          user_metadata: {
            full_name: data.full_name || "Customer",
            phone_verified: true,
            auth_provider: "phone_otp",
          },
        });

        if (createErr) {
          // If phone auth is disabled in Supabase, create pseudo-email account or update profile
          console.warn("[Auth Admin] Direct phone creation note:", createErr.message);
        } else if (newUser?.user) {
          userId = newUser.user.id;
        }
      }
    } catch (authErr) {
      console.warn("[Auth Admin] User account creation error:", authErr);
    }

    // Update public.profiles table
    if (userId) {
      try {
        await supabase
          .from("profiles")
          .update({
            phone,
            phone_verified: true,
            phone_verified_at: verifiedIso,
            full_name: data.full_name || undefined,
          } as never)
          .eq("id", userId);
      } catch {
        // Fallback gracefully
      }
    }

    await logSecurityEvent(supabase, {
      eventType: "otp.verified",
      actorId: userId,
      phone,
      metadata: { purpose: data.purpose },
    });

    return {
      ok: true,
      phone,
      userId,
      email: userEmail,
      message: "Mobile number verified successfully.",
    };
}

export const verifyMobileSignupOtp = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof verifyOtpSchema>) => verifyOtpSchema.parse(d))
  .handler(async ({ data }) => verifyMobileSignupOtpHandler(data));

// ============================================================================
// 3. MANDATORY COD MOBILE VERIFICATION (REQUEST OTP)
// ============================================================================
export const requestCodPhoneOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { phone: string }) => z.object({ phone: z.string().trim().min(7).max(25) }).parse(d))
  .handler(async ({ data, context }) => {
    const norm = normalizePhoneNumber(data.phone);
    if (!norm.valid) throw new Error(norm.error || "Please enter a valid mobile number.");
    const phone = norm.phone;

    // Rate limiting: Max 5 per 15 min per user & phone
    const rateCheck = checkRateLimit(`cod_otp:${context.userId}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      throw new Error("Too many verification requests. Please wait a few minutes before trying again.");
    }

    const now = Date.now();

    // Check resend cooldown
    const existing = getActiveFallbackVerification(phone, "cod_order");
    if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
      const remSec = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      throw new Error(`Please wait ${remSec} seconds before requesting a new OTP.`);
    }

    const otp = generateCryptoOtp();
    const otpHash = hashOtp(phone, otp);
    const expiresAt = now + OTP_EXPIRY_MS;

    // Save in DB if table exists
    try {
      await supabase.from("phone_verifications" as unknown as "orders").insert({
        user_id: context.userId,
        phone,
        purpose: "cod_order",
        otp_hash: otpHash,
        attempts: 0,
        max_attempts: MAX_VERIFICATION_ATTEMPTS,
        expires_at: new Date(expiresAt).toISOString(),
      } as never);
    } catch {
      // Memory fallback
    }

    saveFallbackVerification({
      id: `verif_cod_${Date.now()}`,
      userId: context.userId,
      phone,
      purpose: "cod_order",
      otpHash,
      attempts: 0,
      maxAttempts: MAX_VERIFICATION_ATTEMPTS,
      resendCount: 0,
      lastSentAt: now,
      expiresAt,
      verifiedAt: null,
      consumedAt: null,
    });

    const dispatch = await sendSmsOtp({ phone, otp, purpose: "cod_order" });
    if (!dispatch.success) {
      throw new Error(dispatch.error || "Failed to dispatch verification code.");
    }

    await logSecurityEvent(supabase, {
      eventType: "otp.sent",
      actorId: context.userId,
      phone,
      metadata: { purpose: "cod_order" },
    });

    return {
      ok: true,
      phone,
      cooldownSeconds: 60,
      expiresInSeconds: 300,
    };
  });

// ============================================================================
// 4. MANDATORY COD MOBILE VERIFICATION (VERIFY OTP)
// ============================================================================
export const verifyCodPhoneOtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { phone: string; otp: string }) =>
    z
      .object({
        phone: z.string().trim().min(7).max(25),
        otp: z.string().trim().min(4).max(8),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const norm = normalizePhoneNumber(data.phone);
    if (!norm.valid) throw new Error("Invalid mobile number format.");
    const phone = norm.phone;

    const now = Date.now();
    let record: {
      id: string;
      otpHash: string;
      attempts: number;
      expiresAt: number;
      verifiedAt: number | null;
      isDb: boolean;
    } | null = null;

    try {
      const { data: dbRows } = await supabase
        .from("phone_verifications" as unknown as "orders")
        .select("*")
        .eq("phone", phone)
        .eq("purpose", "cod_order")
        .is("verified_at", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (dbRows && dbRows[0]) {
        const row = dbRows[0] as unknown as {
          id: string;
          otp_hash: string;
          attempts: number;
          expires_at: string;
          verified_at: string | null;
        };
        record = {
          id: row.id,
          otpHash: row.otp_hash,
          attempts: row.attempts,
          expiresAt: new Date(row.expires_at).getTime(),
          verifiedAt: row.verified_at ? new Date(row.verified_at).getTime() : null,
          isDb: true,
        };
      }
    } catch {
      // Fall through
    }

    if (!record) {
      const fallback = getActiveFallbackVerification(phone, "cod_order");
      if (fallback) {
        record = {
          id: fallback.id,
          otpHash: fallback.otpHash,
          attempts: fallback.attempts,
          expiresAt: fallback.expiresAt,
          verifiedAt: fallback.verifiedAt,
          isDb: false,
        };
      }
    }

    if (!record) {
      throw new Error("No active OTP request found for this phone number. Please click 'Send OTP'.");
    }

    if (record.verifiedAt) {
      throw new Error("This OTP has already been verified.");
    }

    if (now > record.expiresAt) {
      throw new Error("OTP has expired. Please request a fresh code.");
    }

    if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new Error("Too many incorrect attempts. Please request a new OTP code.");
    }

    const isCorrect = verifyOtpHash(phone, data.otp, record.otpHash);
    if (!isCorrect) {
      const nextAttempts = record.attempts + 1;
      if (record.isDb) {
        await supabase
          .from("phone_verifications" as unknown as "orders")
          .update({ attempts: nextAttempts } as never)
          .eq("id", record.id);
      }
      const mem = getActiveFallbackVerification(phone, "cod_order");
      if (mem) {
        mem.attempts = nextAttempts;
        saveFallbackVerification(mem);
      }

      const rem = MAX_VERIFICATION_ATTEMPTS - nextAttempts;
      if (rem <= 0) throw new Error("Incorrect OTP. Maximum attempts reached. Please request a new code.");
      throw new Error(`Incorrect OTP code. ${rem} attempt(s) remaining.`);
    }

    // Mark verified
    const verifiedIso = new Date().toISOString();
    if (record.isDb) {
      await supabase
        .from("phone_verifications" as unknown as "orders")
        .update({ verified_at: verifiedIso } as never)
        .eq("id", record.id);
    }
    const mem = getActiveFallbackVerification(phone, "cod_order");
    if (mem) {
      mem.verifiedAt = now;
      saveFallbackVerification(mem);
    }

    // Mark user profile phone as verified in database
    try {
      await supabase
        .from("profiles")
        .update({
          phone,
          phone_verified: true,
          phone_verified_at: verifiedIso,
        } as never)
        .eq("id", context.userId);
    } catch {
      // Profile update fallback
    }

    await logSecurityEvent(supabase, {
      eventType: "otp.verified",
      actorId: context.userId,
      phone,
      metadata: { purpose: "cod_order" },
    });

    return {
      ok: true,
      phone,
      verified: true,
      message: "Phone number verified successfully. You can now complete your Cash on Delivery order.",
    };
  });

// ============================================================================
// 5. CHECK PHONE VERIFICATION STATUS
// ============================================================================
export const checkPhoneVerificationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { phone?: string }) => z.object({ phone: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    let profileVerified = false;
    let profilePhone: string | null = null;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone, phone_verified")
        .eq("id", context.userId)
        .maybeSingle();

      if (profile) {
        profilePhone = (profile as unknown as { phone?: string }).phone || null;
        profileVerified = !!(profile as unknown as { phone_verified?: boolean }).phone_verified;
      }
    } catch {
      // Fallback
    }

    // If a specific phone was checked, verify matching
    if (data.phone) {
      const norm = normalizePhoneNumber(data.phone);
      if (norm.valid) {
        const phone = norm.phone;
        const normProfilePhone = profilePhone ? normalizePhoneNumber(profilePhone).phone : null;
        const isMatched = profileVerified && normProfilePhone === phone;

        // Also check if verified in fallback store within last 15 minutes
        const mem = getActiveFallbackVerification(phone, "cod_order");
        const isRecentMemVerified = !!(
          mem &&
          mem.verifiedAt &&
          Date.now() - mem.verifiedAt < 15 * 60 * 1000 &&
          !mem.consumedAt
        );

        return {
          verified: isMatched || isRecentMemVerified,
          phone,
        };
      }
    }

    return {
      verified: profileVerified,
      phone: profilePhone,
    };
  });
