// import { Eye, EyeOff, UserRound, Lock } from 'lucide-react';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import z from 'zod';
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useSignInMutation } from "@/lib/features/auth/authApi"
// import { useDispatch } from 'react-redux';
// import { setUser } from '@/lib/features/auth/authSlice';
// import { CREDENTIALS } from '@/contants';
// import { Button } from '@/components/ui/button';
// // import logo from "iravya-logo.png"
// import { CustomInputField } from '@/components/form/FormFields';
// import { signInSchema } from '@/schema/signInSchema';

// type SignFormValues = z.infer<typeof signInSchema>;
// type UseMeCred = {
//     role: string;
//     badge: string;
//     badgeClass: string;
//     email: string;
//     pass: string;
// }


// export default function Auth() {
//     const [login, { isLoading }] = useSignInMutation()
//     const dispatch = useDispatch();
//     const {
//         handleSubmit,
//         setValue,
//         control,
//     } = useForm({
//         resolver: zodResolver(signInSchema),
//         defaultValues: { email: "", password: "" }
//     })
//     const navigate = useNavigate();

//     const [showPw, setShowPw] = useState(false);

//     const handleUse = (cred: UseMeCred) => {
//         setValue("email", cred.email);
//         setValue("password", cred.pass);
//         // setRole(cred.badge)
//     };

//     async function onSubmit(data: SignFormValues) {
//         try {
//             const userData = await login(data).unwrap();
//             console.log("userData", userData);
//             dispatch(setUser(userData.data))

//             if (userData?.data?.role === 'super_admin') {
//                 navigate('/admin', { replace: true })
//             } else {
//                 navigate('/user', { replace: true })
//             }
//         } catch (err) {
//             console.error('Failed to login:', err);
//         }
//         // console.log(data);

//     }

//     // funtyp
//     return (
//         <>
//             {/* Root */}
//             <div
//                 className="w-full min-h-screen bg-linear-to-br from-maroon to-maroon-dark flex flex-col items-center justify-center bg-maroon relative overflow-hidden px-4 py-6"
//                 style={{
//                     background: `
//     radial-gradient(
//       circle at 50% 0%,
//       var(--color-maroon) 0%,
//       var(--color-maroon-dark) 100%
//     )
//   `
//                 }}

//             >
               

//                 {/* Card */}
//                 <div
//                     className="bg-white rounded-2xl w-full max-w-105 animate-fade-up p-6 lg:p-8"

//                 >
//                     <img src={'/iravya-logo.png'} width={160} height={160} className='text-center mx-auto' />
                    
//                     <p className="text-sm text-[#7a7a8a] text-center mb-7 font-normal">
//                         Enter your credentials to continue
//                     </p>

//                     <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
//                         {/* Username */}
//                         <CustomInputField<SignFormValues>
//                             name="email"
//                             label="Email"
//                             type='email'
//                             placeholder="arjun.j@gmail.com"
//                             control={control}
//                             icon={UserRound}
//                         />


//                         <CustomInputField<SignFormValues>
//                             name="password"
//                             label="Password"
//                             type={showPw ? "text" : "password"}
//                             placeholder="Password"
//                             control={control}
//                             icon={Lock}
//                             rightElement={
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPw((v) => !v)}
//                                     className="
//         flex
//         items-center
//         text-gray-400
//         hover:text-maroon
//       "
//                                 >
//                                     {showPw ? (
//                                         <Eye size={18} />
//                                     ) : (
//                                         <EyeOff size={18} />
//                                     )}
//                                 </button>
//                             }
//                         />
                        

//                         {/* Sign In button */}
//                         <Button
//                             type="submit"
//                             className="btn-signin w-full py-3.5 text-white text-sm font-semibold rounded-[10px] mt-3 tracking-wide cursor-pointer border-none transition-all duration-150"

