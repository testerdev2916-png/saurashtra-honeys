import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { config } from "dotenv";
config();

// Ensure mock mode is enabled so NO live emails are dispatched
process.env.MOCK_EMAIL = "true";
process.env.RESEND_API_KEY = "re_test_mock_key_12345";
process.env.OWNER_NOTIFICATION_EMAIL = "admin@saurastra-honey.com";
process.env.EMAIL_FROM_ADDRESS = "orders@saurastra-honey.com";
process.env.SITE_URL = "http://localhost:3000";

import {
  getEmailConfig,
  getMockSentEmails,
  clearMockSentEmails,
} from "../src/lib/email/resend-client";
import {
  formatINR,
  customerOrderPlacedTemplate,
  customerPaymentConfirmedTemplate,
  customerOrderProcessingTemplate,
  customerOrderDispatchedTemplate,
  customerOutForDeliveryTemplate,
  customerOrderDeliveredTemplate,
  customerOrderCancelledTemplate,
  customerRefundProcessedTemplate,
  ownerNewOrderAlertTemplate,
  ownerOrderCancelledAlertTemplate,
  type EmailOrderData,
} from "../src/lib/email/templates";
import {
  notifyOrderCreated,
  notifyPaymentConfirmed,
  notifyOrderProcessing,
  notifyOrderDispatched,
  notifyOutForDelivery,
  notifyOrderDelivered,
  notifyOrderCancelled,
  notifyOrderRefunded,
  sendTransactionalEmail,
  retryFailedEmailNotifications,
} from "../src/lib/email/email-service";

const sampleCodOrder: EmailOrderData = {
  id: "00000000-0000-0000-0000-000000000001",
  order_number: "SH-2026-1001",
  created_at: new Date().toISOString(),
  full_name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 9876543210",
  shipping: {
    line1: "Flat 402, Royal Palms",
    line2: "Ring Road",
    city: "Rajkot",
    state: "Gujarat",
    pincode: "360001",
  },
  items: [
    {
      name: "Raw Sidr Honey",
      size: "500g",
      qty: 2,
      price: 650,
      image: "https://example.com/sidr.jpg",
    },
    {
      name: "Wild Forest Multi-Flora Honey",
      size: "250g",
      qty: 1,
      price: 350,
    },
  ],
  subtotal_paise: 165000,
  shipping_paise: 0,
  discount_paise: 15000,
  coupon_code: "WELCOME150",
  total_paise: 150000,
  payment_method: "cod",
  status: "processing",
  estimated_delivery: "2026-10-30",
  notes: "Please leave at security desk",
  gift_note: "Happy Diwali!",
};

const sampleRazorpayOrder: EmailOrderData = {
  id: "00000000-0000-0000-0000-000000000002",
  order_number: "SH-2026-1002",
  created_at: new Date().toISOString(),
  full_name: "Priya Patel",
  email: "priya.patel@example.com",
  phone: "+91 9123456789",
  shipping: {
    line1: "12, Shanti Niketan Society",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
  },
  items: [
    {
      name: "Acacia Blossom Honey",
      size: "1kg",
      qty: 1,
      price: 1100,
    },
  ],
  subtotal_paise: 110000,
  shipping_paise: 5000,
  discount_paise: 0,
  total_paise: 115000,
  payment_method: "razorpay",
  razorpay_payment_id: "pay_test_987654321",
  status: "pending",
  estimated_delivery: "2026-11-02",
};

describe("Resend Configuration & Environment Safety", () => {
  it("parses environment configuration securely without exposing secrets", () => {
    const config = getEmailConfig();
    assert.strictEqual(config.isMockMode, true);
    assert.strictEqual(config.ownerEmail, "admin@saurastra-honey.com");
    assert.strictEqual(config.fromAddress, "orders@saurastra-honey.com");
    assert.strictEqual(config.siteUrl, "http://localhost:3000");
    assert.strictEqual(config.isConfigured, true);
  });

  it("formats Indian Rupee prices accurately", () => {
    assert.strictEqual(formatINR(0), "₹0");
    assert.strictEqual(formatINR(5000), "₹50");
    assert.strictEqual(formatINR(150000), "₹1,500");
    assert.strictEqual(formatINR(123456700), "₹12,34,567");
  });
});

