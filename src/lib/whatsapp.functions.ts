export interface SendWhatsAppAlertParams {
  customerName: string;
  orderNumber: string;
  phone: string;
  paymentMethod: string;
  total: number;
}

export async function sendWhatsAppOrderAlert({
  customerName,
  orderNumber,
  phone,
  paymentMethod,
  total,
}: SendWhatsAppAlertParams) {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const adminTo = process.env.WHATSAPP_ADMIN_TO;
    const templateName = process.env.WHATSAPP_ORDER_TEMPLATE;

    if (!accessToken || !phoneNumberId || !adminTo || !templateName) {
      console.log("[WhatsApp] Missing configuration, skipping alert");
      return;
    }

    const payload = {
      messaging_product: "whatsapp",
      to: adminTo,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: customerName || "Customer" },
              { type: "text", text: orderNumber || "N/A" },
              { type: "text", text: phone || "N/A" },
              { type: "text", text: paymentMethod.toUpperCase() },
              { type: "text", text: (total / 100).toFixed(2) }
            ]
          }
        ]
      }
    };

    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[WhatsApp] Failed to send order alert:", errorText);
    } else {
      console.log("[WhatsApp] Order alert sent");
    }
  } catch (error) {
    console.error("[WhatsApp] Failed to send order alert:", error);
  }
}
