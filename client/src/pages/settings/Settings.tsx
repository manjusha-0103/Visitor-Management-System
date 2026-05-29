import { ArrowLeft, User, Lock, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import Profile from "./Profile"
import ChangePassword from "./ChangePassword"
import GoogleCalendarSettings from "./GoogleCalendarSettings"

import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"

type SectionKey = "profile" | "password" | "calendar"

const SECTION_MAP: Record<SectionKey, React.ReactNode> = {
    profile: <Profile />,
    password: <ChangePassword />,
    calendar: <GoogleCalendarSettings />
}

export default function Settings() {

    const user = useSelector(selectUser)

    const NAV_ITEMS = useMemo(() => {

    const items: {
        key: SectionKey
        label: string
        icon: typeof User
    }[] = [
        { key: "profile", label: "Profile", icon: User },
        { key: "password", label: "Password", icon: Lock },
    ]

    // Show calendar only if role is NOT user
    if (user?.role !== "user") {
        items.push({
            key: "calendar",
            label: "Google Calendar",
            icon: CalendarDays,
        })
    }

    return items

}, [user?.role])

    const [active, setActive] = useState<SectionKey>("profile")

    return (
        <section>
            <div className="h-auto sm:h-18 px-4 sm:px-10 py-3 sm:py-0 flex gap-3 sm:gap-4 items-center shadow-md">
                <Link
                    to={'/admin'}
                    className="bg-gold hover:bg-gold-dark p-2 rounded-full shrink-0"
                >
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>

                <div className="-space-y-1 min-w-0">
                    <h1 className="text-base sm:text-lg truncate">
                        Settings
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                        Manage your account, platform config and notification preferences
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-8 px-4 sm:px-6 lg:px-10">

                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 scrollbar-hide">

                        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {

                            const isActive = active === key

                            return (
                                <button
                                    key={key}
                                    onClick={() => setActive(key)}
                                    className={`
                                        flex items-center justify-center lg:justify-start gap-2 lg:gap-3
                                        px-4 py-2.5 rounded-lg text-sm text-left whitespace-nowrap
                                        lg:w-full transition-all
                                        ${isActive
                                            ? "bg-maroon text-white font-medium shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"}
                                    `}
                                >
                                    <Icon size={14} className="shrink-0" />
                                    {label}
                                </button>
                            )
                        })}

                    </nav>
                </aside>

                <main className="flex-1 min-w-0 pb-10">
                    {SECTION_MAP[active]}
                </main>

            </div>
        </section>
    )
}