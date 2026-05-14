import { useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import VisitorForm from "./VisitorForm";
import { Button } from "../ui/button";

export default function VisitorCheckIn() {
    const [phase, setPhase] = useState<"qr" | "form" | "done">("qr");

    return (
        <section
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-maroon to-maroon-dark
            ">
            {/* Decorative blobs */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -left-20
                    -top-20
                    h-72
                    w-72
                    rounded-full
                    opacity-20
                "
                style={{
                    background:
                        "radial-gradient(circle, #ff6ba8 0%, transparent 70%)",
                }}
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-16
                    -right-16
                    h-64
                    w-64
                    rounded-full
                    opacity-15
                "
                style={{
                    background:
                        "radial-gradient(circle, #ff3a7a 0%, transparent 70%)",
                }}
            />

            {/* Card */}
            <div
                className="
                    rounded-3xl
                    w-full
                    max-w-md
                    bg-white
                    space-y-6
                    p-6
                    shadow-2xl
                "
            >
                {
                    phase === 'qr' && (
                        <>
                            {/* Header */}
                            <div className="space-y-2 text-center">
                                <p
                                    className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-maroon
                            "
                                >
                                    Welcome
                                </p>

                                <h1
                                    className="
                                text-3xl
                                font-bold
                                leading-tight
                                text-gray-900
                            "
                                >
                                    Visitor Check-In
                                </h1>

                                <p className="text-sm text-gray-400">
                                    Scan or tap below to get started
                                </p>
                            </div>

                            {/* QR */}
                            <div className="flex justify-center">
                                <div
                                    className="
                                relative
                                flex
                                h-40
                                w-40
                                items-center
                                justify-center
                                rounded-2xl
                            "
                                    style={{
                                        background: "#faf5f7",
                                        border: "2px dashed #e0b8c8",
                                    }}
                                >
                                    {[
                                        "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
                                        "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
                                        "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
                                        "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
                                    ].map((cls, i) => (
                                        <span
                                            key={i}
                                            className={`absolute h-5 w-5 ${cls}`}
                                            style={{ borderColor: "#9b2255" }}
                                        />
                                    ))}

                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                        <svg
                                            width="52"
                                            height="52"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="#701a40"
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

                                        <span className="text-xs font-medium text-maroon">
                                            QR Code
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-gray-300" />

                                <span className="text-xs font-medium text-gray-500">
                                    OR
                                </span>

                                <div className="h-px flex-1 bg-gray-300" />
                            </div>

                            {/* Button */}
                            <Button
                                onClick={() => setPhase("form")}
                                className="
                            group
                            relative
                            h-12
                            w-full
                            overflow-hidden
                            rounded-xl
                            text-sm
                            font-semibold
                            tracking-wide
                            text-white
                            transition-all
                            duration-200
                            active:scale-[0.98]
                        "
                                style={{
                                    background:
                                        "linear-gradient(135deg, #701a40 0%, #9b2255 50%, #c0346a 100%)",
                                }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Fill form manually

                                    <ArrowLeft/>
                                </span>

                                <span
                                    className="
                                absolute
                                inset-0
                                opacity-0
                                transition-opacity
                                duration-300
                                group-hover:opacity-100
                            "
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #5a1430 0%, #801a45 50%, #a0295a 100%)",
                                    }}
                                />
                            </Button>

                            {/* Footer */}
                            <p className="flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                                <Lock size={16}/> Your data is handled securely
                            </p>
                        </>
                    )
                }


                 {
                phase === 'form' && (
                    <VisitorForm/>
                )
            }

            </div>

           


        </section>
    );
}