//                             style={{
//                                 background: "linear-gradient(135deg, #8b1a30, #6b1223)",
//                                 boxShadow: "0 4px 18px rgba(139,26,48,0.32)",
//                             }}
//                         >
//                             {isLoading ? 'Please wait...' : 'Sign In'}
//                         </Button>

//                     </form>
//                     {/* Divider */}
//                     <div className="flex items-center gap-3 my-5">
//                         <div className="flex-1 h-px bg-[#e8e8f0]" />
//                         <span className="text-xs font-semibold tracking-[0.5px] uppercase text-[#b0b0c0]">
//                             Default Credentials
//                         </span>
//                         <div className="flex-1 h-px bg-[#e8e8f0]" />
//                     </div>

//                     {/* Credential cards */}
//                     {CREDENTIALS.map((cred) => (
//                         <div
//                             key={cred.role}
//                             className="cred-card flex items-center justify-between bg-[#f7f7fb] border border-[#ececf5] rounded-[10px] px-3.5 py-3 mb-2.5 transition-all duration-150 cursor-default"
//                         >
//                             <div className="flex flex-col gap-1">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-xs font-semibold text-[#1a1a2e]">{cred.role}</span>
//                                     <span
//                                         className={`text-xs font-semibold px-2 py-0.5 rounded-[5px] tracking-wide border ${cred.badgeClass}`}
//                                     >
//                                         {cred.badge}
//                                     </span>
//                                 </div>
//                                 <span className="text-xs text-[#9090a0]">
//                                     {cred.email} / {cred.pass}
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={() => handleUse(cred)}
//                                 className="use-btn text-xs font-semibold text-maroon-dark bg-transparent border-none cursor-pointer whitespace-nowrap transition-colors duration-150 p-0"
//                             >
//                                 Use →
//                             </button>
//                         </div>
//                         // </div>
//                     ))}

//                     <p className='text-xs text-center font-semibold text-muted-foreground'>Powered by <span className='text-maroon-dark'>Iravya</span></p>
//                 </div>
//             </div >
//         </>
//     )
// }








