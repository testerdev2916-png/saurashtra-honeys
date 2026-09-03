// @ts-ignore - Route file that is currently resolving fine but typescript complains
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { supabase } from "@/integrations/supabase/client";

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
            .select("timeline, status, items")
            .eq("id", orderData.id)
            .single();

          if (existing) {
            const existingTimeline = Array.isArray(existing.timeline) ? (existing.timeline as any[]) : [];
            
            // Check if this specific webhook event was already processed (Idempotency)
            const alreadyProcessed = existingTimeline.some(t => t.event_id === eventId);
            if (alreadyProcessed) {
              console.log(`Webhook event ${eventId} already processed. Skipping.`);
              return new Response("OK", { status: 200 });
            }

            if (existing.status !== "paid") {
              const newTimeline = [...existingTimeline, { 
                at: new Date().toISOString(), 
                status: "paid", 
                note: "Payment received via Webhook",
                event_id: eventId 
              }];
            
            await supabase.from("orders").update({
              status: "paid",
              razorpay_payment_id: razorpay_payment_id,
              timeline: newTimeline as never,
            }).eq("id", orderData.id);

            // Deduct inventory
            if (Array.isArray(existing.items)) {
              for (const item of existing.items as any[]) {
                if (!item.slug || !item.size || !item.qty) continue;
                
                const { data: pData } = await supabase.from("products").select("id").eq("canonical_url", item.slug).maybeSingle();
                if (!pData) continue;
                
                const { data: vData } = await supabase.from("product_variants")
                  .select("id, stock_quantity")
                  .eq("product_id", pData.id)
                  .eq("label", item.size)
                  .maybeSingle();
                  
                if (vData) {
                  const newStock = Math.max(0, (vData.stock_quantity || 0) - item.qty);
                  await supabase.from("product_variants").update({ stock_quantity: newStock }).eq("id", vData.id);
                  
                  await supabase.from("inventory_history").insert({
                    product_id: pData.id,
                    change: -item.qty,
                    reason: "sale",
                    reference_id: orderData.id
                  });
                }
              }
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
  }
});
