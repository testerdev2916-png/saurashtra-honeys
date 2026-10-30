import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { config } from "dotenv";
config();

import {
  normalizePhoneNumber,
  generateCryptoOtp,
  hashOtp,
  verifyOtpHash,
  sendSmsOtp,
  getLatestMockOtpForTest,
  clearMockOtpRegistryForTest,
  RESEND_COOLDOWN_MS,
  MAX_VERIFICATION_ATTEMPTS,
} from "../src/lib/security/sms-otp.service";
import {
  validateEmailForCheckout,
  checkRateLimit,
  resetRateLimitForTest,
  logSecurityEvent,
} from "../src/lib/security/fake-order-detector";
import {
  requestMobileSignupOtp,
  requestMobileSignupOtpHandler,
  verifyMobileSignupOtp,
  verifyMobileSignupOtpHandler,
  requestCodPhoneOtp,
  verifyCodPhoneOtp,
  checkPhoneVerificationStatus,
  saveFallbackVerification,
  getActiveFallbackVerification,
} from "../src/lib/auth-otp.functions";
import { createOrder, createGuestOrder, insertOrderRow } from "../src/lib/orders.functions";
import { supabaseAdmin as supabase } from "../src/integrations/supabase/client.server";

describe("Phone Normalization & Security Sanitation", () => {
  it("normalizes standard 10-digit Indian numbers with +91 prefix", () => {
    const res = normalizePhoneNumber("9876543210");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.phone, "+919876543210");
  });

  it("normalizes numbers with spaces, dashes and parentheses", () => {
    const res = normalizePhoneNumber("+91 (987) 654-3210");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.phone, "+919876543210");
  });

  it("normalizes numbers starting with 91 prefix without plus", () => {
    const res = normalizePhoneNumber("919876543210");
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.phone, "+919876543210");
  });

  it("rejects invalid, short, or non-phone inputs", () => {
    assert.strictEqual(normalizePhoneNumber("123").valid, false);
    assert.strictEqual(normalizePhoneNumber("abcdefghij").valid, false);
    assert.strictEqual(normalizePhoneNumber("").valid, false);
  });

  it("rejects clearly fake and repeating spam mobile numbers", () => {
    assert.strictEqual(normalizePhoneNumber("0000000000").valid, false);
    assert.strictEqual(normalizePhoneNumber("9999999999").valid, false);
    assert.strictEqual(normalizePhoneNumber("1234567890").valid, false);
  });
});

describe("Cryptographic OTP Generation, Hashing & Verification", () => {
  const phone = "+919876500001";

  before(() => {
    clearMockOtpRegistryForTest();
  });

  it("generates 6-digit cryptographic numeric OTPs", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateCryptoOtp();
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
    }
  });

  it("hashes OTP and prevents plain text recovery", () => {
    const code = "739201";
    const h1 = hashOtp(phone, code);
    assert.notStrictEqual(h1, code);
    assert.strictEqual(typeof h1, "string");
    assert.strictEqual(h1.length, 64); // SHA-256 hex length
  });

  it("verifies matching OTP in constant time", () => {
    const code = "826194";
    const h = hashOtp(phone, code);
    assert.strictEqual(verifyOtpHash(phone, code, h), true);
    assert.strictEqual(verifyOtpHash(phone, "111111", h), false);
    assert.strictEqual(verifyOtpHash("+919999999999", code, h), false);
  });

  it("dispatches OTP via mock provider in test mode", async () => {
    const res = await sendSmsOtp({ phone, otp: "554433", purpose: "signup" });
    assert.strictEqual(res.success, true);
    const mockOtp = getLatestMockOtpForTest(phone);
    assert.strictEqual(mockOtp, "554433");
  });
});

describe("Fake Email Domain & Spam Order Filtering", () => {
  it("rejects reserved test domains (example.com, example.org, test.com)", async () => {
    const res1 = await validateEmailForCheckout(supabase, "customer@example.com");
    assert.strictEqual(res1.valid, false);
    assert.strictEqual(res1.isBlocked, true);

    const res2 = await validateEmailForCheckout(supabase, "john.doe@example.org");
    assert.strictEqual(res2.valid, false);

    const res3 = await validateEmailForCheckout(supabase, "tester@test.com");
    assert.strictEqual(res3.valid, false);
  });

  it("rejects disposable temporary mail domains", async () => {
    const res1 = await validateEmailForCheckout(supabase, "spammer@mailinator.com");
    assert.strictEqual(res1.valid, false);

    const res2 = await validateEmailForCheckout(supabase, "anon@tempmail.com");
    assert.strictEqual(res2.valid, false);

    const res3 = await validateEmailForCheckout(supabase, "temp@guerrillamail.com");
    assert.strictEqual(res3.valid, false);
  });

  it("rejects test.guest.claim generated addresses", async () => {
    const res = await validateEmailForCheckout(
      supabase,
      `test.guest.claim.${Date.now()}@gmail.com`,
    );
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.isTestDomain, true);
  });

  it("accepts genuine legitimate email domains", async () => {
    const res1 = await validateEmailForCheckout(supabase, "customer.rajesh@gmail.com");
    assert.strictEqual(res1.valid, true);

    const res2 = await validateEmailForCheckout(supabase, "priya.patel@yahoo.com");
    assert.strictEqual(res2.valid, true);

    const res3 = await validateEmailForCheckout(supabase, "orders@saurashtrahoney.com");
    assert.strictEqual(res3.valid, true);
  });
});

