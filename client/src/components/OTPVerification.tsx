import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    verifyButtonText = "Verify OTP",
    verifyOtpLoading = false,

    resendLoading = false,
    resendTimer = 0,

    handleVerifyOtp,
    handleResendOtp,

    className = "",
}: OTPVerificationProps) {

    return (

        // <div
        //     className={`
        //         rounded-2xl
        //         border
        //         bg-white

        //         space-y-5
        //         ${className}
        //     `}
        // >

        //     <div>

        //         <h3 className={`${className} font-semibold text-lg`}>
        //             {title}
        //         </h3>

        //         <p className={`${className} text-sm text-muted-foreground leading-5`}>
        //             {description}
        //         </p>

        //     </div>
        <>

            <div className="flex items-center gap-2">

                {otp.map((digit, index) => (

                    <Input
                        key={index}
                        id={`otp-${index}`}
                        value={digit}
                        maxLength={1}
                        className="
                            w-11
                            h-11
                            text-center
                            border-[#c5c5ce]
                            font-semibold
                            rounded-md
                            text-sm
                            text-[#1a1a2e]
                            bg-[#fafafa]
                            transition-all
                            duration-200
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

                <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                        otp.join("").length !== 6 ||
                        verifyOtpLoading
                    }
                    className="
                        bg-maroon
                        hover:bg-maroon-dark
                    "
                >
                    {verifyOtpLoading
                        ? "Verifying..."
                        : verifyButtonText}
                </Button>

            </div>

            <div className={`${className} flex items-center gap-3`}>

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
                        p-0
                        h-auto
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
        // </div>
    );
}