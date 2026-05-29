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
import { Button } from "@/components/ui/button";

interface AuditDataTableProps {
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
}

export function AuditDataTable({
  columns, data, setPage,
  columnFilters, setColumnFilters,
  totalPages = 1, page = 1,
  onPrevious, onNext,
  isFetching = false, meta,
}: AuditDataTableProps) {
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: false,       // client-side for dummy; flip to true with API
    meta: {
      ...meta,
      updatePage: (p: number) => setPage(p),
    },
  });

  return (
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
              <TableCell colSpan={columns.length} className="text-center py-8 text-gray-400">
                Loading audit logs...
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
              <TableCell colSpan={columns.length} className="text-center py-8 text-gray-400">
                No audit logs found
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
  );
}