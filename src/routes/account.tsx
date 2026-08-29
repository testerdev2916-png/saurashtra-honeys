import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { toast } from "sonner";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import {
  User, MapPin, Package, Heart, Mail, LogOut, Plus, Trash2, ShieldCheck, Bell, Star, Clock,
  Award, Lock, Settings, AlertTriangle, KeyRound,
} from "lucide-react";

const TABS = ["dashboard","profile","password","orders","addresses","wishlist","recent","reviews","notifications","newsletter","settings"] as const;
type Tab = (typeof TABS)[number];

const searchSchema = z.object({ tab: z.enum(TABS).optional() });

export const Route = createFileRoute("/account")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "My Account | Saurashtra Honey" },
      { name: "description", content: "Manage your profile, addresses, orders, wishlist, reviews and account preferences." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Account,
});

type Profile = { id: string; full_name: string | null; phone: string | null; newsletter_opt_in: boolean; email: string | null; avatar_url: string | null };
type Address = { id: string; label: string | null; full_name: string | null; line1: string; line2: string | null; city: string; state: string; pincode: string; country: string; phone: string | null; is_default: boolean };
type Order = { id: string; order_number: string | null; created_at: string; status: string; total_paise: number; payment_method: string; items: unknown; tracking_number: string | null };
type Review = { id: string; product_slug: string; rating: number; title: string | null; body: string | null; status: string; created_at: string; admin_reply: string | null; helpful_count: number };
type Notification = { id: string; kind: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string };

const NAV: Array<[Tab, typeof User, string]> = [
  ["dashboard", Award, "Dashboard"],
  ["orders", Package, "Orders"],
  ["wishlist", Heart, "Wishlist"],
  ["recent", Clock, "Recently viewed"],
  ["reviews", Star, "My reviews"],
  ["notifications", Bell, "Notifications"],
  ["addresses", MapPin, "Addresses"],
  ["profile", User, "Profile"],
  ["password", KeyRound, "Password"],
  ["newsletter", Mail, "Newsletter"],
  ["settings", Settings, "Settings"],
];

function Account() {
  const search = Route.useSearch();
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>((search.tab as Tab) ?? "dashboard");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const wl = useWishlist();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => { setTab((search.tab as Tab) ?? "dashboard"); }, [search.tab]);
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/account" } as never });
  }, [user, loading, navigate]);
  useEffect(() => { if (user) void loadAll(); /* eslint-disable-next-line */ }, [user]);

  async function loadAll() {
    if (!user) return;
    const [p, a, o, r, n] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("orders").select("id,order_number,created_at,status,total_paise,payment_method,items,tracking_number").order("created_at", { ascending: false }).limit(50),
      supabase.from("reviews").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]);
    setProfile((p.data as Profile) ?? { id: user.id, full_name: user.user_metadata?.full_name ?? "", phone: "", newsletter_opt_in: false, email: user.email ?? "", avatar_url: null });
    setAddresses((a.data as Address[]) ?? []);
    setOrders((o.data as Order[]) ?? []);
    setReviews((r.data as Review[]) ?? []);
    setNotifications((n.data as Notification[]) ?? []);
  }

  function goto(t: Tab) { setTab(t); navigate({ search: { tab: t } as never }); }

  if (loading || !user) return <SiteLayout><div className="container-page py-24 text-center text-muted-foreground">Loading…</div></SiteLayout>;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SiteLayout>
      <div className="container-page py-6 md:py-10 grid md:grid-cols-[250px_1fr] gap-6 md:gap-10 w-full max-w-full box-border px-4 sm:px-6">
        <aside className="md:sticky md:top-24 md:self-start space-y-1 w-full max-w-full min-w-0">
          <div className="bg-cream-deep/60 border border-border/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs w-full max-w-full box-border">
            <div className="text-xs text-muted-foreground font-medium">Signed in as</div>
            <div className="font-bold text-espresso text-sm mt-0.5 break-all [overflow-wrap:anywhere] leading-snug">{user.email}</div>
            {isAdmin && <Link to="/admin" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-burnt-orange hover:underline"><ShieldCheck className="size-3.5 shrink-0" /> <span>ADMIN DASHBOARD</span></Link>}
          </div>
          <div className="md:block flex items-center overflow-x-auto no-scrollbar gap-2 pb-3 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 w-full max-w-full">
            {NAV.map(([k, Icon, label]) => (
              <button key={k} onClick={() => goto(k)}
                className={`flex-none md:w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap font-semibold transition-all ${tab === k ? "bg-espresso text-cream shadow-sm" : "text-espresso bg-white/60 md:bg-transparent hover:bg-cream/70 border border-border/40 md:border-transparent"}`}>
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
                {k === "notifications" && unreadCount > 0 && <span className="ml-auto bg-destructive text-white rounded-full text-[10px] px-1.5 py-0.5 font-bold">{unreadCount}</span>}
                {k === "wishlist" && wl.count > 0 && <span className="ml-auto text-[10px] font-bold text-muted-foreground">{wl.count}</span>}
              </button>
            ))}
            <button onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="flex-none md:w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 whitespace-nowrap transition-colors border border-border/40 md:border-transparent">
              <LogOut className="size-4 shrink-0" /> <span>Sign out</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          {tab === "dashboard" && <DashboardTab profile={profile} orders={orders} wishlistCount={wl.count} unreadCount={unreadCount} onGo={goto} />}
          {tab === "profile" && profile && <ProfileTab profile={profile} onSaved={loadAll} />}
          {tab === "password" && <PasswordTab />}
          {tab === "addresses" && <AddressesTab addresses={addresses} userId={user.id} profileName={profile?.full_name ?? ""} onChanged={loadAll} />}
          {tab === "orders" && <OrdersTab orders={orders} />}
          {tab === "wishlist" && <WishlistTab />}
          {tab === "recent" && <RecentlyViewedTab />}
          {tab === "reviews" && <ReviewsTab reviews={reviews} onChanged={loadAll} />}
          {tab === "notifications" && <NotificationsTab notifications={notifications} onChanged={loadAll} />}
          {tab === "newsletter" && profile && <NewsletterTab profile={profile} onSaved={loadAll} />}
          {tab === "settings" && <SettingsTab email={user.email ?? ""} onSignedOut={async () => { await signOut(); navigate({ to: "/" }); }} />}
        </main>
      </div>
    </SiteLayout>
  );
}

