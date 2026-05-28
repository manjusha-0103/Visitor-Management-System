import React, { useEffect, useState } from "react";
import type {
    UseFormRegister,
    Control,
    UseFormSetValue,
    UseFormWatch,
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

import {
    CustomInputField,
    FormLabel,
    // SelectField,
} from "../form/FormFields";
import { visitorSchema } from "@/schema/visitorSchema";
import { useSearchEmployeesQuery, type SearchEmployee } from "@/lib/features/employee/employeeApi";
import EmployeeSearchSelect from "../EmployeeSearchSelect";
import OTPVerification from "../OTPVerification";

type AppointmentFormValues = z.infer<
    typeof visitorSchema
>;

// type Department = {
//     id: string | number;
//     name: string;
// };

// type Employee = {
//     id: string | number;
//     first_name: string;
//     last_name: string;
//     position?: string;
//     email?: string;
// };

// type Option = {
//     label: string;
//     value: string;
// };

type CheckInFormProps = {
    control: Control<AppointmentFormValues>;

    register: UseFormRegister<AppointmentFormValues>;

    setValue: UseFormSetValue<AppointmentFormValues>;

    selectedEmployee: SearchEmployee | null;

    setSelectedEmployee: React.Dispatch<
        React.SetStateAction<SearchEmployee | null>
    >;

    hasLaptop: boolean;
    hasVehicle: boolean;

    showScheduleFields?: boolean;

    date?: Date;

    setDate?: React.Dispatch<
        React.SetStateAction<Date | undefined>
    >;

    time?: string;

    setTime?: React.Dispatch<
        React.SetStateAction<string>
    >;

    errorMsg?: string | null;

    showVisitorEmailVerification?: boolean;

    visitorOtpSent?: boolean;

    visitorEmailVerified?: boolean;

    handleSendVisitorOtp?: () => void;

    sendVisitorOtpLoading?: boolean;

    visitorOtp?: string[];

    setVisitorOtp?: React.Dispatch<
        React.SetStateAction<string[]>
    >;

    verifyVisitorOtpLoading?: boolean;

    visitorResendLoading?: boolean;

    visitorResendTimer?: number;

    handleVerifyVisitorOtp?: () => void;

    handleResendVisitorOtp?: () => void;
    watch?: UseFormWatch<AppointmentFormValues>;
};

export default function CheckInForm({
    control,
    register,
    hasLaptop,
    hasVehicle,
    setValue,
    showScheduleFields = false,
    selectedEmployee,
    setSelectedEmployee,
    date,
    setDate,
    time,
    setTime,
    errorMsg,
    showVisitorEmailVerification,
    visitorOtpSent,
    visitorEmailVerified,
    handleSendVisitorOtp,
    sendVisitorOtpLoading,
    visitorOtp,
    setVisitorOtp,
    verifyVisitorOtpLoading,
    visitorResendLoading,
    visitorResendTimer,
    handleVerifyVisitorOtp,
    handleResendVisitorOtp,
    watch
}: CheckInFormProps) {

    const [employeeSearch, setEmployeeSearch] = useState("");


    const [debounced, setDebounced] = useState("");


    useEffect(() => {
        if (selectedEmployee) return;

        const timer = setTimeout(() => {
            setDebounced(employeeSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [employeeSearch, selectedEmployee]);


    const { data, isLoading: empSearchLoading } =
        useSearchEmployeesQuery(debounced, {
            skip: !debounced.trim(),
        });

    const employees = data?.data || [];
    return (
        <FieldGroup className="max-w-xl">
            <FieldSet>
                <FieldGroup className="gap-2">

                    {showScheduleFields && (
                        <div className=" border border-gray-200 p-4 rounded-xl">
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
                                            className="w-auto rounded-2xl p-0 bg-white shadow-xl border z-9999"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                disabled={(date) => {
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);

                                                    // 4 weeks from today
                                                    const maxDate = new Date(today);
                                                    maxDate.setDate(today.getDate() + 36);

                                                    return date < today || date > maxDate;
                                                }}
                                                captionLayout="dropdown"
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
                                        <SelectTrigger className="h-11 w-full mb-0 rounded-md border-gray-200 bg-white">

                                            <div className="flex items-center gap-2">

                                                <Clock3 className="h-4 w-4 text-[#8b1a30]" />

                                                <SelectValue placeholder="Select time" />

                                            </div>

                                        </SelectTrigger>

                                        <SelectContent className="max-h-72 z-9999">

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
                        </div>
                    )}

                    {/* Whom To Meet */}

                    <div className="border border-gray-200 p-4 rounded-xl">
                        <h3 className="font-semibold text-sm mb-1">
                            Whom To Meet
                        </h3>

                        <EmployeeSearchSelect<AppointmentFormValues>
                            employees={employees}
                            isLoading={empSearchLoading}
                            setValue={setValue}
                            employeeSearch={employeeSearch}
                            setEmployeeSearch={setEmployeeSearch}
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            debounced={debounced}
                            setDebounced={setDebounced}
                            errorMsg={errorMsg}
                        />

                        {/* <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-2">

                            <div className="space-y-3 ">

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
                                    <div className="rounded-md border border-[#8b1a30]/10 bg-white/80 p-3 sm:p-4 backdrop-blur">

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
                                    <div className="rounded-md border border-[#8b1a30]/10 bg-white/80 p-3 sm:p-4">

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
                        </div> */}

                    </div>



                      {/* Purpose of Visit */}
                    {
                        !showScheduleFields && (
                             <div className="border border-gray-200 p-4 rounded-xl">
                        <h3 className="font-semibold text-sm mb-1">
                            Purpose of visit
                        </h3>

                            <CustomInputField<AppointmentFormValues>
                                name="purpose"
                                label=""
                                placeholder="Meeting with local clients"
                                control={control}
                            />

                        </div>
                        )
                    }


                    <div className="border border-gray-200 p-4 rounded-xl">
                        <h3 className="font-semibold text-sm mb-1">
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


                          {
    !showScheduleFields &&
    showVisitorEmailVerification && (
        <div className="mt-3">
            {
                !visitorEmailVerified ? (
                    <Button
                        type="button"
                        onClick={handleSendVisitorOtp}
                        disabled={
                            !watch("email") ||
                            sendVisitorOtpLoading
                        }
                        className="bg-maroon hover:bg-maroon-dark"
                    >
                        {
                            sendVisitorOtpLoading
                                ? "Sending OTP..."
                                : visitorOtpSent
                                    ? "Resend OTP"
                                    : "Verify Email"
                        }
                    </Button>
                ) : (
                    <div className="text-sm font-medium text-green-600">
                        Email verified successfully
                    </div>
                )
            }
        </div>
    )
}

{
    !showScheduleFields &&
    visitorOtpSent &&
    !visitorEmailVerified && (
        <div className="rounded-2xl border bg-white p-5 space-y-5 mt-2 max-w-xl">

            <div>
                <h3 className="font-semibold text-lg">
                    Verify Email OTP
                </h3>

                <p className="text-sm text-muted-foreground">
                    Enter the OTP sent to visitor email
                </p>
            </div>

            <OTPVerification
                otp={visitorOtp}
                setOtp={setVisitorOtp}
                verifyOtpLoading={verifyVisitorOtpLoading}
                resendLoading={visitorResendLoading}
                resendTimer={visitorResendTimer}
                handleVerifyOtp={handleVerifyVisitorOtp}
                handleResendOtp={handleResendVisitorOtp}
            />

        </div>
    )
}
                        </div>

                    </div>

                    <div className="border border-gray-200 p-4 rounded-xl">
                        <h3 className="font-semibold text-sm my-1">
                            Company Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                            <CustomInputField<AppointmentFormValues>
                                name="company"
                                label="Company Name"
                                placeholder="Infosys"
                                control={control}
                                required={true}
                            />

                            <CustomInputField<AppointmentFormValues>
                                name="position"
                                label="Position"
                                placeholder="Software Engineer"
                                control={control}
                                required={false}
                            />
                        </div>
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