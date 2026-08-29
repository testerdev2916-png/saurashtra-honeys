import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getDashboardStats, type DashboardStats } from "@/lib/admin-cms.functions";
import { Card, PageHeader, paise, StatusPill } from "@/components/admin/ui";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from "recharts";
import { IndianRupee, ShoppingBag, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">{label}</div>
          <div className={`mt-1 font-serif text-2xl ${tone ?? "text-forest-dark"}`}>{value}</div>
          {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        </div>
        <Icon className="size-5 text-gold-deep" />
      </div>
    </Card>
  );
}

function Dashboard() {
  const get = useServerFn(getDashboardStats);
  const [s, setS] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { get({}).then((r) => setS(r.stats)).catch((e) => toast.error((e as Error).message)).finally(() => setLoading(false)); }, [get]);

  if (loading) return <div className="py-24 text-center text-muted-foreground">Loading dashboard…</div>;
  if (!s) return <div className="py-24 text-center text-muted-foreground">No data.</div>;

  const salesData = s.sales_last_30.map((d) => ({ day: d.day.slice(5), revenue: d.revenue_paise / 100, orders: d.orders }));
  const topProducts = s.top_products.map((p) => ({ name: p.name ?? "—", revenue: (p.revenue ?? 0) / 100, units: p.units ?? 0 }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Store performance at a glance" />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Kpi icon={IndianRupee} label="Total Revenue" value={paise(s.revenue_total_paise)} sub="Lifetime" />
        <Kpi icon={TrendingUp} label="This Month" value={paise(s.revenue_month_paise)} />
        <Kpi icon={ShoppingBag} label="Orders Today" value={String(s.orders_today)} sub={`${s.orders_pending} pending`} />
        <Kpi icon={Users} label="Customers" value={String(s.customers_total)} />
        <Kpi icon={ShoppingBag} label="Delivered" value={String(s.orders_delivered)} tone="text-forest" />
        <Kpi icon={ShoppingBag} label="Cancelled" value={String(s.orders_cancelled)} tone="text-destructive" />
        <Kpi icon={Package} label="Products" value={String(s.products_total)} />
        <Kpi icon={AlertTriangle} label="Low / OOS" value={`${s.low_stock_products} / ${s.out_of_stock}`} tone="text-gold-deep" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-serif text-lg text-forest-dark">Sales — Last 30 days</h3>
            <span className="text-xs text-muted-foreground">Revenue in ₹</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-serif text-lg text-forest-dark mb-3">Orders / day</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--gold-deep, #b8871a))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="p-5">
          <h3 className="font-serif text-lg text-forest-dark mb-3">Top Products</h3>
          {topProducts.length === 0 ? <div className="text-xs text-muted-foreground">No sales yet.</div> : (
            <ul className="divide-y divide-border text-sm">
              {topProducts.map((p, i) => (
                <li key={i} className="flex justify-between py-2"><span className="truncate">{p.name}</span><span className="font-semibold">₹{p.revenue.toFixed(0)} • {p.units}</span></li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="font-serif text-lg text-forest-dark mb-3">Top Customers</h3>
          {s.top_customers.length === 0 ? <div className="text-xs text-muted-foreground">No orders yet.</div> : (
            <ul className="divide-y divide-border text-sm">
              {s.top_customers.map((c, i) => (
                <li key={i} className="flex justify-between py-2 gap-2">
                  <span className="truncate"><span className="font-medium">{c.name}</span><span className="block text-xs text-muted-foreground">{c.email}</span></span>
                  <span className="font-semibold whitespace-nowrap">{paise(c.spent_paise)} • {c.orders}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex justify-between mb-3"><h3 className="font-serif text-lg text-forest-dark">Recent Orders</h3><Link to="/admin/orders" className="text-xs text-gold-deep hover:underline">View all →</Link></div>
          <ul className="divide-y divide-border text-sm">
            {s.recent_orders.map((o) => (
              <li key={o.id} className="flex justify-between py-2 gap-2">
                <span className="truncate">
                  <span className="font-medium">{o.order_number ?? o.id.slice(0, 8)}</span>
                  <span className="block text-xs text-muted-foreground">{o.full_name ?? o.email ?? "—"}</span>
                </span>
                <span className="text-right shrink-0"><span className="font-semibold block">{paise(o.total_paise)}</span><StatusPill s={o.status} /></span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
