import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AuditRecord {
  id: string;
  created_at: string;
  ip_address: string;
  audit_record: Record<string, any>;
  action: string;
}

// Action badge config
const ACTION_STYLES: Record<
  string,
  {
    className: string;
    label?: string;
  }
> = {
  signin: {
    className: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  },

  signin_failed: {
    className: "bg-red-100 text-red-800 border border-red-200",
  },

  logout: {
    className: "bg-slate-100 text-slate-700 border border-slate-200",
  },

  checkin: {
    className: "bg-sky-100 text-sky-800 border border-sky-200",
  },

  checkin_approval: {
    className: "bg-green-100 text-green-800 border border-green-200",
  },

  checkin_reject: {
    className: "bg-rose-100 text-rose-800 border border-rose-200",
  },

  checkout: {
    className: "bg-orange-100 text-orange-800 border border-orange-200",
  },

  preschedule: {
    className: "bg-violet-100 text-violet-800 border border-violet-200",
  },

  add_employee: {
    className: "bg-cyan-100 text-cyan-800 border border-cyan-200",
  },

  update_employee: {
    className: "bg-amber-100 text-amber-800 border border-amber-200",
  },

  delete_employee: {
    className: "bg-red-100 text-red-800 border border-red-200",
  },

  employee_bulk_import: {
    className: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  },

  update_profile: {
    className: "bg-blue-100 text-blue-800 border border-blue-200",
  },

  failed_update_profile: {
    className: "bg-pink-100 text-pink-800 border border-pink-200",
  },

  change_password: {
    className: "bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200",
  },

  change_password_failed: {
    className: "bg-red-100 text-red-800 border border-red-200",
  },

  checkin_approval_failed: {
    className: "bg-red-100 text-red-800 border border-red-200",
  },

  preschedule_failed: {
    className: "bg-red-100 text-red-800 border border-red-200",
  },

  checkout_failed: {
    className: "bg-red-100 text-red-800 border border-red-200",
  },
};

