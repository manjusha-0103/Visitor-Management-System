import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface Props {
  columns: ColumnDef<any>[];
  data: any[];
  setPage: (p: number) => void;
  columnFilters: any[];
  setColumnFilters: (f: any) => void;
  totalPages?: number;
  page?: number;
  onPrevious: () => void;
  onNext: () => void;
  isFetching?: boolean;
  meta?: Record<string, any>;
  // Which column key drives the status filter (differs per tab)
  statusFilterKey?: string;
  statusOptions?: { label: string; value: string }[];
  searchPlaceholder?: string;
  // Past tab also needs a type filter
  typeFilterKey?: string;
  typeOptions?: { label: string; value: string }[];
}

export function AppointmentDataTable({
  columns, data, setPage,
  columnFilters, setColumnFilters,
  totalPages = 1, page = 1,
  onPrevious, onNext, isFetching = false, meta,
  statusFilterKey = "is_approve",
  statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Pending",      value: "pending" },
    { label: "Approved",     value: "approved" },
    { label: "Checked out",  value: "checked_out" },
  ],
  searchPlaceholder = "Search visitor or host...",
  typeFilterKey,
  typeOptions,
}: Props) {
  const [search, setSearch] = useState("");

  // Status filter value
  const statusFilter = columnFilters.find((f) => f.id === statusFilterKey)?.value ?? "all";
  const setStatusFilter = (val: string) => {
    setColumnFilters((prev: any[]) => {
      const filtered = prev.filter((f) => f.id !== statusFilterKey);
      return val === "all" ? filtered : [...filtered, { id: statusFilterKey, value: val }];
    });
    setPage(1);
  };

  // Type filter (past tab)
  const typeFilter = columnFilters.find((f) => f.id === typeFilterKey)?.value ?? "all";
  const setTypeFilter = (val: string) => {
    setColumnFilters((prev: any[]) => {
      const filtered = prev.filter((f) => f.id !== typeFilterKey);
      return val === "all" ? filtered : [...filtered, { id: typeFilterKey, value: val }];
    });
    setPage(1);
  };

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter: search },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, value) => {
      const a = row.original;
      const q = value.toLowerCase();
      return (
        `${a.visitor_first_name} ${a.visitor_last_name}`.toLowerCase().includes(q) ||
        a.visitor_phone?.includes(q) ||
        `${a.employee_first_name} ${a.employee_last_name}`.toLowerCase().includes(q) ||
        a.company?.toLowerCase().includes(q) ||
        a.department?.toLowerCase().includes(q)
      );
    },
    meta: {
      ...meta,
      updatePage: (p: number) => setPage(p),
    },
  });

  const currentStatusLabel =
    statusOptions.find((o) => o.value === statusFilter)?.label ?? "All statuses";

  return (
    <div className="space-y-3 mt-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="pl-9 h-9 text-sm border border-input bg-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-2 text-sm">
              <SlidersHorizontal size={13} />
              {currentStatusLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 bg-white border shadow-md">
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              {statusOptions.map((o) => (
                <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type filter (past tab only) */}
        {typeFilterKey && typeOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 text-sm">
                {typeOptions.find((o) => o.value === typeFilter)?.label ?? "All types"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-white border shadow-md">
              <DropdownMenuRadioGroup value={typeFilter} onValueChange={setTypeFilter}>
                {typeOptions.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={o.value} className="text-xs">
                    {o.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ── Table ── */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="font-bold">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-maroon border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading appointments...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10 text-gray-400">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold text-black">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={onPrevious}
              disabled={page <= 1 || isFetching}
              className="bg-maroon text-xs hover:bg-maroon-dark cursor-pointer disabled:bg-gray-200 disabled:text-black"
            >
              Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={page >= totalPages || isFetching}
              className="bg-maroon text-xs hover:bg-maroon-dark cursor-pointer disabled:bg-gray-200 disabled:text-black"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}