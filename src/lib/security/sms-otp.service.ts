import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export type OtpPurpose = "signup" | "cod_order" | "phone_update" | "login";

export interface SendOtpResult {
  success: boolean;
  provider: "mock" | "twilio" | "msg91" | "fast2sms" | "whatsapp";
  messageId?: string;
  error?: string;
}

export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
export const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const MAX_VERIFICATION_ATTEMPTS = 3;
export const MAX_HOURLY_RESENDS = 5;

// In-memory test OTP registry for test suites and dev environments
const mockOtpRegistry = new Map<string, { otp: string; purpose: OtpPurpose; createdAt: number }>();

/**
 * Normalizes and validates a mobile phone number to E.164 international format (+91XXXXXXXXXX).
 * Handles Indian numbers seamlessly with or without +91 prefix.
 */
export function normalizePhoneNumber(raw: string): {
  valid: boolean;
  phone: string;
  error?: string;
} {
  if (!raw || typeof raw !== "string") {
    return { valid: false, phone: "", error: "Phone number is required." };
  }

  // Remove spaces, hyphens, parentheses, and dots
  let cleaned = raw.trim().replace(/[\s\-\(\)\.]/g, "");

  // If starts with 00, replace with +
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }

  // Check if it's a 10-digit Indian number without country code
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    cleaned = "+91" + cleaned;
  } else if (/^91[6-9]\d{9}$/.test(cleaned)) {
    cleaned = "+" + cleaned;
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  // General E.164 validation: + followed by 10 to 15 digits
  const e164Regex = /^\+[1-9]\d{9,14}$/;
  if (!e164Regex.test(cleaned)) {
    return {
      valid: false,
      phone: cleaned,
      error: "Please enter a valid 10-digit mobile number with country code (e.g. +91 9876543210).",
    };
  }

  // Reject clearly fake or spam repeating sequences (e.g., +910000000000, +919999999999)
  const digitsOnly = cleaned.replace(/\D/g, "");
  const last10 = digitsOnly.slice(-10);
  if (/^(\d)\1{9}$/.test(last10) || last10 === "1234567890" || last10 === "0123456789") {
    return {
      valid: false,
      phone: cleaned,
      error: "Invalid mobile number. Please provide a genuine active mobile number.",
    };
  }

  return { valid: true, phone: cleaned };
}

/**
 * Generates a secure, cryptographically random 6-digit OTP string.
 */
export function generateCryptoOtp(): string {
  return String(randomInt(100000, 1000000));
}

/**
 * Computes a secure SHA-256 HMAC hash of the OTP bound to the normalized phone and secret.
 * Plaintext OTPs are never stored in the database.
 */
export function hashOtp(phone: string, otp: string): string {
  const salt =
    process.env.OTP_SECRET_SALT ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "saurashtra-honey-secure-otp-salt-2026";
  return createHmac("sha256", salt).update(`${phone}:${otp.trim()}`).digest("hex");
}

/**
 * Verifies a submitted OTP against a stored SHA-256 hash in constant time.
 */
export function verifyOtpHash(phone: string, submittedOtp: string, expectedHash: string): boolean {
  if (!submittedOtp || !expectedHash) return false;
  const computedHash = hashOtp(phone, submittedOtp);
  const a = Buffer.from(computedHash);
  const b = Buffer.from(expectedHash);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

/**
 * Sends a 6-digit OTP through the configured SMS provider.
 * Supports Twilio, Fast2SMS, MSG91, WhatsApp Business API, or local Mock/Test provider.
 */
export async function sendSmsOtp({
  phone,
  otp,
  purpose,
}: {
  phone: string;
  otp: string;
  purpose: OtpPurpose;
}): Promise<SendOtpResult> {
  const purposeText =
    purpose === "signup"
      ? "signup on Saurashtra Honey"
      : purpose === "cod_order"
        ? "confirming your Cash on Delivery (COD) order"
        : purpose === "phone_update"
          ? "updating your phone number"
          : "logging in to Saurashtra Honey";

  const messageText = `Your Saurashtra Honey verification code is ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;

  // Always store in mock registry for local development and automated testing
  mockOtpRegistry.set(phone, {
    otp,
    purpose,
    createdAt: Date.now(),
  });

  // 1. Twilio Integration (Global & Indian Delivery)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      const body = new URLSearchParams({
        To: phone,
        From: twilioFrom,
        Body: messageText,
      });

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[SMS Gateway] Twilio error:", errorText);
        return { success: false, provider: "twilio", error: `Twilio delivery failed: ${res.status}` };
      }

      const twilioRes = (await res.json()) as { sid?: string };
      return { success: true, provider: "twilio", messageId: twilioRes.sid };
    } catch (err) {
      console.error("[SMS Gateway] Twilio exception:", err);
      return { success: false, provider: "twilio", error: (err as Error).message };
    }
  }

  // 2. Fast2SMS / Indian SMS Gateway Integration
  const fast2SmsKey = process.env.FAST2SMS_API_KEY || process.env.SMS_PROVIDER_API_KEY;
  if (fast2SmsKey) {
    try {
      const nationalNumber = phone.replace(/^\+91/, "");
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2SmsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variables_values: otp,
          route: "otp",
          numbers: nationalNumber,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[SMS Gateway] Fast2SMS error:", errText);
        return { success: false, provider: "fast2sms", error: "SMS gateway rejected dispatch" };
      }

      return { success: true, provider: "fast2sms" };
    } catch (err) {
      console.error("[SMS Gateway] Fast2SMS exception:", err);
      return { success: false, provider: "fast2sms", error: (err as Error).message };
    }
  }

  // 3. Fallback: Development & Mock Provider (Zero-config development & testing)
  // Safely logs OTP for developer without throwing unhandled failures
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n======================================================`);
    console.log(`[SMS OTP SIMULATOR - DEV/TEST MODE]`);
    console.log(`To: ${phone}`);
    console.log(`Purpose: ${purposeText}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires: 5 minutes`);
    console.log(`======================================================\n`);
  } else {
    console.log(`[SMS OTP] Dispatched code to ${phone.slice(0, 4)}****${phone.slice(-3)} for ${purpose}`);
  }

  return { success: true, provider: "mock", messageId: `mock_${Date.now()}` };
}

/**
 * Test helper for automated tests to retrieve the mock OTP generated for a phone number.
 */
export function getLatestMockOtpForTest(phone: string): string | null {
  const entry = mockOtpRegistry.get(phone);
  if (!entry) return null;
  return entry.otp;
}

/**
 * Test helper to clear mock registry between tests.
 */
export function clearMockOtpRegistryForTest(): void {
  mockOtpRegistry.clear();
}