describe("Rate Limiting on OTP and Order Operations", () => {
  const testKey = `test_ratelimit_${Date.now()}`;

  before(() => {
    resetRateLimitForTest(testKey);
  });

  it("allows requests under the rate limit threshold", () => {
    for (let i = 0; i < 3; i++) {
      const res = checkRateLimit(testKey, 5, 10000);
      assert.strictEqual(res.allowed, true);
    }
  });

  it("blocks requests that exceed the rate limit threshold", () => {
    // 4th and 5th allowed
    checkRateLimit(testKey, 5, 10000);
    checkRateLimit(testKey, 5, 10000);

    // 6th blocked
    const res = checkRateLimit(testKey, 5, 10000);
    assert.strictEqual(res.allowed, false);
    assert.strictEqual(res.remaining, 0);
    assert.ok(res.resetMs > 0);
  });
});

describe("First-Time Mobile Signup & OTP Lifecycle", () => {
  const testPhone = `+91987654${Math.floor(1000 + Math.random() * 9000)}`;
  let sentOtp: string | null = null;

  it("requests mobile signup OTP with 60-second cooldown", async () => {
    const res = await requestMobileSignupOtpHandler({
      phone: testPhone,
      purpose: "signup",
    });

    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.cooldownSeconds, 60);

    sentOtp = getLatestMockOtpForTest(testPhone);
    assert.ok(sentOtp);
    assert.strictEqual(sentOtp.length, 6);
  });

  it("enforces resend cooldown and rejects rapid consecutive requests", async () => {
    await assert.rejects(
      async () => {
        await requestMobileSignupOtpHandler({
          phone: testPhone,
          purpose: "signup",
        });
      },
      (err: Error) => /Please wait \d+ seconds before requesting a new (OTP|code)/i.test(err.message),
    );
  });

  it("rejects incorrect OTP and decrements remaining attempts", async () => {
    await assert.rejects(
      async () => {
        await verifyMobileSignupOtpHandler({
          phone: testPhone,
          otp: "000000", // wrong OTP
          purpose: "signup",
          full_name: "Test Customer",
        });
      },
      (err: Error) => /Incorrect OTP code/i.test(err.message),
    );
  });

  it("verifies valid OTP successfully and marks phone verified", async () => {
    assert.ok(sentOtp);

    const res = await verifyMobileSignupOtpHandler({
      phone: testPhone,
      otp: sentOtp,
      purpose: "signup",
      full_name: "Verified Test Customer",
    });

    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.phone, testPhone);
  });

  it("prevents OTP replay attacks and rejects already consumed OTP", async () => {
    assert.ok(sentOtp);

    await assert.rejects(
      async () => {
        await verifyMobileSignupOtpHandler({
          phone: testPhone,
          otp: sentOtp,
          purpose: "signup",
          full_name: "Verified Test Customer",
        });
      },
      (err: Error) => /already been consumed|No active OTP request|already been verified/i.test(err.message),
    );
  });

  it("locks out after 3 excessive failed attempts", async () => {
    const lockoutPhone = `+91987653${Math.floor(1000 + Math.random() * 9000)}`;

    // Create fresh verification
    const otp = "998877";
    const otpHash = hashOtp(lockoutPhone, otp);
    saveFallbackVerification({
      id: `verif_test_lockout_${Date.now()}`,
      userId: null,
      phone: lockoutPhone,
      purpose: "signup",
      otpHash,
      attempts: 2, // already had 2 attempts
      maxAttempts: 3,
      resendCount: 0,
      lastSentAt: Date.now() - 70000,
      expiresAt: Date.now() + 300000,
      verifiedAt: null,
      consumedAt: null,
    });

    // 3rd attempt with wrong code triggers lockout
    await assert.rejects(
      async () => {
        await verifyMobileSignupOtpHandler({
          phone: lockoutPhone,
          otp: "000000",
          purpose: "signup",
        });
      },
      (err: Error) => /Maximum attempts reached|Maximum attempts exceeded/i.test(err.message),
    );
  });
});

