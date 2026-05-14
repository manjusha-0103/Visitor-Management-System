import { Navigate, Outlet } from "react-router-dom"
import LoadingSpinner from "./components/LoadinSpinner"
import { useSelector } from "react-redux"
import { selectAuth, selectUser } from "./lib/features/auth/authSlice"
import type { UserRole } from "./contants"

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthChecked } = useSelector(selectAuth);
    const user = useSelector(selectUser)
    if (!isAuthChecked) {
        return <LoadingSpinner />
    }


    if (!user) {
        return <Navigate to="/" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}