/* -------- DASHBOARD -------- */
function DashboardTab({ profile, orders, wishlistCount, unreadCount, onGo }: { profile: Profile | null; orders: Order[]; wishlistCount: number; unreadCount: number; onGo: (t: Tab) => void }) {
  const totalSpent = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total_paise, 0);
  const active = orders.filter((o) => ["pending","paid","confirmed","processing","packed","shipped"].includes(o.status));
  return (
    <section className="space-y-6">
      <div>
        <SectionEyebrow>Dashboard</SectionEyebrow>
        <h1 className="mt-1 font-serif text-3xl font-bold text-espresso">Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-full">
        <StatCard label="Orders" value={String(orders.length)} onClick={() => onGo("orders")} />
        <StatCard label="Wishlist" value={String(wishlistCount)} onClick={() => onGo("wishlist")} />
        <StatCard label="Total spent" value={`₹${(totalSpent/100).toLocaleString()}`} />
        <StatCard label="Unread" value={String(unreadCount)} onClick={() => onGo("notifications")} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-soft">
          <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-4">Active orders</div>
          {active.length === 0 ? <p className="text-sm text-muted-foreground">Nothing on the way right now.</p> : (
            <ul className="space-y-3">
              {active.slice(0,3).map((o) => (
                <li key={o.id}>
                  <Link to="/order/$id" params={{ id: o.id }} className="flex justify-between items-center bg-cream-deep/40 rounded-xl p-3.5 text-sm hover:bg-cream-deep/80 transition-colors border border-border/60">
                    <span className="font-mono text-xs font-bold text-espresso">{o.order_number ?? o.id.slice(0,8)}</span>
                    <span className="text-[10px] uppercase text-burnt-orange font-bold tracking-wider px-2 py-0.5 bg-burnt-orange/10 rounded">{o.status}</span>
                    <span className="font-serif font-bold text-espresso">₹{(o.total_paise/100).toFixed(0)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-espresso text-cream rounded-2xl p-6 flex flex-col justify-between shadow-lg border border-white/10">
          <div>
            <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase">Reward points</div>
            <div className="font-serif text-4xl font-bold mt-2">Coming soon</div>
            <p className="text-xs text-cream/75 mt-1.5 leading-relaxed">Earn points on every order and redeem them for exclusive discounts.</p>
          </div>
          <Link to="/shop" className="mt-6 inline-flex items-center justify-center bg-burnt-orange text-white rounded-xl px-5 py-3 text-xs font-bold tracking-widest hover:bg-terracotta transition-all shadow-md">SHOP NOW</Link>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={!onClick} className={`text-left bg-white border border-border/80 rounded-2xl p-5 shadow-xs transition-all ${onClick ? "hover:border-burnt-orange hover:shadow-soft cursor-pointer" : "cursor-default"}`}>
      <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase">{label}</div>
      <div className="mt-1.5 font-serif text-2xl font-bold text-espresso">{value}</div>
    </button>
  );
}

/* -------- PROFILE -------- */
function ProfileTab({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const [form, setForm] = useState({ full_name: profile.full_name ?? "", phone: profile.phone ?? "" });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("profiles").upsert({ id: profile.id, full_name: form.full_name.trim(), phone: form.phone.trim(), email: profile.email });
      if (error) throw error;
      toast.success("Profile updated"); onSaved();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <section>
      <SectionEyebrow>Profile</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Your details</h1>
      <div className="mt-6 bg-card border border-border rounded-2xl p-5 md:p-6 max-w-lg space-y-3">
        <FieldWrap label="Full name"><input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inpCls} /></FieldWrap>
        <FieldWrap label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inpCls} /></FieldWrap>
        <FieldWrap label="Email"><input value={profile.email ?? ""} disabled className={inpCls + " opacity-60"} /></FieldWrap>
        <button disabled={busy} onClick={save} className="mt-2 bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60">{busy ? "SAVING…" : "SAVE"}</button>
      </div>
    </section>
  );
}

/* -------- PASSWORD -------- */
function PasswordTab() {
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next.length < 8) { toast.error("Use at least 8 characters"); return; }
    if (pw.next !== pw.confirm) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw.next });
      if (error) throw error;
      toast.success("Password updated"); setPw({ next: "", confirm: "" });
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }
  return (
    <section>
      <SectionEyebrow>Password</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Change password</h1>
      <form onSubmit={save} className="mt-6 bg-card border border-border rounded-2xl p-5 md:p-6 max-w-lg space-y-3">
        <FieldWrap label="New password"><input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inpCls} /></FieldWrap>
        <FieldWrap label="Confirm new password"><input type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inpCls} /></FieldWrap>
        <button disabled={busy} className="mt-2 bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60 inline-flex items-center gap-2"><Lock className="size-3.5" /> {busy ? "UPDATING…" : "UPDATE PASSWORD"}</button>
      </form>
    </section>
  );
}

