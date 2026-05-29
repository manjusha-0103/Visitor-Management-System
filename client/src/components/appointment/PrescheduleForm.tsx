import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useEmpoyeeSendOtpMutation,
    useEmpoyeeVerifyOtpMutation,
    usePreScheduleVisitorMutation,
} from "@/lib/features/visitor-check-in/visitorApi";
import z from "zod";
import { useEffect, useState } from "react";
import {
    CalendarIcon,
    Clock3,
    Plus,
} from "lucide-react";
import { format } from "date-fns";
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
import { FormLabel } from "@/components/form/FormFields";
import { visitorSchema } from "@/schema/visitorSchema";
import OTPVerification from "@/components/OTPVerification";
import EmployeeSearchSelect from "@/components/EmployeeSearchSelect";
import { useSearchEmployeesQuery, type SearchEmployee } from "@/lib/features/employee/employeeApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/lib/features/auth/authSlice";
import VisitorCard from "@/pages/employee/VisitorCard";

const singleVisitorSchema = visitorSchema.pick({
    first_name: true,
    last_name: true,
    phone: true,
    email: true,
    position: true,
    company: true,
});

const formSchema = z.object({
    visitors: z.array(singleVisitorSchema),
});

export type FormValues = z.infer<typeof formSchema>;

export default function PreScheduleForm() {
    const user = useSelector(selectUser)
    const isGoogleCalendarConnected = user?.google_calendar_connected === true;

    // Schedule fields (Step 1)
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState<SearchEmployee | null>(null);

    // Google Calendar connection (Step 2)
    // const [googleConnected, setGoogleConnected] = useState(isGoogleCalendarConnected);

    // OTP fields (Step 4)
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    // Employee search
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [debounced, setDebounced] = useState("");

    // Get URL params for Google OAuth redirect
    // const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    // const status = queryParams.get("status");

    const [sendOtp, { isLoading: sendOtpLoading }] = useEmpoyeeSendOtpMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useEmpoyeeVerifyOtpMutation();
    const [preScheduleVisitor, { isLoading: isSubmitting }] = usePreScheduleVisitorMutation();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting: isFormSubmitting, isValid }
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            visitors: [
                {
                    first_name: "",
                    last_name: "",
                    phone: "",
                    email: "",
                    position: "",
                    company: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "visitors",
    });

    // Employee search
    useEffect(() => {
        if (selectedEmployee) return;
        const timer = setTimeout(() => {
            setDebounced(employeeSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [employeeSearch, selectedEmployee]);


    const { data: employeeData, isLoading: empSearchLoading } = useSearchEmployeesQuery(debounced, {
        skip: !debounced.trim(),
    });

    const employees = employeeData?.data || [];

    // Form submission
    const onSubmit = async (data: FormValues) => {
        if (!date || !time || !selectedEmployee?.email) return;

        const date_time = new Date(
            `${format(date, "yyyy-MM-dd")}T${time}`
        ).toISOString();

        try {
            await preScheduleVisitor({
                date_time,
                employee_email: selectedEmployee.email,
                visitors: data.visitors,
                login_user: user?.id ?? ""
            }).unwrap();

            // Reset everything
            setDate(undefined);
            setTime("");
            setSelectedEmployee(null);
            setOtp(["", "", "", "", "", ""]);
            setOtpSent(false);
            setOtpVerified(false);
            reset();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSendOtp = async () => {
        if (!selectedEmployee?.email) return;
        try {
            await sendOtp({
                employee_email: selectedEmployee.email,
            }).unwrap();
            setOtpSent(true);
            setResendTimer(30);
        } catch (error) {
            console.log(error);
        }
    };

    const handleResendOtp = async () => {
        if (!selectedEmployee?.email) return;
        try {
            setResendLoading(true);
            await sendOtp({
                employee_email: selectedEmployee.email,
            }).unwrap();
            setOtp(["", "", "", "", "", ""]);
            setResendTimer(30);
            const firstInput = document.getElementById("otp-0") as HTMLInputElement;
            firstInput?.focus();
        } catch (error) {
            console.log(error);
        } finally {
            setResendLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!selectedEmployee?.email) return;
        try {
            const enteredOtp = otp.join("");
            await verifyOtp({
                email: selectedEmployee.email,
                otp: enteredOtp,
            }).unwrap();
            setOtpVerified(true);
        } catch (error) {
            console.log(error);
        }
    };

    // Resend timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpSent && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, resendTimer]);

    // Step checks
    // const isStep1Complete = date && time && selectedEmployee;
    // const isStep2Complete = googleConnected;
    // const isStep3Complete = isValid;
    // const canSendOtp = isStep1Complete && isStep2Complete && isStep3Complete && !otpSent;


    const isStep1Complete = !!date && !!time;

    const isEmployeeSelected = !!selectedEmployee;

    const isStep2Complete =
        isEmployeeSelected && isGoogleCalendarConnected;

    const isStep3Complete = isValid;

    const canSendOtp =
        isStep1Complete &&
        isEmployeeSelected &&
        isStep2Complete &&
        isStep3Complete &&
        !otpSent;

    
    if (!isGoogleCalendarConnected) {
    return (
        <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-4 max-w-xl">
            <p className="text-sm font-medium text-yellow-800">
                Your Google Calendar is not connected.
            </p>

            <p className="text-sm text-yellow-700 mt-1">
                Please connect your Google Calendar first from
                Settings to enable appointment scheduling.
            </p>

            <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                    window.location.href = "/admin/settings";
                }}
            >
                Go to Settings
            </Button>
        </div>
    );
}

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            {/* STEP 1: Schedule Details */}

            <div className="rounded-2xl border bg-white p-4 space-y-4">
                <div>
                    {/* <h2 className="text-lg font-semibold">Step 1: Schedule Visit</h2> */}
                    <p className="text-sm text-muted-foreground">
                        Select date, time, and employee to meet
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div className="space-y-2">
                        <FormLabel htmlFor="visit-date" label="Visit Date" required />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-9 w-full justify-start rounded-md border-gray-200 bg-white text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-[#8b1a30]" />
                                    {date ? format(date, "PPP") : <span className="text-gray-400">Select visit date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="start" sideOffset={4} avoidCollisions={false} className="w-auto rounded-2xl p-0 bg-white shadow-xl border">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
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
                        <FormLabel htmlFor="visit-time" label="Visit Time" required />
                        <Select value={time} onValueChange={setTime}>
                            <SelectTrigger className="h-11 w-full rounded-md">
                                <div className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-[#8b1a30]" />
                                    <SelectValue placeholder="Select time" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {Array.from({ length: 48 }).map((_, index) => {
                                    const hour = Math.floor(index / 2);
                                    const minute = index % 2 === 0 ? "00" : "30";
                                    const time24 = `${String(hour).padStart(2, "0")}:${minute}`;
                                    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
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
            </div>


            {/* STEP 1.5: Select Employee (shown after date & time) */}
            {isStep1Complete && (
                <div className="rounded-2xl border bg-white p-4 space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Select Employee</h2>
                        <p className="text-sm text-muted-foreground">
                            Who will you be meeting?
                        </p>
                    </div>

                    <EmployeeSearchSelect
                        employees={employees}
                        isLoading={empSearchLoading}
                        setValue={() => { }}
                        employeeSearch={employeeSearch}
                        setEmployeeSearch={setEmployeeSearch}
                        selectedEmployee={selectedEmployee}
                        setSelectedEmployee={setSelectedEmployee}
                        debounced={debounced}
                        setDebounced={setDebounced}
                    />
                </div>
            )}

            {/* STEP 2: Connect Google Calendar (shown after employee selected) */}
            {/* {isStep1Complete && !googleConnected && ( */}
            {/* {isEmployeeSelected && !isGoogleCalendarConnected && (
                <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 max-w-xl">
                    <p className="text-sm font-medium text-yellow-800">
                        Your Google Calendar is not connected.
                    </p>

                    <p className="text-sm text-yellow-700 mt-1">
                        Please connect your Google Calendar first from
                        Settings to enable appointment scheduling.
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => {
                            window.location.href = "/admin/settings";
                        }}
                    >
                        Go to Settings
                    </Button>
                </div>
            )} */}

            {/* STEP 3: Add Visitor Details (shown after Google connected) */}
            {isStep2Complete && (
                <div className="space-y-5">
                    {/* <div className="rounded-2xl border bg-white p-4">
                        <h3 className="font-semibold text-lg">Step 3: Add Visitors</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Add one or multiple visitors for this appointment
                        </p>
                    </div> */}

                    {fields.map((field, index) => (
                        <VisitorCard
                            key={field.id}
                            field={field}
                            index={index}
                            control={control}
                            watch={watch}
                            remove={remove}
                            fieldsLength={fields.length}
                        />
                    ))}

                    {/* Add Visitor */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border border-gray-300 hover:border-gray-400"
                        onClick={() =>
                            append({
                                first_name: "",
                                last_name: "",
                                phone: "",
                                email: "",
                                position: "",
                                company: "",
                            })
                        }
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Visitor
                    </Button>
                </div>
            )}

            {/* STEP 4: OTP Verification (shown after visitors added) */}
            {otpSent && !otpVerified && (
                <div className="rounded-2xl border bg-white p-5 space-y-5">
                    <div>
                        {/* <h3 className="font-semibold text-lg">Step 4: Verify OTP</h3> */}
                        <p className="text-sm text-muted-foreground leading-5">
                            Enter the 6 digit OTP sent to {selectedEmployee?.email}
                        </p>
                    </div>

                    <OTPVerification
                        otp={otp}
                        setOtp={setOtp}
                        handleVerifyOtp={handleVerifyOtp}
                        handleResendOtp={handleResendOtp}
                        verifyOtpLoading={verifyOtpLoading}
                        resendLoading={resendLoading}
                        resendTimer={resendTimer}
                    />
                </div>
            )}

            {/* Footer */}
            <div className="border-t p-4 flex justify-end">
                {!canSendOtp && !otpSent ? (
                    <Button type="button" disabled className="bg-maroon hover:bg-maroon-dark">
                        {!isStep1Complete
                            ? "Fill Schedule & Select Employee First"
                            : !isGoogleCalendarConnected
                                ? "Connect Google Calendar First"
                                : !isStep3Complete
                                    ? "Add Visitor Details First"
                                    : "Complete Form"}
                    </Button>
                ) : !otpSent ? (
                    <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={sendOtpLoading}
                        className="bg-maroon hover:bg-maroon-dark"
                    >
                        {sendOtpLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                ) : !otpVerified ? (
                    <Button type="button" disabled className="bg-maroon hover:bg-maroon-dark">
                        Verify OTP First
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        disabled={isSubmitting || isFormSubmitting}
                        className="bg-maroon hover:bg-maroon-dark"
                    >
                        {isSubmitting || isFormSubmitting ? "Scheduling..." : "Schedule Visit"}
                    </Button>
                )}
            </div>
        </form>
    );
}