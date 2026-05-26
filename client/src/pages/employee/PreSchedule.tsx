import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    usePreScheduleVisitorMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
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
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import VisitorCard from "./VisitorCard";
import { visitorSchema } from "@/schema/visitorSchema";


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

export default function PreSchedule() {
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const [empEmail, setEmpEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    // const [sendOtpLoading, setSendOtpLoading] = useState(false);
    // const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting, isValid }
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

    const isScheduleDisabled =
        !date || !time || !empEmail || !isValid || isSubmitting;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "visitors",
    });

    const [preScheduleVisitor] = usePreScheduleVisitorMutation();

    const onSubmit = async (data: FormValues) => {
        if (!date || !time) return;

        const date_time = new Date(
            `${format(date, "yyyy-MM-dd")}T${time}`
        ).toISOString();

        try {
            await preScheduleVisitor({
                date_time,
                employee_email: empEmail,
                visitors: data.visitors,
            }).unwrap();
          
            reset();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSendOtp = async () => {
        try {
            // call backend api here
            await sendOtp({
                employee_email: empEmail,
            }).unwrap();

            setOtpSent(true);

            // reset timer
            setResendTimer(30);

        } catch (error) {
            console.log(error);
        }
    };

    const handleResendOtp = async () => {
        try {
            setResendLoading(true);

             await sendOtp({
            employee_email: empEmail,
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
                email: empEmail,
                otp: enteredOtp,
            }).unwrap();
            setOtpVerified(true);

        } catch (error) {
            console.log(error);
        }
    };

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
        <div className="min-h-screen bg-gray-50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 w-full border-b bg-white">
                <nav className="w-full px-4 lg:px-6 h-14 flex items-center justify-between bg-maroon shadow-lg"
                    style={{
                        background: 'linear-gradient(90deg, rgb(112, 26, 64) 0%, rgb(84, 11, 40) 100%)'
                    }}>

                    <div className="flex items-center gap-3">
                        <img src={'/app.png'} width={40} height={40} className='text-center mx-auto mb-2 bg-white rounded-full' />
                        {/* <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-500 text-maroon border-2 border-orange-200 font-bold text-lg shadow-md">
                            I
                        </div> */}

                        <Link to="/employee" className="flex flex-col leading-tight">
                            <span className="font-bold text-white text-lg">
                                VisitMi
                            </span>

                        </Link>
                    </div>

                </nav>
            </div>

            <div className="mx-auto max-w-xl p-4 overflow-visible">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        <div className="border-b p-4">
                            <h2 className="text-lg font-semibold">
                                Pre Schedule Visitors
                            </h2>

                            <p className="text-sm text-muted-foreground mt-1">
                                Add one or multiple visitors
                            </p>
                        </div>

                        {/* Schedule Section */}
                        <div className="rounded-2xl border bg-white p-4 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Schedule Visit
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Select date, time of vist and your work email first
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                                            sideOffset={4}
                                            avoidCollisions={false}
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

                                                const minute =
                                                    index % 2 === 0 ? "00" : "30";

                                                const time24 = `${String(hour).padStart(
                                                    2,
                                                    "0"
                                                )}:${minute}`;

                                                const hour12 =
                                                    hour === 0
                                                        ? 12
                                                        : hour > 12
                                                            ? hour - 12
                                                            : hour;

                                                const ampm =
                                                    hour >= 12 ? "PM" : "AM";

                                                return (
                                                    <SelectItem
                                                        key={time24}
                                                        value={time24}
                                                    >
                                                        {`${String(hour12).padStart(
                                                            2,
                                                            "0"
                                                        )}:${minute} ${ampm}`}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Employee Email */}
                                <div className="space-y-2">
                                    <FormLabel htmlFor="employee_email" label="Employee email" required={true} />
                                    <Input
                                        name="employee_email"
                                        type="email"
                                        placeholder="john@iravya.com"
                                        value={empEmail}
                                        onChange={(e) => setEmpEmail(e.target.value)}
                                        className="rounded-md text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200 border border-[#e8e8f0]"
                                    />

                                </div>
                            </div>
                        </div>

                        {date && time && empEmail && (
                            <div className="space-y-5">
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


                        {/* OTP Verification */}
                        {otpSent && !otpVerified && (
                            <div className="rounded-2xl border bg-white p-5 space-y-5">
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

                        {/* Footer */}
                        <div className="border-t p-4 flex justify-end">

                            {!otpSent ? (
                                <Button
                                    type="button"
                                    disabled={isScheduleDisabled}
                                    onClick={handleSendOtp}
                                    className="bg-maroon hover:bg-maroon-dark"
                                >
                                    {sendOtpLoading
                                        ? "Sending OTP..."
                                        : "Send OTP"}
                                </Button>
                            ) : !otpVerified ? (
                                <Button
                                    type="button"
                                    disabled
                                    className="bg-maroon hover:bg-maroon-dark"
                                >
                                    Verify OTP First
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-maroon hover:bg-maroon-dark"
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : "Schedule Visit"}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
