import { Link, useNavigate, useRouterState, Outlet } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { claimAdmin } from "@/lib/admin.functions";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Users,
  MessageSquare,
  Star,
  Ticket,
  FileText,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Boxes,
  Sparkles,
  Megaphone,
  ArrowLeftRight,
  Mail,
  Award,
  Store,
  Home,
  Film,
  Layers,
  Instagram,
} from "lucide-react";

type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  perm?: string;
  indent?: boolean;
  dividerBefore?: string; // section header label
};

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package, perm: "products.manage" },
  { label: "Categories", to: "/admin/categories", icon: Tags, perm: "categories.manage" },
  { label: "Inventory", to: "/admin/inventory", icon: Boxes, perm: "products.manage" },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag, perm: "orders.manage" },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Reviews", to: "/admin/reviews", icon: Star, perm: "reviews.moderate" },
  { label: "Coupons", to: "/admin/coupons", icon: Ticket, perm: "coupons.manage" },
  { label: "Blog", to: "/admin/blog", icon: FileText, perm: "blog.manage" },
  { label: "Media", to: "/admin/media", icon: ImageIcon, perm: "media.manage" },
  // ── Homepage group ──
  { label: "Homepage Management", to: "/admin/homepage", icon: Home, perm: "settings.manage", dividerBefore: "HOMEPAGE" },
  { label: "↳ Hero Slider", to: "/admin/hero", icon: Layers, perm: "settings.manage", indent: true },
  { label: "↳ Videos & Stories", to: "/admin/stories", icon: Film, perm: "settings.manage", indent: true },
  // ── Other ──
  {
    label: "Who We Supply",
    to: "/admin/who-we-supply",
    icon: Store,
    perm: "settings.manage",
    dividerBefore: "OTHER",
  },
  { label: "Submissions", to: "/admin/submissions", icon: MessageSquare },
  { label: "Newsletter", to: "/admin/newsletter", icon: Mail, perm: "settings.manage" },
  { label: "Loyalty & Rewards", to: "/admin/loyalty", icon: Award, perm: "settings.manage" },
  { label: "Marketing & SEO", to: "/admin/marketing", icon: Megaphone, perm: "settings.manage" },
  { label: "Instagram Integration", to: "/admin/instagram", icon: Instagram, perm: "settings.manage" },
  { label: "Redirects", to: "/admin/redirects", icon: ArrowLeftRight, perm: "settings.manage" },
  { label: "Site Settings", to: "/admin/settings", icon: Settings, perm: "settings.manage" },
  { label: "Users & Roles", to: "/admin/users", icon: ShieldCheck, perm: "users.manage" },
  { label: "Audit Logs", to: "/admin/audit", icon: ClipboardList, perm: "audit.read" },
];

export function AdminShell() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const claim = useServerFn(claimAdmin);
  const [claiming, setClaiming] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [perms, setPerms] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/admin" } as never });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    // Fetch permissions via role_permissions × user_roles (RLS: user reads own roles)
    (async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const roleList = (roles ?? []).map((r) => r.role);
      if (!roleList.length) return setPerms(new Set());
      const { data: rp } = await supabase
        .from("role_permissions")
        .select("permission_key,role")
        .in("role", roleList);
      setPerms(new Set((rp ?? []).map((r) => r.permission_key)));
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream/50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-border p-8 text-center">
          <ShieldCheck className="mx-auto size-12 text-gold-deep" />
          <h1 className="mt-4 font-serif text-2xl text-forest-dark">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}.</p>
          <button
            disabled={claiming}
            onClick={async () => {
              setClaiming(true);
              try {
                const r = await claim({});
                if (r.claimed) {
                  toast.success("You are now the admin");
                  location.reload();
                } else toast.error("An admin already exists. Ask them to grant access.");
              } catch (e) {
                toast.error((e as Error).message);
              } finally {
                setClaiming(false);
              }
            }}
            className="mt-6 bg-forest-dark text-cream rounded-lg px-6 py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60"
          >
            {claiming ? "CLAIMING…" : "CLAIM ADMIN (FIRST USER)"}
          </button>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <Link to="/account" className="text-gold-deep hover:underline">
              Back to account
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="text-muted-foreground hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const visible = NAV.filter((n) => !n.perm || perms.has(n.perm) || isAdmin);

  return (
    <div className="min-h-screen bg-cream/40 flex">
      {/* Sidebar */}
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-forest-dark text-cream flex flex-col transition-transform`}
      >
        <div className="px-5 h-14 flex items-center border-b border-white/10">
          <Link to="/" className="font-serif text-lg tracking-wide">
            Saurashtra <span className="text-gold">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {visible.map((item) => {
            const active = item.to === "/admin" ? path === "/admin" : path.startsWith(item.to);
            return (
              <div key={item.to}>
                {item.dividerBefore && (
                  <div className="px-5 pt-4 pb-1 text-[10px] font-bold tracking-[0.15em] text-cream/30 uppercase select-none">
                    {item.dividerBefore}
                  </div>
                )}
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 py-2 text-sm transition ${
                    item.indent ? "pl-8 pr-5" : "px-5"
                  } ${
                    active
                      ? "bg-white/10 text-gold border-l-2 border-gold"
                      : item.indent
                      ? "text-cream/60 hover:bg-white/5 hover:text-cream/90"
                      : "text-cream/80 hover:bg-white/5 hover:text-cream"
                  }`}
                >
                  <item.icon className={`shrink-0 ${item.indent ? "size-3.5" : "size-4"}`} />
                  <span className={item.indent ? "text-[13px]" : ""}>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="text-xs text-cream/60 truncate mb-2">{user.email}</div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="flex-1 text-center text-[11px] font-bold tracking-widest bg-white/5 hover:bg-white/10 rounded px-2 py-2"
            >
              SITE
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="flex-1 inline-flex justify-center items-center gap-1 text-[11px] font-bold tracking-widest bg-white/5 hover:bg-white/10 rounded px-2 py-2"
            >
              <LogOut className="size-3" /> LOGOUT
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-14 bg-white border-b border-border sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-forest-dark">
              Admin
            </Link>
            {path !== "/admin" && (
              <span>
                {" "}
                /{" "}
                <span className="text-forest-dark font-semibold capitalize">
                  {path.split("/")[2]}
                </span>
              </span>
            )}
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
