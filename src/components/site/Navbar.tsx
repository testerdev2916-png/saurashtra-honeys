import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingBag, User, Search, Menu, X, ShieldCheck, Heart, ChevronRight,
  Sparkles, Flame, Gift, Leaf, Package, Bell,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BrandMark, BeeLogo } from "./BeeLogo";
import { TopBar } from "./TopBar";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchShopCategories, DEFAULT_SHOP_CATEGORIES, type ShopCategory } from "@/lib/category-catalog";
import { getCategorySlug } from "@/lib/collection-helpers";

type PrimaryLink = { to: string; label: string; hash?: string };
const primaryLinks: readonly PrimaryLink[] = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "Our Story" },
  { to: "/blog", label: "Journal" },
  { to: "/bulk-gifting", label: "Bulk & Gifting" },
  { to: "/contact", label: "Contact" },
] as const;

const categoryIcons: Record<string, typeof Leaf> = {
  "Single Flora": Leaf, Multiflora: Sparkles, "Raw Honey": Flame, "Honey Comb": Sparkles, "Gift Packs": Gift,
};

const HISTORY_KEY = "sh_search_history_v1";
const POPULAR = ["Ajwain honey", "Gift packs", "Honey comb", "Lychee", "Multiflora"];

function readHistory(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as string[]; } catch { return []; }
}
function pushHistory(q: string) {
  const list = readHistory().filter((x) => x.toLowerCase() !== q.toLowerCase());
  list.unshift(q);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 6))); } catch {/* ignore */}
}

