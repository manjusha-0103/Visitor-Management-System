import {
  CalendarClock,
  ChartNoAxesCombined,
  // Settings,
  UserRound,
  UsersRound,
} from "lucide-react";

export const SUPER_ADMIN_TASKS = [
  {
    key: "visitor",
    label: "Visitors",
    icon: UserRound,
    bg: "bg-violet-600 shadow-lg shadow-violet-600/40",
    path: "/admin/visitors",
  },

  {
    key: "check-in",
    label: "Check In",
    icon: CalendarClock,
    bg: "bg-cyan-700 shadow-lg shadow-cyan-700/40",
    path: "/admin/check-in",
  },

  {
    key: "team",
    label: "Team",
    icon: UsersRound,
    bg: "bg-amber-700 shadow-lg shadow-amber-700/40",
    path: "/admin/team",
  },

  {
    key: "analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    bg: "bg-yellow-700 shadow-lg shadow-yellow-700/40",
    path: "/admin/analytics",
  },

  // {
  //   key: "settings",
  //   label: "Settings",
  //   icon: Settings,
  //   bg: "bg-green-500 shadow-lg shadow-green-500/40",
  //   path: "/admin/settings",
  // },
] as const;

export const RECEPTIONIST_TASKS = [
  {
    key: "visitors",
    label: "Visitors",
    icon: UserRound,
    bg: "bg-amber-700 shadow-lg shadow-amber-700/40",
    path: "/user/visitors",
  },

  {
    key: "check-in",
    label: "Check In",
    icon: CalendarClock,
    bg: "bg-cyan-700 shadow-lg shadow-cyan-700/40",
    path: "/user/check-in",
  },

  // {
  //   key: "team",
  //   label: "Team",
  //   icon: UsersRound,
  //   bg: "bg-violet-600 shadow-lg shadow-violet-600/40",
  //   path: "/receptionist/team",
  // },

  // {
  //   key: "analytics",
  //   label: "Analytics",
  //   icon: ChartNoAxesCombined,
  //   bg: "bg-yellow-700 shadow-lg shadow-yellow-700/40",
  //   path: "/receptionist/analytics",
  // },
] as const;