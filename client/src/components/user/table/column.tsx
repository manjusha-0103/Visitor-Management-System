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
    // MoreHorizontal, Pencil, Eye, 
    Pencil,
    Clock } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { getNameInitials } from "@/lib/utils/helperFunctions";
// import DeleteModal from "@/components/DeleteModal";

// ── Types (matching API response) ─────────────────────────────────────────────
export type UserRole = "super_admin" | "receptionist" | "visitor";

export interface User {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  last_login: string | null;
  created_at: string;
}

// ── Avatar colour cycling ─────────────────────────────────────────────────────
// const AVATAR_COLORS: Record<UserRole, string> = {
//   super_admin:  "bg-maroon text-white",
//   receptionist: "bg-violet-500 text-white",
//   employee:     "bg-amber-600 text-white",
//   visitor:      "bg-cyan-600 text-white",
// };

// ── Role badge styles ─────────────────────────────────────────────────────────
const ROLE_STYLES: Record<UserRole, string> = {
  super_admin:  "bg-[#fbeaf0] text-[#701a40]",
  receptionist: "bg-violet-100 text-violet-700",
  // employee:     "bg-amber-100 text-amber-700",
  visitor:      "bg-cyan-100 text-cyan-700",
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:  "Super Admin",
  receptionist: "Receptionist",
  // employee:     "Employee",
  visitor:      "Visitor",
};

// ── Actions cell ──────────────────────────────────────────────────────────────
function ActionsCell({ row, table }: { row: any; table: any }) {
  const user: User = row.original;
  const { setEditMember, setEditOpen, setSheetMode } =
    table.options.meta || {};

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        variant="outline"
        size="xs"
        className="hover:bg-maroon hover:text-white cursor-pointer"
        onClick={() => {
          setSheetMode?.("edit")
          setEditMember?.(user);
          setEditOpen?.(true);
        }}
      >
        <Pencil size={14} />
      </Button>

      {/* <DeleteModal
        who={user.full_name}
        m1active="All data associated with this user will be removed"
        onConfirm={() => onDelete?.(user.id)}
        isLoading={false}
      /> */}

      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border shadow-md w-40">
          <DropdownMenuItem
            className="gap-2 text-sm cursor-pointer"
            onClick={() => {
              setViewUser?.(user);
              setViewOpen?.(true);
            }}
          >
            <Eye size={14} /> View profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// COLUMNS
// ════════════════════════════════════════════════════════════════════════════
export const userColumns = [
  // ── User avatar + name + email ────────────────────────────────────────────
  {
    accessorKey: "full_name",
    header: "User",
    cell: ({ row }: any) => {
      const user: User = row.original;
      // const avatarCls = AVATAR_COLORS[user.role] ?? "bg-gray-400 text-white";
      return (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold p-1 bg-gold text-white`}
          >
            {getNameInitials(user.first_name, user.last_name)}
          </div>
          <div className="-space-y-0.5">
            <p className="font-medium text-sm capitalize">{user.full_name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      );
    },
  },

  // ── Phone ─────────────────────────────────────────────────────────────────
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }: any) => (
      <span className="text-sm font-mono text-gray-600">{row.original.phone}</span>
    ),
  },

  // ── Role (with filter dropdown) ───────────────────────────────────────────
  {
    accessorKey: "role",
    header: ({ column, table }: any) => {
      const current = (column.getFilterValue() as string) || "all";
      return (
        <div className="flex items-center gap-2">
          <span>Role</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 min-w-20 text-[10px]">
                {current === "all" ? "All roles" : ROLE_LABELS[current as UserRole] ?? current}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-white border shadow-md">
              <DropdownMenuRadioGroup
                value={current}
                onValueChange={(v) => {
                  column.setFilterValue(v === "all" ? undefined : v);
                  table.options.meta?.updatePage?.(1);
                }}
              >
                <DropdownMenuRadioItem value="all" className="text-xs">
                  All roles
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="super_admin" className="text-xs">
                  Super Admin
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="receptionist" className="text-xs">
                  Receptionist
                </DropdownMenuRadioItem>
                {/* <DropdownMenuRadioItem value="employee" className="text-xs">
                  Employee
                </DropdownMenuRadioItem> */}
                <DropdownMenuRadioItem value="visitor" className="text-xs">
                  Visitor
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    cell: ({ row }: any) => {
      const role: UserRole = row.original.role;
      return (
        <Badge className={`${ROLE_STYLES[role] ?? "bg-gray-100 text-gray-600"} border-0 text-xs font-medium`}>
          {ROLE_LABELS[role] ?? role}
        </Badge>
      );
    },
    filterFn: (row: any, _id: string, value: string) => {
      if (!value) return true;
      return row.original.role === value;
    },
  },

  // ── Joined date ───────────────────────────────────────────────────────────
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }: any) => {
      const { created_at } = row.original as User;
      return (
        <div className="-space-y-0.5">
          <p className="text-sm text-gray-700">
            {format(parseISO(created_at), "dd MMM yyyy")}
          </p>
          <p className="text-xs text-gray-400">
            {format(parseISO(created_at), "hh:mm a")}
          </p>
        </div>
      );
    },
  },

  // ── Last active ───────────────────────────────────────────────────────────
  {
    accessorKey: "last_login",
    header: "Last active",
    // header: ({  }: any) => {
    // //   const current = (column.getFilterValue() as string) || "all";
    // //   const isChecked = current === "inactive";
    //   return (
    //     <div className="flex items-center gap-2">
    //       <span>Last active</span>
    //       {/* Toggle to show never-logged-in users only */}
    //       {/* <button
    //         onClick={() =>
    //           column.setFilterValue(isChecked ? undefined : "inactive")
    //         }
    //         className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
    //           isChecked
    //             ? "bg-maroon text-white border-maroon"
    //             : "border-gray-300 text-gray-500 hover:border-gray-400"
    //         }`}
    //       >
    //         inactive
    //       </button> */}
    //     </div>
    //   );
    // },
    cell: ({ row }: any) => {
      const { last_login } = row.original as User;
      if (!last_login) {
        return (
          <span className="text-xs text-gray-300 italic">Never logged in</span>
        );
      }
      return (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} className="shrink-0" />
          <span className="text-xs">
            {formatDistanceToNow(parseISO(last_login), { addSuffix: true })}
          </span>
        </div>
      );
    },
    filterFn: (row: any, _id: string, value: string) => {
      if (!value || value === "all") return true;
      if (value === "inactive") return !row.original.last_login;
      return true;
    },
  },

  // ── Actions ───────────────────────────────────────────────────────────────
  {
    id: "actions",
    cell: ({ row, table }: any) => <ActionsCell row={row} table={table} />,
  },
];