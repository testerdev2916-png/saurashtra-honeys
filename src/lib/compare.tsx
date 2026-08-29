import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

type CompareCtx = {
  slugs: string[];
  count: number;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => boolean; // returns new state
  clear: () => void;
};

const Ctx = createContext<CompareCtx | null>(null);
const KEY = "sh_compare_v1";
const MAX = 4;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as string[]) : []; }
  catch { return []; }
}
function write(list: string[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {/* ignore */}
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => { setSlugs(read()); }, []);
  useEffect(() => { write(slugs); }, [slugs]);

  const add = useCallback((s: string) => {
    setSlugs((prev) => {
      if (prev.includes(s)) return prev;
      if (prev.length >= MAX) { toast.info(`You can compare up to ${MAX} products`); return prev; }
      return [...prev, s];
    });
  }, []);
  const remove = useCallback((s: string) => setSlugs((p) => p.filter((x) => x !== s)), []);
  const toggle = useCallback((s: string) => {
    let out = false;
    setSlugs((prev) => {
      if (prev.includes(s)) { out = false; return prev.filter((x) => x !== s); }
      if (prev.length >= MAX) { toast.info(`You can compare up to ${MAX} products`); out = false; return prev; }
      out = true; return [...prev, s];
    });
    return out;
  }, []);
  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<CompareCtx>(() => ({
    slugs, count: slugs.length, has: (s) => slugs.includes(s), add, remove, toggle, clear,
  }), [slugs, add, remove, toggle, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const FALLBACK: CompareCtx = { slugs: [], count: 0, has: () => false, add: () => {}, remove: () => {}, toggle: () => false, clear: () => {} };
export function useCompare() { return useContext(Ctx) ?? FALLBACK; }
