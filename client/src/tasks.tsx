import {
  CalendarClock,
  ChartNoAxesCombined,
  // Settings,
  UserRound,
  UsersRound,
} from "lucide-react";

export const SUPER_ADMIN_TASKS = [
  {
    key: "users",
    label: "Users",
    icon: UserRound,
    bg: "bg-violet-600 shadow-lg shadow-violet-600/40",
    path: "/admin/users",
  },

  {
    key: "appointments",
    label: "Appointments",
    icon: CalendarClock,
    bg: "bg-cyan-700 shadow-lg shadow-cyan-700/40",
    path: "/admin/appointments",
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
    key: "users",
    label: "Users",
    icon: UserRound,
    bg: "bg-amber-700 shadow-lg shadow-amber-700/40",
    path: "/receptionist/users",
  },

  {
    key: "appointments",
    label: "Appointments",
    icon: CalendarClock,
    bg: "bg-cyan-700 shadow-lg shadow-cyan-700/40",
    path: "/receptionist/appointments",
  },

  {
    key: "team",
    label: "Team",
    icon: UsersRound,
    bg: "bg-violet-600 shadow-lg shadow-violet-600/40",
    path: "/receptionist/team",
  },

  {
    key: "analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    bg: "bg-yellow-700 shadow-lg shadow-yellow-700/40",
    path: "/receptionist/analytics",
  },
] as const;