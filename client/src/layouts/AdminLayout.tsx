// layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";
// import { getSocket } from "@/lib/utils/socket";
// import { useEffect } from "react";
// import { toast } from "sonner";

// const socket = getSocket();

export default function AdminLayout() {

    // useEffect(() => {

    //     const handleBirthdayNotification = (
    //         data: {
    //             title: string;
    //             message: string;
    //         }
    //     ) => {
    //         console.log("kjhkjhkj", data);


    //         toast.success(data.title, {
    //             description: data.message,
    //             duration: 10000,
    //         });
    //     };

    //     socket.on(
    //         "birthdayNotification",
    //         handleBirthdayNotification
    //     );

    //     return () => {

    //         socket.off(
    //             "birthdayNotification",
    //             handleBirthdayNotification
    //         );
    //     };

    // }, []);

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

