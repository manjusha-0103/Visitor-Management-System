import AdminSubHeader from "@/components/AdminSubHeader";
import AuditFilters from "@/components/audit/AuditFilters";
import AuditTable from "@/components/audit/AuditTable";
import { useGetAllAuditsQuery } from "@/lib/features/audit/auditApi";
// import { CircleX, Lock } from "lucide-react";
import { useMemo, useState } from "react";

type ColumnFilter = {
  id: string;
  value: string;
};

const LIMIT = 10;

export default function Audit() {
  const [page, setPage] = useState(1);
//   const [searchInput, setSearchInput] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");

  const { data, isLoading, isFetching } = useGetAllAuditsQuery({
    page,
    limit: LIMIT,
    action,
    date,
  });

  const audits = useMemo(() => data?.data?.data || [], [data]);
  const totalPages = useMemo(
    () => data?.data?.pagination?.total_pages || 1,
    [data],
  );
  const currentPage = useMemo(() => data?.data?.pagination?.page || 1, [data]);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchInput);
//       setPage(1);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchInput]);

//   const handleClear = () => {
//     setSearchInput("");
//     setDebouncedSearch("");
//     setPage(1);
//   };

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <section className="mb-12">
      <AdminSubHeader
        showBack={true}
        to="/admin"
        heading="Audit Trail"
        subh="Immutable, append-only event log"
      />


      <AuditFilters
        // searchInput={searchInput}
        // setSearchInput={setSearchInput}
        // handleClear={handleClear}
        date={date}
        setDate={setDate}
      />

      <AuditTable
        data={audits}
        page={currentPage}
        setPage={setPage}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFetching={isFetching || isLoading}
        action={action}
        setAction={setAction}
      />
    </section>
  );
}
