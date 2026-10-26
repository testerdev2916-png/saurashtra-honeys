// @ts-expect-error - Route file that is currently resolving fine but typescript complains
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import { notifyPaymentConfirmed } from "@/lib/email/email-service";
import type { EmailOrderData, EmailOrderItem, EmailShippingAddress } from "@/lib/email/templates";

export const APIRoute = createAPIFileRoute("/api/razorpay-webhook")({
  POST: async ({ request }: { request: Request }) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error("Webhook secret not configured.");
        return new Response("Webhook secret not configured", { status: 500 });
      }

      // Read raw body for HMAC verification
      const rawBody = await request.text();
      const signature = request.headers.get("x-razorpay-signature");

      if (!signature) {
        return new Response("Missing signature", { status: 400 });
      }

      // Verify the webhook signature
      const { createHmac, timingSafeEqual } = await import("node:crypto");
      const expectedSignature = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

      const a = Buffer.from(expectedSignature);
      const b = Buffer.from(signature);

      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        console.error("Invalid webhook signature.");
        return new Response("Invalid signature", { status: 400 });
      }

      const payload = JSON.parse(rawBody);
      const eventId = request.headers.get("x-razorpay-event-id") || "unknown-event";

      // We only care about order.paid for now
      if (payload.event === "order.paid") {
        const paymentEntity = payload.payload.payment.entity;
        const orderEntity = payload.payload.order.entity;

        const razorpay_order_id = orderEntity.id;
        const razorpay_payment_id = paymentEntity.id;

        // Fetch the order_id from our database using the razorpay_order_id
        const { data: orderData } = await supabase
          .from("orders")
          .select("id")
          .eq("razorpay_order_id", razorpay_order_id)
          .maybeSingle();

        if (orderData?.id) {
          const { data: existing } = await supabase
            .from("orders")
            .select(
              "id, user_id, razorpay_order_id, timeline, status, items, full_name, order_number, phone, payment_method, total_paise, email, shipping, subtotal_paise, shipping_paise, discount_paise, coupon_code, created_at, estimated_delivery, notes, gift_note",
            )
            .eq("id", orderData.id)
            .single();

          if (existing) {
            const existingTimeline = Array.isArray(existing.timeline)
              ? (existing.timeline as Array<{ event_id?: string }>)
              : [];

            // Check if this specific webhook event was already processed (Idempotency)
            const alreadyProcessed = existingTimeline.some((t) => t.event_id === eventId);
            if (alreadyProcessed) {
              console.log(`Webhook event ${eventId} already processed. Skipping.`);
              return new Response("OK", { status: 200 });
            }

            if (existing.status !== "paid") {
              const newTimeline = [
                ...existingTimeline,
                {
                  at: new Date().toISOString(),
                  status: "paid",
                  note: "Payment received via Webhook",
                  event_id: eventId,
                },
              ];

              await supabase
                .from("orders")
                .update({
                  status: "paid",
                  razorpay_payment_id: razorpay_payment_id,
                  timeline: newTimeline as never,
                })
                .eq("id", orderData.id);

              // Deduct inventory
              if (Array.isArray(existing.items)) {
                const itemsList = existing.items as unknown as Array<{
                  slug?: string;
                  size?: string;
                  qty?: number;
                }>;
                for (const item of itemsList) {
                  if (!item.slug || !item.size || !item.qty) continue;

                  const { data: pData } = await supabase
                    .from("products")
                    .select("id")
                    .eq("canonical_url", item.slug)
                    .maybeSingle();
                  if (!pData) continue;

                  const { data: vData } = await supabase
                    .from("product_variants")
                    .select("id, stock_quantity")
                    .eq("product_id", pData.id)
                    .eq("label", item.size)
                    .maybeSingle();

                  if (vData) {
                    const newStock = Math.max(0, (vData.stock_quantity || 0) - item.qty);
                    await supabase
                      .from("product_variants")
                      .update({ stock_quantity: newStock })
                      .eq("id", vData.id);

                    await supabase.from("inventory_history").insert({
                      product_id: pData.id,
                      change: -item.qty,
                      reason: "sale",
                      reference_id: orderData.id,
                    });
                  }
                }
              }

              // Dispatch payment confirmation email (guarded by idempotency key)
              try {
                const emailOrderData: EmailOrderData = {
                  id: orderData.id,
                  order_number: existing.order_number,
                  created_at: existing.created_at || new Date().toISOString(),
                  full_name: existing.full_name,
                  email: existing.email,
                  phone: existing.phone,
                  shipping: existing.shipping as unknown as EmailShippingAddress,
                  items: (Array.isArray(existing.items)
                    ? existing.items
                    : []) as unknown as EmailOrderItem[],
                  subtotal_paise: existing.subtotal_paise || 0,
                  discount_paise: existing.discount_paise || 0,
                  coupon_code: existing.coupon_code,
                  shipping_paise: existing.shipping_paise || 0,
                  total_paise: existing.total_paise || 0,
                  payment_method: "razorpay",
                  razorpay_payment_id: razorpay_payment_id,
                  status: "paid",
                  estimated_delivery: existing.estimated_delivery,
                  notes: existing.notes,
                  gift_note: existing.gift_note,
                };
                await notifyPaymentConfirmed(emailOrderData);
              } catch (err) {
                console.error("[Email] Error dispatching webhook payment confirmation email:", err);
              }
            }
          }
        }
      }

      return new Response("OK", { status: 200 });
    } catch (e) {
      console.error("Webhook processing error:", e);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
});