// These will be loaded dynamically
// const uniqueCategories = ...

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<ShopCategory[]>(DEFAULT_SHOP_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featuredForMenu, setFeaturedForMenu] = useState<Product[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  useEffect(() => {
    void fetchShopCategories().then((res) => {
      if (res.length > 0) setDbCategories(res);
    });
    void fetchProducts().then((res) => {
      if (res.length > 0) {
        setProducts(res);
        setUniqueCategories(Array.from(new Set(res.map((p) => p.category))));
        const bs = res.filter((p) => p.badge === "BESTSELLER").slice(0, 3);
        const na = res.filter((p) => p.badge === "NEW").slice(0, 3);
        setBestSellers(bs);
        setNewArrivals(na);
        setFeaturedForMenu((na.length ? na : res).slice(0, 3));
      }
    });
  }, []);
  const navCategories = useMemo(() => {
    const names = dbCategories.map((c) => c.name);
    return names.length > 0 ? names : Array.from(new Set(products.map((p) => p.category)));
  }, [dbCategories]);
  const { count, setOpen: setCartOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterShop = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShopOpen(true);
  };

  const handleMouseLeaveShop = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setShopOpen(false);
    }, 280);
  };

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        if (currentScrollY < 30 || mobileOpen) {
          setIsHidden(false);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }
        const delta = currentScrollY - lastScrollY.current;
        if (Math.abs(delta) > 8) {
          if (delta > 0 && currentScrollY > 80) {
            setIsHidden(true);
          } else if (delta < 0) {
            setIsHidden(false);
          }
          lastScrollY.current = currentScrollY;
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { setHistory(readHistory()); }, [searchOpen, mobileOpen]);

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    (async () => {
      const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false);
      setUnread(count ?? 0);
    })();
  }, [user]);

  const suggestions = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products
      .filter((p) => [p.name, p.category, p.flora ?? "", ...(p.benefits ?? [])].join(" ").toLowerCase().includes(t))
      .slice(0, 6);
  }, [q]);

  const doSearch = (term?: string) => {
    const t = (term ?? q).trim();
    if (!t) return;
    pushHistory(t);
    setSearchOpen(false); setMobileOpen(false); setQ("");
    navigate({ to: "/shop", search: { q: t } as never });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-transform duration-300 ease-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <TopBar />
      <div className="bg-cream/95 backdrop-blur-xl border-b border-border/80 shadow-soft transition-all">
        <div className="container-page">
        {/* Mobile row: MENU + LOGO | SEARCH + CART */}
        <div className="flex items-center justify-between h-[80px] px-2 lg:hidden w-full relative">
          {/* Left group: Hamburger */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="p-3 active:scale-95 transition-transform text-[#2B2118] hover:text-[#D97706] min-h-[48px] min-w-[48px] flex items-center justify-center shrink-0"
            >
              <Menu className="size-[26px] stroke-[1.5]" />
            </button>
          </div>

          <Link to="/" aria-label="Saurashtra Honey home" className="absolute left-1/2 -translate-x-1/2 flex items-center min-w-0 shrink-0 top-1/2 -translate-y-1/2">
            <BrandMark />
          </Link>

          {/* Right group: Search + Cart */}
          <div className="flex items-center gap-1 shrink-0 text-[#2B2118]">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="p-3 active:scale-95 transition-transform hover:text-[#D97706] min-h-[48px] min-w-[48px] flex items-center justify-center shrink-0"
            >
              <Search className="size-[22px] stroke-[1.5]" />
            </button>
            <button
              type="button"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="p-3 active:scale-95 transition-transform hover:text-[#D97706] min-h-[48px] min-w-[48px] flex items-center justify-center shrink-0 relative"
            >
              <ShoppingBag className="size-[22px] stroke-[1.5]" />
              {count > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop row */}
        <div className="hidden lg:flex items-center justify-between h-[100px] relative">
          <nav className="flex items-center gap-7 text-[13.5px] lg:-ml-[190px]">
            {primaryLinks.map((l, idx) => {
              const isShop = l.to === "/shop";
              const isHome = l.label === "Home";
              return (
                <div 
                  key={idx} 
                  className="relative" 
                  onMouseEnter={() => { if (isShop) handleMouseEnterShop(); }}
                  onMouseLeave={() => { if (isShop) handleMouseLeaveShop(); }}
                >
                  {l.hash ? (
                    <a
                      href={`/#${l.hash}`}
                      onClick={(e) => {
                        const el = document.getElementById(l.hash!);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-foreground/90 hover:text-brand-orange transition-colors relative py-2 font-semibold tracking-wide"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      activeOptions={{ exact: isHome }}
                      className="text-foreground/90 hover:text-brand-orange transition-colors relative py-2 font-semibold tracking-wide [&.active]:text-brand-orange [&.active]:after:content-[''] [&.active]:after:absolute [&.active]:after:-bottom-1 [&.active]:after:left-0 [&.active]:after:right-0 [&.active]:after:h-0.5 [&.active]:after:bg-brand-orange"
                      preload={false}
                    >
                      {l.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <Link to="/" aria-label="Saurashtra Honey home" className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shrink-0">
            <BrandMark />
          </Link>

          <div className="flex items-center gap-4 text-foreground/80 justify-self-end shrink-0">
            <button aria-label="Search" className="hover:text-burnt-orange transition-colors" onClick={() => setSearchOpen((s) => !s)}>
              <Search className="size-5" />
            </button>
            {isAdmin && (
              <Link to="/admin" aria-label="Admin" className="hover:text-burnt-orange"><ShieldCheck className="size-5" /></Link>
            )}
            <Link to="/wishlist" aria-label="Wishlist" className="relative hover:text-burnt-orange transition-colors">
              <Heart className="size-5" />
              {wishCount > 0 && <span className="absolute -top-2 -right-2 bg-burnt-orange text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">{wishCount}</span>}
            </Link>
            {user && (
              <Link to="/account" search={{ tab: "notifications" } as never} aria-label="Notifications" className="relative hover:text-burnt-orange transition-colors">
                <Bell className="size-5" />
                {unread > 0 && <span className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center">{unread}</span>}
              </Link>
            )}
            <Link to={user ? "/account" : "/auth"} aria-label={user ? "Account" : "Sign in"} className="hover:text-gold-deep transition-colors">
              <User className="size-5" />
            </Link>
            <button aria-label="Cart" className="relative hover:text-gold-deep transition-colors" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="size-5" />
              {count > 0 && <span className="absolute -top-2 -right-2 bg-gold-deep text-cream text-[10px] font-bold size-4 rounded-full flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu — Shop (desktop) */}
      <div className={`hidden lg:block absolute left-0 right-0 top-full border-t border-border/60 bg-[#FDFBF7] shadow-xl origin-top transition-all duration-[350ms] ease-out ${shopOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        onMouseEnter={handleMouseEnterShop} onMouseLeave={handleMouseLeaveShop}>
        <div className="w-full max-w-[1400px] mx-auto py-12 px-6 xl:px-12">
          <div className="grid grid-cols-7 gap-4 xl:gap-8 w-full items-start">
            {(() => {
              // Reorder to match requested design if possible, fallback to DB order
              const desiredOrder = ["Honey", "Beeswax", "Bee Pollen", "Beeswax Candles", "Beeswax Products", "Beauty Products", "Gift Hamper"];
              let orderedCats = desiredOrder.map(name => dbCategories.find(c => c.name.toLowerCase() === name.toLowerCase() || c.name.toLowerCase() === name.toLowerCase() + "s")).filter(Boolean) as typeof dbCategories;
              
              // If we didn't find all requested categories, append the rest
              const remaining = dbCategories.filter(c => !orderedCats.find(o => o.slug === c.slug));
              const displayCats = [...orderedCats, ...remaining].filter(c => c.slug !== "all-products");

              return displayCats.map((cat) => (
                <Link key={cat.slug} to={cat.slug === "all-products" ? "/shop" : "/shop/$slug"} params={cat.slug === "all-products" ? undefined : { slug: cat.slug }} onClick={() => setShopOpen(false)} className="group flex flex-col items-center text-center gap-4 outline-none w-full">
                  <div className="w-full max-w-[140px] aspect-square rounded-[20px] overflow-hidden bg-white shadow-sm border border-border/40 group-hover:shadow-md transition-all duration-300">
                    <img src={cat.image_url || undefined} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <span className="font-serif text-[14px] xl:text-[15px] text-espresso group-hover:text-brand-orange transition-colors leading-tight px-1">
                    {cat.name}
                  </span>
                </Link>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Search dropdown (desktop + mobile) */}
      {searchOpen && (
        <div className="border-t border-border bg-cream animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={(e) => { e.preventDefault(); doSearch(); }} className="container-page py-4">
            <div className="flex gap-2">
              <input ref={searchRef} autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search honey, gift packs, ajwain…"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold-deep" />
              <button className="bg-forest-dark text-cream rounded-lg px-5 text-xs font-bold tracking-widest hover:bg-forest">SEARCH</button>
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} className="rounded-lg px-3 border border-border hover:bg-cream-deep">
                <X className="size-4" />
              </button>
            </div>
            {suggestions.length > 0 ? (
              <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                {suggestions.map((p) => (
                  <li key={p.slug}>
                    <Link to="/product/$slug" params={{ slug: p.slug }} onClick={() => { setSearchOpen(false); setQ(""); }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream-deep">
                      <img loading="lazy" src={p.image} alt="" className="size-10 rounded object-cover" />
                      <span className="flex-1 text-sm truncate">{p.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">₹{p.price}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 grid sm:grid-cols-2 gap-4 text-[11px]">
                {history.length > 0 && (
                  <div>
                    <div className="tracking-widest font-bold text-forest-dark uppercase mb-1.5">Recent searches</div>
                    <div className="flex flex-wrap gap-1.5">
                      {history.map((h) => (
                        <button key={h} type="button" onClick={() => doSearch(h)} className="px-2.5 py-1 rounded-full border border-border bg-background hover:border-gold-deep text-forest-dark">{h}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="tracking-widest font-bold text-forest-dark uppercase mb-1.5">Popular</div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR.map((h) => (
                      <button key={h} type="button" onClick={() => doSearch(h)} className="px-2.5 py-1 rounded-full bg-forest-dark text-cream hover:bg-forest">{h}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Mobile drawer (Portal to document.body so it is never clipped by sticky header stacking context) */}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={`lg:hidden fixed inset-0 z-[9999] overflow-hidden transition-all duration-300 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-hidden={!mobileOpen}
          >
            <button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setMobileOpen(false)}
              className={`absolute inset-0 bg-espresso/60 backdrop-blur-xs transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
            />
            <aside
              className={`absolute inset-y-0 left-0 w-[min(86vw,340px)] bg-cream shadow-lift flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              {/* Drawer Header: LOGO + X */}
              <div className="flex items-center justify-between p-4 border-b border-border min-h-[64px]">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 min-w-0">
                  <BeeLogo className="max-h-[56px] w-auto object-contain shrink-0" />
                  <div className="min-w-0">
                    <span className="block font-serif text-[16px] font-bold text-espresso truncate">Saurashtra Honey</span>
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-burnt-orange font-semibold truncate">Bee Farm</span>
                  </div>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 -mr-2 min-h-11 min-w-11 flex items-center justify-center text-espresso hover:text-burnt-orange transition-colors"
                >
                  <X className="size-6" />
                </button>
              </div>

              {/* Drawer Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-3">
                <ul className="space-y-1">
                  {primaryLinks.map((l, idx) => {
                    const isShop = l.to === "/shop";

                    return (
                    <li key={idx}>
                      {isShop ? (
                        <div className="rounded-xl overflow-hidden mb-1">
                          <button
                            onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                            className={`w-full flex items-center justify-between px-3 py-3 text-[15px] font-semibold text-espresso transition-colors ${mobileShopExpanded ? 'bg-[#F8F5EF] text-brand-orange' : 'hover:bg-[#F8F5EF]'}`}
                          >
                            {l.label}
                            <ChevronRight className={`size-4 text-muted-foreground transition-transform duration-300 ${mobileShopExpanded ? 'rotate-90 text-brand-orange' : ''}`} />
                          </button>
                          
                          {/* Shop Mobile Accordion Content */}
                          <div className={`overflow-hidden transition-all duration-300 ${mobileShopExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-3 pb-4 pt-1 bg-[#F8F5EF]/50 flex flex-col gap-6">
                              
                              {/* Categories */}
                              <div>
                                <p className="text-[10px] tracking-wide text-brand-orange font-bold mb-3">Shop by Category</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {dbCategories.filter(c => c.slug !== "all-products").map((cat) => (
                                    <Link key={cat.slug} to={cat.slug === "all-products" ? "/shop" : "/shop/$slug"} params={cat.slug === "all-products" ? undefined : { slug: cat.slug }} onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-border/50 shadow-sm">
                                      <img loading="lazy" src={cat.image_url || undefined} alt="" className="size-7 rounded object-cover" />
                                      <span className="text-[13px] font-medium text-espresso truncate">{cat.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Best Sellers */}
                              <div>
                                <p className="text-[10px] tracking-wide text-brand-orange font-bold mb-3">Best Sellers</p>
                                <ul className="space-y-3">
                                  {bestSellers.map(p => (
                                    <li key={p.slug}>
                                      <Link to="/product/$slug" params={{ slug: p.slug }} onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                                        <img loading="lazy" src={p.image} alt="" className="size-10 rounded-md object-cover border border-border/50" />
                                        <div className="flex flex-col">
                                          <span className="text-[13px] font-medium text-espresso truncate">{p.name}</span>
                                          <span className="text-[11px] text-foreground/60 font-semibold">₹{p.price}</span>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Explore */}
                              <div>
                                <p className="text-[10px] tracking-wide text-brand-orange font-bold mb-3">Explore</p>
                                <ul className="space-y-2 text-[13px] font-medium text-espresso">
                                  <li><Link to="/compare" onClick={() => setMobileOpen(false)}>Compare Products</Link></li>
                                  <li><Link to="/track-order" onClick={() => setMobileOpen(false)}>Track an Order</Link></li>
                                  <li><Link to="/bulk-gifting" onClick={() => setMobileOpen(false)}>Bulk & Corporate Gifting</Link></li>
                                </ul>
                              </div>

                              {/* Featured */}
                              {featuredForMenu[0] && (
                                <Link to="/product/$slug" params={{ slug: featuredForMenu[0].slug }} onClick={() => setMobileOpen(false)} className="block relative rounded-xl overflow-hidden h-[120px] shadow-sm">
                                  <img loading="lazy" src={featuredForMenu[0].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A120A]/90 to-transparent" />
                                  <div className="absolute bottom-3 left-3 text-white">
                                    <p className="text-[9px] tracking-[0.25em] text-brand-orange font-bold uppercase mb-0.5">Featured</p>
                                    <p className="font-serif text-[15px]">{featuredForMenu[0].name}</p>
                                  </div>
                                </Link>
                              )}

                            </div>
                          </div>
                        </div>
                      ) : l.hash ? (
                        <a
                          href={`/#${l.hash}`}
                          onClick={(e) => {
                            setMobileOpen(false);
                            const el = document.getElementById(l.hash!);
                            if (el) {
                              e.preventDefault();
                              el.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-semibold text-espresso hover:bg-[#F8F5EF] transition-colors"
                        >
                          {l.label}
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </a>
                      ) : (
                        <Link
                          to={l.to}
                          activeOptions={{ exact: l.label === "Home" }}
                          className="flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-semibold text-espresso hover:bg-[#F8F5EF] [&.active]:text-brand-orange [&.active]:bg-[#F8F5EF]/60 transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {l.label}
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      )}
                    </li>
                  )})}
                </ul>
                <div className="mt-5 pt-5 border-t border-border/80 pb-6">
                  <p className="text-[10px] tracking-wide text-gold-deep font-bold mb-2 px-3">
                    My Account
                  </p>
                  <ul className="space-y-1 text-sm font-medium">
                    <li>
                      <Link
                        to="/account"
                        search={{ tab: "orders" } as never}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-deep transition-colors"
                      >
                        <Package className="size-4 text-gold-deep shrink-0" />
                        <span>Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-deep transition-colors"
                      >
                        <Heart className="size-4 text-gold-deep shrink-0" />
                        <span>Wishlist</span>
                        {wishCount > 0 && (
                          <span className="ml-auto text-xs font-bold text-burnt-orange bg-cream-deep px-2 py-0.5 rounded-full">
                            {wishCount}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/track-order"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-deep transition-colors"
                      >
                        <Package className="size-4 text-gold-deep shrink-0" />
                        <span>Track Order</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/compare"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-deep transition-colors"
                      >
                        <ChevronRight className="size-4 text-gold-deep shrink-0" />
                        <span>Compare</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="border-t border-border p-4 grid grid-cols-2 gap-3 bg-cream/90 shrink-0">
                <Link
                  to={user ? "/account" : "/auth"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-espresso hover:bg-cream-deep transition-colors shadow-xs"
                >
                  <User className="size-4 text-burnt-orange" />
                  <span className="truncate">{user ? "My Account" : "Sign in"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-espresso text-cream py-3 text-sm font-semibold hover:bg-burnt-orange transition-colors shadow-sm"
                >
                  <ShoppingBag className="size-4 text-gold" />
                  <span>Cart</span>
                  {count > 0 && <span className="text-xs font-bold bg-burnt-orange text-white px-1.5 py-0.5 rounded-full">{count}</span>}
                </button>
              </div>
            </aside>
          </div>,
          document.body
        )}
      </div>
    </header>
  );
}
