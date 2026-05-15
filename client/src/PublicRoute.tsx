import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectAuth, selectUser } from "./lib/features/auth/authSlice"
import LoadingSpinner from "./components/LoadinSpinner";


export default function PublicRoute() {
  const { isAuthChecked } = useSelector(selectAuth);
  const user = useSelector(selectUser)
  if (!isAuthChecked) {
    return <LoadingSpinner />
  }

  if (user) {
    if (user.role === "super_admin") {
      return <Navigate to="/admin" replace />
    }

    if (user.role === "receptionist") {
      return <Navigate to="/receptionist" replace />
    }
    if (user.role === "employee") {
      return <Navigate to="/employee" replace />
    }
  }

  return <Outlet />
}