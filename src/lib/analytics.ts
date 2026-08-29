// Lightweight analytics dispatcher. Fires GA4-style e-commerce events onto
// window.dataLayer (works with GTM/GA4) and dispatches a browser CustomEvent
// so other listeners can react. Deduplicates events fired with the same key
// within a short window to prevent double-fire from React StrictMode etc.

type EventName =
  | "search"
  | "view_item_list"
  | "view_item"
  | "select_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "add_payment_info"
  | "purchase";

type AnyRecord = Record<string, unknown>;

declare global {
  interface Window { dataLayer?: AnyRecord[] }
}

const seen = new Map<string, number>();
const WINDOW_MS = 1500;

function fingerprint(name: EventName, params: AnyRecord): string {
  // Cheap stable key for dedupe — event + a few stable dims
  const key = JSON.stringify({
    n: name,
    id: params.transaction_id ?? params.item_id ?? params.search_term ?? null,
    list: params.item_list_name ?? null,
    v: params.value ?? null,
    q: (params.items as unknown[] | undefined)?.length ?? null,
  });
  return key;
}

export function track(name: EventName, params: AnyRecord = {}) {
  if (typeof window === "undefined") return;
  const key = fingerprint(name, params);
  const now = Date.now();
  const last = seen.get(key) ?? 0;
  if (now - last < WINDOW_MS) return;
  seen.set(key, now);

  window.dataLayer = window.dataLayer || [];
  const payload = { event: name, ...params, _ts: now };
  window.dataLayer.push(payload);
  try {
    window.dispatchEvent(new CustomEvent(`analytics:${name}`, { detail: payload }));
  } catch { /* ignore */ }
}

// GA4 item shape helper
export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity?: number;
};

export function toItem(p: {
  slug: string; name: string; price: number; category?: string;
}, opts: { size?: string; qty?: number } = {}): AnalyticsItem {
  return {
    item_id: p.slug,
    item_name: p.name,
    item_category: p.category,
    item_variant: opts.size,
    price: p.price,
    quantity: opts.qty ?? 1,
  };
}
