import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import { getEmailConfig, getResendClient, recordMockSentEmail } from "./resend-client";
import {
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
  type RenderedEmail,
} from "./templates";

export type EmailTemplateName =
  | "order_placed"
  | "payment_confirmed"
  | "order_processing"
  | "order_dispatched"
  | "out_for_delivery"
  | "order_delivered"
  | "order_cancelled"
  | "order_refunded"
  | "owner_new_order_alert"
  | "owner_order_cancelled_alert";

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  skipped?: boolean;
  reason?: string;
  error?: string;
  mock?: boolean;
}

function renderTemplate(
  template: EmailTemplateName,
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  switch (template) {
    case "order_placed":
      return customerOrderPlacedTemplate(order, siteUrl);
    case "payment_confirmed":
      return customerPaymentConfirmedTemplate(order, siteUrl);
    case "order_processing":
      return customerOrderProcessingTemplate(order, siteUrl);
    case "order_dispatched":
      return customerOrderDispatchedTemplate(order, siteUrl);
    case "out_for_delivery":
      return customerOutForDeliveryTemplate(order, siteUrl);
    case "order_delivered":
      return customerOrderDeliveredTemplate(order, siteUrl);
    case "order_cancelled":
      return customerOrderCancelledTemplate(order, siteUrl);
    case "order_refunded":
      return customerRefundProcessedTemplate(order, siteUrl);
    case "owner_new_order_alert":
      return ownerNewOrderAlertTemplate(order, siteUrl);
    case "owner_order_cancelled_alert":
      return ownerOrderCancelledAlertTemplate(order, siteUrl);
    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}

/**
 * Send a transactional email with Resend, enforcing idempotency and recording
 * delivery status in the database.
 */
export async function sendTransactionalEmail({
  template,
  recipientEmail,
  recipientName,
  order,
  idempotencyKey,
}: {
  template: EmailTemplateName;
  recipientEmail: string;
  recipientName?: string;
  order: EmailOrderData;
  idempotencyKey: string;
}): Promise<SendEmailResult> {
  const config = getEmailConfig();
  const normalizedEmail = recipientEmail.trim().toLowerCase();

  // 1. Idempotency Check: prevent duplicate notifications
  try {
    const { data: existing } = await supabase
      .from("email_notifications" as unknown as "orders")
      .select("id, status")
      .eq("idempotency_key" as never, idempotencyKey as never)
      .maybeSingle();

    if (existing && (existing as unknown as { status: string }).status === "sent") {
      console.log(`[Email] Skipping duplicate notification for key: ${idempotencyKey}`);
      return { ok: true, skipped: true, reason: "Notification already sent" };
    }
  } catch {
    // Database table might not be migrated yet; fallback gracefully
  }

  // 2. Render HTML & Plain-Text
  const { subject, html, text } = renderTemplate(template, order, config.siteUrl);

  // 3. Mock/Test Mode Check
  if (config.isMockMode) {
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    recordMockSentEmail({
      from: config.fromAddress,
      to: normalizedEmail,
      subject,
      html,
      text,
      idempotencyKey,
      template,
      timestamp: new Date().toISOString(),
    });

    console.log(`[Email Mock] ${template} -> ${normalizedEmail} (${subject})`);

    try {
      await supabase.from("email_notifications" as unknown as "orders").upsert(
        {
          order_id: order.id,
          recipient_email: normalizedEmail,
          recipient_name: recipientName || order.full_name || null,
          template,
          subject,
          status: "sent",
          idempotency_key: idempotencyKey,
          resend_id: mockId,
          attempts: 1,
          sent_at: new Date().toISOString(),
          metadata: {
            mock: true,
            order_number: order.order_number,
          },
        } as never,
        { onConflict: "idempotency_key" as never },
      );
    } catch {
      // ignore
    }

    return { ok: true, id: mockId, mock: true };
  }

  // 4. Check if Resend credentials are configured
  if (!config.isConfigured || !config.apiKey) {
    const errMsg = "Resend API key (RESEND_API_KEY) is not configured.";
    console.warn(`[Email] ${errMsg}. Recording notification as pending.`);

    try {
      await supabase.from("email_notifications" as unknown as "orders").upsert(
        {
          order_id: order.id,
          recipient_email: normalizedEmail,
          recipient_name: recipientName || order.full_name || null,
          template,
          subject,
          status: "pending",
          idempotency_key: idempotencyKey,
          attempts: 0,
          last_error: errMsg,
          metadata: {
            order_number: order.order_number,
          },
        } as never,
        { onConflict: "idempotency_key" as never },
      );
    } catch {
      // ignore
    }

    return { ok: false, error: errMsg };
  }

  // 5. Live Transmission via Resend SDK
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "Failed to initialize Resend client." };
  }

  try {
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: config.fromAddress,
      to: normalizedEmail,
      subject,
      html,
      text,
      tags: [
        { name: "order_id", value: order.id },
        { name: "template", value: template },
      ],
    });

    if (resendError) {
      const isRateLimit =
        resendError.name === "rate_limit_exceeded" ||
        resendError.message?.toLowerCase().includes("rate limit") ||
        resendError.message?.toLowerCase().includes("too many requests");

      const status = isRateLimit ? "rate_limited" : "failed";
      console.error(`[Email Error] Failed to send ${template} to ${normalizedEmail}:`, resendError);

      try {
        await supabase.from("email_notifications" as unknown as "orders").upsert(
          {
            order_id: order.id,
            recipient_email: normalizedEmail,
            recipient_name: recipientName || order.full_name || null,
            template,
            subject,
            status,
            idempotency_key: idempotencyKey,
            attempts: 1,
            last_error: resendError.message,
            metadata: {
              error_details: resendError,
              order_number: order.order_number,
            },
          } as never,
          { onConflict: "idempotency_key" as never },
        );
      } catch {
        // ignore
      }

      return { ok: false, error: resendError.message };
    }

    const resendId = resendData?.id;
    console.log(`[Email Sent] ${template} -> ${normalizedEmail} (ID: ${resendId})`);

    try {
      await supabase.from("email_notifications" as unknown as "orders").upsert(
        {
          order_id: order.id,
          recipient_email: normalizedEmail,
          recipient_name: recipientName || order.full_name || null,
          template,
          subject,
          status: "sent",
          idempotency_key: idempotencyKey,
          resend_id: resendId,
          attempts: 1,
          sent_at: new Date().toISOString(),
          metadata: {
            order_number: order.order_number,
          },
        } as never,
        { onConflict: "idempotency_key" as never },
      );
    } catch {
      // ignore
    }

    return { ok: true, id: resendId };
  } catch (err) {
    const errorMsg = (err as Error).message || "Unknown email transport error";
    console.error(`[Email Exception] ${errorMsg}`);

    try {
      await supabase.from("email_notifications" as unknown as "orders").upsert(
        {
          order_id: order.id,
          recipient_email: normalizedEmail,
          recipient_name: recipientName || order.full_name || null,
          template,
          subject,
          status: "failed",
          idempotency_key: idempotencyKey,
          attempts: 1,
          last_error: errorMsg,
        } as never,
        { onConflict: "idempotency_key" as never },
      );
    } catch {
      // ignore
    }

    return { ok: false, error: errorMsg };
  }
}

