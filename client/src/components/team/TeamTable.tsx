// import { useMemo } from "react";
import { teamColumns } from "./table/column";
import { TeamDataTable } from "./table/data-table";
import type { Employee } from "@/lib/features/employee/employeeApi";
import type { Department } from "@/lib/features/visitor-check-in/visitorApi";
import { useMemo } from "react";
interface TeamTableProps {
  members: Employee[];
  departments: Department[];
  setPage: (p: number) => void;
  columnFilters: any[];
  setColumnFilters: (f: any) => void;
  totalPages: number;
  page: number;
  onPrevious: () => void;
  onNext: () => void;
  isFetching?: boolean;
  setEditMember: (employee: Employee | null) => void;
setEditOpen: (open: boolean) => void;
setSheetMode: (mode: "add" | "edit") => void;
//   setEditMember2: (employee: Employee | null) => void;
// setEditOpen2: (open: boolean) => void;
// setSheetMode2: (mode: "add" | "edit") => void;
}

export default function TeamTable({
  members,
  departments,
   setEditMember,
    setEditOpen,
    setSheetMode,
  //  setEditMember2,
  //   setEditOpen2,
  //   setSheetMode2,
  setPage, columnFilters, setColumnFilters,
  totalPages, page, onPrevious, onNext, isFetching,
}: TeamTableProps) {
  const meta = useMemo(() => ({
    departments,
     setEditMember,
    setEditOpen,
    setSheetMode,
    // setEditMember2,
    // setEditOpen2,
    // setSheetMode2
  }), [departments, setEditMember,
    setEditOpen,setSheetMode,
    // setEditMember2,
    // setEditOpen2,
    // setSheetMode2
  ])
 
  return (
    <section className="mt-6 px-4 lg:px-10">
      <div className="border rounded-lg">
        <TeamDataTable
          columns={teamColumns}
          data={members}
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
      </div>
    </section>
  );
}