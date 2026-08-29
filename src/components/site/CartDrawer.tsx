import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X, BookmarkPlus, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { track } from "@/lib/analytics";
import { validateCouponFn } from "@/lib/coupons.functions";
import { toast } from "sonner";

export function CartDrawer() {
  const {
    items, saved, open, setOpen, updateQty, remove, subtotal, subtotalPaise, discount, clear,
    coupon, applyCoupon, moveToSaved, moveToCart, removeSaved, shippingWaived,
  } = useCart();
  const navigate = useNavigate();
  const validate = useServerFn(validateCouponFn);
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (open && items.length) {
      track("view_cart", {
        currency: "INR", value: subtotal,
        items: items.map((i) => ({ item_id: i.slug, item_name: i.name, item_variant: i.size, price: i.price, quantity: i.qty })),
      });
    }
  }, [open, items, subtotal]);

  const freeAt = 799;
  const remaining = Math.max(0, freeAt - (subtotal - discount));
  const pct = Math.min(100, Math.round(((subtotal - discount) / freeAt) * 100));
  const shipping = shippingWaived || (subtotal - discount) >= freeAt ? 0 : 49;
  const total = subtotal - discount + shipping;

  async function apply() {
    if (!code.trim()) return;
    setApplying(true);
    try {
      const r = await validate({ data: { code: code.trim(), subtotal_paise: subtotalPaise } });
      if (r.ok) {
        applyCoupon({ code: r.code, discount_paise: r.discount_paise, free_shipping: r.free_shipping, description: r.description });
        setCode("");
        toast.success(r.free_shipping ? `Coupon applied — free shipping!` : `Coupon applied — you saved ₹${(r.discount_paise / 100).toFixed(0)}`);
      } else { toast.error(r.error); }
    } catch (e) { toast.error((e as Error).message); } finally { setApplying(false); }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border space-y-1 text-left">
          <SheetTitle className="font-serif text-xl text-forest-dark flex items-center gap-2 pr-6">
            <ShoppingBag className="size-5 text-gold-deep shrink-0" /> Your Cart
          </SheetTitle>
          <div className="text-[11px] font-bold tracking-widest text-muted-foreground">
            {items.length === 0 ? "0 ITEMS" : `${items.reduce((n, i) => n + i.qty, 0)} ITEM${items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "S"}`}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto size-16 rounded-full bg-cream flex items-center justify-center text-gold-deep mb-3"><ShoppingBag className="size-6" /></div>
              <p className="text-sm font-medium text-forest-dark">Your cart is empty.</p>
              <p className="mt-1 text-xs text-muted-foreground">Discover naturally sourced honey from our collection.</p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="mt-5 inline-block bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-[11px] font-bold tracking-widest hover:bg-forest"
              >
                SHOP HONEY
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.slug + i.size} className="flex gap-3 bg-cream rounded-xl p-3">
                  <img src={i.image} alt={i.name} loading="lazy" width={80} height={80} className="size-20 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-serif text-sm text-forest-dark leading-tight truncate">{i.name}</div>
                        <div className="text-[11px] text-muted-foreground">Size: {i.size}</div>
                      </div>
                      <button aria-label="Remove" onClick={() => remove(i.slug, i.size)} className="text-muted-foreground hover:text-destructive shrink-0 p-1.5 -m-1.5"><Trash2 className="size-4" /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-border rounded-lg bg-background">
                        <button aria-label="Decrease quantity" onClick={() => updateQty(i.slug, i.size, i.qty - 1)} className="px-2.5 py-1.5"><Minus className="size-3" /></button>
                        <span className="px-2 text-xs tabular-nums min-w-[1.5rem] text-center">{i.qty}</span>
                        <button aria-label="Increase quantity" onClick={() => updateQty(i.slug, i.size, i.qty + 1)} className="px-2.5 py-1.5"><Plus className="size-3" /></button>
                      </div>
                      <div className="text-sm font-semibold text-forest-dark">₹{(i.price * i.qty).toLocaleString()}</div>
                    </div>
                    <button onClick={() => moveToSaved(i.slug, i.size)} className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-forest-dark/70 hover:text-gold-deep py-1">
                      <BookmarkPlus className="size-3" /> Save for later
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {saved.length > 0 && (
            <div>
              <div className="text-[10px] font-bold tracking-widest text-forest-dark mb-2">SAVED FOR LATER ({saved.length})</div>
              <ul className="space-y-2">
                {saved.map((i) => (
                  <li key={i.slug + i.size} className="flex gap-3 items-center bg-background border border-border rounded-xl p-2.5">
                    <img loading="lazy" src={i.image} alt="" className="size-12 rounded-md object-cover" />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-medium text-forest-dark truncate">{i.name}</div>
                      <div className="text-muted-foreground">{i.size} · ₹{i.price}</div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button onClick={() => moveToCart(i.slug, i.size)} className="text-[10px] font-bold tracking-widest text-gold-deep hover:underline inline-flex items-center gap-1"><ArrowUpRight className="size-3" />MOVE</button>
                      <button aria-label="Remove saved item" onClick={() => removeSaved(i.slug, i.size)} className="text-muted-foreground hover:text-destructive"><X className="size-3.5" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-3">
            {remaining > 0 && !shippingWaived ? (
              <div>
                <div className="text-[11px] text-forest-dark">₹{remaining} away from <b className="font-bold tracking-wide">FREE SHIPPING</b></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-cream overflow-hidden"><div className="h-full bg-gold-deep transition-all" style={{ width: `${pct}%` }} /></div>
              </div>
            ) : (
              <div className="text-[11px] font-bold tracking-widest text-gold-deep">YOU'VE UNLOCKED FREE SHIPPING</div>
            )}

            {coupon ? (
              <div className="flex items-center gap-2 bg-cream rounded-lg px-3 py-2">
                <Tag className="size-3.5 text-gold-deep" />
                <div className="flex-1 text-xs text-forest-dark"><b>{coupon.code}</b> applied {coupon.free_shipping ? "· free shipping" : `· −₹${(coupon.discount_paise/100).toFixed(0)}`}</div>
                <button aria-label="Remove coupon" onClick={() => applyCoupon(null)} className="text-muted-foreground hover:text-destructive"><X className="size-3.5" /></button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); void apply(); }} className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="flex-1 border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:border-gold-deep" />
                <button disabled={applying} className="bg-forest-dark text-cream rounded-lg px-4 text-[11px] font-bold tracking-widest hover:bg-forest disabled:opacity-60">{applying ? "…" : "APPLY"}</button>
              </form>
            )}

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex items-center justify-between text-gold-deep"><span>Discount</span><span>−₹{discount.toLocaleString()}</span></div>}
              <div className="flex items-center justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-forest-dark font-semibold text-sm">Total</span>
                <span className="font-serif text-2xl text-forest-dark">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); navigate({ to: "/checkout" }); }}
              className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest">
              CHECKOUT · ₹{total.toLocaleString()}
            </button>
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1"><ShieldCheck className="size-3 text-gold-deep" /> Secure</span>
              <span className="inline-flex items-center gap-1"><Truck className="size-3 text-gold-deep" /> Ships in 24–48 hrs</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <Link to="/shop" onClick={() => setOpen(false)} className="text-gold-deep font-semibold">Continue shopping</Link>
              <button onClick={clear} className="text-muted-foreground hover:text-destructive">Clear cart</button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
