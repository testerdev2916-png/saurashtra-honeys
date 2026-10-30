import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getSecurityOverview,
  listBlockedEntities,
  addBlockedEntity,
  removeBlockedEntity,
  listSecurityAuditEvents,
} from "@/lib/admin-security.functions";
import {
  BtnGhost,
  BtnPrimary,
  Card,
  Field,
  inp,
  PageHeader,
  StatusPill,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  Phone,
  RefreshCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/admin/security")({ component: SecurityPage });

type Overview = {
  totalCustomers: number;
  verifiedCustomers: number;
  unverifiedCustomers: number;
  totalOrders: number;
  codOrders: number;
  codVerifiedOrders: number;
  codUnverifiedOrders: number;
  blockedEntitiesCount: number;
};

type BlockedItem = {
  id: string;
  type: "email" | "domain" | "phone";
  value: string;
  reason: string | null;
  created_at: string;
};

type AuditItem = {
  id: string;
  event_type: string;
  severity: string;
  actor_id: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

function SecurityPage() {
  const getOverview = useServerFn(getSecurityOverview);
  const getBlocked = useServerFn(listBlockedEntities);
  const addBlocked = useServerFn(addBlockedEntity);
  const removeBlocked = useServerFn(removeBlockedEntity);
  const getAudit = useServerFn(listSecurityAuditEvents);

  const [overview, setOverview] = useState<Overview | null>(null);
  const [blockedList, setBlockedList] = useState<BlockedItem[]>([]);
  const [auditList, setAuditList] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "blocklist" | "audit">("overview");

  // New blocked entity form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<"email" | "domain" | "phone">("domain");
  const [newValue, setNewValue] = useState("");
  const [newReason, setNewReason] = useState("");
  const [busyAdd, setBusyAdd] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [ov, blk, aud] = await Promise.all([
        getOverview(),
        getBlocked(),
        getAudit(),
      ]);
      setOverview(ov as Overview);
      setBlockedList(blk.rows as BlockedItem[]);
      setAuditList(aud.rows as AuditItem[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleAddBlocked(e: React.FormEvent) {
    e.preventDefault();
    if (!newValue.trim()) {
      toast.error("Please enter a value to block");
      return;
    }
    setBusyAdd(true);
    try {
      await addBlocked({
        data: {
          type: newType,
          value: newValue.trim(),
          reason: newReason.trim() || undefined,
        },
      });
      toast.success(`Blocked ${newType} added successfully`);
      setNewValue("");
      setNewReason("");
      setShowAddModal(false);
      void loadData();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyAdd(false);
    }
  }

  async function handleRemoveBlocked(id: string, val: string) {
    if (!confirm(`Are you sure you want to unblock "${val}"?`)) return;
    try {
      await removeBlocked({ data: { id } });
      toast.success(`Unblocked ${val}`);
      void loadData();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Security & Fake Order Protection"
        subtitle="OTP verification enforcement, suspicious domain filters, and security audit logs"
        actions={
          <div className="flex gap-2">
            <BtnGhost onClick={loadData}>
              <RefreshCcw className="size-3.5" /> REFRESH
            </BtnGhost>
            <BtnPrimary onClick={() => setShowAddModal(true)}>
              <Plus className="size-3.5" /> BLOCK DOMAIN / EMAIL
            </BtnPrimary>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs font-bold tracking-wider transition-colors ${
            activeTab === "overview"
              ? "border-b-2 border-forest-dark text-forest-dark"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          SECURITY OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab("blocklist")}
          className={`pb-3 px-4 text-xs font-bold tracking-wider transition-colors ${
            activeTab === "blocklist"
              ? "border-b-2 border-forest-dark text-forest-dark"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          BLOCKED DOMAINS & EMAILS ({blockedList.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 px-4 text-xs font-bold tracking-wider transition-colors ${
            activeTab === "audit"
              ? "border-b-2 border-forest-dark text-forest-dark"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          SECURITY AUDIT LOGS ({auditList.length})
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-l-4 border-l-emerald-500 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>PHONE-VERIFIED USERS</span>
                <Phone className="size-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-forest-dark font-serif">
                {overview?.verifiedCustomers ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Out of {overview?.totalCustomers ?? 0} registered accounts
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-blue-500 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>VERIFIED COD ORDERS</span>
                <CheckCircle2 className="size-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-forest-dark font-serif">
                {overview?.codVerifiedOrders ?? 0}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Total COD orders: {overview?.codOrders ?? 0}
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-rose-500 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>BLOCKED ENTITIES</span>
                <Ban className="size-4 text-rose-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-forest-dark font-serif">
                {overview?.blockedEntitiesCount ?? blockedList.length}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Reserved test domains & spam rules
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-amber-500 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
                <span>SECURITY INCIDENTS</span>
                <ShieldAlert className="size-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl font-bold text-forest-dark font-serif">
                {auditList.length}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Interceptions & rate limit triggers
              </p>
            </Card>
          </div>

          {/* Policy & Protection Features */}
          <Card className="p-6">
            <h3 className="font-serif text-lg text-forest-dark font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" /> Active Security Controls
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-cream/50 border border-border/80">
                <div className="font-bold text-forest-dark flex items-center gap-1.5 mb-1">
                  <Lock className="size-3.5 text-forest" /> Mandatory COD Mobile Verification
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Every Cash on Delivery order strictly requires a 6-digit OTP verified via SMS.
                  Direct API calls without proof of verification are automatically rejected server-side.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cream/50 border border-border/80">
                <div className="font-bold text-forest-dark flex items-center gap-1.5 mb-1">
                  <Ban className="size-3.5 text-rose-600" /> Reserved Domain & Fake Email Shield
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Orders using <code className="bg-background px-1 py-0.5 rounded">example.com</code>,
                  disposable temp-mail domains, or custom blocked patterns are immediately blocked.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cream/50 border border-border/80">
                <div className="font-bold text-forest-dark flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="size-3.5 text-blue-600" /> Server-Side Catalog Recalculation
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Line item prices, discounts, and shipping tiers are authoritative and computed
                  directly from the product catalog database, preventing client-side price tampering.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cream/50 border border-border/80">
                <div className="font-bold text-forest-dark flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="size-3.5 text-amber-600" /> Sliding Window Rate Limiting
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Protects SMS OTP gateways from abuse (max 5 requests/15 mins) and throttles rapid
                  order submissions (max 5 orders/10 mins per user/IP).
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "blocklist" && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-forest-dark">
                Blocked Domains, Emails & Phones
              </h3>
              <p className="text-xs text-muted-foreground">
                Orders from these domains or addresses are automatically blocked before creation.
              </p>
            </div>
            <BtnPrimary onClick={() => setShowAddModal(true)}>
              <Plus className="size-3.5" /> Add Rule
            </BtnPrimary>
          </div>

          <TableWrap>
            <thead>
              <tr>
                {["Type", "Blocked Value", "Reason", "Added On", "Actions"].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {blockedList.length === 0 && (
                <tr>
                  <Td className="text-center py-8 text-muted-foreground">No blocked entities.</Td>
                </tr>
              )}
              {blockedList.map((item) => (
                <tr key={item.id} className="hover:bg-cream/30">
                  <Td>
                    <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                      {item.type}
                    </span>
                  </Td>
                  <Td className="font-mono font-medium text-forest-dark">{item.value}</Td>
                  <Td className="text-xs text-muted-foreground">{item.reason || "—"}</Td>
                  <Td className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </Td>
                  <Td>
                    <button
                      onClick={() => handleRemoveBlocked(item.id, item.value)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <Trash2 className="size-3" /> Remove
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      )}

      {activeTab === "audit" && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-forest-dark">Security Audit Log</h3>
            <p className="text-xs text-muted-foreground">
              Real-time feed of authentication events, OTP deliveries, blocked attempts, and rate limits.
            </p>
          </div>

          <TableWrap>
            <thead>
              <tr>
                {["Timestamp", "Event Type", "Severity", "Target", "Actor", "Details"].map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditList.length === 0 && (
                <tr>
                  <Td className="text-center py-8 text-muted-foreground">No security events recorded yet.</Td>
                </tr>
              )}
              {auditList.map((evt) => (
                <tr key={evt.id} className="hover:bg-cream/30">
                  <Td className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(evt.created_at).toLocaleString()}
                  </Td>
                  <Td className="font-mono text-xs font-semibold">{evt.event_type}</Td>
                  <Td>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.severity === "critical"
                          ? "bg-rose-100 text-rose-700"
                          : evt.severity === "warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </Td>
                  <Td className="font-mono text-xs text-forest-dark">
                    {evt.email || evt.phone || "—"}
                  </Td>
                  <Td className="font-mono text-[11px] text-muted-foreground">
                    {evt.actor_id ? `#${evt.actor_id.slice(0, 8)}` : "anonymous"}
                  </Td>
                  <Td className="text-xs text-muted-foreground max-w-xs truncate">
                    {evt.metadata ? JSON.stringify(evt.metadata) : "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      )}

      {/* Add Blocked Entity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border">
            <h3 className="font-serif text-xl font-bold text-forest-dark mb-4">
              Block Suspicious Domain or Email
            </h3>
            <form onSubmit={handleAddBlocked} className="space-y-4">
              <Field label="Entity Type">
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as "email" | "domain" | "phone")}
                  className={inp}
                >
                  <option value="domain">Email Domain (e.g. example.com, mailinator.com)</option>
                  <option value="email">Specific Email (e.g. fake.user@mail.com)</option>
                  <option value="phone">Specific Phone (e.g. +91 9876543210)</option>
                </select>
              </Field>

              <Field label={newType === "domain" ? "Domain (without @)" : "Value"}>
                <input
                  required
                  placeholder={
                    newType === "domain"
                      ? "example.com"
                      : newType === "email"
                        ? "user@domain.com"
                        : "+919876543210"
                  }
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className={inp}
                />
              </Field>

              <Field label="Reason (Optional)">
                <input
                  placeholder="e.g. Fake test domain, repeated spam orders"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className={inp}
                />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <BtnGhost type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </BtnGhost>
                <BtnPrimary disabled={busyAdd}>
                  {busyAdd ? "Saving…" : "Add to Blocklist"}
                </BtnPrimary>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
