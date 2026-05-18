import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Clock,
} from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { getNameInitials } from "@/lib/utils/helperFunctions";
import type { Employee } from "@/lib/features/employee/employeeApi";



// ── Actions cell ──────────────────────────────────────────────────────────────
function ActionsCell({ row, table }: { row: any; table: any }) {
  const member: Employee = row.original;
  const { 
    setEditMember, 
    setEditOpen, 
    setSheetMode,
    // setEditMember2, 
    // setEditOpen2, 
    // setSheetMode2 
  } =
    table.options.meta || {};

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        variant="outline"
        size="xs"
        className="hover:bg-maroon hover:text-white cursor-pointer"
        onClick={() => {
          setSheetMode?.("edit")
          setEditMember?.(member);
          setEditOpen?.(true);
        }}
      >
        <Pencil size={14} />
      </Button>

      {/* <DeleteModal
        who={member.full_name}
        m1active="Employee will not be assignable for visitor appointments"
        onConfirm={() => onDelete?.(member.id)}
        isLoading={false}
      /> */}

      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-md w-44">
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() => {
              setViewMember?.(member);
              setViewOpen?.(true);
            }}
          >
            <Eye size={14} /> View profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() => {
              setViewMember?.(member);
              setViewOpen?.(true);
            }}
          >
            <CalendarClock size={14} /> Visit history
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// COLUMNS
// ════════════════════════════════════════════════════════════════════════════
export const teamColumns = [
  // ── Employee name + email ──────────────────────────────────────────────────
  {
    accessorKey: "full_name",
    header: "Employee",
    cell: ({ row }: any) => {
      const member: Employee = row.original;
      return (
        <div className="flex items-center gap-3">
          <div
            className={"w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold p-1 bg-gold text-white"}
          >
            {getNameInitials(
              member.full_name.split(
                " "
              )[0] || "",
              member.full_name.split(
                " "
              )[1] || ""
            )}
          </div>
          <div className="-space-y-0.5">
            <p className="font-medium text-sm">{member.full_name}</p>
            <p className="text-xs text-gray-400">{member.email}</p>
          </div>
        </div>
      );
    },
  },

  // ── Position ───────────────────────────────────────────────────────────────
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }: any) => {
      const member: Employee = row.original;
      return (
        <div className="-space-y-0.5">
          <p className="text-sm font-medium">{member.position}</p>
          <p className="text-xs text-gray-400">{member.phone}</p>
        </div>
      );
    },
  },

  // ── Department (with filter) ───────────────────────────────────────────────
  {
  accessorKey: "department_name",

  header: ({ column, table }: any) => {
    const current =
      (column.getFilterValue() as string) ||
      "all";

    const departments =
      table.options.meta?.departments ||
      [];

    return (
      <div className="flex items-center gap-2">
        <span>Department</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-6 min-w-20 text-[10px]"
            >
              {current === "all"
                ? "All depts"
                : current}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-44 bg-white border shadow-md">
            <DropdownMenuRadioGroup
              value={current}
              onValueChange={(v) =>
                column.setFilterValue(
                  v === "all"
                    ? undefined
                    : v
                )
              }
            >
              <DropdownMenuRadioItem
                value="all"
                className="text-xs"
              >
                All departments
              </DropdownMenuRadioItem>

              {departments.map(
                (d: any) => (
                  <DropdownMenuRadioItem
                    key={d.id}
                    value={d.name}
                    className="text-xs"
                  >
                    {d.name}
                  </DropdownMenuRadioItem>
                )
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },

  cell: ({ row }: any) => {
    const member = row.original;

    return (
      <Badge className="bg-gray-100 text-gray-700 border-0 text-xs font-medium">
        {member.department_name}
      </Badge>
    );
  },

  filterFn: (
    row: any,
    _id: string,
    value: string
  ) => {
    if (!value) return true;

    return (
      row.original.department_name ===
      value
    );
  },
},

  // ── Visits received ────────────────────────────────────────────────────────
  // {
  //   accessorKey: "total_visits_received",
  //   header: "Visits",
  //   cell: ({ row }: any) => {
  //     const member: Employee = row.original;
  //     return (
  //       <div className="-space-y-0.5">
  //         <p className="text-sm font-medium">{member.total_visits_received} total</p>
  //         <p className="text-xs text-gray-400">{member.visits_this_month} this month</p>
  //       </div>
  //     );
  //   },
  // },

  // ── Pending approvals ──────────────────────────────────────────────────────
  // {
  //   accessorKey: "pending_approvals",
  //   header: "Pending",
  //   cell: ({ row }: any) => {
  //     const count: number = row.original.pending_approvals;
  //     if (count === 0)
  //       return <span className="text-gray-300 text-sm">—</span>;
  //     return (
  //       <div className="flex items-center gap-1.5">
  //         <AlertCircle size={13} className="text-amber-500 shrink-0" />
  //         <span className="text-sm font-medium text-amber-700">{count} pending</span>
  //       </div>
  //     );
  //   },
  // },

  // ── Since (joined) ─────────────────────────────────────────────────────────
  {
    accessorKey: "created_at",
    header: "Since",
    cell: ({ row }: any) => {
      const { created_at } = row.original as Employee;
      return (
        <span className="text-sm text-gray-500">
          {created_at ? format(parseISO(created_at), "MMM yyyy") : "—"}
        </span>
      );
    },
  },

  // ── Last active ────────────────────────────────────────────────────────────
  {
    accessorKey: "last_login",
    header: "Last active",
    cell: ({ row }: any) => {
      const { last_login } = row.original as Employee;
      if (!last_login)
        return <span className="text-gray-300 text-xs">Never logged in</span>;
      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} className="shrink-0" />
          <span className="text-xs">
            {formatDistanceToNow(parseISO(last_login), { addSuffix: true })}
          </span>
        </div>
      );
    },
  },

  // ── Actions ────────────────────────────────────────────────────────────────
  {
    id: "actions",
    cell: ({ row, table }: any) => <ActionsCell row={row} table={table} />,
  },
];