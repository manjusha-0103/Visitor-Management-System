import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
  Tooltip, 
} from "recharts";
import {
  Laptop, Car, BadgeCheck, Clock,
//   Users, CalendarCheck, TrendingUp,
//   ShieldCheck, LogOut,
} from "lucide-react";
import {
  todaySummary,
  dailyTrend,
  monthlyVisits,
  departmentTraffic,
  approvalStatus,
  peakHours,
  frequentVisitors,
  visitTypePie,
} from "@/components/analytics/analyticsData";
import MetricCard from "@/components/analytics/MetricCard";
import SectionLabel from "@/components/analytics/SectionLabel";
import AdminSubHeader from "@/components/AdminSubHeader";

// ── Brand colours ─────────────────────────────────────────────────────────────
const MAROON = "#701a40";
const PINK   = "#c0346a";
const BLUE   = "#5b8dee";

// ── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg px-3 py-2.5 text-xs min-w-30">
      {label && <p className="font-semibold text-foreground mb-1.5">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-foreground">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function ChartCard({ title, children, className = "" }: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-border rounded-2xl p-5 ${className}`}>
      <p className="text-sm font-semibold text-foreground mb-4">{title}</p>
      {children}
    </div>
  );
}

// ── Legend item ───────────────────────────────────────────────────────────────
function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{
          background: color,
          outline: dashed ? `1.5px dashed ${color}` : "none",
          outlineOffset: "1px",
        }}
      />
      {label}
    </span>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
