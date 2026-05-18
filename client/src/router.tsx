import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { ROLES } from "./contants";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Auth = lazy(() => import("@/pages/Auth"))
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"))
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"))
const DashHome = lazy(() => import("@/components/dash/DashHome"));
const AnalyticsPage = lazy(() => import("@/pages/analytics/AnalyticsPage"))
const ManageAppointment = lazy(() => import("@/pages/appointment/ManageAppointment"))
const VisitorCheckIn = lazy(() => import("@/components/visitor/VisitorCheckIn"));
const PreSchedule = lazy(() => import("@/pages/employee/PreSchedule"))
const ManageTeam = lazy(() => import("@/components/team/ManageTeam"))
const ManageUsers = lazy(() => import("@/pages/users/ManageUser"))

const router = createBrowserRouter([
    //Auth Routes
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/",
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <Auth />
                    },

                ]
            }
        ]
    },

    //Super Admin Routes
    {
        element: <ProtectedRoute allowedRoles={[ROLES.super_admin.role]} />,
        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <DashHome />
                    },
                    {
                        path: "users",
                        element: <ManageUsers />
                    },
                    {
                        path: "team",
                        element: <ManageTeam />
                    },
                    {
                        path: "check-in",
                        element: <ManageAppointment />
                    },
                    {
                        path: "analytics",
                        element: <AnalyticsPage />
                    },
                ]
            }
        ]

    },
    //Receptionist Routes
    {
        element: <ProtectedRoute allowedRoles={[ROLES.receptionist.role]} />,
        children: [
            {
                path: '/receptionist',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <ManageAppointment />
                        // element: <DashHome />
                    },
                    // {
                    //     path: "appointments",
                    //     element: <ManageAppointment />
                    // },
                ]
            }
        ]

    },
    // {
    //     element: <ProtectedRoute allowedRoles={[ROLES.employee.role]} />,
    //     children: [
    //         {
    //             path: '/employee',
    //             element: <AdminLayout />,
    //             children: [
    //                 {
    //                     index: true,
    //                     element: <PreSchedule />
    //                 },
    //             ]
    //         }
    //     ]

    // },

    //public pages
    {
        path: "visitor-check-in",
        element: <VisitorCheckIn />
    },
    {
        path: "employee",
        element: <PreSchedule />
    }
])

export default router;