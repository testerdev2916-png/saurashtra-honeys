import { useCallback, useEffect, useState } from "react";

const KEY = "sh_recent_v1";
const MAX = 12;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(KEY); return raw ? (JSON.parse(raw) as string[]) : []; }
  catch { return []; }
}
function write(list: string[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch {/* ignore */}
  try { window.dispatchEvent(new Event("sh:recent-changed")); } catch {/* ignore */}
}

export function pushRecent(slug: string) {
  const list = read();
  const next = [slug, ...list.filter((s) => s !== slug)];
  write(next);
}

export function useRecentlyViewed(excludeSlug?: string) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const load = () => setSlugs(read());
    load();
    const listener = () => load();
    window.addEventListener("sh:recent-changed", listener);
    window.addEventListener("storage", listener);
    return () => { window.removeEventListener("sh:recent-changed", listener); window.removeEventListener("storage", listener); };
  }, []);
  const clear = useCallback(() => write([]), []);
  const filtered = excludeSlug ? slugs.filter((s) => s !== excludeSlug) : slugs;
  return { slugs: filtered, clear };
}
