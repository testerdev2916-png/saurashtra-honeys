/**
 * Transactional Email HTML and Plain-Text Templates for Saurashtra Honey
 * Designed with responsive inline styles and brand color palette:
 * - Forest Dark: #1C3B2B
 * - Gold Deep: #D4AF37
 * - Cream Background: #FCFBF7 / #F7F4EE
 * - Warm Espresso Text: #2D241E
 */

export interface EmailOrderItem {
  slug?: string;
  name: string;
  size?: string;
  price: number;
  qty: number;
  image?: string;
}

export interface EmailShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface EmailOrderData {
  id: string;
  order_number: string | null;
  created_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  shipping: EmailShippingAddress;
  items: EmailOrderItem[];
  subtotal_paise: number;
  discount_paise?: number;
  coupon_code?: string | null;
  shipping_paise: number;
  total_paise: number;
  payment_method: string;
  status: string;
  estimated_delivery?: string | null;
  tracking_number?: string | null;
  shipping_carrier?: string | null;
  razorpay_payment_id?: string | null;
  notes?: string | null;
  gift_note?: string | null;
  cancel_reason?: string;
  refund_amount_paise?: number | null;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function formatINR(paise: number): string {
  const amount = (paise || 0) / 100;
  const hasDecimals = paise % 100 !== 0;
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`;
}

export function formatDateString(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function getTrackingUrl(
  carrier?: string | null,
  trackingNumber?: string | null,
): string | null {
  if (!trackingNumber) return null;
  const c = (carrier || "").toLowerCase();
  if (c.includes("delhivery")) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes("bluedart") || c.includes("blue dart")) {
    return `https://www.bluedart.com/tracking?handler=traking&action=auto&awb=awb&numbers=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes("dtdc")) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${encodeURIComponent(trackingNumber)}`;
  }
  if (c.includes("india post") || c.includes("speed post")) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
  }
  return null;
}

