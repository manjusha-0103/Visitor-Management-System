import { useState } from "react";
import {
    ArrowRight,
    Building2,
    Lock,
    ShieldCheck,
} from "lucide-react";
import VisitorForm from "./VisitorForm";
import { Button } from "../ui/button";
import VisitBookSuccess from "./VisitBookSuccess";

export default function VisitorCheckIn() {
    const [phase, setPhase] = useState<"qr" | "form" | "done">("qr");

    return (
        <section
            className="
                relative flex min-h-screen items-center justify-center overflow-hidden
                bg-gradient-to-br from-[#5e1028] via-[#7a1737] to-[#3f0b1a]
                px-4 py-8
            "
        >
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-pink-400/10 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-300/10 blur-3xl" />
            </div>

            {/* Main Card */}
            <div
                className="
                    relative z-10 w-full max-w-lg min-h-[90vh] overflow-hidden rounded-3xl
                    border border-white/10 bg-white shadow-2xl
                "
            >
                {/* Top Header */}
                <div
                    className="
                        flex items-center justify-between
                        border-b border-gray-100 px-6 py-4
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex h-10 w-10 items-center justify-center rounded-lg
                                bg-gradient-to-br from-[#8b1a30] to-[#6b1223]
                                text-white shadow-lg
                            "
                        >
                            <Building2 size={18} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                VisitMi
                            </h2>
                        </div>
                    </div>

                    <div
                        className="
                            rounded-full border border-emerald-100
                            bg-emerald-50 px-3 py-1
                            text-xs font-medium text-emerald-700
                        "
                    >
                        Secure
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    {phase === "qr" && (
                        <div className="space-y-4">
                            {/* Hero */}
                            <div className="text-center">
                                {/* <div
                                    className="
                                        mx-auto mb-5 flex h-20 w-20 items-center
                                        justify-center rounded-3xl
                                        bg-gradient-to-br from-[#8b1a30]/10 to-[#6b1223]/10
                                    "
                                >
                                    <ShieldCheck
                                        className="text-[#8b1a30]"
                                        size={38}
                                    />
                                </div> */}

                                <p className="text-sm font-medium text-[#8b1a30]">
                                    Welcome Visitor
                                </p>

                                <h1
                                    className="
                                        mt-1 text-2xl font-bold tracking-tight
                                        text-gray-900
                                    "
                                >
                                    Check in for your visit
                                </h1>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                                    Tap to check-in your visit and notify your host.
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setPhase("form")}
                                    className="
                                        h-10 w-full rounded-md text-sm font-semibold
                                        shadow-lg transition-all duration-200
                                        hover:scale-[1.01]
                                        active:scale-[0.99]
                                    "
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #8b1a30 0%, #6b1223 100%)",
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        Start Check-In
                                        <ArrowRight size={18} />
                                    </span>
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    Takes less than a minute
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gray-200" />

                                <span className="text-xs text-gray-400">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            {/* QR Section */}
                            <div className="flex flex-col items-center">
                                <div
                                    className="
                                        relative flex h-30 w-30 items-center
                                        justify-center rounded-3xl border
                                        border-dashed border-[#8b1a30]/20
                                        bg-gradient-to-br
                                        from-[#faf6f8] to-[#fff]
                                    "
                                >
                                    {/* QR corners */}
                                    {[
                                        "top-4 left-4 border-t-2 border-l-2 rounded-tl-xl",
                                        "top-4 right-4 border-t-2 border-r-2 rounded-tr-xl",
                                        "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl",
                                        "bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl",
                                    ].map((cls, i) => (
                                        <span
                                            key={i}
                                            className={`absolute h-6 w-6 ${cls}`}
                                            style={{
                                                borderColor: "#8b1a30",
                                            }}
                                        />
                                    ))}

                                    <div className="opacity-60">
                                        <svg
                                            width="70"
                                            height="70"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="#8b1a30"
                                            strokeWidth="1.2"
                                        >
                                            <rect
                                                x="3"
                                                y="3"
                                                width="7"
                                                height="7"
                                                rx="1"
                                            />
                                            <rect
                                                x="14"
                                                y="3"
                                                width="7"
                                                height="7"
                                                rx="1"
                                            />
                                            <rect
                                                x="3"
                                                y="14"
                                                width="7"
                                                height="7"
                                                rx="1"
                                            />
                                            <rect
                                                x="14"
                                                y="14"
                                                width="3"
                                                height="3"
                                                rx=".5"
                                            />
                                            <rect
                                                x="18"
                                                y="14"
                                                width="3"
                                                height="3"
                                                rx=".5"
                                            />
                                            <rect
                                                x="14"
                                                y="18"
                                                width="3"
                                                height="3"
                                                rx=".5"
                                            />
                                            <rect
                                                x="18"
                                                y="18"
                                                width="3"
                                                height="3"
                                                rx=".5"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <p className="mt-4 text-xs font-medium text-gray-700">
                                    Fast Scan/Touchless Check in
                                </p>

                                {/* <p className="mt-1 text-xs text-gray-400">
                                    Fast touchless visitor registration
                                </p> */}
                            </div>

                            {/* Footer */}
                            <div
                                className="
                                    flex items-center justify-center gap-2
                                    rounded-xl border border-gray-100
                                    bg-gray-50 px-4 py-3
                                "
                            >
                                <Lock
                                    size={15}
                                    className="text-gray-500"
                                />

                                <p className="text-xs text-gray-500">
                                    Your information is encrypted and secure
                                </p>
                            </div>
                        </div>
                    )}

                    {phase === "form" && <VisitorForm setPhase={setPhase}/>}

                    {phase === 'done' && <VisitBookSuccess setPhase={setPhase}/>}
                </div>
            </div>
        </section>
    );
} 