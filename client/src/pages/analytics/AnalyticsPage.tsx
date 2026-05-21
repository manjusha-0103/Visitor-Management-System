import {
  AreaChart, Area,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
  Tooltip, 
} from "recharts";
import {
  Laptop, Car, BadgeCheck,
} from "lucide-react";
import MetricCard from "@/components/analytics/MetricCard";
import SectionLabel from "@/components/analytics/SectionLabel";
import AdminSubHeader from "@/components/AdminSubHeader";
import { useGetAnalyticsGraphQuery, useGetAnalyticsHeaderQuery } from "@/lib/features/analytics/analyticsApi";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadinSpinner";


// ── Brand colours ─────────────────────────────────────────────────────────────
const MAROON = "#701a40";
// const PINK   = "#c0346a";
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

  // ── FILTER STATES ─────────────────────────────────────
const currentYear = new Date().getFullYear();

const [selectedYear, setSelectedYear] = useState<number | undefined>();
const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
const [last15Days, setLast15Days] = useState(true);

// ── GRAPH QUERY ───────────────────────────────────────
const {
  data: analyticsGraphResponse,
  isLoading: graphLoading,
  isFetching: graphFetching,
  isError: graphError,
  // error: graphErrorData,
} = useGetAnalyticsGraphQuery({
  year: selectedYear,
  month: selectedMonth,
  last_15_days: last15Days,
});

const gLoading = graphLoading || graphFetching;

const graphData = analyticsGraphResponse?.data;

console.log(graphData);


const hasLineChartData =
  graphData?.line_chart?.some(
    (item) => item.walkIn > 0 || item.preScheduled > 0
  ) ?? false;

const hasDepartmentData =
  graphData?.department_traffic?.some((item) => item.count > 0) ?? false;

const hasApprovalData =
  graphData?.approval_status?.some((item) => item.count > 0) ?? false;

  const maxDept = Math.max(
  ...(graphData?.department_traffic?.map((d) => d.count) ?? [1])
);

const maxApproval = Math.max(
  ...(graphData?.approval_status?.map((s) => s.count) ?? [1])
);

  const {
    data: analyticsHeaderResponse,
  isLoading: headerLoading,
  isFetching: headerFetching,
  isError: headerError,
  // error: headerErrorData,
} = useGetAnalyticsHeaderQuery();

const todaySummary = analyticsHeaderResponse?.data;
console.log(todaySummary);

const isPageLoading =
  graphLoading ||
  graphFetching ||
  headerLoading ||
  headerFetching;

  const hasError = graphError || headerError;


const chartTitle = last15Days
  ? "Daily visits — last 15 days"
  : selectedYear && selectedMonth
  ? `Daily visits — ${selectedMonth}/${selectedYear}`
  : selectedYear
  ? `Monthly visits — ${selectedYear}`
  : "Analytics";


  if(isPageLoading){
    return <LoadingSpinner/>
  }


  if (hasError) {
  return (
    <section className="h-[60vh] flex flex-col items-center justify-center gap-3">
      <h2 className="text-lg font-semibold text-red-600">
        Failed to load analytics
      </h2>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        Something went wrong while fetching analytics data.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl bg-maroon text-white text-sm"
      >
        Retry
      </button>
    </section>
  );
}

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
          {/* <SectionLabel>Today at a glance</SectionLabel> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard
              label="Total visits"
              value={todaySummary?.total_appointments ?? 0}
              // sub={`↑ ${todaySummary.totalVisitsDelta}% vs yesterday`}
              // delta={todaySummary.totalVisitsDelta}
            />
            <MetricCard
              label="Walk-ins"
              value={todaySummary?.total_walk_ins ?? 0}
              sub={`${Math.round(((todaySummary?.total_walk_ins ?? 0 )/ (todaySummary?.total_appointments ?? 0)) * 100)}% of total`}
            />
            <MetricCard
              label="Pre-scheduled"
              value={todaySummary?.total_preschedule ?? 0}
              sub={`${Math.round(((todaySummary?.total_preschedule ?? 0) / (todaySummary?.total_appointments ?? 0)) * 100)}% of total`}
            />
            <MetricCard
              label="Checked out"
              value={todaySummary?.total_checkout ?? 0}
              sub={`${Math.round(((todaySummary?.total_checkout ?? 0) / (todaySummary?.total_appointments ?? 0)) * 100)}% cleared`}
              // delta={todaySummary.checkedOutDelta}
            />
            <MetricCard
              label="Pending"
              value={todaySummary?.total_pendings ?? 0}
              // sub={`↑ ${todaySummary.pendingDelta} since 1 hr ago`}
              // delta={-todaySummary.pendingDelta}
            />
            {/* <MetricCard
              label="Avg. duration"
              value={`${todaySummary.avgDurationMin}m`}
              sub={`${todaySummary.avgDurationDelta}m vs last week`}
              delta={todaySummary.avgDurationDelta}
              deltaInvert
            /> */}
          </div>
        </div>

        
