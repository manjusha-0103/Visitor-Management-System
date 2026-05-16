import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import {
    FieldGroup,
    FieldSet,
} from "@/components/ui/field";

import {
    Building2,
    User,
    Laptop,
    Car,
    Plus,
} from "lucide-react";

import {
    useGetDepartmentsQuery,
    useGetEmployeesQuery,
    useVisitorCheckInMutation,
} from "@/lib/features/visitor-check-in/visitorApi";

import { useWatch } from "react-hook-form";
import { visitorSchema } from "@/schema";
import { CustomInputField, SelectField } from "../form/FormFields";

type AppointmentFormValues = z.infer<
    typeof visitorSchema
>;

interface Props {
    open: boolean;
    onClose: (
        open: boolean
    ) => void;
}

export default function AppointmentForm({
    open,
    onClose,
}: Props) {
    const [createAppointment, { isLoading }] =
        useVisitorCheckInMutation();

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
    } = useForm<AppointmentFormValues>({
        resolver: zodResolver(
            visitorSchema
        ),

        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            position: "",
            company: "",
            is_laptop: false,
            make: "",
            model: "",
            serial_no: "",
            is_vehicle: false,
            vehicle_no: "",
            employee_id: "",
            department_id: "",
        },
    });

    const selectedDepartment =
        useWatch({
            control,
            name: "department_id",
        });

    const hasLaptop = watch("is_laptop");
    const hasVehicle = watch("is_vehicle");

    const {
        data: departments = [],
        isLoading: deptLoading,
    } = useGetDepartmentsQuery();

    const {
        data: employees = [],
        isLoading: empLoading,
    } = useGetEmployeesQuery(
        selectedDepartment,
        {
            skip: !selectedDepartment,
        }
    );

    const selectedDepartmentData = departments.find((d) => String(d.id) === selectedDepartment);
    const selectedEmployeeData = employees.find((e) => String(e.id) === watch("employee_id"));

    const departmentOptions = departments.map((d) => ({ label: d.name, value: String(d.id) }));
    const employeeOptions = employees.map((e) => ({
        label: `${e.first_name} ${e.last_name}`,
        value: String(e.id),
    }));

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = async (
        data: AppointmentFormValues
    ) => {
        try {
            const payload = {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                company: data.company,
                position: data.position,
                is_laptop: data.is_laptop,
                ...(data.is_laptop ? {
                    make: data.make,
                    model: data.model,
                    serial_no: data.serial_no,
                } : {
                    make: "",
                    model: "",
                    serial_no: "",
                }
                ),
                is_vehicle: data.is_vehicle,
                ...(data.is_vehicle ? { vehicle_no: data.vehicle_no } : { vehicle_no: "" }),
                employee_id: data.employee_id,
            };

            await createAppointment(
                payload
            ).unwrap();

            onClose(false);
            reset();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Sheet
            open={open}
            onOpenChange={onClose}
        >
            <SheetContent className="w-full sm:max-w-xl bg-white p-0 flex flex-col">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="h-full flex flex-col"
                >
                    {/* Header */}
                    <SheetHeader className="border-b border-gray-200 p-4">
                        <SheetTitle>
                            Create Walk-in Appointment
                        </SheetTitle>

                        <SheetDescription>
                            Add visitor appointment
                            details
                        </SheetDescription>
                    </SheetHeader>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="gap-2">

                                    <div className="flex items-center gap-2">
                                        <User
                                            size={18}
                                            className="text-maroon"
                                        />
                                        <h3 className="font-semibold text-sm">
                                            Whom To Meet
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                                                    <div className="space-y-3">
                                                                        <SelectField<AppointmentFormValues>
                                                                            name="department_id"
                                                                            label="Department"
                                                                            placeholder={deptLoading ? "Loading departments..." : "Select Department"}
                                                                            control={control}
                                                                            options={departmentOptions}
                                                                        />
                                                                        {selectedDepartmentData && (
                                                                            <div className="rounded-md border border-[#8b1a30]/10 bg-white/80 p-4 backdrop-blur">
                                                                                <p className="text-xs text-gray-500">Selected Department</p>
                                                                                <p className="mt-1 text-sm font-semibold text-gray-900">{selectedDepartmentData.name}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        <SelectField<AppointmentFormValues>
                                                                            name="employee_id"
                                                                            label="Employee"
                                                                            placeholder={!selectedDepartment ? "Select department first" : empLoading ? "Loading employees..." : "Select Employee"}
                                                                            control={control}
                                                                            options={employeeOptions}
                                                                            disabled={!selectedDepartment}
                                                                        />
                                                                        {selectedEmployeeData && (
                                                                            <div className="rounded-md border border-[#8b1a30]/10 bg-white/80 p-4">
                                                                                <p className="text-xs text-gray-500">Selected Employee</p>
                                                                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                                                                    {selectedEmployeeData.first_name} {selectedEmployeeData.last_name}
                                                                                </p>
                                                                                <p className="mt-1 text-xs text-gray-600">{selectedEmployeeData.position}</p>
                                                                                <p className="text-xs text-gray-500">{selectedEmployeeData.email}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <Field>
                                            <FieldLabel>
                                                Department
                                            </FieldLabel>

                                            <Select
                                                onValueChange={(
                                                    value
                                                ) =>
                                                    setValue(
                                                        "department_id",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            deptLoading
                                                                ? "Loading..."
                                                                : "Select department"
                                                        }
                                                    />
                                                </SelectTrigger>

                                                <SelectContent className="bg-white">
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Departments
                                                        </SelectLabel>

                                                        {departments.map(
                                                            (dept: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        dept.id
                                                                    }
                                                                    value={String(
                                                                        dept.id
                                                                    )}
                                                                >
                                                                    {
                                                                        dept.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            {errors.department_id && (
                                                <p className="text-red-500 text-[10px] ml-1">
                                                    {
                                                        errors
                                                            .department_id
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel>
                                                Employee
                                            </FieldLabel>

                                            <Select
                                                disabled={
                                                    !selectedDepartment
                                                }
                                                onValueChange={(
                                                    value
                                                ) =>
                                                    setValue(
                                                        "employee_id",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            !selectedDepartment
                                                                ? "Select department first"
                                                                : empLoading
                                                                    ? "Loading..."
                                                                    : "Select employee"
                                                        }
                                                    />
                                                </SelectTrigger>

                                                <SelectContent className="bg-white">
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Employees
                                                        </SelectLabel>

                                                        {employees.map(
                                                            (
                                                                emp: any
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        emp.id
                                                                    }
                                                                    value={String(
                                                                        emp.id
                                                                    )}
                                                                >
                                                                    {
                                                                        emp.first_name
                                                                    }{" "}
                                                                    {
                                                                        emp.last_name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            {errors.employee_id && (
                                                <p className="text-red-500 text-[10px] ml-1">
                                                    {
                                                        errors
                                                            .employee_id
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </Field>
                                    </div> */}


                                    <div className="flex items-center gap-2 mt-4 mb-2">
                                        <User
                                            size={18}
                                            className="text-cyan-700"
                                        />
                                        <h3 className="font-semibold text-sm">
                                            Personal Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <CustomInputField<AppointmentFormValues> name="first_name" label="First Name" placeholder="Rahul" control={control} />
                                        <CustomInputField<AppointmentFormValues> name="last_name" label="Last Name" placeholder="Sharma" control={control} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <CustomInputField<AppointmentFormValues> name="phone" label="Phone Number" placeholder="+91 9876543210" control={control} />
                                        <CustomInputField<AppointmentFormValues> name="email" type="email" label="Email Address" placeholder="rahul@gmail.com" control={control} />
                                    </div>


                                    <div className="flex items-center gap-2 mt-4 mb-2">
                                        <Building2
                                            size={18}
                                            className="text-indigo-700"
                                        />
                                        <h3 className="font-semibold text-sm">
                                            Company Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <CustomInputField<AppointmentFormValues> name="company" label="Company Name" placeholder="Infosys" control={control} required={false} />
                                        <CustomInputField<AppointmentFormValues> name="position" label="Position" placeholder="Software Engineer" control={control} required={false} />
                                    </div>

                                    <div className="mt-5 rounded-2xl border border-gray-200 overflow-hidden">
                                        <label className="flex items-center gap-3 px-4 py-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                {...register(
                                                    "is_laptop"
                                                )}
                                            />

                                            <div className="flex items-center gap-2">
                                                <Laptop className="text-purple-700" />

                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Carrying a
                                                        laptop?
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Add laptop
                                                        details
                                                    </p>
                                                </div>
                                            </div>
                                        </label>

                                        {hasLaptop && (
                                            <div className="border-t bg-purple-50 p-4 space-y-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <CustomInputField<AppointmentFormValues> name="make" label="Laptop Make" placeholder="Dell" control={control} required={false} />
                                                                                                            <CustomInputField<AppointmentFormValues> name="model" label="Laptop Model" placeholder="Inspiron 15" control={control} required={false} />
                                                </div>

                                                <CustomInputField<AppointmentFormValues> name="serial_no" label="Serial Number" placeholder="SN123456789" control={control} required={false} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                                        <label className="flex items-center gap-3 px-4 py-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                {...register(
                                                    "is_vehicle"
                                                )}
                                            />

                                            <div className="flex items-center gap-2">
                                                <Car className="text-blue-700" />

                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Bringing a
                                                        vehicle?
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Add vehicle
                                                        number
                                                    </p>
                                                </div>
                                            </div>
                                        </label>

                                        {hasVehicle && (
                                            <div className="border-t bg-blue-50 p-4">
                                                <CustomInputField<AppointmentFormValues> name="vehicle_no" label="Vehicle Registration Number" placeholder="MH12AB1234" control={control} required={false} />
                                            </div>
                                        )}
                                    </div>

                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </div>

                    {/* Footer */}
                    <SheetFooter className="border-t border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button
                                type="submit"
                                className="w-full sm:flex-1 bg-maroon hover:bg-maroon-dark"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Creating..."
                                    : "Create Appointment"}

                                <Plus />
                            </Button>

                            <SheetClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:flex-1"
                                >
                                    Cancel
                                </Button>
                            </SheetClose>
                        </div>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}