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
    useSendOtpMutation,
    useVerifyOtpMutation,
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
import FaceCapture from "../visitor/FaceCapture";



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
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [walkinStep, setWalkinStep] = useState<"camera" | "form">("camera");

    const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();
    const [createAppointment, { isLoading }] = useVisitorCheckInMutation();
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
        formState: { isValid }
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
        setCapturedImage(null);
        setCapturedFile(null);
        setWalkinStep("camera");

        setOtp(["", "", "", "", "", ""]);
        setOtpSent(false);
        setOtpVerified(false);
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
                const hasValidLaptopDetails =
                    data.is_laptop &&
                    (data.make ?? "").trim() &&
                    (data.model ?? "").trim() &&
                    (data.serial_no ?? "").trim();

                const hasValidVehicleDetails =
                    data.is_vehicle &&
                    (data.vehicle_no ?? "").trim();
                const formData = new FormData();

                formData.append("first_name", data.first_name);
                formData.append("last_name", data.last_name);
                formData.append("email", data.email);
                formData.append("phone", data.phone);

                formData.append("company", data.company || "");
                formData.append("position", data.position || "");

                formData.append("employee_id", data.employee_id);

                /* IMPORTANT */
                formData.append(
                    "is_laptop",
                    String(!!hasValidLaptopDetails)
                );

                formData.append(
                    "is_vehicle",
                    String(!!hasValidVehicleDetails)
                );

                if (capturedFile) {
                    formData.append(
                        "visitor_photo",
                        capturedFile
                    );
                }

                if (hasValidLaptopDetails) {
                    formData.append(
                        "make",
                        (data.make ?? "").trim()
                    );

                    formData.append(
                        "model",
                        (data.model ?? "").trim()
                    );

                    formData.append(
                        "serial_no",
                        (data.serial_no ?? "").trim()
                    );
                } else {
                    formData.append("make", "");
                    formData.append("model", "");
                    formData.append("serial_no", "");
                }

                if (hasValidVehicleDetails) {
                    formData.append(
                        "vehicle_no",
                        (data.vehicle_no ?? "").trim()
                    );
                } else {
                    formData.append("vehicle_no", "");
                }

                await createAppointment(
                    formData
                ).unwrap();
            } else {

                if (!otpVerified) {
                    return;
                } else {
                    if (!date || !time || !otpVerified) {
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

                    await createPreschedule(payload).unwrap();
                }


                resetForm();
                onClose(false)
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendOtp = async () => {
        try {
            if (!selectedEmployeeData?.email) return;

            await sendOtp({
                employee_email: selectedEmployeeData.email,
            }).unwrap();

            setOtpSent(true);

        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const enteredOtp = otp.join("");

            await verifyOtp({
                email: selectedEmployeeData?.email ?? "",
                otp: enteredOtp,
            }).unwrap();

            setOtpVerified(true);

        } catch (err) {
            console.error(err);
        }
    };

    const isWalkinReady =
        walkinStep === "form" &&
        capturedFile &&
        isValid;

    const isPrescheduleReady =
        isValid &&
        otpVerified &&
        date &&
        time;

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
                                    {
                                        walkinStep === "camera" ? (
                                            <FaceCapture
                                                onComplete={(file, image) => {
                                                    setCapturedImage(image);
                                                    setCapturedFile(file);
                                                    setWalkinStep("form");
                                                }}
                                            />
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Captured preview */}
                                                {capturedImage && (
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={capturedImage}
                                                            alt="Visitor"
                                                            className="w-28 h-28 rounded-xl object-cover border"
                                                        />
                                                    </div>
                                                )}

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

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCapturedImage(null);
                                                        setCapturedFile(null);
                                                        setWalkinStep("camera");
                                                    }}
                                                >
                                                    Retake Photo
                                                </Button>
                                            </div>
                                        )
                                    }

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

                                    {otpSent && !otpVerified && (
                                        <div className="mt-4 rounded-xl border p-4 bg-white space-y-4">

                                            <div>
                                                <h3 className="font-semibold">
                                                    Verify OTP
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    Enter OTP sent to employee email
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                {otp.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        value={digit}
                                                        maxLength={1}
                                                        className="w-10 h-10 border rounded text-center"
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, "");

                                                            const newOtp = [...otp];
                                                            newOtp[index] = value;

                                                            setOtp(newOtp);

                                                            if (value && index < 5) {
                                                                const next =
                                                                    document.getElementById(
                                                                        `otp-${index + 1}`
                                                                    ) as HTMLInputElement;

                                                                next?.focus();
                                                            }
                                                        }}
                                                        id={`otp-${index}`}
                                                    />
                                                ))}
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={
                                                    otp.join("").length !== 6 ||
                                                    verifyOtpLoading
                                                }
                                                className="bg-maroon hover:bg-maroon-dark"
                                            >
                                                {verifyOtpLoading
                                                    ? "Verifying..."
                                                    : "Verify OTP"}
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        ) : (

                            walkinStep === "camera" ? (
                                <FaceCapture
                                    onComplete={(file, image) => {
                                        setCapturedImage(image);
                                        setCapturedFile(file);
                                        setWalkinStep("form");
                                    }}
                                />
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
                            )
                        )}

                    </div>

                    {/* Footer */}
                    <SheetFooter className="border-t border-gray-200 p-4">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">

                            {/* PRESCHEDULE SEND OTP BUTTON */}
                            {activeTab === "preschedule" &&
                                isSuperAdmin &&
                                !otpSent ? (
                                <Button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={
                                        sendOtpLoading ||
                                        !watch("employee_id")
                                    }
                                    className="w-full sm:flex-1 bg-maroon hover:bg-maroon-dark"
                                >
                                    {sendOtpLoading
                                        ? "Sending OTP..."
                                        : "Send OTP"}
                                </Button>
                            ) : null}

                            {/* WALKIN CREATE BUTTON */}
                            {activeTab === "walkin" && (
                                <Button
                                    type="submit"
                                    className="w-full sm:flex-1 bg-maroon hover:bg-maroon-dark"
                                    disabled={
                                        isLoading ||
                                        !isWalkinReady
                                    }
                                >
                                    {isLoading
                                        ? "Creating..."
                                        : "Create Appointment"}

                                    <Plus />
                                </Button>
                            )}

                            {/* PRESCHEDULE BUTTON */}
                            {activeTab === "preschedule" &&
                                (!isSuperAdmin || otpSent) && (
                                    <Button
                                        type="submit"
                                        className="w-full sm:flex-1 bg-maroon hover:bg-maroon-dark"
                                        disabled={
                                            isPreScheduling ||
                                            !isPrescheduleReady
                                        }
                                    >
                                        {isPreScheduling
                                            ? "Scheduling..."
                                            : "Schedule Appointment"}

                                        <Plus />
                                    </Button>
                                )}

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