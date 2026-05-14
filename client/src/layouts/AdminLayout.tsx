// layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";


export default function AdminLayout() {
    return (
        <div className="app-container">
            {/* Navbar */}
            <Header />

            {/* Page Content */}
            <main className="">
                <Outlet />
            </main>
        </div>
    );
}

