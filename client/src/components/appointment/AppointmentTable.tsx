import { useEffect, useMemo, useState } from "react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { AppointmentDataTable } from "./table/data-table";
import { pastColumns, preScheduleColumns, walkInColumns } from "./table/column";
import AppointmentFilters from "./AppointmentFilters";
import { useGetAppointmentsQuery } from "@/lib/features/appointment/appointmentApi";
import type { AppointmentRow } from "@/types";
import AppointmentDetailSheet from "./AppointmentDetailSheet";

type AppointmentType = "walkin" | "prescheduled" | "past";

interface Props {
  type: AppointmentType;
}

export default function AppointmentTable({ type }: Props) {
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openDetailSheet, setOpenDetailSheet] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppointmentRow | null>(null)

  // ─────────────────────────────────────
  // Debounce Search
  // ─────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ─────────────────────────────────────
  // Extract Filters
  // ─────────────────────────────────────

  const filters = useMemo(() => {
    const getFilterValue = (id: string) =>
      columnFilters.find((f) => f.id === id)?.value;

    return {
      is_approve:
        type === "past"
          ? getFilterValue("is_approve")
          : undefined,

      is_preschedule:
        type === "past"
          ? getFilterValue("is_preschedule")
          : undefined,

      date:
        type === "past"
          ? getFilterValue("date")
          : undefined,
    };
  }, [columnFilters, type]);

  // ─────────────────────────────────────
  // Query
  // ─────────────────────────────────────

  const { data, isLoading, isFetching } = useGetAppointmentsQuery({
    type, page, limit: 10,
    search: debouncedSearch,
    is_approve: filters.is_approve as
      | boolean
      | undefined,
    is_preschedule: filters.is_preschedule as
      | boolean
      | undefined,
    date: selectedDate || undefined
  });

  const appointments = useMemo(() => data?.data || [], [data])
  const totalPages = useMemo(() => data?.pagination?.totalPages || 1, [data])
  const currentPage = useMemo(() => data?.pagination?.page || 1, [data])

  // ─────────────────────────────────────
  // Clear Search
  // ─────────────────────────────────────

  const handleClear = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedDate("");
    setPage(1);
  };

  // ─────────────────────────────────────
  // Columns
  // ─────────────────────────────────────

  const columns = {
    walkin: walkInColumns,
    prescheduled: preScheduleColumns,
    past: pastColumns,
  }[type];

  const handlePrevious = () => setPage(prev => Math.max(prev - 1, 1))
  const handleNext = () => setPage(prev => prev < totalPages ? prev + 1 : prev)


  const meta = useMemo(() => ({
        setSelectedApp,
        setOpenDetailSheet
    }), [setSelectedApp,setOpenDetailSheet])

  return (
    <>

      <AppointmentDetailSheet
        appointment={selectedApp}
        open={openDetailSheet}
        onClose={setOpenDetailSheet}
      />

      <AppointmentFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleClear={handleClear}
      />

      <AppointmentDataTable
        data={appointments}
        columns={columns}
        page={currentPage}
        meta={meta}
        setPage={setPage}
        totalPages={totalPages}
        isFetching={isFetching || isLoading}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
}