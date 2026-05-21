import { useState } from "react";
import {
    ArrowRight,
    Building2,
    Lock,
} from "lucide-react";
import VisitorForm from "./VisitorForm";
import { Button } from "../ui/button";
import VisitBookSuccess from "./VisitBookSuccess";
import CheckInQRCode from "./CheckInQRCode";
import FaceCapture from "./FaceCapture";

const CHECK_IN_URL =
    (import.meta as any).env?.VITE_CHECKIN_URL ?? window.location.href;

export default function VisitorCheckIn() {
    const isMobile =
        window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

    const [phase, setPhase] = useState<
        "qr" | "camera" | "form" | "done"
    >(
        isMobile ? "camera" : "qr"
    );
    const [capturedImage, setCapturedImage] =
        useState<string | null>(null);

    const [capturedFile, setCapturedFile] =
        useState<File | null>(null);

    return (
        <section
            className="
                relative flex min-h-screen items-center justify-center overflow-hidden
                px-4 py-8
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
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-pink-400/10 blur-3xl" />

                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-pink-300/10 blur-3xl" />
            </div>

            {/* Main Card */}
            <div
                className="
                    relative z-10 w-full max-w-lg min-h-[90vh] overflow-hidden bg-white rounded-xl
                    border border-gray-200 shadow-2xl
                "
            >
                <div className="max-w-lg">
                    {/* Top Header */}
                    <div
                        className="
                        flex items-center justify-between
                        border-b border-gray-100 px-6 py-3
                    "
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                flex h-10 w-10 items-center justify-center rounded-full
                                bg-linear-to-br from-[#8b1a30] to-[#6b1223]
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
                    <div className="h-full overflow-y-auto p-4">
                        {phase === "qr" && (
                            <div className="space-y-3">
                                {/* Hero */}
                                <div className="text-center">
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
                                <div className="space-y-3 text-center">
                                    <Button
                                        onClick={() => setPhase("camera")}
                                        className="
                                        min-w-xs rounded-full text-sm font-semibold
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
                                <div className="flex items-center gap-3 max-w-sm justify-center mx-auto">
                                    <div className="h-px flex-1 bg-gray-200" />

                                    <span className="text-xs text-gray-400">
                                        OR
                                    </span>

                                    <div className="h-px flex-1 bg-gray-200" />
                                </div>

                                {/* ── Real QR code ── */}
                                <CheckInQRCode checkInUrl={CHECK_IN_URL} />
                                {/* Footer */}
                                <div
                                    className="
                                    flex items-center justify-center gap-2
                                    rounded-xl border border-gray-100
                                    bg-gray-100 px-4 py-2
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

                        {phase === "camera" && (
                            <FaceCapture
                                onComplete={(file, preview) => {
                                    setCapturedFile(file);

                                    setCapturedImage(preview);

                                    setPhase("form");
                                }}
                            />
                        )}

                        {phase === "form" && <VisitorForm
                            setPhase={setPhase}
                            capturedImage={capturedImage}
                            capturedFile={capturedFile}
                        />}

                        {phase === 'done' && <VisitBookSuccess setPhase={setPhase} />}
                    </div>

                </div>
            </div>
        </section>
    );
} 