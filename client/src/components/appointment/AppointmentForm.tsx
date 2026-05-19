import { useEffect, useState } from "react";
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
    Plus,
} from "lucide-react";

import {
    useGetDepartmentsQuery,
    useGetEmployeesQuery,
    usePreScheduleVisitorMutation,
    useVisitorCheckInMutation,
} from "@/lib/features/visitor-check-in/visitorApi";

import { useWatch } from "react-hook-form";
import { visitorSchema } from "@/schema";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import CheckInForm from "./CheckInForm";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/features/auth/authSlice";


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
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const [activeTab, setActiveTab] = useState("walkin");
    const [createAppointment, { isLoading }] =
        useVisitorCheckInMutation();
    const [createPreschedule, { isLoading: isPreScheduling }] = usePreScheduleVisitorMutation();
    const user = useSelector(selectUser);
    const isSuperAdmin = user?.role === "super_admin";
    // const isReceptionist = user?.role === "receptionist";

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

    const hasLaptop = watch("is_laptop") ?? false;
    const hasVehicle = watch("is_vehicle") ?? false;

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

    const resetForm = () => {
        reset({
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
        });
        setDate(undefined);
        setTime("");
        setActiveTab("walkin");
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open, reset]);

    const onSubmit = async (
        data: AppointmentFormValues
    ) => {
        try {
            if (activeTab === "walkin") {
                const payload = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,

                    company: data.company,
                    position: data.position,

                    is_laptop: data.is_laptop,

                    ...(data.is_laptop
                        ? {
                            make: data.make,
                            model: data.model,
                            serial_no: data.serial_no,
                        }
                        : {
                            make: "",
                            model: "",
                            serial_no: "",
                        }),

                    is_vehicle: data.is_vehicle,

                    ...(data.is_vehicle
                        ? {
                            vehicle_no:
                                data.vehicle_no,
                        }
                        : {
                            vehicle_no: "",
                        }),

                    employee_id:
                        data.employee_id,
                };

                await createAppointment(
                    payload
                ).unwrap();
            } else {
                if (!date || !time) {
                    return;
                }

                const date_time = new Date(
                    `${format(date, "yyyy-MM-dd")}T${time}`
                ).toISOString();

                const payload = {
                    date_time,
                    employee_email: selectedEmployeeData?.email ?? "",
                    visitors: [
                        {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            phone: data.phone,
                            company: data.company,
                            position: data.position,
                        },
                    ],
                };

                await createPreschedule(
                    payload
                ).unwrap();
            }

            resetForm();
            onClose(false)
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
                    <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
                        {isSuperAdmin ? (
                            <Tabs
                                defaultValue="walkin"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="walkin"
                                        className="
                    text-xs
                    text-[#701a40]
                    data-[state=active]:bg-[#701a40]
                    data-[state=active]:text-white
                    data-[state=active]:shadow-none
                "
                                    >
                                        Walk-In
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="preschedule"
                                        className="
                    text-xs
                    text-[#701a40]
                    data-[state=active]:bg-[#701a40]
                    data-[state=active]:text-white
                    data-[state=active]:shadow-none
                "
                                    >
                                        Pre-Schedule
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="walkin" className="mt-4">
                                    <CheckInForm
                                        control={control}
                                        register={register}
                                        deptLoading={deptLoading}
                                        empLoading={empLoading}
                                        selectedDepartment={selectedDepartment}
                                        hasLaptop={hasLaptop}
                                        hasVehicle={hasVehicle}
                                        departmentOptions={departmentOptions}
                                        employeeOptions={employeeOptions}
                                        selectedDepartmentData={selectedDepartmentData}
                                        selectedEmployeeData={selectedEmployeeData}
                                    />
                                </TabsContent>

                                <TabsContent value="preschedule" className="mt-4">
                                    <CheckInForm
                                        control={control}
                                        register={register}
                                        deptLoading={deptLoading}
                                        empLoading={empLoading}
                                        selectedDepartment={selectedDepartment}
                                        hasLaptop={hasLaptop}
                                        hasVehicle={hasVehicle}
                                        departmentOptions={departmentOptions}
                                        employeeOptions={employeeOptions}
                                        selectedDepartmentData={selectedDepartmentData}
                                        selectedEmployeeData={selectedEmployeeData}
                                        showScheduleFields={true}
                                        date={date}
                                        setDate={setDate}
                                        time={time}
                                        setTime={setTime}
                                    />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="mt-4">
                                <CheckInForm
                                    control={control}
                                    register={register}
                                    deptLoading={deptLoading}
                                    empLoading={empLoading}
                                    selectedDepartment={selectedDepartment}
                                    hasLaptop={hasLaptop}
                                    hasVehicle={hasVehicle}
                                    departmentOptions={departmentOptions}
                                    employeeOptions={employeeOptions}
                                    selectedDepartmentData={selectedDepartmentData}
                                    selectedEmployeeData={selectedEmployeeData}
                                />
                            </div>
                        )}

                        {/* <Tabs defaultValue="walkin"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full">

                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="walkin" className="text-xs 
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
                                    Walk-In
                                </TabsTrigger>

                                <TabsTrigger value="preschedule" className="text-xs 
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
                                    Pre-Schedule
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="walkin" className="mt-4">
                                <CheckInForm
                                    control={control}
                                    register={register}
                                    deptLoading={deptLoading}
                                    empLoading={empLoading}
                                    selectedDepartment={selectedDepartment}
                                    hasLaptop={hasLaptop}
                                    hasVehicle={hasVehicle}
                                    departmentOptions={departmentOptions}
                                    employeeOptions={employeeOptions}
                                    selectedDepartmentData={selectedDepartmentData}
                                    selectedEmployeeData={selectedEmployeeData}
                                />
                            </TabsContent>
                            <TabsContent value="preschedule" className="mt-4">
                                <CheckInForm
                                    control={control}
                                    register={register}
                                    deptLoading={deptLoading}
                                    empLoading={empLoading}
                                    selectedDepartment={selectedDepartment}
                                    hasLaptop={hasLaptop}
                                    hasVehicle={hasVehicle}
                                    departmentOptions={departmentOptions}
                                    employeeOptions={employeeOptions}
                                    selectedDepartmentData={selectedDepartmentData}
                                    selectedEmployeeData={selectedEmployeeData}
                                    showScheduleFields={true}
                                    date={date}
                                    setDate={setDate}
                                    time={time}
                                    setTime={setTime}
                                />
                            </TabsContent>

                        </Tabs> */}

                    </div>

                    {/* Footer */}
                    <SheetFooter className="border-t border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <Button
                                type="submit"
                                className="w-full sm:flex-1 bg-maroon hover:bg-maroon-dark"
                                disabled={isLoading || isPreScheduling}
                            >
                                {
                                    isLoading || isPreScheduling
                                        ? activeTab === "walkin"
                                            ? "Creating..."
                                            : "Scheduling..."
                                        : activeTab === "walkin"
                                            ? "Create Appointment"
                                            : "Schedule Appointment"
                                }

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