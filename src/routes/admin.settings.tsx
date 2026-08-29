import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { listSettings, upsertSetting } from "@/lib/admin-cms.functions";
import { BtnPrimary, Card, Field, inp, PageHeader } from "@/components/admin/ui";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

type Row = { key: string; value: Record<string, unknown>; is_public: boolean; updated_at: string };

const LABELS: Record<string, { title: string; fields: { key: string; label: string; type?: string; textarea?: boolean }[] }> = {
  company:  { title: "Company", fields: [{ key: "name", label: "Company name" }, { key: "tagline", label: "Tagline" }, { key: "logo_url", label: "Logo URL" }, { key: "favicon_url", label: "Favicon URL" }] },
  contact:  { title: "Contact", fields: [{ key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "whatsapp", label: "WhatsApp" }, { key: "address", label: "Address", textarea: true }] },
  social:   { title: "Social links", fields: [{ key: "instagram", label: "Instagram" }, { key: "facebook", label: "Facebook" }, { key: "youtube", label: "YouTube" }, { key: "twitter", label: "Twitter/X" }] },
  business: { title: "Business", fields: [{ key: "gst", label: "GST number" }, { key: "hours", label: "Business hours" }] },
  footer:   { title: "Footer", fields: [{ key: "copyright", label: "Copyright line" }] },
  seo:      { title: "Default SEO", fields: [{ key: "default_title", label: "Default title" }, { key: "default_description", label: "Default description", textarea: true }, { key: "og_image", label: "Default OG image URL" }] },
};

function SettingsPage() {
  const list = useServerFn(listSettings);
  const save = useServerFn(upsertSetting);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const queryClient = useQueryClient();

  async function load() {
    try {
      const r = await list({});
      const rs = r.rows as Row[];
      setRows(rs);
      const v: Record<string, Record<string, string>> = {};
      for (const row of rs) {
        v[row.key] = {};
        for (const [k, val] of Object.entries(row.value ?? {})) v[row.key][k] = String(val ?? "");
      }
      setValues(v);
    } catch (e) { toast.error((e as Error).message); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  async function onUploadBranding(rowKey: string, fieldKey: string, file: File) {
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "_");
      const path = `logos/${Date.now()}_${safeName}`;
      const { data, error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: true,
      });
      if (error) throw new Error(error.message);
      const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
      setValues((v) => ({
        ...v,
        [rowKey]: {
          ...v[rowKey],
          [fieldKey]: pubData.publicUrl,
        },
      }));
      toast.success("Uploaded original branding file to Supabase Storage");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function onSave(key: string) {
    setBusy(key);
    try {
      await save({ data: { key, value: values[key] ?? {}, is_public: true } });
      toast.success(`Saved ${key}`);
      if (key === "company") void queryClient.invalidateQueries({ queryKey: ["company-settings"] });
      await load();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  }

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="All customer-facing site content" />
      <div className="grid gap-4">
        {rows.map((row) => {
          const meta = LABELS[row.key];
          if (!meta) {
            return (
              <Card key={row.key} className="p-6">
                <h2 className="font-serif text-xl text-forest-dark mb-3">{row.key}</h2>
                <textarea rows={6} className={`${inp} font-mono text-xs`} defaultValue={JSON.stringify(row.value, null, 2)}
                  onBlur={(e) => { try { const v = JSON.parse(e.target.value); void save({ data: { key: row.key, value: v, is_public: row.is_public } }).then(() => toast.success("Saved")); } catch { toast.error("Invalid JSON"); } }}
                />
              </Card>
            );
          }
          return (
            <Card key={row.key} className="p-6">
              <h2 className="font-serif text-xl text-forest-dark mb-4">{meta.title}</h2>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {meta.fields.map((fld) => (
                  <div key={fld.key} className={fld.textarea ? "md:col-span-2" : ""}>
                    <Field label={fld.label}>
                      {fld.textarea ? (
                        <textarea rows={3} className={inp} value={values[row.key]?.[fld.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [row.key]: { ...v[row.key], [fld.key]: e.target.value } }))} />
                      ) : (
                        <div className="flex items-center gap-2">
                          <input type={fld.type ?? "text"} className={`${inp} flex-1`} value={values[row.key]?.[fld.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [row.key]: { ...v[row.key], [fld.key]: e.target.value } }))} />
                          {(fld.key === "logo_url" || fld.key === "favicon_url") && (
                            <label className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0">
                              <Upload className="size-3.5" />
                              <span>UPLOAD</span>
                              <input
                                type="file"
                                accept="image/*,.ico,.svg"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) void onUploadBranding(row.key, fld.key, file);
                                }}
                              />
                            </label>
                          )}
                        </div>
                      )}
                      {(fld.key === "logo_url" || fld.key === "favicon_url") && values[row.key]?.[fld.key] && (
                        <div className="mt-2 p-2 rounded-lg border border-border bg-espresso/90 flex items-center gap-3">
                          <img
                            src={values[row.key][fld.key]}
                            alt={fld.label}
                            className="max-h-8 w-auto object-contain"
                            style={{
                              filter: "none",
                              opacity: 1,
                              mixBlendMode: "normal",
                            }}
                          />
                          <span className="text-[10px] text-cream/70 truncate font-mono">
                            Previewing original file without tinting
                          </span>
                        </div>
                      )}
                    </Field>
                  </div>
                ))}
              </div>
              <BtnPrimary onClick={() => onSave(row.key)} disabled={busy === row.key} className="mt-4">{busy === row.key ? "SAVING…" : "SAVE"}</BtnPrimary>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
