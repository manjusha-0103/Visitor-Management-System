import { BadgeCheck, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface VisitBookSuccessProps {
    setPhase: React.Dispatch<
        React.SetStateAction<"qr" | "camera" | "form" | "done">
    >;
}

export default function VisitBookSuccess({
    setPhase,
}: VisitBookSuccessProps) {

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            setPhase("qr");
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };

    }, [setPhase]);

    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-[70vh] flex-col items-center justify-center text-center"
        >

            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 12,
                }}
                className="
                    relative flex h-20 w-20 items-center justify-center
                    rounded-full bg-emerald-50
                "
            >

                {/* Pulse Ring */}
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />

                <div
                    className="
                        relative flex h-14 w-14 items-center justify-center
                        rounded-full bg-emerald-500 shadow-xl
                    "
                >
                    <BadgeCheck size={25} className="text-white" />
                </div>
            </motion.div>

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8"
            >
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Registration Successful
                </p>

                <h2
                    className="
                        mt-2 text-xl font-bold tracking-tight
                        text-gray-900
                    "
                >
                    Your host has been notified
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-5 text-gray-500">
                    Your visitor pass has been created successfully.
                    Please wait for approval or proceed as instructed by reception.
                </p>
            </motion.div>

            {/* Status Card */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="
                    mt-8 w-full max-w-md rounded-2xl border border-emerald-100
                    bg-emerald-50/70 p-4
                "
            >
                <div className="flex justify-center items-center gap-3">
                    <div
                        className="
                            flex h-10 w-10 items-center justify-center
                            rounded-full bg-emerald-500
                        "
                    >
                        <Check size={18} className="text-white" />
                    </div>

                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">
                            Check-in completed
                        </p>

                        <p className="text-xs text-gray-600">
                            Redirecting to home screen in {countdown}s 
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                onClick={() => setPhase("qr")}
                className="
                    mt-6 inline-flex items-center gap-2
                    text-sm font-medium text-[#8b1a30]
                    transition hover:gap-3
                "
            >
                Return now
                <ArrowRight size={16} />
            </motion.button>

        </motion.section>
    );
}