import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  LogOut,
  BadgeCheck,
  Car,
  Laptop,
  Clock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import type { AppointmentRow } from '@/types';
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/features/auth/authSlice";

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-500", "bg-cyan-600", "bg-amber-600",
  "bg-rose-500", "bg-green-600", "bg-sky-600",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}
function fmtTime(iso: string | null) {
  return iso ? format(parseISO(iso), "hh:mm a") : null;
}

// ── Approve badge ─────────────────────────────────────────────────────────────
function ApproveBadge({ is_approve, check_out }: { is_approve: boolean; check_out: string | null }) {
  if (check_out)
    return <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">Checked out</Badge>;
  if (is_approve)
    return <Badge className="bg-green-100 text-green-700 border-0 text-xs">Approved</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Pending</Badge>;
}

// ── Actions cell ──────────────────────────────────────────────────────────────
function ActionsCell({ row, table }: { row: any; table: any }) {
  const appt: AppointmentRow = row.original;
  const user = useSelector(selectUser);
  const isReceptionist = user?.role === "receptionist";

  const { onView, onCheckOut, onSetPass } = table.options.meta || {};

  return (
    <div className="flex items-center gap-2 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-md w-44">
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() => onView?.(appt)}
          >
            <Eye size={14} /> View details
          </DropdownMenuItem>

          {/* {isReceptionist && !appt.is_approve && !appt.check_out && (
            <>
              <DropdownMenuItem
                className="text-green-600"
                onClick={() => onApprove?.(appt.appointment_id)}
              >
                <BadgeCheck size={14} /> Approve
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onReject?.(appt.appointment_id)}
              >
                <X size={14} /> Reject
              </DropdownMenuItem>
            </>
          )} */}

          {isReceptionist && appt.is_approve && !appt.check_out && (
            <>
              {!appt.pass_id && (
                <DropdownMenuItem
                  className="gap-2 text-sm cursor-pointer text-blue-600"
                  onClick={() => onSetPass?.(appt)}
                >
                  <BadgeCheck size={14} /> Set pass ID
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="gap-2 text-sm cursor-pointer text-gray-600"
                onClick={() => onCheckOut?.(appt.appointment_id)}
              >
                <LogOut size={14} /> Check out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Visitor cell (shared) ─────────────────────────────────────────────────────
function VisitorCell({ row }: { row: any }) {
  const appt: AppointmentRow = row.original;
  const name = `${appt.visitor_first_name} ${appt.visitor_last_name}`;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${avatarColor(name)}`}
      >
        {initials(appt.visitor_first_name, appt.visitor_last_name)}
      </div>
      <div className="-space-y-0.5">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-400">
          {appt.company ? `${appt.company} · ${appt.visitor_position} - ` : ""}
          {appt.visitor_phone}
        </p>
      </div>
    </div>
  );
}

// ── Host cell (shared) ────────────────────────────────────────────────────────
function HostCell({ row }: { row: any }) {
  const appt: AppointmentRow = row.original;
  return (
    <div className="-space-y-0.5">
      <p className="text-sm font-medium">
        {appt.employee_first_name} {appt.employee_last_name}
      </p>
      <p className="text-xs text-gray-400">{appt.employee_position}</p>
    </div>
  );
}

// ── Extras badges (laptop / vehicle) ─────────────────────────────────────────
function ExtrasCell({ row }: { row: any }) {
  const appt: AppointmentRow = row.original;
  return (
    <div className="flex gap-1.5">
      {appt.is_laptop && (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">
          <Laptop size={10} /> Laptop
        </span>
      )}
      {appt.is_vehicle && (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
          <Car size={10} /> Vehicle
        </span>
      )}
      {!appt.is_laptop && !appt.is_vehicle && (
        <span className="text-gray-300 text-xs">—</span>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// WALK-IN COLUMNS
// ════════════════════════════════════════════════════════════════════════════
export const walkInColumns = [
  {
    accessorKey: "visitor_first_name",
    header: "Visitor",
    cell: ({ row }: any) => <VisitorCell row={row} />,
  },
  {
    accessorKey: "employee_first_name",
    header: "Host",
    cell: ({ row }: any) => <HostCell row={row} />,
  },
  {
    accessorKey: "check_in",
    header: "Check-in",
    cell: ({ row }: any) => {
      const t = fmtTime(row.original.check_in);
      return t ? (
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-gray-400" />
          <span className="text-sm">{t}</span>
        </div>
      ) : (
        <span className="text-gray-300 text-sm">—</span>
      );
    },
  },
  {
    accessorKey: "is_laptop",
    header: "Extras",
    cell: ({ row }: any) => <ExtrasCell row={row} />,
  },
  {
    accessorKey: "pass_id",
    header: "Pass ID",
    cell: ({ row }: any) => {
      const p = row.original.pass_id;
      return p ? (
        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p}</span>
      ) : (
        <span className="text-gray-300 text-xs">Not set</span>
      );
    },
  },
  {
    accessorKey: "is_approve",
    header: "Status",
    cell: ({ row }: any) => (
      <ApproveBadge is_approve={row.original.is_approve} check_out={row.original.check_out} />
    ),
    filterFn: (row: any, _: string, value: string) => {
      if (!value || value === "all") return true;
      const a: AppointmentRow = row.original;
      if (value === "checked_out") return !!a.check_out;
      if (value === "approved") return a.is_approve && !a.check_out;
      if (value === "pending") return !a.is_approve && !a.check_out;
      return true;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }: any) => <ActionsCell row={row} table={table} />,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// PRE-SCHEDULE COLUMNS
// ════════════════════════════════════════════════════════════════════════════
export const preScheduleColumns = [
  {
    accessorKey: "visitor_first_name",
    header: "Visitor",
    cell: ({ row }: any) => <VisitorCell row={row} />,
  },
  {
    accessorKey: "employee_first_name",
    header: "Host",
    cell: ({ row }: any) => <HostCell row={row} />,
  },
  {
    accessorKey: "date_time",
    header: "Scheduled",
    cell: ({ row }: any) => {
      const appt: AppointmentRow = row.original;
      return (
        <div className="-space-y-0.5">
          <p className="text-sm">{format(parseISO(appt.date_time), "dd MMM yyyy")}</p>
          <p className="text-xs text-gray-400">{format(parseISO(appt.date_time), "hh:mm a")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "is_laptop",
    header: "Extras",
    cell: ({ row }: any) => <ExtrasCell row={row} />,
  },
  {
    accessorKey: "pass_id",
    header: "Pass ID",
    cell: ({ row }: any) => {
      const p = row.original.pass_id;
      return p ? (
        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{p}</span>
      ) : (
        <span className="text-gray-300 text-xs">Not set</span>
      );
    },
  },
  {
    accessorKey: "is_approve",
    header: "Status",
    cell: ({ row }: any) => (
      <ApproveBadge is_approve={row.original.is_approve} check_out={row.original.check_out} />
    ),
    filterFn: (row: any, _: string, value: string) => {
      if (!value || value === "all") return true;
      const a: AppointmentRow = row.original;
      if (value === "checked_out") return !!a.check_out;
      if (value === "approved") return a.is_approve && !a.check_out;
      if (value === "pending") return !a.is_approve && !a.check_out;
      return true;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }: any) => <ActionsCell row={row} table={table} />,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// PAST COLUMNS (read-only — no actions dropdown for mutations)
// ════════════════════════════════════════════════════════════════════════════
export const pastColumns = [
  {
    accessorKey: "visitor_first_name",
    header: "Visitor",
    cell: ({ row }: any) => <VisitorCell row={row} />,
  },
  {
    accessorKey: "employee_first_name",
    header: "Host",
    cell: ({ row }: any) => <HostCell row={row} />,
  },
  {
    accessorKey: "date_time",
    header: "Date",
    cell: ({ row }: any) => (
      <div className="-space-y-0.5">
        <p className="text-sm">{format(parseISO(row.original.date_time), "dd MMM yyyy")}</p>
        <p className="text-xs text-gray-400">{format(parseISO(row.original.date_time), "hh:mm a")}</p>
      </div>
    ),
  },
  {
    accessorKey: "check_in",
    header: "Check-in / out",
    cell: ({ row }: any) => {
      const a: AppointmentRow = row.original;
      return (
        <div className="-space-y-0.5">
          <p className="text-xs text-gray-500">In: {fmtTime(a.check_in) ?? "—"}</p>
          <p className="text-xs text-gray-400">Out: {fmtTime(a.check_out) ?? "—"}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "is_laptop",
    header: "Extras",
    cell: ({ row }: any) => <ExtrasCell row={row} />,
  },
  {
    accessorKey: "is_preschedule",
    header: "Type",
    cell: ({ row }: any) => (
      <Badge
        className={
          row.original.is_preschedule
            ? "bg-violet-100 text-violet-700 border-0 text-xs"
            : "bg-cyan-100 text-cyan-700 border-0 text-xs"
        }
      >
        {row.original.is_preschedule ? "Pre-scheduled" : "Walk-in"}
      </Badge>
    ),
    filterFn: (row: any, _: string, value: string) => {
      if (!value || value === "all") return true;
      return String(row.original.is_preschedule) === value;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }: any) => (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => table.options.meta?.onView?.(row.original)}
      >
        <Eye size={15} />
      </Button>
    ),
  },
];