const statusStyle: Record<string, string> = {
  "Approved":    "bg-green-100 text-green-800",
  "Pending":     "bg-amber-100 text-amber-800",
  "Denied":      "bg-red-100 text-red-700",
  "Checked out": "bg-gray-100 text-gray-600",
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function AnalyticsPage() {
  const maxDept = Math.max(...departmentTraffic.map((d) => d.count));
  const maxApproval = Math.max(...approvalStatus.map((s) => s.count));

  return (
    <section className="mb-12">
      <AdminSubHeader
      showBack={true}
        to="/admin"
        heading="Analytics"
        subh="Visitor activity overview — today and historical trends"
      />

      <div className="px-4 lg:px-10 mt-6 space-y-8">

        {/* ── TODAY AT A GLANCE ─────────────────────────────────────────── */}
        <div>
          <SectionLabel>Today at a glance</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard
              label="Total visits"
              value={todaySummary.totalVisits}
              sub={`↑ ${todaySummary.totalVisitsDelta}% vs yesterday`}
              delta={todaySummary.totalVisitsDelta}
            />
            <MetricCard
              label="Walk-ins"
              value={todaySummary.walkIns}
              sub={`${Math.round((todaySummary.walkIns / todaySummary.totalVisits) * 100)}% of total`}
            />
            <MetricCard
              label="Pre-scheduled"
              value={todaySummary.preScheduled}
              sub={`${Math.round((todaySummary.preScheduled / todaySummary.totalVisits) * 100)}% of total`}
            />
            <MetricCard
              label="Checked out"
              value={todaySummary.checkedOut}
              sub={`${Math.round((todaySummary.checkedOut / todaySummary.totalVisits) * 100)}% cleared`}
              delta={todaySummary.checkedOutDelta}
            />
            <MetricCard
              label="Pending"
              value={todaySummary.pendingApproval}
              sub={`↑ ${todaySummary.pendingDelta} since 1 hr ago`}
              delta={-todaySummary.pendingDelta}
            />
            <MetricCard
              label="Avg. duration"
              value={`${todaySummary.avgDurationMin}m`}
              sub={`${todaySummary.avgDurationDelta}m vs last week`}
              delta={todaySummary.avgDurationDelta}
              deltaInvert
            />
          </div>
        </div>

        {/* ── TREND + DONUT ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

          {/* 14-day area trend */}
          <ChartCard title="Daily visits — last 14 days">
            <div className="flex gap-4 mb-3">
              <LegendDot color={MAROON} label="Walk-in" />
              <LegendDot color={BLUE} label="Pre-scheduled" dashed />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradWalkin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={MAROON} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={MAROON} stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradPre" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={BLUE} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="walkIn"
                  name="Walk-in"
                  stroke={MAROON}
                  strokeWidth={2}
                  fill="url(#gradWalkin)"
                  dot={{ r: 3, fill: MAROON, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="preScheduled"
                  name="Pre-scheduled"
                  stroke={BLUE}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  fill="url(#gradPre)"
                  dot={{ r: 3, fill: BLUE, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Pie donut */}
          <ChartCard title="Visit type breakdown">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={visitTypePie}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {visitTypePie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value ) => [`${value ?? 0}%`, ""]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-5 mt-2">
              {visitTypePie.map((d) => (
                <LegendDot key={d.name} color={d.color} label={`${d.name} ${d.value}%`} />
              ))}
            </div>

            {/* centre label overlay */}
            <div className="flex flex-col items-center -mt-33 mb-20 pointer-events-none">
              <span className="text-2xl font-semibold text-foreground leading-none">
                {todaySummary.totalVisits}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">total</span>
            </div>
          </ChartCard>
        </div>

        {/* ── DEPARTMENT + APPROVAL + PEAK HOURS ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Department traffic */}
          <ChartCard title="Department traffic">
            <div className="space-y-3">
              {departmentTraffic.map((d, i) => {
                const pct = Math.round((d.count / maxDept) * 100);
                const opacity = 1 - i * 0.13;
                return (
                  <div key={d.department} className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground w-21 shrink-0 truncate">
                      {d.department}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: MAROON, opacity }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">
                      {d.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* Approval status */}
          <ChartCard title="Approval status">
            <div className="space-y-3 mb-4">
              {approvalStatus.map((s) => {
                const pct = Math.round((s.count / maxApproval) * 100);
                return (
                  <div key={s.status} className="flex items-center gap-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-21 shrink-0 text-center ${statusStyle[s.status]}`}>
                      {s.status}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${pct}%`, background: s.color }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">
                      {s.count}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Approval rate</p>
              <p className="text-2xl font-semibold text-foreground leading-tight">
                {todaySummary.approvalRate}%
                <span className="text-xs font-normal text-muted-foreground ml-1.5">of resolved</span>
              </p>
            </div>
          </ChartCard>

          {/* Peak hours */}
          <ChartCard title="Peak hours (today)">
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={peakHours} margin={{ top: 4, right: 0, left: -32, bottom: 0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tickFormatter={(v: string) => v.replace(" AM", "A").replace(" PM", "P")}
                />
                <YAxis hide />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#f5f5f5" }}
                />
                <Bar dataKey="count" name="Visitors" radius={[4, 4, 0, 0]}>
                  {peakHours.map((entry, i) => {
                    const intensity = 0.35 + 0.65 * (entry.count / Math.max(...peakHours.map((h) => h.count)));
                    return (
                      <Cell
                        key={i}
                        fill={MAROON}
                        fillOpacity={intensity}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Busiest slot</p>
              <p className="text-sm font-semibold text-foreground">10 AM – 11 AM</p>
              <p className="text-[11px] text-muted-foreground">14 visitors in one hour</p>
            </div>
          </ChartCard>
        </div>

        {/* ── MONTHLY TREND + FREQUENT VISITORS ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

          {/* Monthly stacked bar */}
          <ChartCard title="Monthly visits — 2025">
            <div className="flex gap-4 mb-3">
              <LegendDot color={MAROON} label="Walk-in" />
              <LegendDot color={PINK} label="Pre-scheduled" dashed />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyVisits} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9f9f9" }} />
                <Bar dataKey="walkIn" name="Walk-in" stackId="a" fill={MAROON} radius={[0, 0, 0, 0]} />
                <Bar dataKey="preScheduled" name="Pre-scheduled" stackId="a" fill={PINK} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Frequent visitors */}
          <ChartCard title="Frequent visitors (this month)">
            <div className="space-y-3">
              {frequentVisitors.map((v, i) => (
                <div key={v.name} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-muted-foreground w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: v.color, color: v.textColor }}
                  >
                    {v.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground truncate">{v.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {v.company} · {v.department}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">{v.visits}</p>
                    <p className="text-[10px] text-muted-foreground">visits</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* ── SECURITY & ACCESS ─────────────────────────────────────────── */}
        <div>
          <SectionLabel>Security & access</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Laptops registered"
              value={todaySummary.laptopsRegistered}
              sub={`${Math.round((todaySummary.laptopsRegistered / todaySummary.totalVisits) * 100)}% of visitors`}
              icon={<Laptop size={14} />}
            />
            <MetricCard
              label="Vehicles registered"
              value={todaySummary.vehiclesRegistered}
              sub={`${Math.round((todaySummary.vehiclesRegistered / todaySummary.totalVisits) * 100)}% of visitors`}
              icon={<Car size={14} />}
            />
            <MetricCard
              label="Passes issued"
              value={todaySummary.passesIssued}
              sub={`${Math.round((todaySummary.passesIssued / todaySummary.totalVisits) * 100)}% coverage`}
              delta={5}
              icon={<BadgeCheck size={14} />}
            />
            <MetricCard
              label="Avg. wait time"
              value={`${todaySummary.avgWaitMin}m`}
              sub={`${todaySummary.avgWaitDelta}m vs last week`}
              delta={todaySummary.avgWaitDelta}
              deltaInvert
              icon={<Clock size={14} />}
            />
          </div>
        </div>

      </div>
    </section>
  );
}