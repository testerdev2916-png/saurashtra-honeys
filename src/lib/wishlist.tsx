import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type WishCtx = {
  slugs: Set<string>;
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => Promise<boolean>; // returns new state
  remove: (slug: string) => Promise<void>;
  clear: () => Promise<void>;
};

const Ctx = createContext<WishCtx | null>(null);
const KEY = "sh_wishlist_v1";

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as string[]) : []; }
  catch { return []; }
}
function writeLocal(list: string[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {/* ignore */}
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [slugs, setSlugs] = useState<Set<string>>(new Set());
  const mergedRef = useRef<string | null>(null);

  // Initial hydrate from localStorage
  useEffect(() => { setSlugs(new Set(readLocal())); }, []);

  // Sync with DB when user signs in — merge local → DB, then load
  useEffect(() => {
    if (loading) return;
    if (!user) { setSlugs(new Set(readLocal())); return; }
    if (mergedRef.current === user.id) return;
    mergedRef.current = user.id;

    (async () => {
      try {
        const local = readLocal();
        const { data } = await supabase.from("wishlists").select("product_slug").eq("user_id", user.id);
        const dbSlugs = (data ?? []).map((r) => (r as { product_slug: string }).product_slug);
        const combined = Array.from(new Set([...local, ...dbSlugs]));
        setSlugs(new Set(combined));
        writeLocal(combined);

        for (const s of local) {
          if (!dbSlugs.includes(s)) {
            await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", s);
            await supabase.from("wishlists").insert({ user_id: user.id, product_slug: s });
          }
        }
      } catch (err) {
        console.warn("Wishlist sync error (using local cache):", err);
      }
    })();
  }, [user, loading]);

  const persist = useCallback(async (next: Set<string>, added: string | null, removed: string | null) => {
    const list = [...next];
    setSlugs(new Set(list));
    writeLocal(list); // Always update localStorage immediately for guests and signed-in users
    if (user) {
      try {
        if (added) {
          await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", added);
          await supabase.from("wishlists").insert({ user_id: user.id, product_slug: added });
        }
        if (removed) {
          await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", removed);
        }
      } catch (err) {
        console.warn("Wishlist Supabase sync error:", err);
      }
    }
  }, [user]);

  const value = useMemo<WishCtx>(() => ({
    slugs,
    count: slugs.size,
    has: (s) => slugs.has(s),
    toggle: async (s) => {
      const next = new Set(slugs);
      if (next.has(s)) { next.delete(s); await persist(next, null, s); return false; }
      next.add(s); await persist(next, s, null); return true;
    },
    remove: async (s) => {
      if (!slugs.has(s)) return;
      const next = new Set(slugs); next.delete(s);
      await persist(next, null, s);
    },
    clear: async () => {
      setSlugs(new Set());
      writeLocal([]);
      if (user) {
        try {
          await supabase.from("wishlists").delete().eq("user_id", user.id);
        } catch (err) {
          console.warn("Wishlist clear error:", err);
        }
      }
    },
  }), [slugs, persist, user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const FALLBACK: WishCtx = { slugs: new Set(), count: 0, has: () => false, toggle: async () => false, remove: async () => {}, clear: async () => {} };
export function useWishlist() { return useContext(Ctx) ?? FALLBACK; }
