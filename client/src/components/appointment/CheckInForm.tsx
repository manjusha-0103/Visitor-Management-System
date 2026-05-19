import React from "react";
import type {
    UseFormRegister,
    Control,
} from "react-hook-form";

import z from "zod";

import {
    FieldGroup,
    FieldSet,
} from "@/components/ui/field";

import {
    Laptop,
    Car,
    CalendarIcon,
    Clock3,
} from "lucide-react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { visitorSchema } from "@/schema";

import {
    CustomInputField,
    FormLabel,
    SelectField,
} from "../form/FormFields";

type AppointmentFormValues = z.infer<
    typeof visitorSchema
>;

type Department = {
    id: string | number;
    name: string;
};

type Employee = {
    id: string | number;
    first_name: string;
    last_name: string;
    position?: string;
    email?: string;
};

type Option = {
    label: string;
    value: string;
};

type CheckInFormProps = {
    control: Control<AppointmentFormValues>;

    register: UseFormRegister<AppointmentFormValues>;

    //   watch: UseFormWatch<AppointmentFormValues>;

    //   departments: Department[];

    //   employees: Employee[];

    deptLoading: boolean;

    empLoading: boolean;

    selectedDepartment?: string;

    hasLaptop: boolean;

    hasVehicle: boolean;

    departmentOptions: Option[];

    employeeOptions: Option[];

    selectedDepartmentData?: Department;

    selectedEmployeeData?: Employee;

    showScheduleFields?: boolean;

    date?: Date;

    setDate?: React.Dispatch<
        React.SetStateAction<Date | undefined>
    >;

    time?: string;

    setTime?: React.Dispatch<
        React.SetStateAction<string>
    >;
};

