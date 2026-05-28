import { selectUser } from "@/lib/features/auth/authSlice"
import { useSelector } from "react-redux"


export default function GoogleCalendarSettings() {
    const user = useSelector(selectUser)
    const isConnected = user?.google_calendar_connected === true

    const handleConnect = () => {
        window.location.href =
            `http://localhost:5000/?email=${encodeURIComponent(user?.email ?? "")}&redirect=/admin/settings`
            // `${import.meta.env.VITE_SERVER_URL}/?email=${encodeURIComponent(user?.email)}`
    }

    return (
        <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                    Google Calendar Integration
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                    Connect your Google account to automatically create
                    calendar events for visitor appointments and send
                    meeting invitations to employees and visitors.
                </p>
            </div>

            <div className="mt-6 rounded-xl border bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                    <div>
                        <p className="font-medium text-gray-900">
                            Connection Status
                        </p>

                        <p
                            className={`text-sm mt-1 ${
                                isConnected
                                    ? "text-green-600"
                                    : "text-yellow-700"
                            }`}
                        >
                            {isConnected
                                ? "Google Calendar connected successfully"
                                : "Google Calendar is not connected"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleConnect}
                        className="bg-maroon hover:bg-maroon-dark text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        {isConnected
                            ? "Reconnect Google Account"
                            : "Connect Google Account"}
                    </button>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <h3 className="font-medium text-gray-900">
                    What this enables
                </h3>

                <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                    <li>
                        Automatic Google Calendar event creation
                    </li>

                    <li>
                        Meeting invitation emails to visitors
                    </li>

                    <li>
                        Google Meet link generation
                    </li>

                    <li>
                        Appointment reminders and scheduling sync
                    </li>
                </ul>
            </div>
        </div>
    )
}