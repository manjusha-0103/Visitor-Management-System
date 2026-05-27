import { useEffect, useState } from "react";

import {
    type UseFormSetValue,
    type FieldValues,
    type Path,
    type PathValue,
} from "react-hook-form";

import { type SearchEmployee } from "@/lib/features/employee/employeeApi";

type Props<T extends FieldValues> = {
    employees: SearchEmployee[];
    isLoading?: boolean;

    setValue: UseFormSetValue<T>;

    employeeSearch: string;

    setEmployeeSearch: React.Dispatch<
        React.SetStateAction<string>
    >;

    selectedEmployee: SearchEmployee | null;

    setSelectedEmployee: React.Dispatch<
        React.SetStateAction<SearchEmployee | null>
    >;

    debounced?: string;

    setDebounced: React.Dispatch<
        React.SetStateAction<string>
    >;

    placeholder?: string;

    errorMsg?: string | null;
};

export default function EmployeeSearchSelect<
    T extends FieldValues
>({
    employees,
    isLoading,
    setValue,

    employeeSearch,
    setEmployeeSearch,

    selectedEmployee,
    setSelectedEmployee,

    debounced,
    setDebounced,

    placeholder = "Search employee by name, email or phone",
    errorMsg = null
}: Props<T>) {
    const [showDropdown, setShowDropdown] =
        useState(false);

    useEffect(() => {
        const handleClickOutside = () => {
            setShowDropdown(false);
        };

        window.addEventListener(
            "click",
            handleClickOutside
        );

        return () => {
            window.removeEventListener(
                "click",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div
            className="relative space-y-4"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative">
                <input
                    type="text"
                    value={employeeSearch}
                    onChange={(e) => {
                        setEmployeeSearch(e.target.value);

                        setSelectedEmployee(null);

                        setShowDropdown(true);
                    }}
                    placeholder={placeholder}
                    className={`
                        h-10 w-full rounded-lg border border-gray-200
                        bg-white px-4 text-sm outline-none
                        transition-all
                        ${errorMsg ? "border-red-500" : "border-[#e8e8f0]"}
                        
                        focus:ring-4 focus:ring-[#8b1a30]/10
                    `}
                />


                {errorMsg && (
              <p className=" text-red-500 text-xs ml-1 mt-0.5">
                {errorMsg}
              </p>
            )}
            </div>

            {showDropdown && (
                <div
                    className="
                        max-h-56 overflow-y-auto
                        rounded-xl border border-gray-200 bg-white
                    "
                >
                    {isLoading && (
                        <div className="p-4 text-sm text-gray-500">
                            Searching employees...
                        </div>
                    )}

                    {!isLoading &&
                        employees.length === 0 &&
                        debounced && (
                            <div className="p-4 text-sm text-gray-500">
                                No employee found
                            </div>
                        )}

                    {!isLoading &&
                        employees.map((employee) => (
                            <button
                                key={employee.employee_id}
                                type="button"
                                onClick={() => {
                                    setSelectedEmployee(
                                        employee
                                    );

                                    setValue(
                                        "employee_id" as Path<T>,
                                        String(employee.employee_id) as PathValue<
                                            T,
                                            Path<T>
                                        >,
                                        {
                                            shouldValidate: true,
                                        }
                                    );

                                    setValue(
                                        "department_id" as Path<T>,
                                        String(employee.department_id) as PathValue<
                                            T,
                                            Path<T>
                                        >,
                                        {
                                            shouldValidate: true,
                                        }
                                    );

                                    setDebounced("");
                                    setEmployeeSearch(
                                        `${employee.first_name} ${employee.last_name}`
                                    );


                                    setShowDropdown(false);
                                }}
                                className="
                                    flex w-full flex-col items-start
                                    border-b border-gray-100
                                    p-3 text-left transition-all
                                    hover:bg-gray-50
                                "
                            >
                                <div className="flex w-full items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {employee.first_name}{" "}
                                            {employee.last_name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {employee.position}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {employee.email}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {employee.phone}
                                        </p>
                                    </div>

                                    {employee.department_name && (
                                        <span
                                            className="
                                                rounded-full
                                                bg-[#8b1a30]/10
                                                px-2 py-1
                                                text-[10px]
                                                font-medium
                                                text-[#8b1a30]
                                            "
                                        >
                                            {
                                                employee.department_name
                                            }
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                </div>
            )}

            {selectedEmployee && (
                <div
                    className="
                        rounded-xl border border-[#8b1a30]/10
                        bg-amber-50 p-4
                    "
                >
                    <p className="text-xs text-gray-500">
                        Selected Employee
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedEmployee.first_name}{" "}
                        {selectedEmployee.last_name}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                        {selectedEmployee.position}
                    </p>

                    <p className="text-xs text-gray-500">
                        {selectedEmployee.email}
                    </p>

                    <p className="text-xs text-gray-500">
                        Department:{" "}
                        {
                            selectedEmployee.department_name
                        }
                    </p>
                </div>
            )}
        </div>
    );
}