// ----------------------------------------------------------------------------
// High-Level Notification Triggers
// ----------------------------------------------------------------------------

/**
 * Triggered immediately when a new order is placed (both COD and Razorpay).
 * Sends:
 * 1) Customer Order Confirmation Email
 * 2) Store Owner New Order Alert
 */
export async function notifyOrderCreated(order: EmailOrderData): Promise<void> {
  const config = getEmailConfig();

  // 1. Customer Email
  if (order.email) {
    await sendTransactionalEmail({
      template: "order_placed",
      recipientEmail: order.email,
      recipientName: order.full_name || undefined,
      order,
      idempotencyKey: `order_${order.id}_placed`,
    });
  }

  // 2. Store Owner Alert
  if (config.ownerEmail) {
    await sendTransactionalEmail({
      template: "owner_new_order_alert",
      recipientEmail: config.ownerEmail,
      recipientName: "Saurashtra Honey Admin",
      order,
      idempotencyKey: `order_${order.id}_owner_alert`,
    });
  }
}

/**
 * Triggered when Razorpay payment is verified and confirmed.
 */
export async function notifyPaymentConfirmed(order: EmailOrderData): Promise<void> {
  if (!order.email) return;
  await sendTransactionalEmail({
    template: "payment_confirmed",
    recipientEmail: order.email,
    recipientName: order.full_name || undefined,
    order,
    idempotencyKey: `order_${order.id}_payment_confirmed`,
  });
}

/**
 * Triggered when an order transitions to "processing" status.
 */