import {
    Eye,
    EyeOff,
    UserRound,
    Lock,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';

import z from 'zod';

import { zodResolver } from "@hookform/resolvers/zod";

import {
    useSendOtpMutation,
    useSignInMutation,
    useVerifyOtpMutation,
} from "@/lib/features/auth/authApi";

import { useDispatch } from 'react-redux';

import { setUser } from '@/lib/features/auth/authSlice';

import { CREDENTIALS } from '@/contants';

import { Button } from '@/components/ui/button';

import { CustomInputField } from '@/components/form/FormFields';

import { signInSchema } from '@/schema/signInSchema';
import OTPVerification from '@/components/OTPVerification';


type SignFormValues =
    z.infer<typeof signInSchema>;

type UseMeCred = {
    role: string;
    badge: string;
    badgeClass: string;
    email: string;
    pass: string;
};

export default function Auth() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [showPw, setShowPw] =
        useState(false);

    // MFA STATES
    const [step, setStep] =
        useState<"login" | "otp">("login");

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState(["", "", "", "", "", ""]);

    const [resendTimer, setResendTimer] =
        useState(30);

    // API
    const [login, { isLoading }] =
        useSignInMutation();

    const [
    verifyOtp,
    {
        isLoading: verifyOtpLoading
    }
] = useVerifyOtpMutation();

const [
    resendOtp,
    {
        isLoading: resendLoading
    }
] = useSendOtpMutation();

    // FORM
    const {
        handleSubmit,
        setValue,
        control,
    } = useForm<SignFormValues>({
        resolver:
            zodResolver(signInSchema),

        defaultValues: {
            email: "",
            password: ""
        }
    });

    // AUTO FILL
    const handleUse = (
        cred: UseMeCred
    ) => {

        setValue(
            "email",
            cred.email
        );

        setValue(
            "password",
            cred.pass
        );
    };

    // LOGIN
    async function onSubmit(
        data: SignFormValues
    ) {

        try {

            const response =
                await login(data).unwrap();

            if (
                response?.data?.otpRequired
            ) {

                setEmail(data.email);

                setStep("otp");

                setResendTimer(30);
            }

        } catch (err) {

            console.error(
                'Failed to login:',
                err
            );
        }
    }

    // VERIFY OTP
    const handleVerifyOtp =
        async () => {

            try {

                const response =
                    await verifyOtp({
                        email,
                        otp: otp.join("")
                    }).unwrap();

                dispatch(
                    setUser(response.data)
                );

                if (
                    response?.data?.role ===
                    'super_admin'
                ) {

                    navigate('/admin', {
                        replace: true
                    });

                } else {

                    navigate('/user', {
                        replace: true
                    });
                }

            } catch (err) {

                console.error(
                    "OTP verification failed",
                    err
                );
            }
        };

    // RESEND OTP
    const handleResendOtp = async () => {

    try {

        await resendOtp({
            email
        }).unwrap();

        // clear otp
        setOtp([
            "",
            "",
            "",
            "",
            "",
            ""
        ]);

        // restart timer
        setResendTimer(30);

        // focus first input
        const firstInput =
            document.getElementById(
                "otp-0"
            ) as HTMLInputElement;

        firstInput?.focus();

    } catch (err) {

        console.log(err);
    }
};

    // TIMER
    useEffect(() => {

        let interval:
            NodeJS.Timeout;

        if (step === "otp" &&
            resendTimer > 0
        ) {

            interval =
                setInterval(() => {

                    setResendTimer(
                        (prev) => prev - 1
                    );

                }, 1000);
        }

        return () =>
            clearInterval(interval);

    }, [step, resendTimer]);

    return (

        <div
            className="
                w-full
                min-h-screen
                bg-linear-to-br
                from-maroon
                to-maroon-dark
                flex
                flex-col
                items-center
                justify-center
                bg-maroon
                relative
                overflow-hidden
                px-4
                py-6
            "
            style={{
                background: `
                    radial-gradient(
                        circle at 50% 0%,
                        var(--color-maroon) 0%,
                        var(--color-maroon-dark) 100%
                    )
                `
            }}
        >

            {/* CARD */}
            <div
                className="
                    bg-white
                    rounded-2xl
                    w-full
                    max-w-105
                    animate-fade-up
                    p-6
                    lg:p-8
                "
            >

                {
                    step === 'login' && (
                        <img
                    src={'/iravya-logo.png'}
                    width={160}
                    height={160}
                    className='text-center mx-auto'
                />
                    )
                }

                

                {/* LOGIN STEP */}
                {step === "login" && (
                    <>

                        <p
                            className="
                                text-sm
                                text-[#7a7a8a]
                                text-center
                                mb-7
                                font-normal
                            "
                        >
                            Enter your credentials to continue
                        </p>

                        <form
                            onSubmit={
                                handleSubmit(
                                    onSubmit
                                )
                            }
                            className='space-y-2'
                        >

                            {/* EMAIL */}
                            <CustomInputField<SignFormValues>
                                name="email"
                                label="Email"
                                type='email'
                                placeholder="arjun.j@gmail.com"
                                control={control}
                                icon={UserRound}
                            />

                            {/* PASSWORD */}
                            <CustomInputField<SignFormValues>
                                name="password"
                                label="Password"
                                type={
                                    showPw
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                control={control}
                                icon={Lock}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPw(
                                                (v) => !v
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            text-gray-400
                                            hover:text-maroon
                                        "
                                    >
                                        {showPw ? (
                                            <Eye size={18} />
                                        ) : (
                                            <EyeOff size={18} />
                                        )}
                                    </button>
                                }
                            />

                            {/* SUBMIT */}
                            <Button
                                type="submit"
                                className="
                                    btn-signin
                                    w-full
                                    py-3.5
                                    text-white
                                    text-sm
                                    font-semibold
                                    rounded-[10px]
                                    mt-3
                                    tracking-wide
                                    cursor-pointer
                                    border-none
                                    transition-all
                                    duration-150
                                "
                                style={{
                                    background:
                                        "linear-gradient(135deg, #8b1a30, #6b1223)",

                                    boxShadow:
                                        "0 4px 18px rgba(139,26,48,0.32)",
                                }}
                            >
                                {isLoading
                                    ? 'Please wait...'
                                    : 'Sign In'}
                            </Button>

                        </form>

                        {/* DIVIDER */}
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                my-5
                            "
                        >

                            <div
                                className="
                                    flex-1
                                    h-px
                                    bg-[#e8e8f0]
                                "
                            />

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    tracking-[0.5px]
                                    uppercase
                                    text-[#b0b0c0]
                                "
                            >
                                Default Credentials
                            </span>

                            <div
                                className="
                                    flex-1
                                    h-px
                                    bg-[#e8e8f0]
                                "
                            />

                        </div>

                        {/* CREDENTIALS */}
                        {CREDENTIALS.map((cred) => (

                            <div
                                key={cred.role}
                                className="
                                    cred-card
                                    flex
                                    items-center
                                    justify-between
                                    bg-[#f7f7fb]
                                    border
                                    border-[#ececf5]
                                    rounded-[10px]
                                    px-3.5
                                    py-3
                                    mb-2.5
                                    transition-all
                                    duration-150
                                    cursor-default
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-1
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                font-semibold
                                                text-[#1a1a2e]
                                            "
                                        >
                                            {cred.role}
                                        </span>

                                        <span
                                            className={`
                                                text-xs
                                                font-semibold
                                                px-2
                                                py-0.5
                                                rounded-[5px]
                                                tracking-wide
                                                border
                                                ${cred.badgeClass}
                                            `}
                                        >
                                            {cred.badge}
                                        </span>

                                    </div>

                                    <span
                                        className="
                                            text-xs
                                            text-[#9090a0]
                                        "
                                    >
                                        {cred.email}
                                        {" / "}
                                        {cred.pass}
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleUse(cred)
                                    }
                                    className="
                                        use-btn
                                        text-xs
                                        font-semibold
                                        text-maroon-dark
                                        bg-transparent
                                        border-none
                                        cursor-pointer
                                        whitespace-nowrap
                                        transition-colors
                                        duration-150
                                        p-0
                                    "
                                >
                                    Use →
                                </button>

                            </div>

                        ))}

                    </>
                )}

                {/* OTP STEP */}
                {step === "otp" && (
                     <div
                                className={`
                rounded-2xl
                border
                bg-white
                p-5
                space-y-5
            `}
                            >

                                <div>

                                    <h3 className={`text-center font-semibold text-lg`}>
                                        Verify OTP
                                    </h3>

                                    <p className={`text-center ext-sm text-muted-foreground leading-5`}>
                                        Enter the 6 digit OTP
                            sent to {email}
                                    </p>

                                </div>

                    <OTPVerification
                        otp={otp}
                        setOtp={setOtp}

                        // title="Verify OTP"

                        // description={`
                        //     Enter the 6 digit OTP
                        //     sent to ${email}
                        // `}

                        handleVerifyOtp={
                            handleVerifyOtp
                        }

                        handleResendOtp={
                            handleResendOtp
                        }
                        verifyButtonText="Verify"

                        verifyOtpLoading={
                            verifyOtpLoading
                        }

                        resendLoading={resendLoading}

                        resendTimer={
                            resendTimer
                        }

                        className="
                            border-0
                            p-0
                            justify-center
                            text-center
                        "
                    />
                    </div>

                )}

                {/* FOOTER */}
                <p
                    className='
                        text-xs
                        text-center
                        font-semibold
                        text-muted-foreground
                        mt-5
                    '
                >
                    Powered by
                    <span
                        className='text-maroon-dark'
                    >
                        {" "}Iravya
                    </span>
                </p>

            </div>

        </div>
    );
}
