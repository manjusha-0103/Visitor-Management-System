import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type OTPVerificationProps = {
    otp: string[];
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;

    // title?: string;
    // description?: string;

    verifyButtonText?: string;
    verifyOtpLoading?: boolean;

    resendLoading?: boolean;
    resendTimer?: number;

    handleVerifyOtp: () => void;
    handleResendOtp: () => void;

    className?: string;
};

export default function OTPVerification({
    otp,
    setOtp,

    // title = "Verify OTP",
    // description = "Enter the 6 digit OTP",

    verifyButtonText = "Verify",
    verifyOtpLoading = false,

    resendLoading = false,
    resendTimer = 0,

    handleVerifyOtp,
    handleResendOtp,

    className = "",
}: OTPVerificationProps) {

    return (
<>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        
        {/* OTP Inputs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="
                        h-9 w-9
                        sm:h-10 sm:w-10
                        text-center
                        border-[#c5c5ce]
                        font-semibold
                        rounded-md
                        text-sm
                        text-[#1a1a2e]
                        bg-[#fafafa]
                        transition-all
                        duration-200
                        focus:ring-2
                        focus:ring-maroon
                    "
                    onChange={(e) => {
                        const value =
                            e.target.value.replace(/\D/g, "");

                        const newOtp = [...otp];

                        newOtp[index] = value;

                        setOtp(newOtp);

                        // move forward
                        if (value && index < 5) {
                            const next =
                                document.getElementById(
                                    `otp-${index + 1}`
                                );

                            (next as HTMLInputElement)?.focus();
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace") {

                            // clear current
                            if (otp[index]) {
                                const newOtp = [...otp];

                                newOtp[index] = "";

                                setOtp(newOtp);

                                return;
                            }

                            // move previous
                            if (index > 0) {
                                const prev =
                                    document.getElementById(
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
        </div>

        {/* Verify Button */}
        <Button
            type="button"
            onClick={handleVerifyOtp}
            disabled={
                otp.join("").length !== 6 ||
                verifyOtpLoading
            }
            className="
                w-full
                sm:w-auto
                bg-maroon
                hover:bg-maroon-dark
            "
        >
            {verifyOtpLoading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : verifyButtonText}
        </Button>
    </div>

    {/* Resend Section */}
    <div
        className={`
            flex flex-col items-center gap-1
            text-center
            sm:flex-row sm:items-center sm:gap-3 sm:text-left
            ${className}
        `}
    >
        <p className="text-sm text-muted-foreground">
            Didn&apos;t receive OTP?
        </p>

        <Button
            type="button"
            variant="link"
            onClick={handleResendOtp}
            disabled={
                resendTimer > 0 ||
                resendLoading
            }
            className="
                h-auto
                p-0
                text-[#8b1a30]
            "
        >
            {resendLoading
                ? "Resending..."
                : resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend OTP"}
        </Button>
    </div>
</>
    );
}