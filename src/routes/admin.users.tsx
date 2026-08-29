import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listUsers, setUserRole, inviteUser, sendPasswordReset } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, TableWrap, Td, Th } from "@/components/admin/ui";
import { RefreshCcw, KeyRound, X, Check } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

type User = { id: string; email: string | undefined; created_at: string; last_sign_in_at: string | null; roles: string[] };
const ROLES = ["super_admin","admin","manager","editor","customer"] as const;

function UsersPage() {
  const list = useServerFn(listUsers);
  const setRole = useServerFn(setUserRole);
  const invite = useServerFn(inviteUser);
  const reset = useServerFn(sendPasswordReset);
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<typeof ROLES[number]>("editor");

  async function load() { setLoading(true); try { const r = await list({}); setRows(r.rows as unknown as User[]); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  return (
    <div>
      <PageHeader title="Users & Roles" subtitle={`${rows.length} accounts`} actions={<BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>} />
      <Card className="p-4 mb-4 grid md:grid-cols-[1fr_auto_auto] gap-2 items-end">
        <Field label="Invite by email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} placeholder="new.staff@example.com" /></Field>
        <Field label="Role"><select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as never)} className={inp}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select></Field>
        <BtnPrimary onClick={async () => { if (!email) return; try { await invite({ data: { email, role: inviteRole } }); toast.success("Invite sent"); setEmail(""); void load(); } catch (e) { toast.error((e as Error).message); } }}>SEND INVITE</BtnPrimary>
      </Card>
      <TableWrap>
        <thead><tr>{["Email","Joined","Last sign-in","Roles","Actions"].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && rows.map((r) => (
            <tr key={r.id} className="hover:bg-cream/40">
              <Td className="text-xs">{r.email ?? "—"}</Td>
              <Td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</Td>
              <Td className="text-xs text-muted-foreground">{r.last_sign_in_at ? new Date(r.last_sign_in_at).toLocaleString() : "—"}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {ROLES.map((role) => {
                    const has = r.roles.includes(role);
                    return (
                      <button key={role} onClick={async () => {
                        try { await setRole({ data: { user_id: r.id, role, action: has ? "revoke" : "grant" } }); toast.success(`${has ? "Revoked" : "Granted"} ${role}`); void load(); }
                        catch (e) { toast.error((e as Error).message); }
                      }} className={`text-[10px] font-bold tracking-wider uppercase rounded-full px-2 py-1 border ${has ? "bg-forest-dark text-cream border-forest-dark" : "bg-white text-muted-foreground border-border hover:border-gold-deep"}`}>
                        {has ? <Check className="size-3 inline mr-0.5" /> : <X className="size-3 inline mr-0.5" />} {role.replace("_"," ")}
                      </button>
                    );
                  })}
                </div>
              </Td>
              <Td>
                <button onClick={async () => { if (!r.email) return; try { await reset({ data: { email: r.email } }); toast.success("Reset link generated"); } catch (e) { toast.error((e as Error).message); } }} className="text-xs font-bold text-gold-deep hover:underline"><KeyRound className="size-3 inline" /> RESET</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