// Format action text
const formatActionText = (action: string) => {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Badge component helper
const ActionBadge = ({ action }: { action: string }) => {
  const style = ACTION_STYLES[action.toLowerCase()] ?? {
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <Badge
      className={`
                font-medium
                shadow-none
                hover:${style.className}
                ${style.className}
            `}
    >
      {formatActionText(action)}
    </Badge>
  );
};

// Parse audit_record JSON safely
// const parseAuditRecord = (record: any) => {
//   return record || {};
// };

// Get action badge color
// const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
//     switch (action.toLowerCase()) {
//         case "signin":
//             return "default";
//         case "logout":
//             return "secondary";
//         case "update_profile":
//             return "outline";
//         case "delete":
//             return "destructive";
//         default:
//             return "default";
//     }
// };

// Format action text
// const formatActionText = (action: string) => {
//     return action
//         .split("_")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
// };

// Details Dialog Component
function AuditDetailsDialog({ audit }: { audit: AuditRecord }) {
  const [open, setOpen] = useState(false);
  const auditData = audit.audit_record;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">View details</span>
      </Button>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Detailed information about this audit action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ID</p>
              <p className="text-sm font-mono text-gray-900 break-all">
                {audit.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Action</p>
              <ActionBadge action={audit.action} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Timestamp</p>
              <p className="text-sm text-gray-900">
                {format(new Date(audit.created_at), "PPpp")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">IP Address</p>
              <p className="text-sm font-mono text-gray-900">
                {audit.ip_address}
              </p>
            </div>
          </div>

          {/* Audit Record Data */}
          <div className="max-w-sm">
            <p className="text-sm font-medium text-gray-500 mb-2">Audit Data</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre
                className="
        text-xs
        whitespace-pre-wrap
        wrap-break-words
        overflow-x-hidden
      "
              >
                {JSON.stringify(auditData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const getAuditUserInfo = (auditRecord: any) => {
  // Most actions
  if (auditRecord?.updated_by) {
    return {
      name: auditRecord.updated_by.name,
      email: auditRecord.updated_by.email,
      phone: auditRecord.updated_by.phone,
    };
  }

  // Fallbacks
  if (auditRecord?.profile) {
    return {
      name: auditRecord.profile.name,
      email: auditRecord.profile.email,
      phone: auditRecord.profile.phone,
    };
  }

  return null;
};

export const auditColumns = [
  {
    accessorKey: "created_at",
    header: "Date & Time",
    cell: ({ row }: any) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-900">
            {format(new Date(date), "PPpp")}
          </p>
          {/* <span className="font-medium">
                        {format(date, "MMM dd, yyyy")}
                    </span>
                    <span className="text-xs text-gray-500">
                        {format(date, "HH:mm:ss")}
                    </span> */}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "action",
  //   header: "Action",
  //   cell: ({ row }: any) => {
  //     const action = row.getValue("action") as string;
  //     return <ActionBadge action={action} />;
  //   },
  // },
  {
    accessorKey: "action",

    header: ({ table }: any) => {
      const action = table.options.meta?.action || "";

      const setAction = table.options.meta?.setAction;

      // Hardcoded actions for now
      const actions = [
        "signin",
        "signin_failed",
        "logout",
        "checkin",
        "checkout",
        "checkin_approval",
        "checkin_reject",
        "preschedule",
        "add_employee",
        "update_employee",
        "delete_employee",
        "update_profile",
        "employee_bulk_import",
        "failed_update_profile",
        "change_password",
        "change_password_failed",
        "checkin_approval_failed",
        "preschedule_failed",
        "checkout_failed",
      ];

      return (
        <div className="flex items-center gap-2">
          <span>Action</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 min-w-24 text-[10px]"
              >
                {action ? formatActionText(action) : "All actions"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52 bg-white border shadow-md">
              <DropdownMenuRadioGroup
                value={action || "all"}
                onValueChange={(value) => {
                  setAction(value === "all" ? "" : value);
                }}
              >
                <DropdownMenuRadioItem value="all" className="text-xs">
                  All actions
                </DropdownMenuRadioItem>

                {actions.map((action) => (
                  <DropdownMenuRadioItem
                    key={action}
                    value={action}
                    className="text-xs"
                  >
                    {formatActionText(action)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },

    cell: ({ row }: any) => {
      const action = row.getValue("action") as string;

      return <ActionBadge action={action} />;
    },
  },
  {
    id: "user",
    // accessorKey: "audit_record",
    header: "User",
    accessorFn: (row: AuditRecord) => {
      return row.audit_record?.updated_by?.name || "";
    },
    cell: ({ row }: any) => {
      const auditRecord = row.original.audit_record;

      const user = getAuditUserInfo(auditRecord);

      if (!user) {
        return <span className="text-gray-400">-</span>;
      }

      return (
        <div className="flex flex-col gap-1 min-w-55">
          <p className="font-medium text-sm text-gray-900">{user.name}</p>

          <p className="text-xs text-gray-500 break-all">{user.email}</p>

          {user.phone && (
            <p className="text-xs text-gray-400">+91 {user.phone}</p>
          )}
        </div>
      );
    },
  },
  {
    id: "message",
    // accessorKey: "audit_record",
    accessorFn: (row: AuditRecord) => {
      return row.audit_record?.message || "";
    },

    header: "Message",
    cell: ({ row }: any) => {
      const auditRecord = row.original.audit_record;

      return (
        <p className="text-sm text-gray-600 max-w-70 truncate">
          {auditRecord?.message || "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
    cell: ({ row }: any) => (
      <span className="font-mono text-sm text-gray-600">
        {row.getValue("ip_address")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      return (
        <div className="flex items-center justify-end gap-2">
          <AuditDetailsDialog audit={row.original} />
          {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(row.original.id);
                                }}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    const auditData = parseAuditRecord(
                                        row.original.audit_record
                                    );
                                    navigator.clipboard.writeText(
                                        JSON.stringify(auditData, null, 2)
                                    );
                                }}
                            >
                                Copy Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
        </div>
      );
    },
  },
];
