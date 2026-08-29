import { useState } from "react";

export const inp = "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep";

export function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="text-xs font-semibold text-forest-dark">{label}</span>{children}</label>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-forest-dark">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-border rounded-2xl ${className}`}>{children}</div>;
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border border-border rounded-2xl overflow-hidden overflow-x-auto"><table className="w-full text-sm">{children}</table></div>;
}

export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-forest-dark bg-cream/60 text-left ${className}`}>{children}</th>;
}
export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

export function StatusPill({ s }: { s: string }) {
  const c = ["paid","delivered","approved","completed","active","published","live"].includes(s) ? "bg-forest text-cream"
    : ["shipped","processing","packed","confirmed","in_progress"].includes(s) ? "bg-gold text-forest-dark"
    : ["cancelled","refunded","rejected","disabled","archived"].includes(s) ? "bg-destructive/15 text-destructive"
    : "bg-cream text-forest-dark border border-border";
  return <span className={`text-[10px] font-bold tracking-wider uppercase rounded px-2 py-1 ${c}`}>{s}</span>;
}

export function BtnPrimary(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return <button {...rest} className={`inline-flex items-center gap-2 bg-forest-dark text-cream rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60 ${className}`} />;
}
export function BtnGhost(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return <button {...rest} className={`inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep ${className}`} />;
}

export function csvDownload(rows: Record<string, unknown>[], cols: string[], filename: string) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export function ConfirmButton({ onConfirm, message, children, className = "" }: { onConfirm: () => void; message: string; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={() => { if (confirm(message)) onConfirm(); }}
      className={className}
    >{children}</button>
  );
}

export function useAsync<T>() {
  const [loading, setLoading] = useState(false);
  return {
    loading,
    async run(fn: () => Promise<T>): Promise<T | null> {
      setLoading(true);
      try { return await fn(); }
      catch (e) { const { toast } = await import("sonner"); toast.error((e as Error).message); return null; }
      finally { setLoading(false); }
    },
  };
}

export function paise(p?: number | null) { return `₹${((p ?? 0) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`; }
