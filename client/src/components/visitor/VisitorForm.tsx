import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    User,
    Laptop,
    Car,
    ArrowRight,
    ArrowLeft,
    Check,
    // CalendarCheck,
    // Clock,
    // MapPin,
    // Clock3,
    // CalendarIcon,
    QrCode,
    Loader2,
} from "lucide-react";
// import { format } from "date-fns"
import { Button } from "../ui/button";
import { CustomInputField } from "../form/FormFields";
// import { Calendar } from "@/components/ui/calendar"
import {
    // useGetDepartmentsQuery,
    // useGetEmployeesQuery,
    useVisitorCheckInMutation,
} from "@/lib/features/visitor-check-in/visitorApi";
import type { LucideIcon } from "lucide-react";
// import { useLocation } from "react-router-dom";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
import { visitorSchema } from "@/schema/visitorSchema";
import { useSearchEmployeesQuery } from "@/lib/features/employee/employeeApi";
import EmployeeSearchSelect from "../EmployeeSearchSelect";

type VisitorFormValues = z.infer<typeof visitorSchema>;

interface SectionHeaderItem {
    icon: LucideIcon;
    heading: string;
    color: string;
    description?: string;
}

interface VisitorFormProps {
    setPhase: React.Dispatch<React.SetStateAction<"qr" | "camera" | "form" | "done">>;
    capturedImage: string | null;
    capturedFile: File | null;
}

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, heading, description }: SectionHeaderItem) {
    const Icon = icon;
    return (
        <div className="mb-6 flex items-start gap-3">
            <div className={`flex h-10 w-10 md:w-10 items-center justify-center rounded-full bg-maroon shadow-lg`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
                <h3 className="text-md md:text-lg font-semibold text-gray-900">{heading}</h3>
                {description && <p className="text-xs md:text-sm text-gray-500">{description}</p>}
            </div>
        </div>
    );
}

const steps = [
    { title: "Whom to Meet", subtitle: "Choose department & employee" },
    { title: "Personal", subtitle: "Your contact information" },
    { title: "Company", subtitle: "Organization details" },
    { title: "Additional", subtitle: "Laptop & vehicle info" },
];

// ─── Main form ─────────────────────────────────────────────────────────────────
export default function VisitorForm({ setPhase,
    capturedImage,
    capturedFile }: VisitorFormProps) {
    const [step, setStep] = useState(0);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    // const [showDropdown, setShowDropdown] = useState(false);
    const [debounced, setDebounced] = useState("");
    // const [date, setDate] = useState<Date>();
    // const [time, setTime] = useState("");
    // const location = useLocation();

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        trigger,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<VisitorFormValues>({
        resolver: zodResolver(visitorSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            position: "",
            company: "",
            purpose: "",
            is_laptop: false,
            make: "",
            model: "",
            serial_no: "",
            is_vehicle: false,
            vehicle_no: "",
            employee_id: "",
            // department_id: "",
        },
    });

    console.log(errors);
    

    const hasLaptop = watch("is_laptop");
    const hasVehicle = watch("is_vehicle");
    // const watchedDepartment = watch("department_id");


    const { data, isLoading } =
        useSearchEmployeesQuery(debounced, {
            skip: !debounced.trim()
        });

    //   console.log(data);

    const employees = data?.data || [];

    // const { data: departments = [], isLoading: deptLoading } = useGetDepartmentsQuery();
    // const { data: employees = [], isLoading: empLoading } = useGetEmployeesQuery(watchedDepartment, {
    //     skip: !watchedDepartment,
    // });
    const [checkInVisitor] = useVisitorCheckInMutation();

    // const selectedDepartmentData = departments.find((d) => String(d.id) === watchedDepartment);
    // const selectedEmployeeData = employees.find((e) => String(e.id) === watch("employee_id"));

    // const departmentOptions = departments.map((d) => ({ label: d.name, value: String(d.id) }));
    // const employeeOptions = employees.map((e) => ({
    //     label: `${e.first_name} ${e.last_name}`,
    //     value: String(e.id),
    // }));



    useEffect(() => {
        if (selectedEmployee) return;

        const timer = setTimeout(() => {
            setDebounced(employeeSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [employeeSearch, selectedEmployee]);
    // ── Navigation ────────────────────────────────────────────────────────────
    const nextStep = async () => {

        const fieldMap: Record<number, (keyof VisitorFormValues)[]> = {
            0: ["employee_id", "purpose"],
            1: ["first_name", "last_name", "phone", "email"],
            2: ["company"]
        };

        const fields = fieldMap[step];
        if (fields) {
            const valid = await trigger(fields);
            if (!valid) return;
        }

        setStep((p) => p + 1);
    };

    const prevStep = () => setStep((p) => Math.max(p - 1, 0));

    // ── Submit — invoked ONLY by the final button's onClick ───────────────────
    const onSubmit = async (data: VisitorFormValues) => {
        try {
            console.log(capturedImage, capturedFile);

            const formData = new FormData();

            // Basic details
            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("company", data.company || "");
            formData.append("position", data.position || "");
            formData.append("purpose", data.purpose || "");

            // Employee
            formData.append("employee_id", data.employee_id);

            // Photo file
            if (capturedFile) {
                formData.append("visitor_photo", capturedFile);
            }

            // ── Laptop Logic ─────────────────────────────
            const hasLaptopDetails =
                !!data.make?.trim() ||
                !!data.model?.trim() ||
                !!data.serial_no?.trim();

            formData.append("is_laptop", String(hasLaptopDetails));

            if (hasLaptopDetails) {
                formData.append("make", data.make?.trim() || "");
                formData.append("model", data.model?.trim() || "");
                formData.append("serial_no", data.serial_no?.trim() || "");
            } else {
                formData.append("make", "");
                formData.append("model", "");
                formData.append("serial_no", "");
            }

            // ── Vehicle Logic ────────────────────────────
            const hasVehicleDetails = !!data.vehicle_no?.trim();

            formData.append("is_vehicle", String(hasVehicleDetails));

            if (hasVehicleDetails) {
                formData.append("vehicle_no", (data.vehicle_no ?? "").trim());
            } else {
                formData.append("vehicle_no", "");
            }

            await checkInVisitor(formData).unwrap();

            reset();
            setStep(0);
            setPhase("done");

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
            <form
                className="flex min-h-full flex-col"
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                }}
            >
                <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait">

                        {/* STEP 0 — Whom to Meet */}
                        {step === 0 && (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.25 }}
                                className="
    w-full
    min-h-[250px]
    rounded-xl border border-[#8b1a30]/10
    bg-linear-to-br from-[#8b1a30]/5 to-[#6b1223]/5
    p-4 md:p-6
    shadow-sm
"
                            >
                                <SectionHeader
                                    icon={User}
                                    heading="Whom to Meet & Purpose"
                                    description="Select the person to meet and purpose of the meet"
                                    color="bg-gradient-to-br from-[#8b1a30] to-[#6b1223]"
                                />

                                <EmployeeSearchSelect<VisitorFormValues>
                                    employees={employees}
                                    isLoading={isLoading}
                                    setValue={setValue}
                                    employeeSearch={employeeSearch}
                                    setEmployeeSearch={setEmployeeSearch}
                                    selectedEmployee={selectedEmployee}
                                    setSelectedEmployee={setSelectedEmployee}
                                    debounced={debounced}
                                    setDebounced={setDebounced}
                                    errorMsg={errors?.employee_id?.message ?? null}
                                />

                            <div className="mt-4">
                                <CustomInputField<VisitorFormValues> name="purpose" label="Purpose of visit" placeholder="Meeting with local clients" control={control} />
</div>
                                {/* <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={employeeSearch}
                                            onChange={(e) => {
                                                setEmployeeSearch(e.target.value)
                                                setSelectedEmployee(null)
                                                setShowDropdown(true)
                                            }}
                                            placeholder="Search employee by name, email or phone"
                                            className="
                h-12 w-full rounded-xl border border-gray-200
                bg-white px-4 text-sm outline-none
                transition-all
                focus:border-[#8b1a30]
                focus:ring-4 focus:ring-[#8b1a30]/10
            "
                                        />
                                    </div>

                                    {showDropdown && (
                                        <div className="overflow-y-auto max-h-56 rounded-xl border border-gray-200 bg-white">

                                            {isLoading && (
                                                <div className="p-4 text-sm text-gray-500">
                                                    Searching employees...
                                                </div>
                                            )}

                                            {!isLoading && employees.length === 0 && debounced && (
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
                                                            setSelectedEmployee(employee);

                                                            setValue(
                                                                "employee_id",
                                                                String(employee.employee_id),
                                                                { shouldValidate: true }
                                                            );

                                                            setValue(
                                                                "department_id",
                                                                String(employee.department_id),
                                                                { shouldValidate: true }
                                                            );

                                                            setEmployeeSearch(
                                                                `${employee.first_name} ${employee.last_name}`
                                                            );

                                                            setDebounced("");
                                                            setShowDropdown(false);
                                                        }}
                                                        className="
                        flex w-full flex-col items-start
                        border-b border-gray-100
                        p-3 text-left
                        transition-all
                        hover:bg-gray-50
                    "
                                                    >
                                                        <div className="flex w-full items-start justify-between">
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {employee.first_name} {employee.last_name}
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

                                                            {
                                                                employee.department_name && (
                                                                    <span
                                                                        className="
                                rounded-full bg-[#8b1a30]/10
                                px-2 py-1 text-[10px] font-medium
                                text-[#8b1a30]"
                                                                    >
                                                                        {employee.department_name}
                                                                    </span>
                                                                )
                                                            }


                                                        </div>

                                                    </button>
                                                ))}
                                        </div>
                                    )}


                                    {selectedEmployee && (
                                        <div className="rounded-xl border border-[#8b1a30]/10 bg-amber-50 p-4">
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
                                                Department: {selectedEmployee.department_name}
                                            </p>
                                        </div>
                                    )}
                                </div> */}




                                {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <SelectField<VisitorFormValues>
                                            name="department_id"
                                            label="Department"
                                            placeholder={deptLoading ? "Loading departments..." : "Select Department"}
                                            control={control}
                                            options={departmentOptions}
                                        />
                                        {selectedDepartmentData && (
                                            <div className="rounded-md border border-[#8b1a30]/10 bg-amber-50 p-4 backdrop-blur">
                                                <p className="text-xs text-gray-500">Selected Department</p>
                                                <p className="mt-1 text-sm font-semibold text-gray-900">{selectedDepartmentData.name}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <SelectField<VisitorFormValues>
                                            name="employee_id"
                                            label="Employee"
                                            placeholder={!watchedDepartment ? "Select department first" : empLoading ? "Loading employees..." : "Select Employee"}
                                            control={control}
                                            options={employeeOptions}
                                            disabled={!watchedDepartment}
                                        />
                                        {selectedEmployeeData && (
                                            <div className="rounded-md border border-[#8b1a30]/10 bg-amber-50 p-4">
                                                <p className="text-xs text-gray-500">Selected Employee</p>
                                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                                    {selectedEmployeeData.first_name} {selectedEmployeeData.last_name}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-600">{selectedEmployeeData.position}</p>
                                                <p className="text-xs text-gray-500">{selectedEmployeeData.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div> */}
                                {/* {
                                    location.pathname === '/employee' && (
                                        <div className="mt-4 flex gap-2 items-center">
                                            <div className="space-y-2 basis-1/2">
                                                <FormLabel htmlFor="visit-date" label="Visit Date" required={true} />

                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="
                        h-10 w-full justify-start rounded-md
                        border-gray-200 bg-white text-left font-normal
                        hover:bg-gray-50
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
                                                        className="w-auto rounded-2xl border-gray-200 p-0"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={setDate}
                                                            // initialFocus
                                                            disabled={(date) => {
                                                                const today = new Date();
                                                                today.setHours(0, 0, 0, 0);

                                                                return date < today;
                                                            }}
                                                            captionLayout="dropdown"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>

                                            <div className="space-y-2 basis-1/2">
                                                <FormLabel htmlFor="visit-time" label="Visit Time" required={true} />

                                                <Select value={time} onValueChange={setTime}>
                                                    <SelectTrigger
                                                        className="
                    h-10 rounded-md border-gray-200 w-full
                    focus:ring-[#8b1a30] mb-0
                "
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Clock3 className="h-4 w-4 text-[#8b1a30]" />

                                                            <SelectValue placeholder="Select time" />
                                                        </div>
                                                    </SelectTrigger>

                                                    <SelectContent className="rounded-xl max-h-60">
                                                        {Array.from({ length: 48 }).map((_, index) => {
                                                            const hour = Math.floor(index / 2);
                                                            const minute = index % 2 === 0 ? "00" : "30";

                                                            const time24 = `${String(hour).padStart(2, "0")}:${minute}`;

                                                            const hour12 =
                                                                hour === 0
                                                                    ? 12
                                                                    : hour > 12
                                                                        ? hour - 12
                                                                        : hour;

                                                            const ampm = hour >= 12 ? "PM" : "AM";

                                                            return (
                                                                <SelectItem key={time24} value={time24}>
                                                                    {`${String(hour12).padStart(2, "0")}:${minute} ${ampm}`}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )
                                } */}

                            </motion.div>
                        )}

                        {/* STEP 1 — Personal */}
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.25 }}
                                className="
    w-full
    min-h-[250px]
    rounded-xl border border-[#8b1a30]/10
    bg-linear-to-br from-[#8b1a30]/5 to-[#6b1223]/5
    p-4 md:p-6
    shadow-sm
"
                            >
                                <SectionHeader
                                    icon={User}
                                    heading="Personal Information"
                                    description="Enter your personal contact details"
                                    color="bg-cyan-700"
                                />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInputField<VisitorFormValues> name="first_name" label="First Name" placeholder="Rahul" control={control} />
                                    <CustomInputField<VisitorFormValues> name="last_name" label="Last Name" placeholder="Sharma" control={control} />
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInputField<VisitorFormValues> name="phone" label="Phone Number" placeholder="+91 9876543210" control={control} />
                                    <CustomInputField<VisitorFormValues> name="email" type="email" label="Email Address" placeholder="rahul@gmail.com" control={control} />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2 — Company (optional) */}
                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.25 }}
                                className="
    w-full
    min-h-[250px]
    rounded-xl border border-[#8b1a30]/10
    bg-linear-to-br from-[#8b1a30]/5 to-[#6b1223]/5
    p-4 md:p-6
    shadow-sm
"
                            >
                                <SectionHeader
                                    icon={Building2}
                                    heading="Company Information"
                                    description="Tell us about your organization"
                                    color="bg-indigo-700"
                                />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInputField<VisitorFormValues> name="company" label="Company Name" placeholder="Infosys" control={control} required={true} />
                                    <CustomInputField<VisitorFormValues> name="position" label="Position" placeholder="Software Engineer" control={control} required={false} />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3 — Additional */}
                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.25 }}
                                className="
    w-full
"
                            >
                                <div className="
    w-full
    min-h-[250px]
    rounded-xl border border-[#8b1a30]/10
    bg-linear-to-br from-[#8b1a30]/5 to-[#6b1223]/5
    p-4 md:p-6
    shadow-sm
">
                                    <SectionHeader
                                        icon={Laptop}
                                        heading="Additional Details"
                                        description="Optional security & parking information"
                                        color="bg-purple-700"
                                    />

                                    {/* Laptop toggle */}
                                    <div className="overflow-hidden rounded-md border-2 border-gray-200 transition-all hover:border-purple-300">
                                        <label className="group flex cursor-pointer items-center gap-4 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                {...register("is_laptop")}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setValue("is_laptop", checked);
                                                    if (!checked) { setValue("make", ""); setValue("model", ""); setValue("serial_no", ""); }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-[#8b1a30]"
                                            />
                                            <div className="flex flex-1 items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-200">
                                                    <Laptop className="h-4 w-4 text-purple-700" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Carrying a Laptop?</p>
                                                    <p className="text-xs text-gray-500">Security will register your device</p>
                                                </div>
                                            </div>
                                        </label>
                                        <AnimatePresence>
                                            {hasLaptop && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="border-t border-purple-100 bg-purple-50/60"
                                                >
                                                    <div className="space-y-4 p-5">
                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                            <CustomInputField<VisitorFormValues> name="make" label="Laptop Make" placeholder="Dell" control={control} required={false} />
                                                            <CustomInputField<VisitorFormValues> name="model" label="Laptop Model" placeholder="Inspiron 15" control={control} required={false} />
                                                        </div>
                                                        <CustomInputField<VisitorFormValues> name="serial_no" label="Serial Number" placeholder="SN123456789" control={control} required={false} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Vehicle toggle */}
                                    <div className="mt-5 overflow-hidden rounded-md border-2 border-gray-200 transition-all hover:border-blue-300">
                                        <label className="group flex cursor-pointer items-center gap-4 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                {...register("is_vehicle")}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setValue("is_vehicle", checked);
                                                    if (!checked) setValue("vehicle_no", "");
                                                }}
                                                className="h-4 w-4 rounded border-gray-300 text-[#8b1a30]"
                                            />
                                            <div className="flex flex-1 items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200">
                                                    <Car className="h-4 w-4 text-blue-700" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Bringing a Vehicle?</p>
                                                    <p className="text-xs text-gray-500">Register for parking access</p>
                                                </div>
                                            </div>
                                        </label>
                                        <AnimatePresence>
                                            {hasVehicle && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="border-t border-blue-100 bg-blue-50/60"
                                                >
                                                    <div className="p-5">
                                                        <CustomInputField<VisitorFormValues> name="vehicle_no" label="Vehicle Registration Number" placeholder="MH12AB1234" control={control} required={false} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* ── Navigation bar ───────────────────────────────────────────── */}
                <div className="mt-auto pt-8 flex items-center justify-between">
                    {step === 0 ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPhase("qr")}
                            className="rounded-md text-sm border-gray-300 px-5 text-gray-700 hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Scan
                            <QrCode className="h-5 w-5" />
                            {/* Scan QR Instead */}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="h-10 w-10 rounded-full border-gray-300"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    {step !== steps.length - 1 ? (
                        /* ✅ type="button" — cannot trigger form submission */
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="h-10 w-10 rounded-full text-white shadow-lg transition-all hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, #8b1a30 0%, #6b1223 100%)" }}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        /*
                          ✅ type="button" + onClick={handleSubmit(onSubmit)}
                          This is the ONLY path that ever calls onSubmit.
                          No other step can reach it.
                        */
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                            className="h-10 w-10 rounded-full text-white shadow-xl transition-all hover:scale-[1.02] disabled:opacity-60"
                            style={{ background: "linear-gradient(135deg, #8b1a30 0%, #6b1223 100%)" }}
                        >
                            {isSubmitting
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                :
                                <Check className="w-4 h-4" />
                                // "Complete Registration"
                            }
                            {/* {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />} */}
                        </Button>
                    )}
                </div>

                <p className="mt-5 text-center text-xs text-gray-500">
                    By continuing, you agree to visitor security policies and check-in protocols.
                </p>
            </form>
        </div>
    );
}