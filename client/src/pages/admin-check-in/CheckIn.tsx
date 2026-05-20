import AdminSubHeader from "@/components/AdminSubHeader";
import { useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import FaceCapture from "@/components/visitor/FaceCapture";
import CheckInForm from "@/components/appointment/CheckInForm";
import { visitorSchema } from "@/schema";
import { useGetDepartmentsQuery, useGetEmployeesQuery, usePreScheduleVisitorMutation, useSendOtpMutation, useVerifyOtpMutation, useVisitorCheckInMutation } from "@/lib/features/visitor-check-in/visitorApi";
import z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/features/auth/authSlice";

type AppointmentFormValues = z.infer<
    typeof visitorSchema
>;

export default function CheckIn() {
    const [activeTab, setActiveTab] = useState("walkin");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [walkinStep, setWalkinStep] = useState<"camera" | "form">("camera");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");

    const user = useSelector(selectUser);
    const isSuperAdmin = user?.role === "super_admin";

    const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();
    const [createAppointment, { isLoading }] = useVisitorCheckInMutation();
    const [createPreschedule, { isLoading: isPreScheduling }] = usePreScheduleVisitorMutation();


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
        <section className="mb-10">
            <AdminSubHeader
                showBack={true}
                to="/admin"
                heading="Check-in"
                subh="Create Walk-in or Pre-Schedule Appointment"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
                    {/* Custom Tabs */}
                    <div className="sticky top-20 rounded-2xl border bg-white p-3 shadow-sm space-y-2 h-fit">

                        <button
                            type="button"
                            onClick={() => setActiveTab("walkin")}
                            className={`w-full flex items-center justify-start rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "walkin"
                                ? "bg-[#701a40] text-white shadow-sm"
                                : "text-[#701a40] hover:bg-muted"
                                }`}
                        >
                            Walk-In
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("preschedule")}
                            className={`w-full flex items-center justify-start rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "preschedule"
                                ? "bg-[#701a40] text-white shadow-sm"
                                : "text-[#701a40] hover:bg-muted"
                                }`}
                        >
                            Pre-Schedule
                        </button>

                    </div>

                    <div className="min-w-0">
                        {/* <div className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm"> */}
                        {/* WALKIN CONTENT */}
                        {activeTab === "walkin" && (
                            <div className="">
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
                            </div>
                        )}

                        {/* PRESCHEDULE CONTENT */}
                        {activeTab === "preschedule" && (
                            <div className="">
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
                            </div>
                        )}



                        {/* Footer */}
                        <div className="border-t border-gray-200 max-w-xl ms-10 mt-4 p-4 flex flex-col sm:flex-row gap-2">

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
                                    className=" bg-maroon hover:bg-maroon-dark"
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
                                    className=" bg-maroon hover:bg-maroon-dark"
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
                                        className=" bg-maroon hover:bg-maroon-dark"
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

                            <Button
                                type="button"
                                variant="outline"
                                className=""
                            >
                                Cancel
                            </Button>
                        </div>

                        {/* </div> */}
                    </div>
                </div>
            </div>
        </section>



    )
}