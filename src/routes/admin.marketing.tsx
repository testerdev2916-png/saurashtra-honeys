import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings } from "@/lib/site-settings.functions";

export const Route = createFileRoute("/admin/marketing")({ component: Page });

type Tab = "seo" | "analytics" | "social" | "whatsapp" | "loyalty" | "features" | "robots";

function Page() {
  const [tab, setTab] = useState<Tab>("seo");
  const [data, setData] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(updateSiteSettings);

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
      setData((row?.data as Record<string, Record<string, unknown>>) ?? {});
      setLoading(false);
    })();
  }, []);

  function update(section: string, key: string, value: unknown) {
    setData((d) => ({ ...d, [section]: { ...(d[section] ?? {}), [key]: value } }));
  }

  async function persist() {
    setSaving(true);
    try { await save({ data: { data } }); toast.success("Settings saved"); }
    catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;

  const tabs: [Tab, string][] = [["seo","SEO"],["analytics","Analytics"],["social","Social"],["whatsapp","WhatsApp"],["loyalty","Loyalty"],["features","Features"],["robots","Robots"]];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl text-forest-dark">Marketing & Settings</h1>
        <p className="text-sm text-muted-foreground">Global configuration used across the storefront.</p>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-border">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === id ? "border-gold text-forest-dark" : "border-transparent text-muted-foreground hover:text-forest-dark"}`}>{label}</button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl p-6 space-y-4">
        {tab === "seo" && <>
          <F label="Default Title" v={s(data,"seo","default_title")} onChange={(v)=>update("seo","default_title",v)} />
          <F label="Default Description" textarea v={s(data,"seo","default_description")} onChange={(v)=>update("seo","default_description",v)} />
          <F label="Default Keywords" v={s(data,"seo","default_keywords")} onChange={(v)=>update("seo","default_keywords",v)} />
          <F label="Default OG Image URL" v={s(data,"seo","default_og_image")} onChange={(v)=>update("seo","default_og_image",v)} />
        </>}
        {tab === "analytics" && <>
          <F label="GA4 Measurement ID" placeholder="G-XXXXXXX" v={s(data,"analytics","ga4_measurement_id")} onChange={(v)=>update("analytics","ga4_measurement_id",v)} />
          <F label="Meta Pixel ID" v={s(data,"analytics","meta_pixel_id")} onChange={(v)=>update("analytics","meta_pixel_id",v)} />
          <F label="Microsoft Clarity ID" v={s(data,"analytics","clarity_id")} onChange={(v)=>update("analytics","clarity_id",v)} />
          <F label="Search Console Verification" v={s(data,"analytics","gsc_verification")} onChange={(v)=>update("analytics","gsc_verification",v)} />
        </>}
        {tab === "social" && (["instagram","facebook","youtube","linkedin","x","pinterest"] as const).map((k)=>(
          <F key={k} label={k.toUpperCase()} v={s(data,"social",k)} onChange={(v)=>update("social",k,v)} />
        ))}
        {tab === "whatsapp" && <>
          <Switch label="Show floating WhatsApp button" checked={b(data,"whatsapp","enabled")} onChange={(v)=>update("whatsapp","enabled",v)} />
          <F label="WhatsApp Number (with country code, no +)" v={s(data,"whatsapp","number")} onChange={(v)=>update("whatsapp","number",v)} />
          <F label="Default Message" textarea v={s(data,"whatsapp","default_message")} onChange={(v)=>update("whatsapp","default_message",v)} />
        </>}
        {tab === "loyalty" && <>
          <Switch label="Enable loyalty program" checked={b(data,"loyalty","enabled")} onChange={(v)=>update("loyalty","enabled",v)} />
          <F label="Points per Rupee" type="number" v={String(n(data,"loyalty","points_per_rupee"))} onChange={(v)=>update("loyalty","points_per_rupee",Number(v)||0)} />
          <F label="Redeem rate (paise per point)" type="number" v={String(n(data,"loyalty","redeem_rate_paise"))} onChange={(v)=>update("loyalty","redeem_rate_paise",Number(v)||0)} />
          <F label="Referral reward (referrer)" type="number" v={String(n(data,"loyalty","referral_reward"))} onChange={(v)=>update("loyalty","referral_reward",Number(v)||0)} />
          <F label="Referred bonus (new user)" type="number" v={String(n(data,"loyalty","referred_reward"))} onChange={(v)=>update("loyalty","referred_reward",Number(v)||0)} />
        </>}
        {tab === "features" && (["recently_purchased_popup","trust_badges","low_stock_message","exit_intent_ready"] as const).map((k)=>(
          <Switch key={k} label={k.replace(/_/g," ")} checked={b(data,"features",k)} onChange={(v)=>update("features",k,v)} />
        ))}
        {tab === "robots" && <>
          <div>
            <div className="text-xs font-semibold mb-1">Disallow paths (one per line)</div>
            <textarea className="w-full min-h-[120px] border border-border rounded-lg p-2 text-sm font-mono"
              value={(data.robots?.disallow_paths as string[] ?? []).join("\n")}
              onChange={(e)=>update("robots","disallow_paths", e.target.value.split(/\n+/).map((s)=>s.trim()).filter(Boolean))} />
          </div>
          <F label="Extra rules" textarea v={s(data,"robots","extra")} onChange={(v)=>update("robots","extra",v)} />
        </>}
      </div>

      <div className="flex justify-end">
        <button disabled={saving} onClick={persist} className="bg-forest-dark text-cream rounded-lg px-6 py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60">
          {saving ? "SAVING…" : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}

function s(d: Record<string, Record<string, unknown>>, section: string, key: string): string {
  const v = d[section]?.[key]; return typeof v === "string" ? v : "";
}
function n(d: Record<string, Record<string, unknown>>, section: string, key: string): number {
  const v = d[section]?.[key]; return typeof v === "number" ? v : 0;
}
function b(d: Record<string, Record<string, unknown>>, section: string, key: string): boolean {
  return Boolean(d[section]?.[key]);
}

function F({ label, v, onChange, textarea, placeholder, type = "text" }: { label: string; v: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold mb-1">{label}</div>
      {textarea
        ? <textarea value={v} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} className="w-full min-h-[80px] border border-border rounded-lg p-2 text-sm" />
        : <input value={v} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} type={type} className="w-full border border-border rounded-lg p-2 text-sm" />}
    </label>
  );
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="size-4" />
      <span className="capitalize">{label}</span>
    </label>
  );
}
