// ── KPI summary ──────────────────────────────────────────────────────────────
export const todaySummary = {
  totalVisits: 84,
  walkIns: 51,
  preScheduled: 33,
  checkedOut: 62,
  pendingApproval: 9,
  avgDurationMin: 38,
  laptopsRegistered: 23,
  vehiclesRegistered: 18,
  passesIssued: 71,
  avgWaitMin: 4,
  approvalRate: 94,

  // delta vs yesterday
  totalVisitsDelta: 12,      // %
  checkedOutDelta: 5,        // %
  pendingDelta: 3,           // absolute
  avgDurationDelta: -5,      // minutes
  avgWaitDelta: -1,          // minutes
};

// ── 14-day daily trend ────────────────────────────────────────────────────────
export const dailyTrend = [
  { date: "22 Apr", walkIn: 38, preScheduled: 28 },
  { date: "23 Apr", walkIn: 42, preScheduled: 31 },
  { date: "24 Apr", walkIn: 35, preScheduled: 24 },
  { date: "25 Apr", walkIn: 51, preScheduled: 35 },
  { date: "26 Apr", walkIn: 58, preScheduled: 42 },
  { date: "27 Apr", walkIn: 47, preScheduled: 33 },
  { date: "28 Apr", walkIn: 29, preScheduled: 18 },
  { date: "29 Apr", walkIn: 22, preScheduled: 14 },
  { date: "30 Apr", walkIn: 44, preScheduled: 30 },
  { date: "1 May",  walkIn: 49, preScheduled: 32 },
  { date: "2 May",  walkIn: 53, preScheduled: 38 },
  { date: "3 May",  walkIn: 47, preScheduled: 33 },
  { date: "4 May",  walkIn: 51, preScheduled: 29 },
  { date: "5 May",  walkIn: 51, preScheduled: 33 },
];

// ── Monthly (Jan–May 2025) ────────────────────────────────────────────────────
export const monthlyVisits = [
  { month: "Jan", walkIn: 980,  preScheduled: 520 },
  { month: "Feb", walkIn: 1100, preScheduled: 620 },
  { month: "Mar", walkIn: 1250, preScheduled: 600 },
  { month: "Apr", walkIn: 1180, preScheduled: 540 },
  { month: "May", walkIn: 780,  preScheduled: 320 },
];

// ── Department traffic ────────────────────────────────────────────────────────
export const departmentTraffic = [
  { department: "Engineering", count: 68 },
  { department: "Sales",       count: 59 },
  { department: "HR",          count: 46 },
  { department: "Finance",     count: 35 },
  { department: "Product",     count: 27 },
  { department: "Legal",       count: 16 },
];

// ── Approval status breakdown ─────────────────────────────────────────────────
export const approvalStatus = [
  { status: "Approved",    count: 64, color: "#639922" },
  { status: "Pending",     count: 9,  color: "#EF9F27" },
  { status: "Denied",      count: 4,  color: "#E24B4A" },
  { status: "Checked out", count: 62, color: "#888780" },
];

// ── Peak hours (today) ────────────────────────────────────────────────────────
export const peakHours = [
  { hour: "8 AM",  count: 4  },
  { hour: "9 AM",  count: 9  },
  { hour: "10 AM", count: 14 },
  { hour: "11 AM", count: 11 },
  { hour: "12 PM", count: 7  },
  { hour: "1 PM",  count: 10 },
  { hour: "2 PM",  count: 8  },
  { hour: "3 PM",  count: 6  },
  { hour: "4 PM",  count: 4  },
  { hour: "5 PM",  count: 2  },
];

// ── Frequent visitors ─────────────────────────────────────────────────────────
export const frequentVisitors = [
  { name: "Rohan Mehta",   company: "Acme Corp",  department: "Engineering", visits: 14, initials: "RM", color: "#EEEDFE", textColor: "#3C3489" },
  { name: "Sneha Patel",   company: "Deloitte",   department: "Finance",     visits: 11, initials: "SP", color: "#E1F5EE", textColor: "#085041" },
  { name: "Aisha Khan",    company: "BlueStar",   department: "Sales",       visits: 9,  initials: "AK", color: "#FBEAF0", textColor: "#72243E" },
  { name: "Karan Verma",   company: "TechSol",    department: "Product",     visits: 8,  initials: "KV", color: "#FAEEDA", textColor: "#633806" },
  { name: "Meera Iyer",    company: "InfoEdge",   department: "HR",          visits: 7,  initials: "MI", color: "#E6F1FB", textColor: "#0C447C" },
];

// ── Visit type pie ────────────────────────────────────────────────────────────
export const visitTypePie = [
  { name: "Walk-in",       value: 61, color: "#701a40" },
  { name: "Pre-scheduled", value: 39, color: "#c0346a" },
];