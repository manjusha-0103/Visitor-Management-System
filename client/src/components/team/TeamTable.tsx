import { useMemo } from "react";
import { teamColumns } from "./table/column";
import { TeamDataTable } from "./table/data-table";
import type { TeamMember } from "./dummy-team";

interface TeamTableProps {
  members: TeamMember[];
  setEditMember: (m: TeamMember | null) => void;
  setEditOpen: (open: boolean) => void;
  setViewMember: (m: TeamMember | null) => void;
  setViewOpen: (open: boolean) => void;
  onDelete: (id: string) => void;
  setPage: (p: number) => void;
  columnFilters: any[];
  setColumnFilters: (f: any) => void;
  totalPages: number;
  page: number;
  onPrevious: () => void;
  onNext: () => void;
  isFetching?: boolean;
}

export default function TeamTable({
  members,
  setEditMember, setEditOpen,
  setViewMember, setViewOpen,
  onDelete,
  setPage, columnFilters, setColumnFilters,
  totalPages, page, onPrevious, onNext, isFetching,
}: TeamTableProps) {
  const meta = useMemo(
    () => ({ setEditMember, setEditOpen, setViewMember, setViewOpen, onDelete }),
    [setEditMember, setEditOpen, setViewMember, setViewOpen, onDelete]
  );

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