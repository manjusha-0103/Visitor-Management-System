import { useState, useEffect, useMemo } from "react";
import AdminSubHeader from "@/components/AdminSubHeader";
import TeamTable from "./TeamTable";
import { useGetAllEmployeesQuery, type Employee } from "@/lib/features/employee/employeeApi";
import { useGetDepartmentsQuery } from "@/lib/features/visitor-check-in/visitorApi";
import TeamFilters from "./TeamFilter";
import EmployeeForm from "./EmployeeForm";
import {type Department} from "@/lib/features/visitor-check-in/visitorApi"
import DepartmentForm from "./DepartmentForm";

type ColumnFilter = {
    id: string;
    value: string;
};
const LIMIT = 10;

export default function ManageTeam() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [employeeSheetOpen, setEmployeeSheetOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");

    const [departmentSheetOpen, setDepartmentSheetOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [sheetMode2, setSheetMode2] = useState<"add" | "edit">("add");

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
    const handleAddDepartment = () => {
        setSheetMode2("add");
        setSelectedDepartment(null);
        setDepartmentSheetOpen(true);
    };

    return (
        <section className="mb-10">
            <AdminSubHeader
                showBack={true}
                to="/admin"
                heading="Manage Team"
                subh="View all employees — their department, position, and last active"
            />

            <TeamFilters
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
                onCreate={handleAddEmployee}
                onAddDept={handleAddDepartment}
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
                // setEditMember2={setSelectedDepartment}
                // setEditOpen2={setDepartmentSheetOpen}
                // setSheetMode2={setSheetMode2}
            />


            <EmployeeForm
                open={employeeSheetOpen}
                onClose={setEmployeeSheetOpen}
                employee={selectedEmployee}
                departments={departments || []}
                mode={sheetMode}
            />
            <DepartmentForm
                open={departmentSheetOpen}
                onClose={setDepartmentSheetOpen}
                employee={selectedDepartment}
                departments={departments || []}
                mode={sheetMode2}
            />
        </section>
    );
}