import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { ROLES } from "./contants";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
// import DummyAnalytics from "./pages/analytics/DummyAnalytics";
// import CheckIn from "./pages/admin-check-in/CheckIn";
// import ChangePassword from "./pages/settings/ChangePassword";

const Auth = lazy(() => import("@/pages/Auth"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const DashHome = lazy(() => import("@/components/dash/DashHome"));
const AnalyticsPage = lazy(() => import("@/pages/analytics/AnalyticsPage"))
const ManageAppointment = lazy(() => import("@/pages/appointment/ManageAppointment"))
const VisitorCheckIn = lazy(() => import("@/components/visitor/VisitorCheckIn"));
const PreSchedule = lazy(() => import("@/pages/employee/PreSchedule"))
const ManageTeam = lazy(() => import("@/components/team/ManageTeam"))
const ChangePassword = lazy(() => import("@/pages/settings/ChangePassword"))
const Profile = lazy(() => import("@/pages/settings/Profile"))
const CheckIn = lazy(() => import("@/pages/admin-check-in/CheckIn"))
// const ManageUsers = lazy(() => import("@/pages/users/ManageUser"))

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
            element: <Auth />,
          },
        ],
      },
    ],
  },

  //Super Admin Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.super_admin.role]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashHome />,
          },
          {
            path: "visitors",
            element: <ManageAppointment />,
          },
          {
            path: "team",
            element: <ManageTeam />,
          },
          // {
          //     path: "new-check-in",
          //     element: <CheckIn/>
          // },
          {
            path: "check-in",
            element: <CheckIn />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  //Receptionist Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.user.role]} />,
    children: [
      {
        path: "/user",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            // element: <ManageAppointment />
            element: <DashHome />,
          },
          {
            path: "visitors",
            element: <ManageAppointment />,
          },
          {
            path: "check-in",
            element: <CheckIn />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },

  //public pages
  {
    path: "visitor-check-in",
    element: <VisitorCheckIn />,
  },
  {
    path: "employee",
    element: <PreSchedule />,
  },
  // {
  //     path: "ana",
  //     element: <DummyAnalytics/>
  // }
]);

export default router;
