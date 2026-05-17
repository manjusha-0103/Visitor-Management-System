import { useMemo } from "react";
import { userColumns } from "./table/column";
import { UsersDataTable } from "./table/data-table";
import type { User } from "./table/column";

interface UsersTableProps {
  users: User[];
  columnFilters: any[];
  setColumnFilters: (f: any) => void;
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFetching?: boolean;
  setEditMember: (employee: User | null) => void;
  setEditOpen: (open: boolean) => void;
  setSheetMode: (mode: "edit") => void;
  // setSheetMode: (mode: "add" | "edit") => void;
}

export default function UsersTable({
  users,
  columnFilters,
  setColumnFilters,
  totalPages,
  page,
  setPage,
  onPrevious,
  onNext,
  isFetching,
  setEditMember,
    setEditOpen,
    setSheetMode,
}: UsersTableProps) {
  const meta = useMemo(
    () => ({
      setEditMember,
    setEditOpen,
    setSheetMode,
    }),
    [setEditMember,
    setEditOpen,
    setSheetMode]
  );

  return (
    <section className="mt-6 px-4 lg:px-10">
      <UsersDataTable
        columns={userColumns}
        data={users}
        meta={meta}
        setPage={setPage}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        totalPages={totalPages}
        page={page}
        onPrevious={onPrevious}
        onNext={onNext}
        isFetching={isFetching}
      />
    </section>
  );
}