export async function notifyOrderProcessing(order: EmailOrderData): Promise<void> {
  if (!order.email) return;
  await sendTransactionalEmail({
    template: "order_processing",
    recipientEmail: order.email,
    recipientName: order.full_name || undefined,
    order,
    idempotencyKey: `order_${order.id}_processing`,
  });
}

/**
 * Triggered when an order transitions to "shipped" status.
 */
export async function notifyOrderDispatched(order: EmailOrderData): Promise<void> {
  if (!order.email) return;
  await sendTransactionalEmail({
    template: "order_dispatched",
    recipientEmail: order.email,
    recipientName: order.full_name || undefined,
    order,
    idempotencyKey: `order_${order.id}_dispatched`,
  });
}

/**
 * Triggered when an order is marked out for delivery.
 */
export async function notifyOutForDelivery(order: EmailOrderData): Promise<void> {
  if (!order.email) return;
  await sendTransactionalEmail({
    template: "out_for_delivery",
    recipientEmail: order.email,
    recipientName: order.full_name || undefined,
    order,
    idempotencyKey: `order_${order.id}_out_for_delivery`,
  });
}

/**
 * Triggered when an order transitions to "delivered" status.
 */
export async function notifyOrderDelivered(order: EmailOrderData): Promise<void> {
  if (!order.email) return;
  await sendTransactionalEmail({
    template: "order_delivered",
    recipientEmail: order.email,
    recipientName: order.full_name || undefined,
    order,
    idempotencyKey: `order_${order.id}_delivered`,
  });
}

/**
 * Triggered when an order is cancelled (by customer or staff).
 * Sends:
 * 1) Customer Order Cancellation Email
 * 2) Store Owner Cancellation Alert
 */
export async function notifyOrderCancelled(order: EmailOrderData): Promise<void> {
  const config = getEmailConfig();

  // 1. Customer cancellation email
  if (order.email) {
    await sendTransactionalEmail({
      template: "order_cancelled",
      recipientEmail: order.email,
      recipientName: order.full_name || undefined,
      order,
      idempotencyKey: `order_${order.id}_cancelled`,
    });
  }

  // 2. Owner cancellation alert
  if (config.ownerEmail) {
    await sendTransactionalEmail({
      template: "owner_order_cancelled_alert",
      recipientEmail: config.ownerEmail,
      recipientName: "Saurashtra Honey Admin",
      order,
      idempotencyKey: `order_${order.id}_owner_cancelled`,
    });
  }
}

/**
 * Triggered when an order refund is processed.
 */
export async function notifyOrderRefunded(order: EmailOrderData): Promise<void> {
  if (!order.email) return;
  await sendTransactionalEmail({
    template: "order_refunded",
    recipientEmail: order.email,
    recipientName: order.full_name || undefined,
    order,
    idempotencyKey: `order_${order.id}_refunded`,
  });
}

/**
 * Safe retry mechanism: looks for failed or rate_limited notifications
 * and attempts delivery again (up to max 3 attempts).
 */
export async function retryFailedEmailNotifications(limit = 20): Promise<{
  retried: number;
  succeeded: number;
  failed: number;
}> {
  const config = getEmailConfig();
  if (!config.isConfigured || !config.apiKey) {
    return { retried: 0, succeeded: 0, failed: 0 };
  }

  try {
    const { data: failedItems, error } = await supabase
      .from("email_notifications" as unknown as "orders")
      .select("*")
      .in("status" as never, ["failed", "rate_limited", "pending"] as never)
      .lt("attempts" as never, 3 as never)
      .limit(limit);

    if (error || !failedItems || failedItems.length === 0) {
      return { retried: 0, succeeded: 0, failed: 0 };
    }

    let succeeded = 0;
    let failed = 0;

    for (const item of failedItems as unknown as Array<{
      id: string;
      order_id: string;
      recipient_email: string;
      recipient_name: string | null;
      template: EmailTemplateName;
      idempotency_key: string;
      attempts: number;
    }>) {
      // Fetch fresh order details
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", item.order_id)
        .maybeSingle();

      if (orderData) {
        const order = orderData as unknown as EmailOrderData;
        const result = await sendTransactionalEmail({
          template: item.template,
          recipientEmail: item.recipient_email,
          recipientName: item.recipient_name || undefined,
          order,
          idempotencyKey: item.idempotency_key,
        });

        if (result.ok) {
          succeeded++;
        } else {
          failed++;
        }
      }
    }

    return { retried: failedItems.length, succeeded, failed };
  } catch (e) {
    console.error("[Email Retry Exception]:", e);
    return { retried: 0, succeeded: 0, failed: 0 };
  }
}