export default function CheckInForm({
    control,
    register,
    selectedDepartment,
    hasLaptop,
    hasVehicle,
    deptLoading,
    empLoading,

    departmentOptions,
    employeeOptions,

    selectedDepartmentData,
    selectedEmployeeData,

    showScheduleFields = false,

    date,
    setDate,

    time,
    setTime,
}: CheckInFormProps) {
    return (
        <FieldGroup>
            <FieldSet>
                <FieldGroup className="gap-0">

                    {showScheduleFields && (
                        <>
                            <h3 className="font-semibold text-sm mb-2">
                                Schedule Visit
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">

                                {/* Date */}

                                <div className="space-y-2">
                                    <FormLabel
                                        htmlFor="visit-date"
                                        label="Visit Date"
                                        required
                                    />

                                    <Popover>
                                        <PopoverTrigger asChild>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="
                          h-9 w-full justify-start rounded-md
                          border-gray-200 bg-white text-left font-normal
                        "
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-[#8b1a30]" />

                                                {date ? (
                                                    format(date, "PPP")
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Select visit date
                                                    </span>
                                                )}
                                            </Button>

                                        </PopoverTrigger>

                                        <PopoverContent
                                            side="bottom"
                                            align="start"
                                            className="w-auto rounded-2xl p-0 bg-white shadow-xl border z-50"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                disabled={(date) => {
                                                    const today = new Date();

                                                    today.setHours(0, 0, 0, 0);

                                                    return date < today;
                                                }}
                                            />
                                        </PopoverContent>

                                    </Popover>
                                </div>

                                {/* Time */}

                                <div className="space-y-2">

                                    <FormLabel
                                        htmlFor="visit-time"
                                        label="Visit Time"
                                        required
                                    />

                                    <Select
                                        value={time}
                                        onValueChange={setTime}
                                    >
                                        <SelectTrigger className="h-11 w-full rounded-md mb-0">

                                            <div className="flex items-center gap-2">

                                                <Clock3 className="h-4 w-4 text-[#8b1a30]" />

                                                <SelectValue placeholder="Select time" />

                                            </div>

                                        </SelectTrigger>

                                        <SelectContent className="max-h-72">

                                            {Array.from({ length: 48 }).map(
                                                (_, index) => {
                                                    const hour = Math.floor(
                                                        index / 2
                                                    );

                                                    const minute =
                                                        index % 2 === 0
                                                            ? "00"
                                                            : "30";

                                                    const time24 = `${String(
                                                        hour
                                                    ).padStart(2, "0")}:${minute}`;

                                                    const hour12 =
                                                        hour === 0
                                                            ? 12
                                                            : hour > 12
                                                                ? hour - 12
                                                                : hour;

                                                    const ampm =
                                                        hour >= 12
                                                            ? "PM"
                                                            : "AM";

                                                    return (
                                                        <SelectItem
                                                            key={time24}
                                                            value={time24}
                                                        >
                                                            {`${String(
                                                                hour12
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}:${minute} ${ampm}`}
                                                        </SelectItem>
                                                    );
                                                }
                                            )}

                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <span className="border-b border-gray-200 h-2 mb-2"></span>
                        </>
                    )}

                    {/* Whom To Meet */}

                    <h3 className="font-semibold text-sm mb-1">
                        Whom To Meet
                    </h3>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-2">

                        <div className="space-y-3">

                            <SelectField<AppointmentFormValues>
                                name="department_id"
                                label="Department"
                                placeholder={
                                    deptLoading
                                        ? "Loading departments..."
                                        : "Select Department"
                                }
                                control={control}
                                options={departmentOptions}
                            />

                            {selectedDepartmentData && (
                                <div className="rounded-md border border-[#8b1a30]/10 bg-white/80 p-4 backdrop-blur">

                                    <p className="text-xs text-gray-500">
                                        Selected Department
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {selectedDepartmentData.name}
                                    </p>

                                </div>
                            )}
                        </div>

                        <div className="space-y-3">

                            <SelectField<AppointmentFormValues>
                                name="employee_id"
                                label="Employee"
                                placeholder={
                                    !selectedDepartment
                                        ? "Select department first"
                                        : empLoading
                                            ? "Loading employees..."
                                            : "Select Employee"
                                }
                                control={control}
                                options={employeeOptions}
                                disabled={!selectedDepartment}
                            />

                            {selectedEmployeeData && (
                                <div className="rounded-md border border-[#8b1a30]/10 bg-white/80 p-4">

                                    <p className="text-xs text-gray-500">
                                        Selected Employee
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {selectedEmployeeData.first_name}{" "}
                                        {selectedEmployeeData.last_name}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-600">
                                        {selectedEmployeeData.position}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {selectedEmployeeData.email}
                                    </p>

                                </div>
                            )}
                        </div>
                    </div>

                    <span className="border-b border-gray-200 h-2"></span>

                    <h3 className="font-semibold text-sm mt-3 mb-1">
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                        <CustomInputField<AppointmentFormValues>
                            name="first_name"
                            label="First Name"
                            placeholder="Rahul"
                            control={control}
                        />

                        <CustomInputField<AppointmentFormValues>
                            name="last_name"
                            label="Last Name"
                            placeholder="Sharma"
                            control={control}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-2">

                        <CustomInputField<AppointmentFormValues>
                            name="phone"
                            label="Phone Number"
                            placeholder="+91 9876543210"
                            control={control}
                        />

                        <CustomInputField<AppointmentFormValues>
                            name="email"
                            type="email"
                            label="Email Address"
                            placeholder="rahul@gmail.com"
                            control={control}
                        />
                    </div>

                    <span className="border-b border-gray-200 h-2 mb-2"></span>

                    <h3 className="font-semibold text-sm my-1">
                        Company Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                        <CustomInputField<AppointmentFormValues>
                            name="company"
                            label="Company Name"
                            placeholder="Infosys"
                            control={control}
                            required={false}
                        />

                        <CustomInputField<AppointmentFormValues>
                            name="position"
                            label="Position"
                            placeholder="Software Engineer"
                            control={control}
                            required={false}
                        />
                    </div>

                    {/* Laptop */}
                    {
                        !showScheduleFields && (
                            <div className="my-2 rounded-md border border-gray-200 overflow-hidden">

                                <label className="flex items-center gap-3 p-3 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        {...register("is_laptop")}
                                    />

                                    <div className="flex items-center gap-2">

                                        <Laptop className="text-purple-700" />

                                        <div>
                                            <p className="font-medium text-sm">
                                                Carrying a laptop?
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Add laptop details
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                {hasLaptop && (
                                    <div className="border-t bg-purple-50 p-4 space-y-3">

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                            <CustomInputField<AppointmentFormValues>
                                                name="make"
                                                label="Laptop Make"
                                                placeholder="Dell"
                                                control={control}
                                                required={false}
                                            />

                                            <CustomInputField<AppointmentFormValues>
                                                name="model"
                                                label="Laptop Model"
                                                placeholder="Inspiron 15"
                                                control={control}
                                                required={false}
                                            />
                                        </div>

                                        <CustomInputField<AppointmentFormValues>
                                            name="serial_no"
                                            label="Serial Number"
                                            placeholder="SN123456789"
                                            control={control}
                                            required={false}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    }


                    {/* Vehicle */}
                    {
                        !showScheduleFields && (
                            <div className="rounded-md border border-gray-200 overflow-hidden">

                                <label className="flex items-center gap-3 p-3 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        {...register("is_vehicle")}
                                    />

                                    <div className="flex items-center gap-2">

                                        <Car className="text-blue-700" />

                                        <div>
                                            <p className="font-medium text-sm">
                                                Bringing a vehicle?
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Add vehicle number
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                {hasVehicle && (
                                    <div className="border-t bg-blue-50 p-4">

                                        <CustomInputField<AppointmentFormValues>
                                            name="vehicle_no"
                                            label="Vehicle Registration Number"
                                            placeholder="MH12AB1234"
                                            control={control}
                                            required={false}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    }



                </FieldGroup>
            </FieldSet>
        </FieldGroup>
    );
}