/* -------- ADDRESSES -------- */
function AddressesTab({ addresses, userId, profileName, onChanged }: { addresses: Address[]; userId: string; profileName: string; onChanged: () => void }) {
  const empty = { label: "Home", full_name: profileName, line1: "", line2: "", city: "", state: "", pincode: "", country: "India", phone: "", is_default: addresses.length === 0 };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  async function add() {
    if (!form.line1 || !form.city || !form.state || !form.pincode) { toast.error("Fill line 1, city, state and pincode"); return; }
    setBusy(true);
    try {
      if (form.is_default) await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
      const { error } = await supabase.from("addresses").insert({ ...form, user_id: userId });
      if (error) throw error;
      setForm(empty); toast.success("Address added"); onChanged();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }
  async function del(id: string) {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChanged(); }
  }
  async function setDefault(id: string) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    toast.success("Default address updated"); onChanged();
  }
  return (
    <section>
      <SectionEyebrow>Shipping addresses</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Where should we deliver?</h1>
      <div className="mt-6 grid gap-3">
        {addresses.length === 0 && <div className="text-sm text-muted-foreground">No addresses yet. Add one below.</div>}
        {addresses.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-4 flex justify-between items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gold-deep">{a.label ?? "ADDRESS"}</span>
                {a.is_default && <span className="text-[10px] font-bold bg-forest-dark text-cream rounded px-1.5 py-0.5">DEFAULT</span>}
              </div>
              {a.full_name && <div className="mt-1 text-sm font-medium text-forest-dark">{a.full_name}</div>}
              <div className="text-sm">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pincode}</div>
              {a.phone && <div className="text-xs text-muted-foreground">📞 {a.phone}</div>}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              {!a.is_default && <button onClick={() => setDefault(a.id)} className="text-[10px] font-bold tracking-widest text-forest-dark hover:text-gold-deep">SET DEFAULT</button>}
              <button aria-label="Delete address" onClick={() => del(a.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-cream rounded-2xl p-5 md:p-6">
        <h3 className="font-semibold text-forest-dark flex items-center gap-2"><Plus className="size-4" /> Add address</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-2">
          <input placeholder="Label (Home, Office)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inpCls} />
          <input placeholder="Recipient name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inpCls} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inpCls} />
          <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inpCls} />
          <input placeholder="Address line 1 *" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={`md:col-span-2 ${inpCls}`} />
          <input placeholder="Address line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={`md:col-span-2 ${inpCls}`} />
          <input placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inpCls} />
          <input placeholder="State *" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inpCls} />
          <input placeholder="Pincode *" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={inpCls} />
          <label className="flex items-center gap-2 text-xs text-forest-dark md:col-span-2"><input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} /> Make default address</label>
        </div>
        <button disabled={busy} onClick={add} className="mt-3 bg-forest-dark text-cream rounded-lg px-5 py-2.5 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60">{busy ? "SAVING…" : "ADD ADDRESS"}</button>
      </div>
    </section>
  );
}