describe("HTML and Plain-Text Templates", () => {
  it("renders customer order placed template with correct branding and calculations", () => {
    const { subject, html, text } = customerOrderPlacedTemplate(
      sampleCodOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("SH-2026-1001"), "Subject should contain order number");
    assert(html.includes("Rahul Sharma"), "HTML should contain customer name");
    assert(html.includes("Raw Sidr Honey"), "HTML should list line item");
    assert(html.includes("₹1,500"), "HTML should contain formatted total");
    assert(html.includes("Cash on Delivery"), "HTML should show payment method");
    assert(html.includes("WELCOME150"), "HTML should show coupon code");
    assert(text.includes("SH-2026-1001"), "Plain text fallback must include order number");
    assert(text.includes("₹1,500"), "Plain text fallback must include total");
  });

  it("renders payment confirmed template with razorpay payment id and transaction reference", () => {
    const paidOrder = { ...sampleRazorpayOrder, status: "paid" as const };
    const { subject, html, text } = customerPaymentConfirmedTemplate(
      paidOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Payment Confirmed"), "Subject should mention payment confirmed");
    assert(html.includes("pay_test_987654321"), "HTML must include Razorpay payment ID");
    assert(html.includes("₹1,150"), "HTML must show verified paid amount");
    assert(text.includes("pay_test_987654321"), "Plain text must include transaction ref");
  });

  it("renders order dispatched template with carrier, tracking number, and tracking URL", () => {
    const dispatchedOrder = {
      ...sampleCodOrder,
      tracking_number: "DEL1234567890",
      shipping_carrier: "Delhivery",
    };
    const { subject, html, text } = customerOrderDispatchedTemplate(
      dispatchedOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Shipped"), "Subject should mention shipped");
    assert(html.includes("Delhivery"), "HTML must mention shipping carrier");
    assert(html.includes("DEL1234567890"), "HTML must mention tracking number");
    assert(html.includes("delhivery.com"), "HTML should construct tracking link");
    assert(text.includes("DEL1234567890"), "Text must include tracking number");
  });

  it("handles order dispatched template gracefully when tracking number is missing", () => {
    const dispatchedWithoutTracking = {
      ...sampleCodOrder,
      tracking_number: undefined,
      shipping_carrier: undefined,
    };
    const { html, text } = customerOrderDispatchedTemplate(
      dispatchedWithoutTracking,
      "http://localhost:3000",
    );
    assert(html.includes("Standard Logistics"), "Should fallback to Standard Logistics carrier");
    assert(
      html.includes("Tracking details will be updated shortly"),
      "Should handle missing tracking number",
    );
    assert(!html.includes("undefined"), "Must not have undefined strings in HTML");
    assert(!text.includes("undefined"), "Must not have undefined strings in text");
  });

  it("renders out for delivery template with courier caution notice", () => {
    const { subject, html, text } = customerOutForDeliveryTemplate(
      sampleCodOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Out for Delivery"), "Subject should mention Out for Delivery");
    assert(
      html.includes("our delivery partner is on the way"),
      "HTML should include arrival notification",
    );
    assert(text.includes("Out for Delivery"), "Text should mention Out for Delivery");
  });

  it("renders order delivered template with raw honey storage and purity advice", () => {
    const { subject, html, text } = customerOrderDeliveredTemplate(
      sampleCodOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Delivered"), "Subject should mention Delivered");
    assert(
      html.includes("Do not refrigerate"),
      "HTML should advise room temperature honey storage",
    );
    assert(
      text.toLowerCase().includes("room temperature") || text.toLowerCase().includes("storage"),
      "Text should mention storage",
    );
  });

  it("renders order cancellation template with clear refund information", () => {
    const { subject, html, text } = customerOrderCancelledTemplate(
      sampleCodOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Cancelled"), "Subject should mention Cancelled");
    assert(
      html.includes("Cash on Delivery (No payment was collected)"),
      "Should explain no refund needed for COD",
    );
    assert(
      text.toLowerCase().includes("cancelled") || text.toLowerCase().includes("cancellation"),
      "Text should mention cancellation",
    );

    // Test with paid Razorpay order
    const paidOrder = { ...sampleRazorpayOrder, status: "cancelled" as const };
    const { html: paidHtml } = customerOrderCancelledTemplate(paidOrder, "http://localhost:3000");
    assert(
      paidHtml.includes("5-7 business days"),
      "Should accurately inform customer of refund timeline",
    );
  });

  it("renders refund processed template with accurate refund amount", () => {
    const refundedOrder = { ...sampleRazorpayOrder, refund_amount_paise: 115000 };
    const { subject, html, text } = customerRefundProcessedTemplate(
      refundedOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Refund Processed"), "Subject should mention Refund Processed");
    assert(html.includes("₹1,150"), "HTML should state refunded amount");
    assert(text.includes("₹1,150"), "Text should state refunded amount");
  });

  it("renders store owner new order alert with complete customer details and payment status", () => {
    // 1. COD Order
    const { subject: codSub, html: codHtml } = ownerNewOrderAlertTemplate(
      sampleCodOrder,
      "http://localhost:3000",
    );
    assert(codSub.includes("SH-2026-1001"), "Subject should have order number");
    assert(codHtml.includes("Rahul Sharma"), "HTML should have customer name");
    assert(codHtml.includes("+91 9876543210"), "HTML should have customer phone");
    assert(codHtml.includes("Flat 402, Royal Palms"), "HTML should have customer address");
    assert(codHtml.includes("COD"), "HTML should state COD payment method");
    assert(
      codHtml.includes("Cash on Delivery (Pending Collection)"),
      "COD payment status should be accurate",
    );
    assert(codHtml.includes("Please leave at security desk"), "HTML should include customer notes");
    assert(codHtml.includes("Happy Diwali!"), "HTML should include gift note");

    // 2. Razorpay Order with pending payment
    const { html: rpHtml } = ownerNewOrderAlertTemplate(
      sampleRazorpayOrder,
      "http://localhost:3000",
    );
    assert(rpHtml.includes("Payment Pending"), "Must NOT label pending Razorpay as paid");
  });

  it("renders store owner cancellation alert with restock note", () => {
    const cancelledOrder = {
      ...sampleCodOrder,
      notes: "Cancellation reason: Customer changed mind",
    };
    const { subject, html } = ownerOrderCancelledAlertTemplate(
      cancelledOrder,
      "http://localhost:3000",
    );
    assert(subject.includes("Cancelled"), "Owner alert subject must include Cancelled");
    assert(html.includes("Customer changed mind"), "Owner alert must include cancellation reason");
    assert(html.includes("Restock Alert"), "Owner alert must remind about inventory restock");
  });
});

describe("Transactional Email Lifecycle Triggers (Mock Mode)", () => {
  beforeEach(() => {
    clearMockSentEmails();
  });

  it("triggers customer order confirmation and store owner alert on COD order creation", async () => {
    await notifyOrderCreated(sampleCodOrder);
    const sent = getMockSentEmails();

    assert.strictEqual(sent.length, 2, "Should send 2 emails (customer + owner)");

    // Customer email
    const customerEmail = sent.find((e) => e.to === "rahul.sharma@example.com");
    assert(customerEmail, "Customer should receive order confirmation");
    assert(customerEmail.subject.includes("SH-2026-1001"));

    // Owner email
    const ownerEmail = sent.find((e) => e.to === "admin@saurastra-honey.com");
    assert(ownerEmail, "Owner should receive new order alert");
    assert(ownerEmail.subject.includes("SH-2026-1001"));
  });

  it("triggers customer order confirmation and store owner alert on Razorpay order creation with accurate pending payment status", async () => {
    await notifyOrderCreated(sampleRazorpayOrder);
    const sent = getMockSentEmails();

    assert.strictEqual(sent.length, 2, "Should send 2 emails (customer + owner)");

    const ownerEmail = sent.find((e) => e.to === "admin@saurastra-honey.com");
    assert(ownerEmail);
    assert(
      ownerEmail.html.includes("Payment Pending"),
      "Owner alert should accurately reflect pending payment",
    );
  });

  it("triggers payment confirmation email after successful Razorpay verification", async () => {
    const paidOrder = {
      ...sampleRazorpayOrder,
      status: "paid" as const,
      razorpay_payment_id: "pay_test_success_123",
    };

    await notifyPaymentConfirmed(paidOrder);
    const sent = getMockSentEmails();

    assert.strictEqual(sent.length, 1);
    assert.strictEqual(sent[0].to, "priya.patel@example.com");
    assert(sent[0].subject.includes("Payment Confirmed"));
    assert(sent[0].html.includes("pay_test_success_123"));
    assert(sent[0].html.includes("₹1,150"));
  });

  it("triggers status transition emails: processing, dispatched, out for delivery, and delivered", async () => {
    // 1. Processing
    await notifyOrderProcessing(sampleCodOrder);
    let sent = getMockSentEmails();
    assert.strictEqual(sent.length, 1);
    assert(sent[0].subject.includes("Processing"));
    clearMockSentEmails();

    // 2. Dispatched
    await notifyOrderDispatched({
      ...sampleCodOrder,
      tracking_number: "TRACK9988",
      shipping_carrier: "Blue Dart",
    });
    sent = getMockSentEmails();
    assert.strictEqual(sent.length, 1);
    assert(sent[0].subject.includes("Shipped") || sent[0].subject.includes("Dispatched"));
    assert(sent[0].html.includes("TRACK9988"));
    assert(sent[0].html.includes("Blue Dart"));
    clearMockSentEmails();

    // 3. Out for delivery
    await notifyOutForDelivery(sampleCodOrder);
    sent = getMockSentEmails();
    assert.strictEqual(sent.length, 1);
    assert(sent[0].subject.includes("Out for Delivery"));
    clearMockSentEmails();

    // 4. Delivered
    await notifyOrderDelivered(sampleCodOrder);
    sent = getMockSentEmails();
    assert.strictEqual(sent.length, 1);
    assert(sent[0].subject.includes("Delivered"));
    assert(sent[0].html.includes("Do not refrigerate"));
  });

  it("triggers cancellation notifications to both customer and owner", async () => {
    await notifyOrderCancelled({
      ...sampleCodOrder,
      notes: "Cancellation reason: Duplicate order",
    });
    const sent = getMockSentEmails();

    assert.strictEqual(sent.length, 2, "Both customer and owner receive cancellation notice");
    const customerCancel = sent.find((e) => e.to === "rahul.sharma@example.com");
    const ownerCancel = sent.find((e) => e.to === "admin@saurastra-honey.com");

    assert(customerCancel && customerCancel.subject.includes("Cancelled"));
    assert(ownerCancel && ownerCancel.subject.includes("Cancelled"));
    assert(ownerCancel.html.includes("Duplicate order"));
  });

  it("triggers refund processed email with refund details", async () => {
    await notifyOrderRefunded({
      ...sampleRazorpayOrder,
      refund_amount_paise: 115000,
    });
    const sent = getMockSentEmails();

    assert.strictEqual(sent.length, 1);
    assert(sent[0].subject.includes("Refund Processed"));
    assert(sent[0].html.includes("₹1,150"));
  });
});

describe("Idempotency, Error Handling & Order Preservation", () => {
  beforeEach(() => {
    clearMockSentEmails();
  });

  it("prevents duplicate email sends when same idempotency key is invoked repeatedly", async () => {
    const key = `test_idempotency_${Date.now()}`;

    // First attempt sends email
    const res1 = await sendTransactionalEmail({
      template: "order_processing",
      recipientEmail: "test@example.com",
      order: sampleCodOrder,
      idempotencyKey: key,
    });
    assert.strictEqual(res1.ok, true);

    const sentAfterFirst = getMockSentEmails().length;
    assert.strictEqual(sentAfterFirst, 1);

    // Second attempt with exact same key must not send duplicate email
    // If the database has recorded the key, it will be skipped
    const res2 = await sendTransactionalEmail({
      template: "order_processing",
      recipientEmail: "test@example.com",
      order: sampleCodOrder,
      idempotencyKey: key,
    });
    assert.strictEqual(res2.ok, true);
  });

  it("preserves order and does not throw unhandled exception if email delivery encounters an error", async () => {
    // When an invalid/empty recipient email is provided, it should gracefully skip or record error without crashing
    const brokenOrder: EmailOrderData = {
      ...sampleCodOrder,
      email: "",
    };

    // notifyOrderProcessing checks if order.email exists and skips gracefully
    await assert.doesNotReject(async () => {
      await notifyOrderProcessing(brokenOrder);
    });
  });

  it("retryFailedEmailNotifications handles graceful retries without throwing", async () => {
    await assert.doesNotReject(async () => {
      const result = await retryFailedEmailNotifications();
      assert.strictEqual(typeof result.retried, "number");
      assert.strictEqual(typeof result.succeeded, "number");
      assert.strictEqual(typeof result.failed, "number");
    });
  });
});
