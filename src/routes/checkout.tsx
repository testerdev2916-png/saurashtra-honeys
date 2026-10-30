import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { createOrder, verifyRazorpay } from "@/lib/orders.functions";
import { requestCodPhoneOtp, verifyCodPhoneOtp } from "@/lib/auth-otp.functions";
import { toast } from "sonner";
import { CreditCard, Truck, ShieldCheck, Package, UserCheck, Lock, Phone, CheckCircle2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | Saurashtra Honey" },
      {
        name: "description",
        content: "Complete your honey order with Cash on Delivery or secure online payment.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Checkout,
});

type SavedAddress = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string | null;
};

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => {
      open(): void;
      on(
        event: string,
        handler: (resp: { error?: { description?: string; code?: string } }) => void,
      ): void;
    };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Checkout() {
  const { items, subtotal, discount, shippingWaived, coupon, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const createOrderFn = useServerFn(createOrder);
  const verifyFn = useServerFn(verifyRazorpay);
  const requestCodOtpFn = useServerFn(requestCodPhoneOtp);
  const verifyCodOtpFn = useServerFn(verifyCodPhoneOtp);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [method, setMethod] = useState<"cod" | "razorpay">("cod");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [beganCheckout, setBeganCheckout] = useState(false);

  // Phone OTP Verification States for COD
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setInterval(() => setOtpCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [otpCooldown]);

  // Enforce mandatory sign-in for checkout: redirect unauthenticated visitors
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { redirect: "/checkout" } as never });
    }
  }, [user, loading, navigate]);

  // Fire begin_checkout exactly once after cart is confirmed non-empty
  useEffect(() => {
    if (beganCheckout || items.length === 0) return;
    setBeganCheckout(true);
    import("@/lib/analytics").then(({ track }) =>
      track("begin_checkout", {
        currency: "INR",
        value: subtotal,
        items: items.map((i) => ({
          item_id: i.slug,
          item_name: i.name,
          item_variant: i.size,
          price: i.price,
          quantity: i.qty,
        })),
      }),
    );
  }, [items, subtotal, beganCheckout]);

  // Prefill verified account email and existing profile information
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: addrs }, { data: profile }] = await Promise.all([
        supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("full_name, phone, phone_verified")
          .eq("id", user.id)
          .maybeSingle(),
      ]);
      setAddresses((addrs as SavedAddress[]) ?? []);
      if (addrs && addrs.length > 0) setSelected(addrs[0].id);

      const pData = profile as unknown as {
        full_name?: string;
        phone?: string;
        phone_verified?: boolean;
      } | null;

      if (pData?.phone && pData?.phone_verified) {
        setVerifiedPhone(pData.phone);
      }

      setForm((f) => ({
        ...f,
        email: user.email ?? "",
        full_name: f.full_name || pData?.full_name || (user.user_metadata?.full_name ?? ""),
        phone: f.phone || pData?.phone || "",
      }));
    })();
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    const a = addresses.find((x) => x.id === selected);
    if (a)
      setForm((f) => ({
        ...f,
        line1: a.line1,
        line2: a.line2 ?? "",
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        phone: a.phone ?? f.phone,
      }));
  }, [selected, addresses]);

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = shippingWaived || discountedSubtotal >= 799 ? 0 : 49;
  const total = discountedSubtotal + shipping;

  async function handleSendCodOtp() {
    if (!form.phone.trim()) {
      toast.error("Please enter your mobile phone number first.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await requestCodOtpFn({ data: { phone: form.phone.trim() } });
      toast.success(`Verification code sent to ${res.phone}`);
      setOtpCooldown(res.cooldownSeconds || 60);
    } catch (e) {
      toast.error((e as Error).message || "Could not send verification code.");
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyAndCompleteCod() {
    if (!otpCode || otpCode.trim().length < 4) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await verifyCodOtpFn({
        data: { phone: form.phone.trim(), otp: otpCode.trim() },
      });
      toast.success(res.message || "Mobile number verified!");
      setVerifiedPhone(form.phone.trim());
      setShowOtpModal(false);
      setOtpCode("");
      void executeOrderPlacement(form.phone.trim());
    } catch (e) {
      toast.error((e as Error).message || "Invalid or expired OTP code.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  async function place() {
    if (busy) return;
    if (!user) {
      toast.error("Please sign in or create an account to complete your order.");
      navigate({ to: "/auth", search: { redirect: "/checkout" } as never });
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (
      !form.full_name ||
      !form.email ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      toast.error("Please fill your name, contact phone, and full shipping address");
      return;
    }

    // Cash on Delivery OTP Verification Enforcement
    if (method === "cod") {
      const cleanInput = form.phone.trim().replace(/\D/g, "").slice(-10);
      const cleanVerified = verifiedPhone ? verifiedPhone.trim().replace(/\D/g, "").slice(-10) : "";
      const isVerified = cleanVerified && cleanInput === cleanVerified;

      if (!isVerified) {
        setShowOtpModal(true);
        void handleSendCodOtp();
        return;
      }
    }

    await executeOrderPlacement(form.phone);
  }

  async function executeOrderPlacement(confirmedPhone: string) {
    setBusy(true);
    const watchdog = setTimeout(() => {
      setBusy(false);
      toast.error("This is taking longer than expected. Please try again.");
    }, 30000);

    try {
      const payload = {
        data: {
          full_name: form.full_name,
          email: form.email,
          phone: confirmedPhone,
          shipping: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          items: items.map((i) => ({
            slug: i.slug,
            name: i.name,
            size: i.size,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
          payment_method: method,
          notes: notes || undefined,
          coupon_code: coupon?.code,
        },
      };

      const res = await createOrderFn(payload);

      const purchasePayload = {
        transaction_id: res.orderId,
        currency: "INR",
        value: total,
        shipping,
        items: items.map((i) => ({
          item_id: i.slug,
          item_name: i.name,
          item_variant: i.size,
          price: i.price,
          quantity: i.qty,
        })),
      };

      if (method === "cod") {
        const { track } = await import("@/lib/analytics");
        track("purchase", purchasePayload);
        clear();
        toast.success("Order placed successfully!", {
          description: "We'll call to confirm within 24 hours.",
        });
        navigate({ to: "/order/$id", params: { id: res.orderId } });
        return;
      }

      if (!res.razorpay)
        throw new Error(
          "Payment could not be started. Please choose Cash on Delivery or try again.",
        );
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay)
        throw new Error("Could not load the payment gateway. Please check your connection.");

      const rp = new window.Razorpay({
        key: res.razorpay.keyId.trim(),
        name: "Saurashtra Honey",
        description: `Order ${res.orderNumber || res.orderId.slice(0, 8)}`,
        order_id: res.razorpay.orderId,
        prefill: { name: form.full_name, email: form.email, contact: form.phone },
        theme: { color: "#2B1B14" },
        handler: async (r: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyFn({ data: { order_id: res.orderId, ...r } });
            const { track } = await import("@/lib/analytics");
            track("purchase", purchasePayload);
            clear();
            toast.success("Payment successful!");
            navigate({ to: "/order/$id", params: { id: res.orderId } });
          } catch (e) {
            toast.error((e as Error).message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setBusy(false);
          },
        },
      });

      rp.on(
        "payment.failed",
        function (response: { error?: { description?: string; code?: string } }) {
          console.error("Razorpay Payment Failed:", response.error);
          toast.error(`Payment failed: ${response.error?.description ?? "Transaction declined"}`);
        },
      );

      rp.open();
      setBusy(false);
    } catch (e) {
      const msg = (e as Error).message || "Could not place order. Please try again.";
      const clean = /^(fetch|network|failed to fetch|typeerror)/i.test(msg)
        ? "Network issue. Please check your connection and try again."
        : msg;
      toast.error(clean);
    } finally {
      clearTimeout(watchdog);
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Lock className="size-4 animate-spin text-burnt-orange" />
            <span>Verifying customer account…</span>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center max-w-md mx-auto">
          <Lock className="mx-auto size-12 text-burnt-orange" />
          <h1 className="mt-4 font-serif text-3xl font-bold text-espresso">Sign In Required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in or create an account before checkout. Your cart items are safely
            preserved.
          </p>
          <Link
            to="/auth"
            search={{ redirect: "/checkout" } as never}
            className="mt-6 inline-block bg-espresso text-cream px-6 py-3 rounded-xl text-xs font-bold tracking-widest hover:bg-burnt-orange transition-colors"
          >
            SIGN IN TO CONTINUE
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <Package className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif text-3xl font-bold text-espresso">Your cart is empty</h1>
          <Link
            to="/shop"
            className="mt-4 inline-block text-burnt-orange font-semibold hover:text-terracotta"
          >
            Browse honey →
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const freeShipRemaining = Math.max(0, 799 - subtotal);
  const freePct = Math.min(100, Math.round((subtotal / 799) * 100));

  return (
    <SiteLayout>
      <div className="container-page py-6 md:py-10 grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8">
        <div>
          <SectionEyebrow>Checkout</SectionEyebrow>
          <h1 className="mt-1 md:mt-2 font-serif text-2xl md:text-4xl font-bold text-espresso">
            Complete your order
          </h1>

          {/* Progress + trust strip */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-burnt-orange" /> Secure SSL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-3.5 text-burnt-orange" /> Free shipping ₹799+
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Package className="size-3.5 text-burnt-orange" /> Ships in 24–48 hrs
            </span>
          </div>

          {/* Verified user authentication badge */}
          <div className="mt-4 bg-cream/90 border border-burnt-orange/30 rounded-xl p-3 text-xs text-espresso flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <UserCheck className="size-4 text-burnt-orange shrink-0" />
              <span className="truncate">
                Signed in as <b className="font-semibold text-espresso">{user.email}</b>
              </span>
            </div>
            <Link
              to="/account"
              className="text-[11px] font-bold tracking-wider text-burnt-orange hover:underline shrink-0"
            >
              MY ACCOUNT
            </Link>
          </div>

          {addresses.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-bold tracking-widest text-espresso">SAVED ADDRESSES</div>
              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`bg-card border rounded-xl p-3 cursor-pointer text-xs transition-all ${selected === a.id ? "border-burnt-orange bg-cream shadow-sm" : "border-border"}`}
                  >
                    <input
                      type="radio"
                      name="addr"
                      checked={selected === a.id}
                      onChange={() => setSelected(a.id)}
                      className="mr-2"
                    />
                    <span className="font-bold text-burnt-orange">{a.label ?? "Address"}</span>
                    <div className="mt-1 text-espresso">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pincode}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 bg-card border border-border rounded-2xl p-4 md:p-6 space-y-3 shadow-sm">
            <div className="text-xs font-bold tracking-widest text-espresso">CONTACT DETAILS</div>
            <div className="grid sm:grid-cols-2 gap-2">
              <input
                placeholder="Full name *"
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
              <input
                placeholder="Phone number *"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
              <div className="sm:col-span-2">
                <input
                  placeholder="Verified account email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  readOnly
                  className="w-full border border-border/80 rounded-lg px-3 py-2.5 text-sm bg-muted/40 min-w-0 text-muted-foreground cursor-not-allowed focus:outline-none"
                />
                <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="size-3 text-burnt-orange" /> Verified email linked to your
                  account order history
                </div>
              </div>
            </div>

            <div className="text-xs font-bold tracking-widest text-espresso mt-4">
              SHIPPING ADDRESS
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <input
                placeholder="Address line 1 *"
                autoComplete="address-line1"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                className="sm:col-span-2 border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
              <input
                placeholder="Address line 2"
                autoComplete="address-line2"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                className="sm:col-span-2 border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
              <input
                placeholder="City *"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
              <input
                placeholder="State *"
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
              <input
                placeholder="Pincode *"
                autoComplete="postal-code"
                inputMode="numeric"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Order notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:border-burnt-orange focus:outline-none"
            />
          </div>

          <div className="mt-5">
            <div className="text-xs font-bold tracking-widest text-espresso">PAYMENT METHOD</div>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              <label
                className={`bg-card border rounded-xl p-4 cursor-pointer flex gap-3 items-start transition-all ${method === "cod" ? "border-burnt-orange bg-cream shadow-sm" : "border-border"}`}
              >
                <input
                  type="radio"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-espresso flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <Truck className="size-4" /> Cash on Delivery
                    </span>
                    {verifiedPhone &&
                    form.phone &&
                    form.phone.trim().replace(/\D/g, "").slice(-10) ===
                      verifiedPhone.trim().replace(/\D/g, "").slice(-10) ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle2 className="size-3" /> Phone Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-burnt-orange bg-burnt-orange/10 px-2 py-0.5 rounded">
                        <Phone className="size-3" /> OTP Required
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Pay when you receive. Verified mobile number required to prevent fake bookings.
                  </div>
                </div>
              </label>
              <label
                className={`bg-card border rounded-xl p-4 cursor-pointer flex gap-3 items-start transition-all ${method === "razorpay" ? "border-burnt-orange bg-cream shadow-sm" : "border-border"}`}
              >
                <input
                  type="radio"
                  checked={method === "razorpay"}
                  onChange={() => setMethod("razorpay")}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-espresso flex items-center gap-2">
                    <CreditCard className="size-4" /> Online payment
                  </div>
                  <div className="text-xs text-muted-foreground">
                    UPI, cards, netbanking via Razorpay
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="bg-cream rounded-2xl md:rounded-3xl p-4 md:p-6 border border-border/70 shadow-sm">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-espresso">
              Order summary
            </h3>

            {freeShipRemaining > 0 ? (
              <div className="mt-3">
                <div className="text-[11px] text-espresso">
                  Add <b>₹{freeShipRemaining}</b> more for <b>FREE</b> shipping
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-burnt-orange transition-all"
                    style={{ width: `${freePct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-3 text-[11px] font-semibold text-burnt-orange">
                🎉 You've unlocked FREE shipping
              </div>
            )}

            <div className="mt-4 divide-y divide-border max-h-72 overflow-y-auto">
              {items.map((i) => (
                <div key={i.slug + i.size} className="py-3 flex gap-3">
                  <img
                    src={i.image}
                    alt={i.name}
                    className="size-14 rounded-lg object-cover object-center shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0 text-sm">
                    <div className="font-medium text-espresso truncate">{i.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.size} × {i.qty}
                    </div>
                  </div>
                  <div className="text-sm font-semibold shrink-0">₹{i.price * i.qty}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-burnt-orange">
                  <span>Coupon {coupon?.code && `(${coupon.code})`}</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-serif text-lg md:text-xl font-bold text-espresso pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button
              disabled={busy}
              onClick={place}
              className="mt-5 w-full bg-espresso text-cream rounded-lg py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange disabled:opacity-60 transition-all shadow-sm"
            >
              {busy
                ? "PLACING…"
                : method === "cod"
                  ? `PLACE COD ORDER · ₹${total}`
                  : `PAY ₹${total}`}
            </button>
            <div className="mt-3 space-y-1.5 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-burnt-orange" /> Secure — no card data touches
                our servers
              </div>
              <div className="flex items-center gap-1.5">
                <Package className="size-3 text-burnt-orange" /> Easy replacement within 7 days if
                damaged
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky mobile summary bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</div>
          <div className="font-serif text-lg font-bold text-espresso leading-none">₹{total}</div>
        </div>
        <button
          disabled={busy}
          onClick={place}
          className="flex-1 bg-espresso text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-burnt-orange disabled:opacity-60 transition-colors"
        >
          {busy ? "PLACING…" : method === "cod" ? "PLACE ORDER" : `PAY ₹${total}`}
        </button>
      </div>

      {/* COD Mandatory Mobile Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-cream border border-burnt-orange/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-espresso">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-espresso p-1 text-sm font-bold"
            >
              ✕
            </button>
            <div className="size-12 rounded-2xl bg-burnt-orange/15 flex items-center justify-center text-burnt-orange mx-auto mb-3">
              <Phone className="size-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-center text-espresso">
              Verify Mobile Number
            </h3>
            <p className="mt-2 text-xs text-center text-muted-foreground leading-relaxed">
              To prevent fake orders and confirm your Cash on Delivery booking, we sent a 6-digit code
              to <b className="text-espresso">{form.phone}</b>.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider text-espresso mb-1 text-center">
                  ENTER 6-DIGIT OTP CODE
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3.5 bg-white border border-border rounded-xl focus:outline-none focus:border-burnt-orange shadow-inner"
                />
              </div>

              <button
                disabled={verifyingOtp || otpCode.length < 4}
                onClick={handleVerifyAndCompleteCod}
                className="w-full bg-espresso text-cream font-bold text-xs tracking-widest py-3.5 rounded-xl hover:bg-burnt-orange transition-colors disabled:opacity-60 shadow-sm"
              >
                {verifyingOtp ? "VERIFYING OTP…" : "VERIFY & PLACE COD ORDER"}
              </button>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <button
                  type="button"
                  disabled={otpCooldown > 0 || sendingOtp}
                  onClick={handleSendCodOtp}
                  className="font-semibold text-burnt-orange hover:underline disabled:opacity-50"
                >
                  {sendingOtp
                    ? "Sending…"
                    : otpCooldown > 0
                      ? `Resend OTP in ${otpCooldown}s`
                      : "Resend Code"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="hover:underline text-muted-foreground"
                >
                  Change number
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
