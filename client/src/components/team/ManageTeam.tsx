import { useState, useEffect, useMemo } from "react";
// import { useSelector } from "react-redux";
import AdminSubHeader from "@/components/AdminSubHeader";
// import CommonFilter from "@/components/CommonFilter";
import TeamTable from "./TeamTable";
// import { DUMMY_TEAM } from "@/components/team/dummy-team";
// import type { TeamMember } from "@/components/team/dummy-team";
import { useGetAllEmployeesQuery, type Employee } from "@/lib/features/employee/employeeApi";
import { useGetDepartmentsQuery } from "@/lib/features/visitor-check-in/visitorApi";
import TeamFilters from "./TeamFilter";
import EmployeeForm from "./EmployeeForm";
// import { selectUser } from "@/lib/features/auth/authSlice";

type ColumnFilter = {
    id: string;
    value: string;
};
const LIMIT = 10;

export default function ManageTeam() {
    // const user = useSelector(selectUser);
    //   const [allMembers, setAllMembers] = useState<TeamMember[]>(DUMMY_TEAM);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [employeeSheetOpen, setEmployeeSheetOpen] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
    const [
        columnFilters,
        setColumnFilters,
    ] = useState<ColumnFilter[]>([]);

    // ── Department Filter ─────────────────────
    const departmentFilter = useMemo(() => {
        const filter = columnFilters.find(
            (f) => f.id === "department_name"
        );

        return filter?.value || "";
    }, [columnFilters]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetAllEmployeesQuery({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        department: departmentFilter,
    });

    const { data: departments } = useGetDepartmentsQuery();



    const employees = useMemo(() => data?.data?.data || [], [data])
    const totalPages = useMemo(() => data?.data?.pagination?.totalPages || 1, [data])
    const currentPage = useMemo(() => data?.data?.pagination?.page || 1, [data])
    // const brands = useMemo(() => departmentData?.data || [], [departmentData])

    // const employees = data?.data || [];
    // const totalPages =
    //   data?.pagination?.totalPages || 1;


    const handleClear = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
    };

    const handlePrevious = () => setPage(prev => Math.max(prev - 1, 1))
    const handleNext = () => setPage(prev => prev < totalPages ? prev + 1 : prev)

    const handleAddEmployee = () => {
        setSheetMode("add");
        setSelectedEmployee(null);
        setEmployeeSheetOpen(true);
    };

    return (
        <section className="mb-10">
            <AdminSubHeader
                showBack={true}
                to="/admin"
                heading="Manage Team"
                subh="View all employees — their department, position, and visitor activity"
            />

            <TeamFilters
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
                onCreate={handleAddEmployee}
            />

            {/* Table */}
            <TeamTable
                members={employees}
                departments={departments || []}
                setPage={setPage}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                totalPages={totalPages}
                page={currentPage}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isFetching={isFetching || isLoading}
                setEditMember={setSelectedEmployee}
                setEditOpen={setEmployeeSheetOpen}
                setSheetMode={setSheetMode}
            />


            <EmployeeForm
  open={employeeSheetOpen}
  onClose={setEmployeeSheetOpen}
  employee={selectedEmployee}
  departments={departments || []}
  mode={sheetMode}
/>
        </section>
    );
}