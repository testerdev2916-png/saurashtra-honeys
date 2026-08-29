import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getVariantByLabel, type Product, type ProductVariant } from "./products";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  size: string;
  price: number;
  qty: number;
  variantId?: string;
  sku?: string;
  stock?: number;
};

export type AppliedCoupon = {
  code: string;
  discount_paise: number;
  free_shipping: boolean;
  description: string | null;
};

type CartCtx = {
  items: CartItem[];
  saved: CartItem[];        // save-for-later
  open: boolean;
  setOpen: (b: boolean) => void;
  add: (p: Product, size?: string, qty?: number, variant?: ProductVariant) => void;
  remove: (slug: string, size: string) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  clear: () => void;
  moveToSaved: (slug: string, size: string) => void;
  moveToCart: (slug: string, size: string) => void;
  removeSaved: (slug: string, size: string) => void;
  coupon: AppliedCoupon | null;
  applyCoupon: (c: AppliedCoupon | null) => void;
  count: number;
  subtotal: number;         // rupees
  subtotalPaise: number;    // paise
  discount: number;         // rupees
  shippingWaived: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "sh_cart_v1";
const SAVED_KEY = "sh_saved_v1";
const COUPON_KEY = "sh_coupon_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw));
      const rawS = localStorage.getItem(SAVED_KEY); if (rawS) setSaved(JSON.parse(rawS));
      const rawC = localStorage.getItem(COUPON_KEY); if (rawC) setCoupon(JSON.parse(rawC));
    } catch {/* ignore */}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); }, [saved, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon, hydrated]);

  const applyCoupon = useCallback((c: AppliedCoupon | null) => setCoupon(c), []);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    const subtotalPaise = subtotal * 100;
    // Re-clamp coupon discount to current subtotal (never negative)
    let discountPaise = 0;
    if (coupon && !coupon.free_shipping) {
      discountPaise = Math.min(coupon.discount_paise, subtotalPaise);
    }
    return {
      items, saved, open, setOpen,
      add: (p, size, qty = 1, variant?: ProductVariant) => {
        const s = size ?? p.sizes[0];
        const v = variant ?? getVariantByLabel(p, s);
        const itemPrice = v.price ?? p.price;
        setItems((prev) => {
          const idx = prev.findIndex((i) => i.slug === p.slug && i.size === s);
          if (idx >= 0) {
            const next = [...prev];
            const newQty = next[idx].qty + qty;
            const cappedQty = v.stock !== undefined ? Math.min(newQty, v.stock) : newQty;
            next[idx] = { ...next[idx], qty: cappedQty, price: itemPrice, variantId: v.id, sku: v.sku, stock: v.stock };
            return next;
          }
          const initialQty = v.stock !== undefined ? Math.min(qty, v.stock) : qty;
          return [...prev, { slug: p.slug, name: p.name, image: p.image, size: s, price: itemPrice, qty: initialQty, variantId: v.id, sku: v.sku, stock: v.stock }];
        });
        setOpen(true);
      },
      remove: (slug, size) => setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size))),
      updateQty: (slug, size, qty) =>
        setItems((prev) =>
          prev.map((i) => {
            if (i.slug === slug && i.size === size) {
              const clamped = Math.max(1, qty);
              const maxQty = i.stock !== undefined ? Math.min(clamped, i.stock) : clamped;
              return { ...i, qty: maxQty };
            }
            return i;
          })
        ),
      clear: () => { setItems([]); setCoupon(null); },
      moveToSaved: (slug, size) => setItems((prev) => {
        const it = prev.find((i) => i.slug === slug && i.size === size);
        if (!it) return prev;
        setSaved((s) => s.some((x) => x.slug === slug && x.size === size) ? s : [...s, { ...it, qty: 1 }]);
        return prev.filter((i) => !(i.slug === slug && i.size === size));
      }),
      moveToCart: (slug, size) => setSaved((prev) => {
        const it = prev.find((i) => i.slug === slug && i.size === size);
        if (!it) return prev;
        setItems((cur) => {
          const idx = cur.findIndex((i) => i.slug === slug && i.size === size);
          if (idx >= 0) { const next = [...cur]; next[idx] = { ...next[idx], qty: next[idx].qty + 1 }; return next; }
          return [...cur, { ...it, qty: 1 }];
        });
        return prev.filter((i) => !(i.slug === slug && i.size === size));
      }),
      removeSaved: (slug, size) => setSaved((prev) => prev.filter((i) => !(i.slug === slug && i.size === size))),
      coupon, applyCoupon,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal, subtotalPaise,
      discount: discountPaise / 100,
      shippingWaived: !!coupon?.free_shipping,
    };
  }, [items, saved, open, coupon, applyCoupon]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}