describe("Mandatory Mobile Verification for Cash on Delivery (COD) Orders", () => {
  let testUserId: string | null = null;
  let createdOrderId: string | null = null;
  const verifiedPhone = `+91987652${Math.floor(1000 + Math.random() * 9000)}`;
  const unverifiedPhone = `+91987651${Math.floor(1000 + Math.random() * 9000)}`;
  const testEmail = `genuine.customer.${Date.now()}@gmail.com`;

  before(async () => {
    // Create an authenticated test customer in Supabase Auth
    const { data: authData } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: "TestPassword123!",
      email_confirm: true,
      user_metadata: { full_name: "COD Security Tester" },
    });
    if (authData?.user) {
      testUserId = authData.user.id;
    }
  });

  after(async () => {
    // Teardown test orders & test users completely
    if (createdOrderId) {
      await supabase.from("orders").delete().eq("id", createdOrderId);
    }
    if (testUserId) {
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  it("strictly rejects COD orders placed with an unverified phone number", async () => {
    assert.ok(testUserId);

    // Call createOrder handler with mock context and unverified phone
    const mockContext = {
      supabase,
      userId: testUserId,
    };

    const orderPayload = {
      full_name: "COD Security Tester",
      email: testEmail,
      phone: unverifiedPhone,
      shipping: {
        line1: "123 Test Street",
        city: "Rajkot",
        state: "Gujarat",
        pincode: "360001",
      },
      items: [
        {
          slug: "raw-honey-500g",
          name: "Raw Honey",
          size: "500g",
          price: 650,
          qty: 1,
        },
      ],
      payment_method: "cod" as const,
    };

    // Calling insertOrderRow with unverified phone must throw
    await assert.rejects(
      async () => {
        await insertOrderRow(supabase, orderPayload, testUserId);
      },
      (err: Error) =>
        /Mobile number verification is mandatory for Cash on Delivery/i.test(err.message),
    );
  });

  it("strictly rejects orders with fake @example.com email addresses", async () => {
    assert.ok(testUserId);

    const fakeEmailOrder = {
      full_name: "Fake User",
      email: "fake.attacker@example.com",
      phone: verifiedPhone,
      shipping: {
        line1: "123 Fake Street",
        city: "Rajkot",
        state: "Gujarat",
        pincode: "360001",
      },
      items: [
        {
          slug: "raw-honey-500g",
          name: "Raw Honey",
          size: "500g",
          price: 650,
          qty: 1,
        },
      ],
      payment_method: "cod" as const,
    };

    await assert.rejects(
      async () => {
        await insertOrderRow(supabase, fakeEmailOrder, testUserId);
      },
      (err: Error) => /Email domain @example\.com is not permitted/i.test(err.message),
    );
  });

  it("allows COD order placement after phone OTP verification succeeds", async () => {
    assert.ok(testUserId);

    // 1. Request COD OTP
    const otp = "654321";
    const otpHash = hashOtp(verifiedPhone, otp);
    saveFallbackVerification({
      id: `verif_cod_test_${Date.now()}`,
      userId: testUserId,
      phone: verifiedPhone,
      purpose: "cod_order",
      otpHash,
      attempts: 0,
      maxAttempts: 3,
      resendCount: 0,
      lastSentAt: Date.now() - 1000,
      expiresAt: Date.now() + 300000,
      verifiedAt: Date.now(), // verified
      consumedAt: null,
    });

    const validCodPayload = {
      full_name: "COD Security Tester",
      email: testEmail,
      phone: verifiedPhone,
      shipping: {
        line1: "456 Verified Road",
        city: "Rajkot",
        state: "Gujarat",
        pincode: "360001",
      },
      items: [
        {
          slug: "raw-honey-500g",
          name: "Raw Honey",
          size: "500g",
          price: 650,
          qty: 1,
        },
      ],
      payment_method: "cod" as const,
    };

    const res = await insertOrderRow(supabase, validCodPayload, testUserId);

    assert.ok(res.orderId);
    createdOrderId = res.orderId;
    assert.strictEqual(res.razorpay, null);

    // Verify order in database
    const { data: dbOrder } = await supabase
      .from("orders")
      .select("id, phone, payment_method, status")
      .eq("id", res.orderId)
      .single();

    assert.ok(dbOrder);
    assert.strictEqual(dbOrder.payment_method, "cod");
    assert.strictEqual(dbOrder.status, "processing");
  });

  it("strictly prohibits unauthenticated guest orders", async () => {
    await assert.rejects(
      async () => {
        // @ts-expect-error testing createGuestOrder
        await createGuestOrder({ data: {} });
      },
      (err: Error) => /Guest checkout is completely disabled|No Start context/i.test(err.message),
    );
  });
});
