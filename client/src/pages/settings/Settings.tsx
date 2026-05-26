import { ArrowLeft, User, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import Profile from "./Profile"
import ChangePassword from "./ChangePassword"

const NAV_ITEMS = [
    { key: "profile", label: "Profile", icon: User },
    { key: "password", label: "Password", icon: Lock },
    // { key: "notifications", label: "Notifications", icon: Bell },
    // { key: "platform", label: "Platform settings", icon: Settings2 },
    // { key: "danger", label: "Danger zone", icon: AlertTriangle },
] as const ;

type SectionKey = typeof NAV_ITEMS[number]["key"]


const SECTION_MAP: Record<SectionKey, React.ReactNode> = {
    profile: <Profile />,
    password: <ChangePassword />,
    // notifications: <NotificationsSection />,
    // platform: <PlatformSection />,
    // danger: <DangerSection />,
}

export default function Settings() {
    const [active, setActive] = useState<SectionKey>("profile")

    return (
        <section>
            {/* Same header pattern as ManageDCs, ManageStores */}
            <div className="h-auto sm:h-18 px-4 sm:px-10 py-3 sm:py-0 flex gap-3 sm:gap-4 items-center shadow-md">
                <Link to={'/admin'} className="bg-gold hover:bg-gold-dark p-2 rounded-full shrink-0">
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>

                <div className="-space-y-1 min-w-0">
                    <h1 className="text-base sm:text-lg truncate">Settings</h1>
                    <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                        Manage your account, platform config and notification preferences
                    </p>
                </div>
            </div>

            {/* Two-column layout */}
            <div className=" flex flex-col lg:flex-row gap-4 sm:gap-6 mt-8 px-4 sm:px-6 lg:px-10">

                {/* Sidebar nav */}
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 scrollbar-hide">
                        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                            // const isDanger = key === "danger"
                            const isActive = active === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActive(key)}
                                    className={`
flex items-center justify-center lg:justify-start gap-2 lg:gap-3
px-4 py-2.5 rounded-lg text-sm text-left whitespace-nowrap
 lg:w-full transition-all
${isActive ? "bg-maroon text-white font-medium shadow-sm" : "text-gray-600 hover:bg-gray-100"}
`}
                                >
                                    <Icon size={14} className="shrink-0" />
                                    {label}
                                </button>
                            )
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0 pb-10">
                    {SECTION_MAP[active]}
                </main>

            </div>
        </section>
    )
}