function baseLayout({
  title,
  previewText,
  content,
  siteUrl,
}: {
  title: string;
  previewText: string;
  content: string;
  siteUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D241E; line-height: 1.6;">
  <span style="display:none;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </span>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F4EE; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(28, 59, 43, 0.08); border: 1px solid #EBE5D8;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1C3B2B; padding: 30px 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <a href="${siteUrl}" style="text-decoration: none; display: inline-block;">
                <span style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #FCFBF7; letter-spacing: 2px;">SAURASHTRA HONEY</span>
                <span style="display: block; font-size: 11px; color: #D4AF37; letter-spacing: 3px; margin-top: 4px; text-transform: uppercase;">Pure • Raw • Unfiltered</span>
              </a>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF8F5; padding: 24px 28px; text-align: center; border-top: 1px solid #EBE5D8; font-size: 12px; color: #736B63;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #1C3B2B;">Saurashtra Honey — Artisanal Apiaries of Gujarat</p>
              <p style="margin: 0 0 12px 0;">Mahuva, Bhavnagar District, Gujarat 364290 • <a href="mailto:hello@saurastrahoney.com" style="color: #D4AF37; text-decoration: none;">hello@saurastrahoney.com</a></p>
              <p style="margin: 0; font-size: 11px; color: #9E968D;">
                You received this transactional service email regarding your order with Saurashtra Honey.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderItemsTable(items: EmailOrderItem[]): string {
  const rows = items
    .map(
      (it) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0ECE1; font-size: 14px; color: #1C3B2B;">
        <strong>${it.name}</strong>
        ${it.size ? `<span style="color: #736B63; font-size: 12px; display: block;">Variant: ${it.size}</span>` : ""}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0ECE1; text-align: center; font-size: 14px; color: #736B63;">
        × ${it.qty}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #F0ECE1; text-align: right; font-size: 14px; font-weight: 600; color: #1C3B2B;">
        ₹${it.price * it.qty}
      </td>
    </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 16px 0;">
      <thead>
        <tr style="border-bottom: 2px solid #EBE5D8;">
          <th align="left" style="padding-bottom: 8px; font-size: 12px; text-transform: uppercase; color: #736B63; letter-spacing: 1px;">Item</th>
          <th align="center" style="padding-bottom: 8px; font-size: 12px; text-transform: uppercase; color: #736B63; letter-spacing: 1px;">Qty</th>
          <th align="right" style="padding-bottom: 8px; font-size: 12px; text-transform: uppercase; color: #736B63; letter-spacing: 1px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}

function renderPriceBreakdown(order: EmailOrderData): string {
  const discountRow =
    order.discount_paise && order.discount_paise > 0
      ? `<tr>
          <td style="padding: 4px 0; font-size: 13px; color: #B45309;">Discount ${order.coupon_code ? `(${order.coupon_code})` : ""}:</td>
          <td align="right" style="padding: 4px 0; font-size: 13px; color: #B45309; font-weight: 600;">−${formatINR(order.discount_paise)}</td>
        </tr>`
      : "";

  const shippingText = order.shipping_paise === 0 ? "FREE" : formatINR(order.shipping_paise);

  return `
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px; border-top: 1px solid #EBE5D8; padding-top: 12px;">
      <tr>
        <td style="padding: 4px 0; font-size: 13px; color: #736B63;">Subtotal:</td>
        <td align="right" style="padding: 4px 0; font-size: 13px; color: #1C3B2B;">${formatINR(order.subtotal_paise)}</td>
      </tr>
      ${discountRow}
      <tr>
        <td style="padding: 4px 0; font-size: 13px; color: #736B63;">Shipping:</td>
        <td align="right" style="padding: 4px 0; font-size: 13px; color: #1C3B2B;">${shippingText}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: bold; color: #1C3B2B; border-top: 2px solid #EBE5D8;">Total Amount:</td>
        <td align="right" style="padding: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #1C3B2B; border-top: 2px solid #EBE5D8;">${formatINR(order.total_paise)}</td>
      </tr>
    </table>`;
}

function renderAddressBox(shipping: EmailShippingAddress): string {
  return `
    <div style="background-color: #FAF8F5; border: 1px solid #EBE5D8; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #2D241E; line-height: 1.5;">
      <strong>Delivery Address:</strong><br>
      ${shipping.line1}<br>
      ${shipping.line2 ? `${shipping.line2}<br>` : ""}
      ${shipping.city}, ${shipping.state} — ${shipping.pincode}<br>
      ${shipping.country || "India"}
    </div>`;
}

// ----------------------------------------------------------------------------
// A. CUSTOMER: Order Placed / Confirmed
// ----------------------------------------------------------------------------
export function customerOrderPlacedTemplate(order: EmailOrderData, siteUrl: string): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Order Confirmed: #${orderNum} — Saurashtra Honey`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const paymentStatusText =
    order.payment_method === "cod"
      ? "Cash on Delivery (Pay upon delivery)"
      : order.status === "paid"
        ? "Paid Online via Razorpay"
        : "Payment Pending via Razorpay";

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Thank You for Your Order!</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Valued Customer"}</strong>, we've received your order <strong>#${orderNum}</strong> placed on ${formatDateString(order.created_at)}. Our beekeepers are carefully preparing your artisanal honey.
    </p>

    <div style="background-color: #FCFBF7; border: 1px solid #D4AF37; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size: 13px; color: #736B63;">Order Number:</td>
          <td align="right" style="font-size: 14px; font-weight: bold; color: #1C3B2B;">#${orderNum}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #736B63;">Payment Method:</td>
          <td align="right" style="font-size: 13px; font-weight: 600; color: #1C3B2B;">${paymentStatusText}</td>
        </tr>
        ${
          order.estimated_delivery
            ? `<tr>
          <td style="font-size: 13px; color: #736B63;">Estimated Delivery:</td>
          <td align="right" style="font-size: 13px; font-weight: 600; color: #1C3B2B;">${formatDateString(order.estimated_delivery)}</td>
        </tr>`
            : ""
        }
      </table>
    </div>

    <h3 style="font-family: Georgia, serif; font-size: 16px; color: #1C3B2B; margin: 20px 0 8px 0;">Order Summary</h3>
    ${renderItemsTable(order.items)}
    ${renderPriceBreakdown(order)}

    <div style="margin: 22px 0;">
      ${renderAddressBox(order.shipping)}
    </div>

    ${
      order.gift_note
        ? `<div style="background-color: #FFFBEB; border-left: 3px solid #D4AF37; padding: 10px 14px; font-size: 13px; margin: 16px 0; border-radius: 4px;">
        <strong>Gift Note:</strong> "${order.gift_note}"
      </div>`
        : ""
    }

    <div style="text-align: center; margin: 30px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        VIEW ORDER DETAILS
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} confirmed! We've received your order of raw Saurashtra honey.`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - ORDER CONFIRMATION
Order #${orderNum}
Placed on: ${formatDateString(order.created_at)}
Customer: ${order.full_name || "Valued Customer"}
Payment: ${paymentStatusText}
Total: ${formatINR(order.total_paise)}

Items:
${order.items.map((i) => `- ${i.name} (${i.size || "Standard"}) x ${i.qty}: ₹${i.price * i.qty}`).join("\n")}

Shipping to:
${order.shipping.line1}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.pincode}

View your order online: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// B. CUSTOMER: Payment Confirmation
// ----------------------------------------------------------------------------
export function customerPaymentConfirmedTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Payment Confirmed: Order #${orderNum} — Saurashtra Honey`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Payment Received!</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Customer"}</strong>, we have successfully verified your payment of <strong>${formatINR(order.total_paise)}</strong> for Order <strong>#${orderNum}</strong>.
    </p>

    <div style="background-color: #F0FDF4; border: 1px solid #86EFAC; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size: 13px; color: #166534;">Payment Status:</td>
          <td align="right" style="font-size: 13px; font-weight: bold; color: #166534;">PAID & VERIFIED</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #166534;">Amount Paid:</td>
          <td align="right" style="font-size: 14px; font-weight: bold; color: #166534;">${formatINR(order.total_paise)}</td>
        </tr>
        ${
          order.razorpay_payment_id
            ? `<tr>
          <td style="font-size: 13px; color: #166534;">Transaction Ref:</td>
          <td align="right" style="font-size: 12px; font-family: monospace; color: #166534;">${order.razorpay_payment_id}</td>
        </tr>`
            : ""
        }
      </table>
    </div>

    <p style="font-size: 14px; color: #4A4238;">
      Your order has been moved to <strong>Processing</strong>. Our packaging team is safely wrapping your honey jars with eco-friendly honeycomb padding.
    </p>

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        TRACK YOUR ORDER
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Payment confirmed for order #${orderNum}. Amount: ${formatINR(order.total_paise)}.`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - PAYMENT RECEIVED
Order #${orderNum}
Amount: ${formatINR(order.total_paise)}
Transaction Ref: ${order.razorpay_payment_id || "N/A"}
Status: Paid & Verified

Your order is now being packed.
Track online: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// C. CUSTOMER: Order Processing
// ----------------------------------------------------------------------------
export function customerOrderProcessingTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Order Processing: #${orderNum} — Saurashtra Honey`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Your Honey Is Being Prepared</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Customer"}</strong>, your order <strong>#${orderNum}</strong> is currently being packed at our facility in Saurashtra.
    </p>
    <p style="font-size: 14px; color: #4A4238;">
      Each jar of Saurashtra Honey is single-origin, unfiltered, and packed directly from raw honeycombs. We will send you another update with tracking information as soon as the package is handed over to our delivery partner.
    </p>

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        VIEW ORDER STATUS
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} is now being prepared and packed with care.`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - ORDER PROCESSING
Order #${orderNum}
Your order is currently being packed. You will receive tracking details once dispatched.
Track online: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// D. CUSTOMER: Order Dispatched
// ----------------------------------------------------------------------------
export function customerOrderDispatchedTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Your Order #${orderNum} Has Been Shipped & Dispatched! 🚚`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;
  const trackingUrl = getTrackingUrl(order.shipping_carrier, order.tracking_number);

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Your Order Is on Its Way!</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Great news, <strong>${order.full_name || "Customer"}</strong>! Order <strong>#${orderNum}</strong> has been shipped and is en route to your delivery address.
    </p>

    <div style="background-color: #FAF8F5; border: 1px solid #D4AF37; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size: 13px; color: #736B63;">Courier Partner:</td>
          <td align="right" style="font-size: 14px; font-weight: bold; color: #1C3B2B;">${order.shipping_carrier || "Standard Logistics"}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #736B63;">Tracking Number:</td>
          <td align="right" style="font-size: 14px; font-family: monospace; font-weight: bold; color: #1C3B2B;">
            ${
              trackingUrl
                ? `<a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; text-decoration: underline;">${order.tracking_number}</a>`
                : order.tracking_number || "Tracking details will be updated shortly"
            }
          </td>
        </tr>
        ${
          trackingUrl
            ? `<tr>
          <td style="font-size: 13px; color: #736B63;">Tracking Link:</td>
          <td align="right" style="font-size: 13px; color: #D4AF37;">
            <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="color: #D4AF37; font-weight: bold; text-decoration: underline;">Track on ${order.shipping_carrier || "Courier"} Website →</a>
          </td>
        </tr>`
            : ""
        }
        ${
          order.estimated_delivery
            ? `<tr>
          <td style="font-size: 13px; color: #736B63;">Estimated Delivery:</td>
          <td align="right" style="font-size: 13px; font-weight: bold; color: #1C3B2B;">${formatDateString(order.estimated_delivery)}</td>
        </tr>`
            : ""
        }
      </table>
    </div>

    ${renderAddressBox(order.shipping)}

    <div style="text-align: center; margin: 28px 0 10px 0;">
      <a href="${trackingUrl || viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        TRACK SHIPMENT
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} is on its way with ${order.shipping_carrier || "our courier"}!`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - ORDER DISPATCHED
Order #${orderNum}
Carrier: ${order.shipping_carrier || "Standard Logistics"}
Tracking Number: ${order.tracking_number || "Check portal"}
${trackingUrl ? `Tracking URL: ${trackingUrl}\n` : ""}Estimated Delivery: ${formatDateString(order.estimated_delivery)}

Track online: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// E. CUSTOMER: Out For Delivery
// ----------------------------------------------------------------------------
export function customerOutForDeliveryTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Out for Delivery Today: Order #${orderNum} — Saurashtra Honey`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const isCod = order.payment_method === "cod";

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Arriving Today!</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Customer"}</strong>, your raw honey package for Order <strong>#${orderNum}</strong> is out for delivery today — our delivery partner is on the way to your doorstep.
    </p>

    ${
      isCod
        ? `<div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-size: 14px; color: #92400E;">
        <strong>Cash on Delivery Reminder:</strong> Please keep <strong>${formatINR(order.total_paise)}</strong> ready for the delivery executive.
      </div>`
        : `<div style="background-color: #F0FDF4; border-left: 4px solid #10B981; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-size: 14px; color: #065F46;">
        <strong>Contactless Delivery:</strong> This order is fully paid online. You can opt for contactless doorstep handover if desired.
      </div>`
    }

    ${renderAddressBox(order.shipping)}

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        VIEW ORDER DETAILS
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} is out for delivery today!`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - OUT FOR DELIVERY TODAY
Order #${orderNum} is Out for Delivery!
${isCod ? `COD Amount due: ${formatINR(order.total_paise)}` : "Order is prepaid."}
Destination: ${order.shipping.line1}, ${order.shipping.city}
Track: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// F. CUSTOMER: Order Delivered
// ----------------------------------------------------------------------------
export function customerOrderDeliveredTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Delivered: Order #${orderNum} — Enjoy Pure Saurashtra Honey! 🍯`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Your Honey Has Arrived!</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Customer"}</strong>, your order <strong>#${orderNum}</strong> has been successfully delivered. We hope you enjoy the authentic flavor of raw Gujarat honey!
    </p>

    <div style="background-color: #FAF8F5; border: 1px solid #EBE5D8; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1C3B2B;">✨ Tips for Raw Honey:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #736B63;">
        <li style="margin-bottom: 6px;"><strong>Do not refrigerate:</strong> Keep at room temperature in a dry spot.</li>
        <li style="margin-bottom: 6px;"><strong>Natural crystallization:</strong> Raw honey will naturally crystallize over time — this is proof of raw, unheated honey. Place the jar in warm water (under 40°C) to re-liquefy if desired.</li>
        <li><strong>Use wooden or dry spoons:</strong> Moisture introduces fermentation in raw honey.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        ORDER DETAILS & INVOICE
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} has been delivered. Enjoy raw Saurashtra honey!`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - DELIVERED
Order #${orderNum} has been delivered!
Thank you for supporting traditional Indian beekeeping.
Storage tip: Store at room temperature away from direct sunlight. Do not refrigerate.
View order & invoice: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// G. CUSTOMER: Order Cancelled & Refund Information
// ----------------------------------------------------------------------------
export function customerOrderCancelledTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const subject = `Order Cancelled: #${orderNum} — Saurashtra Honey`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const isPrepaid =
    order.payment_method === "razorpay" &&
    (order.status === "paid" || order.status === "cancelled");

  const refundNotice = isPrepaid
    ? `<div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #92400E;">
        <strong>Refund Status:</strong> A refund of <strong>${formatINR(order.total_paise)}</strong> has been initiated. Refunds to your original payment method (bank account / UPI / card) typically reflect within <strong>5-7 business days</strong> depending on your issuing bank.
      </div>`
    : `<div style="background-color: #F3F4F6; border: 1px solid #D1D5DB; border-radius: 8px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #374151;">
        <strong>Payment Notice:</strong> As this was a Cash on Delivery (No payment was collected) order, no payment was collected and no refund is required.
      </div>`;

  const cancelReason = order.cancel_reason || order.notes;

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #B91C1C; margin: 0 0 10px 0;">Order Cancellation Confirmation</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Customer"}</strong>, your order <strong>#${orderNum}</strong> has been cancelled.
      ${cancelReason ? `<br><span style="font-size: 13px; color: #736B63;">Reason: "${cancelReason}"</span>` : ""}
    </p>

    ${refundNotice}

    <p style="font-size: 13px; color: #736B63;">
      If you did not request this cancellation or have any questions, please reply directly to this email or WhatsApp us at +91 94291 85986.
    </p>

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        VIEW ORDER STATUS
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} has been cancelled.`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - ORDER CANCELLATION
Order #${orderNum} has been cancelled.
Reason: ${cancelReason || "Customer requested"}
${isPrepaid ? `Refund of ${formatINR(order.total_paise)} will reflect within 5-7 business days.` : "No payment was collected (COD)."}
View online: ${viewOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// H. CUSTOMER: Refund Processed Notice
// ----------------------------------------------------------------------------
export function customerRefundProcessedTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const refundAmount = order.refund_amount_paise || order.total_paise;
  const subject = `Refund Processed for Order #${orderNum} — Saurashtra Honey`;
  const viewOrderUrl = `${siteUrl}/order/${order.id}`;

  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1C3B2B; margin: 0 0 10px 0;">Refund Confirmation</h2>
    <p style="font-size: 15px; margin: 0 0 18px 0; color: #4A4238;">
      Hello <strong>${order.full_name || "Customer"}</strong>, we have processed a refund of <strong>${formatINR(refundAmount)}</strong> for Order <strong>#${orderNum}</strong>.
    </p>

    <div style="background-color: #F0FDF4; border: 1px solid #86EFAC; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="font-size: 13px; color: #166534;">Refund Amount:</td>
          <td align="right" style="font-size: 15px; font-weight: bold; color: #166534;">${formatINR(refundAmount)}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #166534;">Destination:</td>
          <td align="right" style="font-size: 13px; color: #166534;">Original payment method</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #736B63;">
      The refund should appear on your bank statement or UPI app within 5–7 business days depending on banking clearing cycles.
    </p>

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${viewOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        VIEW ORDER
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Refund of ${formatINR(refundAmount)} processed for order #${orderNum}.`,
    content,
    siteUrl,
  });

  const text = `SAURASHTRA HONEY - REFUND PROCESSED
Order #${orderNum}
Refund Amount: ${formatINR(refundAmount)}
Destination: Original payment method
Reflects in 5-7 business days.
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// I. STORE OWNER: New Order Alert
// ----------------------------------------------------------------------------
export function ownerNewOrderAlertTemplate(order: EmailOrderData, siteUrl: string): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const totalStr = formatINR(order.total_paise);
  const paymentMethodLabel = order.payment_method === "cod" ? "COD" : "Razorpay";
  const paymentStatusLabel =
    order.payment_method === "cod"
      ? "Cash on Delivery (Pending Collection)"
      : order.status === "paid"
        ? "Paid (Razorpay)"
        : "Payment Pending (Razorpay)";

  const subject = `🔔 [New Order #${orderNum}] ${order.full_name || "Customer"} - ${totalStr} (${paymentMethodLabel})`;
  const adminOrderUrl = `${siteUrl}/admin/orders`;

  const content = `
    <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 10px 16px; margin-bottom: 20px; font-size: 13px; color: #92400E; font-weight: bold;">
      STORE OWNER NOTIFICATION: New Order Received
    </div>

    <h2 style="font-family: Georgia, serif; font-size: 20px; color: #1C3B2B; margin: 0 0 12px 0;">
      Order #${orderNum} Details
    </h2>

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px; font-size: 13px;">
      <tr>
        <td style="padding: 4px 0; color: #736B63;">Customer Name:</td>
        <td align="right" style="padding: 4px 0; font-weight: bold; color: #1C3B2B;">${order.full_name || "N/A"}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #736B63;">Customer Email:</td>
        <td align="right" style="padding: 4px 0; color: #1C3B2B;"><a href="mailto:${order.email}" style="color: #D4AF37;">${order.email || "N/A"}</a></td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #736B63;">Phone Number:</td>
        <td align="right" style="padding: 4px 0; color: #1C3B2B;"><a href="tel:${order.phone}" style="color: #1C3B2B;">${order.phone || "N/A"}</a></td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #736B63;">Payment Method:</td>
        <td align="right" style="padding: 4px 0; font-weight: bold; color: #1C3B2B;">${order.payment_method.toUpperCase()}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #736B63;">Payment Status:</td>
        <td align="right" style="padding: 4px 0; font-weight: bold; color: ${order.status === "paid" ? "#15803D" : "#B45309"};">${paymentStatusLabel}</td>
      </tr>
    </table>

    <h3 style="font-family: Georgia, serif; font-size: 15px; color: #1C3B2B; margin: 16px 0 8px 0;">Items Ordered</h3>
    ${renderItemsTable(order.items)}
    ${renderPriceBreakdown(order)}

    <div style="margin: 18px 0;">
      ${renderAddressBox(order.shipping)}
    </div>

    ${
      order.notes
        ? `<div style="background-color: #FAF8F5; border: 1px dashed #D4AF37; padding: 10px 14px; font-size: 13px; margin: 14px 0; border-radius: 6px;">
        <strong>Customer Order Note:</strong> "${order.notes}"
      </div>`
        : ""
    }

    ${
      order.gift_note
        ? `<div style="background-color: #FFFBEB; border: 1px dashed #D4AF37; padding: 10px 14px; font-size: 13px; margin: 14px 0; border-radius: 6px;">
        <strong>Customer Gift Note:</strong> "${order.gift_note}"
      </div>`
        : ""
    }

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${adminOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        OPEN ADMIN ORDER MANAGER
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `New order #${orderNum} from ${order.full_name} for ${totalStr} (${paymentStatusLabel}).`,
    content,
    siteUrl,
  });

  const text = `STORE OWNER ALERT: NEW ORDER RECEIVED
Order #${orderNum}
Customer: ${order.full_name}
Email: ${order.email}
Phone: ${order.phone}
Total: ${totalStr}
Payment Method: ${order.payment_method.toUpperCase()}
Payment Status: ${paymentStatusLabel}

Shipping Address:
${order.shipping.line1}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.pincode}

Items:
${order.items.map((i) => `- ${i.name} (${i.size || "Standard"}) x ${i.qty}: ₹${i.price * i.qty}`).join("\n")}

Admin Order Manager: ${adminOrderUrl}
`;

  return { subject, html, text };
}

