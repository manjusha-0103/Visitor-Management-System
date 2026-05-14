import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { ROLES } from "./contants";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const Auth = lazy(() => import("@/pages/Auth"))
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"))
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"))
const DashHome = lazy(() => import("@/components/dash/DashHome"));

const VisitorCheckIn = lazy(() => import("@/components/visitor/VisitorCheckIn"));

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
                    // {
                    //     path: "team",
                    //     element: <ManageTeam />
                    // },
                    // {
                    //     path: "visitor",
                    //     element: <ManageVisitor />
                    // },
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
                        element: <DashHome />
                    },
                    // {
                    //     path: "team",
                    //     element: <ManageTeam />
                    // },
                ]
            }
        ]

    },

    //public pages
    {
        path: "visitor-check-in",
        element: <VisitorCheckIn />
    }
])

export default router;