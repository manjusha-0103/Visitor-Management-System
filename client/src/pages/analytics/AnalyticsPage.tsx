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
  isLoading,
  isFetching,
} = useGetAnalyticsGraphQuery({
  year: selectedYear,
  month: selectedMonth,
  last_15_days: last15Days,
});

const graphLoading = isLoading || isFetching;

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
  // isLoading: headerLoading,
} = useGetAnalyticsHeaderQuery();

const todaySummary = analyticsHeaderResponse?.data;
console.log(todaySummary);


const chartTitle = last15Days
  ? "Daily visits — last 15 days"
  : selectedYear && selectedMonth
  ? `Daily visits — ${selectedMonth}/${selectedYear}`
  : selectedYear
  ? `Monthly visits — ${selectedYear}`
  : "Analytics";

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
            {graphLoading ? (
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
          {graphLoading ? (
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
           {graphLoading ? (
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





// import {
//   AreaChart, Area,
//   BarChart, Bar,
//   PieChart, Pie, Cell,
//   ResponsiveContainer,
//   XAxis, YAxis, CartesianGrid,
//   Tooltip, 
// } from "recharts";
// import {
//   Laptop, Car, BadgeCheck, Clock,
// } from "lucide-react";
// import { useState, useMemo } from "react";
// // import { useGetAnalyticsHeaderQuery, useGetAnalyticsGraphQuery } from "@/services/analyticsApi";
// import MetricCard from "@/components/analytics/MetricCard";
// import SectionLabel from "@/components/analytics/SectionLabel";
// import AdminSubHeader from "@/components/AdminSubHeader";
// import { useGetAnalyticsGraphQuery, useGetAnalyticsHeaderQuery } from "@/lib/features/analytics/analyticsApi";

// // ── Brand colours ─────────────────────────────────────────────────────────────
// const MAROON = "#701a40";
// const PINK   = "#c0346a";
// const BLUE   = "#5b8dee";

// // ── Custom tooltip ────────────────────────────────────────────────────────────
// function ChartTooltip({ active, payload, label }: any) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white border border-border rounded-xl shadow-lg px-3 py-2.5 text-xs min-w-30">
//       {label && <p className="font-semibold text-foreground mb-1.5">{label}</p>}
//       {payload.map((p: any) => (
//         <div key={p.name} className="flex items-center justify-between gap-4">
//           <span className="flex items-center gap-1.5 text-muted-foreground">
//             <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
//             {p.name}
//           </span>
//           <span className="font-semibold text-foreground">{p.value.toLocaleString()}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Card wrapper ──────────────────────────────────────────────────────────────
// function ChartCard({ title, children, className = "" }: {
//   title: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div className={`bg-white border border-border rounded-2xl p-5 ${className}`}>
//       <p className="text-sm font-semibold text-foreground mb-4">{title}</p>
//       {children}
//     </div>
//   );
// }

// // ── Legend item ───────────────────────────────────────────────────────────────
// function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
//   return (
//     <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
//       <span
//         className="w-2.5 h-2.5 rounded-sm shrink-0"
//         style={{
//           background: color,
//           outline: dashed ? `1.5px dashed ${color}` : "none",
//           outlineOffset: "1px",
//         }}
//       />
//       {label}
//     </span>
//   );
// }

// // ── Status pill ───────────────────────────────────────────────────────────────
// const statusStyle: Record<string, string> = {
//   "Approved":    "bg-green-100 text-green-800",
//   "Pending":     "bg-amber-100 text-amber-800",
//   "Denied":      "bg-red-100 text-red-700",
//   "Checked out": "bg-gray-100 text-gray-600",
// };

// // ═════════════════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═════════════════════════════════════════════════════════════════════════════
// export default function AnalyticsPage() {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth() + 1;

//   // ── Filter State ─────────────────────────────────────────────────────────
//   const [filterMode, setFilterMode] = useState<"last_15_days" | "year" | "month">("last_15_days");
//   const [selectedYear, setSelectedYear] = useState<number>(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

//   // ── RTK Query Hooks ──────────────────────────────────────────────────────
//   const { data: headerData, isLoading: headerLoading } = useGetAnalyticsHeaderQuery();

//   const graphParams = useMemo(() => {
//     if (filterMode === "last_15_days") {
//       return { last_15_days: true };
//     } else if (filterMode === "year") {
//       return { year: selectedYear };
//     } else {
//       return { year: selectedYear, month: selectedMonth };
//     }
//   }, [filterMode, selectedYear, selectedMonth]);

//   const { data: graphData, isLoading: graphLoading } = useGetAnalyticsGraphQuery(graphParams);

//   // ── Computed Data ────────────────────────────────────────────────────────
//   const todaySummary = useMemo(() => {
//   if (!headerData) return null;

//   const approvalStatus = graphData?.approval_status ?? [];

//   const approved =
//     approvalStatus.find((s) => s.status === "Approved")?.count || 0;

//   const denied =
//     approvalStatus.find((s) => s.status === "Denied")?.count || 0;

//   const resolved = approved + denied;

//   const approvalRate =
//     resolved > 0
//       ? Math.round((approved / resolved) * 100)
//       : 0;

//   return {
//     totalVisits: headerData.total_appointments,
//     totalVisitsDelta: 5,

//     walkIns: headerData.total_walk_ins,
//     preScheduled: headerData.total_preschedule,

//     checkedOut: headerData.total_checkout,
//     checkedOutDelta: 3,

//     pendingApproval: headerData.total_pendings,
//     pendingDelta: 2,

//     avgDurationMin: 45,
//     avgDurationDelta: -5,

//     approvalRate,

//     laptopsRegistered:
//       headerData.total_laptop_registered,

//     vehiclesRegistered:
//       headerData.vehicles_registered,

//     passesIssued:
//       headerData.total_passes_issued,

//     avgWaitMin: 8,
//     avgWaitDelta: -2,
//   };
// }, [headerData, graphData]);

//   const visitTypePie = useMemo(() => {
//     if (!headerData || headerData.total_appointments === 0) return [];
    
//     const total = headerData.total_appointments;
//     const walkInPct = Math.round((headerData.total_walk_ins / total) * 100);
//     const preScheduledPct = 100 - walkInPct;

//     return [
//       { name: "Walk-in", value: walkInPct, color: MAROON },
//       { name: "Pre-scheduled", value: preScheduledPct, color: BLUE },
//     ];
//   }, [headerData]);

//   // ── Loading State ────────────────────────────────────────────────────────
//   if (headerLoading || graphLoading || !todaySummary) {
//     return (
//       <section className="mb-12">
//         <AdminSubHeader
//           showBack={true}
//           to="/admin"
//           heading="Analytics"
//           subh="Visitor activity overview — today and historical trends"
//         />
//         <div className="px-4 lg:px-10 mt-6 flex items-center justify-center h-96">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Loading analytics...</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const maxDept = Math.max(...(graphData?.department_traffic?.map((d) => d.count) || [1]));
//   const maxApproval = Math.max(...(graphData?.approval_status?.map((s) => s.count) || [1]));

//   const months = [
//     { value: 1, label: "January" },
//     { value: 2, label: "February" },
//     { value: 3, label: "March" },
//     { value: 4, label: "April" },
//     { value: 5, label: "May" },
//     { value: 6, label: "June" },
//     { value: 7, label: "July" },
//     { value: 8, label: "August" },
//     { value: 9, label: "September" },
//     { value: 10, label: "October" },
//     { value: 11, label: "November" },
//     { value: 12, label: "December" },
//   ];

//   const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

//   return (
//     <section className="mb-12">
//       <AdminSubHeader
//         showBack={true}
//         to="/admin"
//         heading="Analytics"
//         subh="Visitor activity overview — today and historical trends"
//       />

//       <div className="px-4 lg:px-10 mt-6 space-y-8">

//         {/* ── FILTER CONTROLS ──────────────────────────────────────────── */}
//         <div className="bg-white border border-border rounded-2xl p-4">
//           <div className="flex flex-wrap gap-3 items-center">
//             <label className="text-sm font-medium text-foreground">View:</label>
            
//             <button
//               onClick={() => setFilterMode("last_15_days")}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 filterMode === "last_15_days"
//                   ? "bg-primary text-white"
//                   : "bg-muted text-muted-foreground hover:bg-muted/80"
//               }`}
//             >
//               Last 15 Days
//             </button>

//             <button
//               onClick={() => setFilterMode("year")}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 filterMode === "year"
//                   ? "bg-primary text-white"
//                   : "bg-muted text-muted-foreground hover:bg-muted/80"
//               }`}
//             >
//               Yearly
//             </button>

//             <button
//               onClick={() => setFilterMode("month")}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 filterMode === "month"
//                   ? "bg-primary text-white"
//                   : "bg-muted text-muted-foreground hover:bg-muted/80"
//               }`}
//             >
//               Monthly
//             </button>

//             {(filterMode === "year" || filterMode === "month") && (
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(Number(e.target.value))}
//                 className="px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             )}

//             {filterMode === "month" && (
//               <select
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(Number(e.target.value))}
//                 className="px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 {months.map((month) => (
//                   <option key={month.value} value={month.value}>
//                     {month.label}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>

//         {/* ── TODAY AT A GLANCE ─────────────────────────────────────────── */}
//         <div>
//           <SectionLabel>Today at a glance</SectionLabel>
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//             <MetricCard
//               label="Total visits"
//               value={todaySummary.totalVisits}
//               sub={`↑ ${todaySummary.totalVisitsDelta}% vs yesterday`}
//               delta={todaySummary.totalVisitsDelta}
//             />
//             <MetricCard
//               label="Walk-ins"
//               value={todaySummary.walkIns}
//               sub={`${Math.round((todaySummary.walkIns / todaySummary.totalVisits) * 100)}% of total`}
//             />
//             <MetricCard
//               label="Pre-scheduled"
//               value={todaySummary.preScheduled}
//               sub={`${Math.round((todaySummary.preScheduled / todaySummary.totalVisits) * 100)}% of total`}
//             />
//             <MetricCard
//               label="Checked out"
//               value={todaySummary.checkedOut}
//               sub={`${Math.round((todaySummary.checkedOut / todaySummary.totalVisits) * 100)}% cleared`}
//               delta={todaySummary.checkedOutDelta}
//             />
//             <MetricCard
//               label="Pending"
//               value={todaySummary.pendingApproval}
//               sub={`↑ ${todaySummary.pendingDelta} since 1 hr ago`}
//               delta={-todaySummary.pendingDelta}
//             />
//             <MetricCard
//               label="Avg. duration"
//               value={`${todaySummary.avgDurationMin}m`}
//               sub={`${todaySummary.avgDurationDelta}m vs last week`}
//               delta={todaySummary.avgDurationDelta}
//               deltaInvert
//             />
//           </div>
//         </div>

//         {/* ── TREND + DONUT ─────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

//           {/* Line/Area chart */}
//           <ChartCard title={
//             filterMode === "last_15_days" ? "Daily visits — last 15 days" :
//             filterMode === "year" ? `Monthly visits — ${selectedYear}` :
//             `Daily visits — ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
//           }>
//             <div className="flex gap-4 mb-3">
//               <LegendDot color={MAROON} label="Walk-in" />
//               <LegendDot color={BLUE} label="Pre-scheduled" dashed />
//             </div>
//             <ResponsiveContainer width="100%" height={200}>
//               <AreaChart data={graphData?.line_chart || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="gradWalkin" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor={MAROON} stopOpacity={0.15} />
//                     <stop offset="95%" stopColor={MAROON} stopOpacity={0}    />
//                   </linearGradient>
//                   <linearGradient id="gradPre" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%"  stopColor={BLUE} stopOpacity={0.1} />
//                     <stop offset="95%" stopColor={BLUE} stopOpacity={0}   />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                 <XAxis
//                   dataKey={filterMode === "year" ? "month" : "date"}
//                   tick={{ fontSize: 10, fill: "#9ca3af" }}
//                   tickLine={false}
//                   axisLine={false}
//                   interval={filterMode === "month" ? 2 : 1}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 10, fill: "#9ca3af" }}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <Tooltip content={<ChartTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="walkIn"
//                   name="Walk-in"
//                   stroke={MAROON}
//                   strokeWidth={2}
//                   fill="url(#gradWalkin)"
//                   dot={{ r: 3, fill: MAROON, strokeWidth: 0 }}
//                   activeDot={{ r: 5 }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="preScheduled"
//                   name="Pre-scheduled"
//                   stroke={BLUE}
//                   strokeWidth={2}
//                   strokeDasharray="5 3"
//                   fill="url(#gradPre)"
//                   dot={{ r: 3, fill: BLUE, strokeWidth: 0 }}
//                   activeDot={{ r: 5 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </ChartCard>

//           {/* Pie donut */}
//           <ChartCard title="Visit type breakdown">
//             <ResponsiveContainer width="100%" height={160}>
//               <PieChart>
//                 <Pie
//                   data={visitTypePie}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={48}
//                   outerRadius={72}
//                   paddingAngle={3}
//                   dataKey="value"
//                   strokeWidth={0}
//                 >
//                   {visitTypePie.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value) => [`${value ?? 0}%`, ""]}
//                   contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="flex justify-center gap-5 mt-2">
//               {visitTypePie.map((d) => (
//                 <LegendDot key={d.name} color={d.color} label={`${d.name} ${d.value}%`} />
//               ))}
//             </div>

//             {/* centre label overlay */}
//             <div className="flex flex-col items-center -mt-33 mb-20 pointer-events-none">
//               <span className="text-2xl font-semibold text-foreground leading-none">
//                 {todaySummary.totalVisits}
//               </span>
//               <span className="text-[10px] text-muted-foreground mt-0.5">total</span>
//             </div>
//           </ChartCard>
//         </div>

//         {/* ── DEPARTMENT + APPROVAL ────────────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

//           {/* Department traffic */}
//           <ChartCard title="Department traffic">
//             <div className="space-y-3">
//               {graphData?.department_traffic?.slice(0, 7).map((d, i) => {
//                 const pct = maxDept > 0 ? Math.round((d.count / maxDept) * 100) : 0;
//                 const opacity = 1 - i * 0.13;
//                 return (
//                   <div key={d.department} className="flex items-center gap-3">
//                     <span className="text-[11px] text-muted-foreground w-21 shrink-0 truncate">
//                       {d.department}
//                     </span>
//                     <div className="flex-1 bg-muted rounded-full h-2">
//                       <div
//                         className="h-2 rounded-full transition-all"
//                         style={{ width: `${pct}%`, background: MAROON, opacity }}
//                       />
//                     </div>
//                     <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">
//                       {d.count}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </ChartCard>

//           {/* Approval status */}
//           <ChartCard title="Approval status">
//             <div className="space-y-3 mb-4">
//               {graphData?.approval_status?.map((s) => {
//                 const pct = maxApproval > 0 ? Math.round((s.count / maxApproval) * 100) : 0;
//                 return (
//                   <div key={s.status} className="flex items-center gap-3">
//                     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-21 shrink-0 text-center ${statusStyle[s.status]}`}>
//                       {s.status}
//                     </span>
//                     <div className="flex-1 bg-muted rounded-full h-1.5">
//                       <div
//                         className="h-1.5 rounded-full"
//                         style={{ width: `${pct}%`, background: s.color }}
//                       />
//                     </div>
//                     <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">
//                       {s.count}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="pt-3 border-t border-border">
//               <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Approval rate</p>
//               <p className="text-2xl font-semibold text-foreground leading-tight">
//                 {todaySummary.approvalRate}%
//                 <span className="text-xs font-normal text-muted-foreground ml-1.5">of resolved</span>
//               </p>
//             </div>
//           </ChartCard>
//         </div>

//         {/* ── SECURITY & ACCESS ─────────────────────────────────────────── */}
//         <div>
//           <SectionLabel>Security & access</SectionLabel>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             <MetricCard
//               label="Laptops registered"
//               value={todaySummary.laptopsRegistered}
//               sub={`${Math.round((todaySummary.laptopsRegistered / todaySummary.totalVisits) * 100)}% of visitors`}
//               icon={<Laptop size={14} />}
//             />
//             <MetricCard
//               label="Vehicles registered"
//               value={todaySummary.vehiclesRegistered}
//               sub={`${Math.round((todaySummary.vehiclesRegistered / todaySummary.totalVisits) * 100)}% of visitors`}
//               icon={<Car size={14} />}
//             />
//             <MetricCard
//               label="Passes issued"
//               value={todaySummary.passesIssued}
//               sub={`${Math.round((todaySummary.passesIssued / todaySummary.totalVisits) * 100)}% coverage`}
//               delta={5}
//               icon={<BadgeCheck size={14} />}
//             />
//             <MetricCard
//               label="Avg. wait time"
//               value={`${todaySummary.avgWaitMin}m`}
//               sub={`${todaySummary.avgWaitDelta}m vs last week`}
//               delta={todaySummary.avgWaitDelta}
//               deltaInvert
//               icon={<Clock size={14} />}
//             />
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }