import AdminSubHeader from "@/components/AdminSubHeader";
import { lazy, Suspense, useEffect, useState } from "react";
// import FaceCapture from "@/components/visitor/FaceCapture";
const FaceCapture = lazy(() => import("@/components/visitor/FaceCapture"))
import CheckInForm from "@/components/appointment/CheckInForm";
import {usePreScheduleVisitorMutation, useSendOtpMutation, useVerifyOtpMutation, useVisitorCheckInMutation } from "@/lib/features/visitor-check-in/visitorApi";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { visitorSchema } from "@/schema/visitorSchema";
import { type SearchEmployee } from "@/lib/features/employee/employeeApi";
// import EmployeeSearchSelect from "@/components/EmployeeSearchSelect";

type AppointmentFormValues = z.infer<
    typeof visitorSchema
>;

export default function CheckIn() {
    const user = useSelector(selectUser);
    const isSuperAdmin = user?.role === "super_admin";

    const [activeTab, setActiveTab] = useState(isSuperAdmin ? "walkin" : "walkin");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [capturedFile, setCapturedFile] = useState<File | null>(null);
    const [walkinStep, setWalkinStep] = useState<"camera" | "form">("camera");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [selectedEmployee, setSelectedEmployee] = useState<SearchEmployee | null>(null);

    const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();
    const [createAppointment, { isLoading }] = useVisitorCheckInMutation();
    const [createPreschedule, { isLoading: isPreScheduling }] = usePreScheduleVisitorMutation();


    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { isValid, errors }
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

    const hasLaptop = watch("is_laptop") ?? false;
    const hasVehicle = watch("is_vehicle") ?? false;


    // const { data, isLoading: empSearchLoading } =
    //         useSearchEmployeesQuery(debounced, {
    //             skip: !debounced.trim()
    //         });
    
        //   console.log(data);
    
        // const employees = data?.data || [];

    // const {
    //     data: departments = [],
    //     isLoading: deptLoading,
    // } = useGetDepartmentsQuery();

    // const {
    //     data: employees = [],
    //     isLoading: empLoading,
    // } = useGetEmployeesQuery(
    //     selectedDepartment,
    //     {
    //         skip: !selectedDepartment,
    //     }
    // );

    // const selectedDepartmentData = departments.find((d) => String(d.id) === selectedDepartment);
    // const selectedEmployeeData = employees.find((e) => String(e.id) === watch("employee_id"));

    // const departmentOptions = departments.map((d) => ({ label: d.name, value: String(d.id) }));
    // const employeeOptions = employees.map((e) => ({
    //     label: `${e.first_name} ${e.last_name}`,
    //     value: String(e.id),
    // }));


    // useEffect(() => {
    //         if (selectedEmployee) return;
    
    //         const timer = setTimeout(() => {
    //             setDebounced(employeeSearch);
    //         }, 300);
    
    //         return () => clearTimeout(timer);
    //     }, [employeeSearch, selectedEmployee]);

    const resetForm = () => {
        reset({
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            position: "",
            purpose: "",
            company: "",
            is_laptop: false,
            make: "",
            model: "",
            serial_no: "",
            is_vehicle: false,
            vehicle_no: "",
            employee_id: "",
            // department_id: "",
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
                formData.append("purpose", data.purpose || "")

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
                        employee_email: selectedEmployee?.email ?? "",
                        // purpose: data.purpose,
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


            }
            resetForm();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendOtp = async () => {
        try {
            if (!selectedEmployee?.email) return;

            await sendOtp({
                employee_email: selectedEmployee.email,
            }).unwrap();

            setOtpSent(true);

        } catch (err) {
            console.error(err);
        }
    };

    const handleResendOtp = async () => {
        try {
            setResendLoading(true);

            await sendOtp({
                employee_email: selectedEmployee?.email ?? "",
            }).unwrap();

            // reset otp boxes
            setOtp(["", "", "", "", "", ""]);

            // restart timer
            setResendTimer(30);

            // focus first box
            const firstInput = document.getElementById(
                "otp-0"
            ) as HTMLInputElement;

            firstInput?.focus();

        } catch (error) {
            console.log(error);
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const enteredOtp = otp.join("");

            await verifyOtp({
                email: selectedEmployee?.email ?? "",
                otp: enteredOtp,
            }).unwrap();

            setOtpVerified(true);

        } catch (err) {
            console.error(err);
        }
    };

    const isPrescheduleReady =
        isValid &&
        otpVerified &&
        date &&
        time;

    useEffect(() => {
        if (!isSuperAdmin) {
            setActiveTab("walkin");
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (otpSent && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [otpSent, resendTimer]);

    return (
        <section className="mb-10">
            <AdminSubHeader
                showBack={true}
                to="/admin"
                heading="Check-in"
                subh="Create Walk-in or Pre-Schedule Appointment"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div
                    className={`grid gap-6 items-start ${isSuperAdmin
                            ? "grid-cols-1 sm:grid-cols-[190px_1fr] md:grid-cols-[190px_1fr]"
                            : "grid-cols-1"
                        }`}
                >

                    {/* Custom Tabs */}
                    {isSuperAdmin && (
                        <div className="sticky top-20 z-8999 flex sm:flex-col gap-2 rounded-xl border bg-white p-3 shadow-sm space-y-2 h-fit">

                            <button
                                type="button"
                                onClick={() => setActiveTab("walkin")}
                                className={`w-full flex items-center justify-start rounded-md h-9 px-4 text-sm font-medium transition-all ${activeTab === "walkin"
                                    ? "bg-[#701a40] text-white shadow-sm"
                                    : "text-[#701a40] bg-muted"
                                    }`}
                            >
                                Walk-In
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("preschedule")}
                                className={`w-full flex items-center justify-start rounded-md px-4 h-9 text-sm font-medium transition-all ${activeTab === "preschedule"
                                    ? "bg-[#701a40] text-white shadow-sm"
                                    : "text-[#701a40] bg-muted"
                                    }`}
                            >
                                Pre-Schedule
                            </button>

                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="h-full flex flex-col"
                    >

                        <div className="min-w-0">
                            {/* WALKIN CONTENT */}
                            {activeTab === "walkin" && (
                                <div className="">
                                    {
                                        walkinStep === "camera" ? (
                                            <Suspense
                                                fallback={
                                                    <div className="flex items-center justify-center py-10">
                                                        Loading camera...
                                                    </div>
                                                }
                                            >
                                                <FaceCapture
                                                    isSuperAdmin={isSuperAdmin}
                                                    onComplete={(file, image) => {
                                                        setCapturedImage(image);
                                                        setCapturedFile(file);
                                                        setWalkinStep("form");
                                                    }}
                                                />
                                            </Suspense>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Captured preview */}
                                                {capturedImage && (
                                                    <div className="flex">
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
                                                    setValue={setValue}
                                                    // deptLoading={deptLoading}
                                                    // empLoading={empLoading}
                                                    // selectedDepartment={selectedDepartment}
                                                    hasLaptop={hasLaptop}
                                                    hasVehicle={hasVehicle}
                                                    selectedEmployee={selectedEmployee}
    setSelectedEmployee={setSelectedEmployee}
    errorMsg={errors?.employee_id?.message ?? null}
                                                    // departmentOptions={departmentOptions}
                                                    // employeeOptions={employeeOptions}
                                                    // selectedDepartmentData={selectedDepartmentData}
                                                    // selectedEmployeeData={selectedEmployeeData}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className=""
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
                                        // deptLoading={deptLoading}
                                        setValue={setValue}
                                        // empLoading={empLoading}
                                        // selectedDepartment={selectedDepartment}
                                        hasLaptop={hasLaptop}
                                        hasVehicle={hasVehicle}
                                        selectedEmployee={selectedEmployee}
    setSelectedEmployee={setSelectedEmployee}
    errorMsg={errors?.employee_id?.message ?? null}
                                        // departmentOptions={departmentOptions}
                                        // employeeOptions={employeeOptions}
                                        // selectedDepartmentData={selectedDepartmentData}
                                        // selectedEmployeeData={selectedEmployeeData}
                                        showScheduleFields={true}
                                        date={date}
                                        setDate={setDate}
                                        time={time}
                                        setTime={setTime}
                                    />

                                    {otpSent && !otpVerified && (
                                        <div className="rounded-2xl border bg-white p-5 space-y-5 mt-2 max-w-xl">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    Verify OTP
                                                </h3>

                                                <p className="text-sm text-muted-foreground">
                                                    Enter the 6 digit OTP sent to employee email
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {otp.map((digit, index) => (
                                                    <Input
                                                        key={index}
                                                        id={`otp-${index}`}
                                                        value={digit}
                                                        maxLength={1}
                                                        className="w-12 h-12 text-center border-[#c5c5ce] font-semibold rounded-md text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200"
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, "");

                                                            const newOtp = [...otp];
                                                            newOtp[index] = value;

                                                            setOtp(newOtp);

                                                            // move forward
                                                            if (value && index < 5) {
                                                                const next = document.getElementById(
                                                                    `otp-${index + 1}`
                                                                );

                                                                (next as HTMLInputElement)?.focus();
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            // backspace handling
                                                            if (e.key === "Backspace") {

                                                                // if current box has value -> clear it
                                                                if (otp[index]) {
                                                                    const newOtp = [...otp];
                                                                    newOtp[index] = "";

                                                                    setOtp(newOtp);

                                                                    return;
                                                                }

                                                                // move to previous box
                                                                if (index > 0) {
                                                                    const prev = document.getElementById(
                                                                        `otp-${index - 1}`
                                                                    ) as HTMLInputElement;

                                                                    prev?.focus();

                                                                    const newOtp = [...otp];
                                                                    newOtp[index - 1] = "";

                                                                    setOtp(newOtp);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                ))}

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


                                            <div className="flex items-center gap-3">
                                                <p className="text-sm text-muted-foreground">
                                                    Didn&apos;t receive OTP?
                                                </p>

                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    onClick={handleResendOtp}
                                                    disabled={resendTimer > 0 || resendLoading}
                                                    className="p-0 h-auto text-[#8b1a30]"
                                                >
                                                    {resendLoading
                                                        ? "Resending..."
                                                        : resendTimer > 0
                                                            ? `Resend in ${resendTimer}s`
                                                            : "Resend OTP"}
                                                </Button>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            )}


                            {/* Footer */}
                            {(activeTab === "preschedule" || walkinStep === "form") && (
                            <div className={`border-t border-gray-200 max-w-xl mt-4 py-4 flex gap-2`}>

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
                                            isLoading
                                            // ||
                                            // !isWalkinReady
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
                                                isPreScheduling
                                                ||
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
                            )}

                        </div>

                    </form>
                </div>
            </div>
        </section>



    )
}