// ----------------------------------------------------------------------------
// J. STORE OWNER: Order Cancelled Alert
// ----------------------------------------------------------------------------
export function ownerOrderCancelledAlertTemplate(
  order: EmailOrderData,
  siteUrl: string,
): RenderedEmail {
  const orderNum = order.order_number || order.id.slice(0, 8);
  const totalStr = formatINR(order.total_paise);
  const subject = `⚠️ [Order Cancelled #${orderNum}] ${order.full_name || "Customer"} - ${totalStr}`;
  const adminOrderUrl = `${siteUrl}/admin/orders`;

  const cancelReasonText = order.cancel_reason || order.notes || "Not specified";

  const content = `
    <div style="background-color: #FEE2E2; border: 1px solid #EF4444; border-radius: 8px; padding: 10px 16px; margin-bottom: 20px; font-size: 13px; color: #991B1B; font-weight: bold;">
      STORE OWNER ALERT: Order Cancelled
    </div>

    <h2 style="font-family: Georgia, serif; font-size: 20px; color: #1C3B2B; margin: 0 0 12px 0;">
      Order #${orderNum} Has Been Cancelled
    </h2>

    <p style="font-size: 14px; color: #4A4238;">
      Customer <strong>${order.full_name || "Customer"}</strong> (${order.email || "No email"}) has cancelled order <strong>#${orderNum}</strong>.
      <br><strong>Reason given:</strong> "${cancelReasonText}"
    </p>

    <div style="background-color: #FAF8F5; border: 1px solid #EBE5D8; border-radius: 8px; padding: 12px 16px; margin: 16px 0; font-size: 13px;">
      <p style="margin: 0 0 6px 0;"><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</p>
      <p style="margin: 0 0 6px 0;"><strong>Previous Status:</strong> ${order.status}</p>
      <p style="margin: 0;"><strong>Inventory Restock Alert:</strong> Reserved item quantities have been automatically restocked to inventory.</p>
    </div>

    <div style="text-align: center; margin: 26px 0 10px 0;">
      <a href="${adminOrderUrl}" style="background-color: #1C3B2B; color: #FCFBF7; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; letter-spacing: 1.5px; display: inline-block;">
        VIEW IN ADMIN ORDERS
      </a>
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: `Order #${orderNum} from ${order.full_name} has been cancelled.`,
    content,
    siteUrl,
  });

  const text = `STORE OWNER ALERT: ORDER CANCELLED
Order #${orderNum}
Customer: ${order.full_name} (${order.email})
Reason: ${cancelReasonText}
Total: ${totalStr}
Inventory has been restocked.
Admin Manager: ${adminOrderUrl}
`;

  return { subject, html, text };
}
