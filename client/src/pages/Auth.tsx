import { Eye, EyeOff, UserRound, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignInMutation } from "@/lib/features/auth/authApi"
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/features/auth/authSlice';
import { CREDENTIALS } from '@/contants';
import { signInSchema } from '@/schema';
import { Button } from '@/components/ui/button';
import logo from "@/assets/Racca-Logo.avif";
import { CustomInputField } from '@/components/form/FormFields';

type SignFormValues = z.infer<typeof signInSchema>;
type UseMeCred = {
    role: string; 
    badge: string; 
    badgeClass: string; 
    email: string; 
    pass: string;
}

// function EyeIcon({ show }: {show: boolean}) {
//     return show ? (
//         <Eye className="text-gray-400" size={20} />
//     ) : (
//         <EyeOff className="text-gray-400" size={20} />
//     );
// }

export default function Auth() {
    const [login, { isLoading }] = useSignInMutation()
    const dispatch = useDispatch();
    const {
        handleSubmit,
        setValue,
        control,
    } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: "", password: "" }
    })
    const navigate = useNavigate();
    // const [role, setRole] = useState("");

    // console.log(watch("email"), watch("password"));

    const [showPw, setShowPw] = useState(false);

    const handleUse = (cred: UseMeCred) => {
        setValue("email", cred.email);
        setValue("password", cred.pass);
        // setRole(cred.badge)
    };

    async function onSubmit(data: SignFormValues) {
        try {
            const userData = await login(data).unwrap();
            console.log("userData", userData);
            dispatch(setUser(userData.data))

            if (userData?.data?.role === 'super_admin') {
                navigate('/admin', { replace: true })
            } else {
                navigate('/receptionist', { replace: true })
            }
        } catch (err) {
            console.error('Failed to login:', err);
        }
        // console.log(data);

    }

    // funtyp
    return (
        <>


            {/* Root */}
            <div
                className="w-full min-h-screen bg-linear-to-br from-maroon to-maroon-dark flex flex-col items-center justify-center bg-maroon relative overflow-hidden px-4 py-6"

            >
                {/* Background orbs */}
                {/* <div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 480, height: 480, background: "#ffab25", filter: "blur(90px)", opacity: 0.18, top: -120, left: -80 }}
                />
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 360, height: 360, background: "#ffab25", filter: "blur(90px)", opacity: 0.18, bottom: -60, right: -60 }}
                />
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: 220, height: 220, background: "#ffab25", filter: "blur(90px)", opacity: 0.18, top: "40%", left: "60%" }}
                /> */}

                {/* Brand */}
                {/* <div className="flex flex-col items-center gap-2.5 mb-7 animate-fade-down">
                    <div
                        className="w-14 h-14 flex items-center justify-center rounded-2xl text-[22px] font-semibold text-maroon"
                        style={{

                            background: "linear-gradient(145deg, #f5a623, #e8903a)",
                            boxShadow: "0 8px 24px rgba(245,166,35,0.35), 0 2px 8px rgba(0,0,0,0.2)",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        I
                    </div>
                    <span
                        className="text-white text-xl font-semibold tracking-wide"

                    >
                        Iravya
                    </span>

                </div> */}

                {/* Card */}
                <div
                    className="bg-white rounded-2xl w-full max-w-105 animate-fade-up p-6 lg:p-8"

                >
                    <img src={logo} width={120} height={120} className='text-center mx-auto mb-2'/>
                    {/* Heading */}
                    {/* <h1
                        className="text-xl font-semibold text-[#1a1a2e] text-center mb-1.5"

                    >
                        Sign In
                    </h1> */}
                    <p className="text-sm text-[#7a7a8a] text-center mb-7 font-normal">
                        Enter your credentials to continue
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
                            {/* Username */}
                            <CustomInputField<SignFormValues>
                                name="email"
                                label="Email"
                                type='email'
                                placeholder="arjun.j@gmail.com"
                                control={control}
                                 icon={UserRound}
                            />


                            <CustomInputField<SignFormValues>
                                name="password"
                                label="Password"
                                type={showPw ? "text" : "password"}
                                placeholder="Password"
                                control={control}
                                icon={Lock}
  rightElement={
    <button
      type="button"
      onClick={() => setShowPw((v) => !v)}
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
                        {/* <div className="relative">
                            <UserRound className="absolute left-3.5 top-1/3 text-gray-400" size={16} />
                            <Input
                                type="email"
                                placeholder="arjun.j@gmail.com"
                                {"email")}
                                className={`w-full pl-10 pr-10 h-11 border ${errors.email ? 'border-red-500' : 'border-[#e8e8f0]'}  rounded-[10px] text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200`}
                            />

                        </div>
                        {errors.email && (
                            <FormError msg={errors.email.message}/>
                        )} */}

                        {/* Password */}
                        {/* <div className="relative mt-2">
                            <Lock className="absolute left-3.5 top-1/3 text-gray-400" size={16} />
                            <Input
                                type={showPw ? "text" : "password"}
                                placeholder="Password"
                                {"password")}
                                className={`w-full pl-10 pr-10 h-11 border ${errors.email ? 'border-red-500' : 'border-[#e8e8f0]'} rounded-[10px] text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((v) => !v)}
                                tabIndex={-1}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-[#b0b0c0] hover:text-[#8b1a30] transition-colors duration-150 bg-transparent border-none cursor-pointer p-0"
                            >
                                <EyeIcon show={showPw} />
                            </button>
                        </div>
                        {errors.password && (
                             <FormError msg={errors.password.message}/>
                        )} */}

                        {/* Sign In button */}
                        <Button
                            type="submit"
                            className="btn-signin w-full py-3.5 text-white text-sm font-semibold rounded-[10px] mt-3 tracking-wide cursor-pointer border-none transition-all duration-150"

                            style={{
                                background: "linear-gradient(135deg, #8b1a30, #6b1223)",
                                boxShadow: "0 4px 18px rgba(139,26,48,0.32)",
                            }}
                        >
                            {isLoading ? 'Please wait...' : 'Sign In'}
                        </Button>

                    </form>
                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#e8e8f0]" />
                        <span className="text-xs font-semibold tracking-[0.5px] uppercase text-[#b0b0c0]">
                            Default Credentials
                        </span>
                        <div className="flex-1 h-px bg-[#e8e8f0]" />
                    </div>

                    {/* Credential cards */}
                    {CREDENTIALS.map((cred) => (
                        <div
                            key={cred.role}
                            className="cred-card flex items-center justify-between bg-[#f7f7fb] border border-[#ececf5] rounded-[10px] px-3.5 py-3 mb-2.5 transition-all duration-150 cursor-default"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-[#1a1a2e]">{cred.role}</span>
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-[5px] tracking-wide border ${cred.badgeClass}`}
                                    >
                                        {cred.badge}
                                    </span>
                                </div>
                                <span className="text-xs text-[#9090a0]">
                                    {cred.email} / {cred.pass}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleUse(cred)}
                                className="use-btn text-xs font-semibold text-maroon-dark bg-transparent border-none cursor-pointer whitespace-nowrap transition-colors duration-150 p-0"
                            >
                                Use →
                            </button>
                        </div>
                        // </div>
                    ))}
                </div>
            </div >
        </>
    )
}