/* -------- ORDERS -------- */
function OrdersTab({ orders }: { orders: Order[] }) {
  return (
    <section>
      <SectionEyebrow>Order history</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Your orders</h1>
      <div className="mt-6 grid gap-3">
        {orders.length === 0 && <div className="text-sm text-muted-foreground">No orders yet. <Link to="/shop" className="text-gold-deep">Start shopping →</Link></div>}
        {orders.map((o) => {
          const items = (o.items as { name: string; qty: number; size: string }[]) ?? [];
          return (
            <Link to="/order/$id" params={{ id: o.id }} key={o.id}
              className="bg-card border border-border rounded-xl p-4 flex justify-between flex-wrap gap-3 hover:border-gold-deep transition-colors">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground font-mono">{o.order_number ?? `#${o.id.slice(0, 8)}`} • {new Date(o.created_at).toLocaleDateString()}</div>
                <div className="mt-1 text-sm font-medium text-forest-dark line-clamp-2">{items.map((i) => `${i.name} (${i.size}) × ${i.qty}`).join(", ")}</div>
                <div className="mt-1 text-xs uppercase text-muted-foreground">{o.payment_method}{o.tracking_number && ` · Tracking ${o.tracking_number}`}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-serif text-forest-dark">₹{(o.total_paise / 100).toFixed(0)}</div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-1">{o.status}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* -------- WISHLIST -------- */
function WishlistTab() {
  const wl = useWishlist();
  const { add } = useCart();
  const [all, setAll] = useState<Product[]>([]);
  useEffect(() => { void fetchProducts().then((r) => { if (r.length) setAll(r); }); }, []);
  const items = useMemo(() => {
    return all.filter((p) => wl.has(p.slug));
  }, [all, wl.slugs, wl]);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <SectionEyebrow>Wishlist</SectionEyebrow>
          <h1 className="mt-2 font-serif text-3xl text-forest-dark">Saved for later ({items.length})</h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={async () => {
              if (confirm("Clear all items from your wishlist?")) {
                await wl.clear();
                toast.success("Wishlist cleared");
              }
            }}
            className="text-xs font-bold tracking-widest text-muted-foreground hover:text-destructive border border-border px-3 py-1.5 rounded-lg"
          >
            CLEAR ALL
          </button>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && <div className="col-span-full text-sm text-muted-foreground">Tap the heart on any product to save it here.</div>}
        {items.map((p) => (
          <div key={p.slug} className="bg-card border border-border rounded-xl overflow-hidden">
            <Link to="/product/$slug" params={{ slug: p.slug }}><img src={p.image} alt={p.name} className="w-full aspect-square object-cover" /></Link>
            <div className="p-3">
              <div className="font-serif text-sm text-forest-dark leading-tight line-clamp-2">{p.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">₹{p.price}{p.priceMax ? ` – ₹${p.priceMax}` : ""}</div>
              <div className="mt-2 grid grid-cols-[1fr_auto] gap-1.5">
                <button onClick={() => { add(p); toast.success(`Added ${p.name}`); }} className="bg-forest-dark text-cream rounded-lg py-1.5 text-[11px] font-bold tracking-widest hover:bg-gold-deep">ADD TO CART</button>
                <button aria-label="Remove" onClick={() => wl.remove(p.slug)} className="text-muted-foreground hover:text-destructive border border-border rounded-lg px-2"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------- RECENTLY VIEWED -------- */
function RecentlyViewedTab() {
  const { slugs, clear } = useRecentlyViewed();
  const [all, setAll] = useState<Product[]>([]);
  useEffect(() => { void fetchProducts().then((r) => { if (r.length) setAll(r); }); }, []);
  const items = slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Product[];
  return (
    <section>
      <div className="flex flex-wrap justify-between items-end gap-2">
        <div>
          <SectionEyebrow>Recently viewed</SectionEyebrow>
          <h1 className="mt-2 font-serif text-3xl text-forest-dark">Recently viewed</h1>
        </div>
        {items.length > 0 && <button onClick={clear} className="text-xs font-bold tracking-widest text-forest-dark hover:text-destructive">CLEAR HISTORY</button>}
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && <div className="col-span-full text-sm text-muted-foreground">Nothing here yet. Browse a few products and they'll show up here.</div>}
        {items.map((p) => (
          <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold-deep">
            <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
            <div className="p-3">
              <div className="font-serif text-sm text-forest-dark leading-tight line-clamp-2">{p.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">₹{p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------- REVIEWS -------- */
function ReviewsTab({ reviews, onChanged }: { reviews: Review[]; onChanged: () => void }) {
  async function del(id: string) {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); onChanged(); }
  }
  return (
    <section>
      <SectionEyebrow>My reviews</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Reviews you've written</h1>
      <div className="mt-6 grid gap-3">
        {reviews.length === 0 && <div className="text-sm text-muted-foreground">You haven't reviewed anything yet.</div>}
        {reviews.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div className="min-w-0">
                <Link to="/product/$slug" params={{ slug: r.product_slug }} className="text-xs font-bold text-gold-deep uppercase tracking-widest hover:underline">{r.product_slug}</Link>
                <div className="mt-1 text-gold flex items-center gap-1">{"★".repeat(r.rating)}<span className="text-muted-foreground">{"☆".repeat(5-r.rating)}</span></div>
                {r.title && <div className="mt-1 font-serif text-lg text-forest-dark">{r.title}</div>}
                {r.body && <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{r.body}</p>}
                {r.admin_reply && (
                  <div className="mt-3 bg-cream rounded-lg p-3 text-xs">
                    <div className="font-bold text-forest-dark uppercase tracking-widest">Reply from Saurashtra Honey</div>
                    <p className="mt-1 text-forest-dark">{r.admin_reply}</p>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[10px] font-bold uppercase tracking-widest rounded px-2 py-0.5 ${r.status === "approved" ? "bg-forest text-cream" : r.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-cream text-forest-dark border border-border"}`}>{r.status}</span>
                <button onClick={() => del(r.id)} className="mt-2 block text-xs text-destructive hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------- NOTIFICATIONS -------- */
function NotificationsTab({ notifications, onChanged }: { notifications: Notification[]; onChanged: () => void }) {
  async function markAllRead() {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", ids);
    onChanged();
  }
  async function toggleRead(n: Notification) {
    await supabase.from("notifications").update({ read: !n.read }).eq("id", n.id); onChanged();
  }
  async function del(id: string) {
    await supabase.from("notifications").delete().eq("id", id); onChanged();
  }
  return (
    <section>
      <div className="flex justify-between items-end gap-3 flex-wrap">
        <div>
          <SectionEyebrow>Notifications</SectionEyebrow>
          <h1 className="mt-2 font-serif text-3xl text-forest-dark">Your notifications</h1>
        </div>
        {notifications.some((n) => !n.read) && <button onClick={markAllRead} className="text-xs font-bold tracking-widest text-forest-dark hover:text-gold-deep">MARK ALL READ</button>}
      </div>
      <div className="mt-6 grid gap-2">
        {notifications.length === 0 && <div className="text-sm text-muted-foreground">You're all caught up.</div>}
        {notifications.map((n) => (
          <div key={n.id} className={`rounded-xl border p-4 flex gap-3 items-start ${n.read ? "bg-card border-border" : "bg-cream border-gold/40"}`}>
            <span className={`size-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-muted" : "bg-gold-deep"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest-dark">{n.kind}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-1 font-medium text-forest-dark">{n.title}</div>
              {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
              {n.link && <a href={n.link} className="mt-1 inline-block text-[11px] font-bold tracking-widest text-gold-deep hover:underline">VIEW →</a>}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => toggleRead(n)} className="text-[10px] text-muted-foreground hover:text-forest-dark uppercase tracking-widest">{n.read ? "Unread" : "Read"}</button>
              <button onClick={() => del(n.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------- NEWSLETTER -------- */
function NewsletterTab({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const [opt, setOpt] = useState(profile.newsletter_opt_in);
  async function save() {
    const { error } = await supabase.from("profiles").upsert({ id: profile.id, newsletter_opt_in: opt });
    if (error) toast.error(error.message); else { toast.success("Preferences saved"); onSaved(); }
  }
  return (
    <section>
      <SectionEyebrow>Newsletter</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Stories from the hive</h1>
      <label className="mt-6 flex items-center gap-3 bg-card border border-border rounded-xl p-4 cursor-pointer max-w-lg">
        <input type="checkbox" checked={opt} onChange={(e) => setOpt(e.target.checked)} className="size-5" />
        <span className="text-sm">Send me recipes, honey tips and new-flora launches (about 2 emails a month).</span>
      </label>
      <button onClick={save} className="mt-4 bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-forest">SAVE</button>
    </section>
  );
}

/* -------- SETTINGS -------- */
function SettingsTab({ email, onSignedOut }: { email: string; onSignedOut: () => void }) {
  const [confirm, setConfirm] = useState("");
  async function requestDelete() {
    if (confirm !== "DELETE") { toast.error("Type DELETE to confirm"); return; }
    try {
      await supabase.from("form_submissions").insert({
        form_type: "account_deletion", email, name: email, subject: "Delete my account",
        message: "Customer requested account deletion from account settings.", meta: { requested_at: new Date().toISOString() },
      });
      toast.success("Deletion request received. We'll email you within 24 hours.");
      setConfirm("");
    } catch (e) { toast.error((e as Error).message); }
  }
  return (
    <section>
      <SectionEyebrow>Settings</SectionEyebrow>
      <h1 className="mt-2 font-serif text-3xl text-forest-dark">Account settings</h1>

      <div className="mt-6 bg-card border border-border rounded-2xl p-5 max-w-lg">
        <div className="text-[10px] tracking-widest font-bold text-forest-dark uppercase">Session</div>
        <p className="mt-2 text-sm text-muted-foreground">Sign out from this device.</p>
        <button onClick={onSignedOut} className="mt-3 border border-border rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-forest-dark hover:border-destructive hover:text-destructive inline-flex items-center gap-2"><LogOut className="size-3.5" /> SIGN OUT</button>
      </div>

      <div className="mt-4 bg-destructive/5 border border-destructive/30 rounded-2xl p-5 max-w-lg">
        <div className="text-[10px] tracking-widest font-bold text-destructive uppercase flex items-center gap-1"><AlertTriangle className="size-3" /> Danger zone</div>
        <h3 className="mt-2 font-semibold text-forest-dark">Delete my account</h3>
        <p className="mt-1 text-xs text-muted-foreground">This submits a deletion request to our team. Your orders will be kept for tax records; profile data will be permanently erased. Type <b>DELETE</b> to confirm.</p>
        <div className="mt-3 flex gap-2">
          <input value={confirm} onChange={(e) => setConfirm(e.target.value.toUpperCase())} placeholder="Type DELETE" className={inpCls + " flex-1"} />
          <button onClick={requestDelete} className="bg-destructive text-white rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-destructive/90">REQUEST DELETION</button>
        </div>
      </div>
    </section>
  );
}

const inpCls = "border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-gold-deep w-full";
function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-semibold text-forest-dark">{label}</span><div className="mt-1">{children}</div></label>;
}