<div className="flex flex-wrap items-center gap-3">

  {/* Last 15 Days */}
  <button
    onClick={() => {
      setLast15Days(true);
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
    }}
    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
      last15Days
        ? "bg-maroon text-white border-maroon"
        : "bg-white text-foreground border-border"
    }`}
  >
    Last 15 Days
  </button>

  {/* Year Select */}
  <select
    value={selectedYear ?? ""}
    onChange={(e) => {
      const year = Number(e.target.value);

      setLast15Days(false);
      setSelectedYear(year);
      setSelectedMonth(undefined);
    }}
    className="h-10 rounded-xl border border-border bg-white px-3 text-sm outline-none"
  >
    <option value="">Select Year</option>

    {Array.from({ length: 5 }).map((_, i) => {
      const year = currentYear - i;

      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    })}
  </select>

  {/* Month Select */}
  <select
    value={selectedMonth ?? ""}
    disabled={!selectedYear}
    onChange={(e) => {
      setLast15Days(false);
      setSelectedMonth(Number(e.target.value));
    }}
    className="h-10 rounded-xl border border-border bg-white px-3 text-sm outline-none disabled:opacity-50"
  >
    <option value="">Select Month</option>

    {[
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].map((month, index) => (
      <option key={month} value={index + 1}>
        {month}
      </option>
    ))}
  </select>
</div>

        {/* ── TREND + DONUT ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4">

          {/* 14-day area trend */}
          <ChartCard title={chartTitle}>
            <div className="flex gap-4 mb-3">
              <LegendDot color={MAROON} label="Walk-in" />
              <LegendDot color={BLUE} label="Pre-scheduled" dashed />
            </div>
            {gLoading ? (
  <div className="h-50 flex items-center justify-center text-sm text-muted-foreground">
    Loading chart...
  </div>
) : !hasLineChartData ? (
  <div className="h-50 flex items-center justify-center text-sm text-muted-foreground">
    No chart data available
  </div>
) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={graphData?.line_chart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
  dataKey={last15Days || selectedMonth ? "date" : "month"}
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
)}
          </ChartCard>

        </div>

        {/* ── DEPARTMENT + APPROVAL + PEAK HOURS ──────────────────────── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Department traffic */}
          <ChartCard title="Department traffic">
          {gLoading ? (
  <div className="h-45 flex items-center justify-center text-sm text-muted-foreground">
    Loading departments...
  </div>
) : !hasDepartmentData ? (
  <div className="h-45 flex items-center justify-center text-sm text-muted-foreground">
    No department data available
  </div>
) : (
  <div className="space-y-3">
    {graphData?.department_traffic?.map((d, i) => {
      const pct = Math.round((d.count / maxDept) * 100);
      const opacity = 1 - i * 0.13;

      return (
        <div key={d.department} className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground w-21 shrink-0 truncate">
            {d.department}
          </span>

          <div className="flex-1 bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: MAROON,
                opacity,
              }}
            />
          </div>

          <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">
            {d.count}
          </span>
        </div>
      );
    })}
  </div>
)}
          </ChartCard>

          {/* Approval status */}
          <ChartCard title="Approval status">
           {gLoading ? (
  <div className="h-45 flex items-center justify-center text-sm text-muted-foreground">
    Loading approvals...
  </div>
) : !hasApprovalData ? (
  <div className="h-45 flex items-center justify-center text-sm text-muted-foreground">
    No approval data available
  </div>
) : (
  <div className="space-y-3 mb-4">
    {graphData?.approval_status?.map((s) => {
      const pct = Math.round((s.count / maxApproval) * 100);

      return (
        <div key={s.status} className="flex items-center gap-3">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-21 shrink-0 text-center ${statusStyle[s.status]}`}
          >
            {s.status}
          </span>

          <div className="flex-1 bg-muted rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: s.color,
              }}
            />
          </div>

          <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">
            {s.count}
          </span>
        </div>
      );
    })}
  </div>
)}
          </ChartCard>

        </div>

        {/* ── SECURITY & ACCESS ─────────────────────────────────────────── */}
        <div>
          <SectionLabel>Security & access</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Laptops registered"
              value={todaySummary?.total_laptop_registered ?? 0}
              sub={`${Math.round(((todaySummary?.total_laptop_registered ?? 0) / (todaySummary?.total_appointments ?? 0)) * 100)}% of visitors`}
              icon={<Laptop size={14} />}
            />
            <MetricCard
              label="Vehicles registered"
              value={todaySummary?.vehicles_registered ?? 0}
              sub={`${Math.round(((todaySummary?.vehicles_registered ?? 0) / (todaySummary?.total_appointments ?? 0)) * 100)}% of visitors`}
              icon={<Car size={14} />}
            />
            <MetricCard
              label="Passes issued"
              value={todaySummary?.total_passes_issued ?? 0}
              sub={`${Math.round(((todaySummary?.total_passes_issued ?? 0)/ (todaySummary?.total_appointments ?? 0)) * 100)}% coverage`}
              delta={5}
              icon={<BadgeCheck size={14} />}
            />
            {/* <MetricCard
              label="Avg. wait time"
              value={`${todaySummary.avgWaitMin}m`}
              sub={`${todaySummary.avgWaitDelta}m vs last week`}
              delta={todaySummary.avgWaitDelta}
              deltaInvert
              icon={<Clock size={14} />}
            /> */}
          </div>
        </div>

      </div>
    </section>
  );
}