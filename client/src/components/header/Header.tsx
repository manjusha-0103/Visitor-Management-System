import { Link, useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { selectUser } from "@/lib/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useSignOutMutation } from "@/lib/features/auth/authApi";
import { ROLES } from "@/contants";
// import { useGetAlertsQuery } from "@/lib/features/alerts/alertApi";

export default function Header() {
  const user = useSelector(selectUser);
  console.log("Authenticated user", user);
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();

    const handleLogout = async () => {
    console.log('logout');

    try {
      await signOut().unwrap();
      navigate('/')
    } catch (err) {
      console.error("Error while logging out: ", err);

    }
  }

  return (
    <div className="bg-zinc-100 sticky top-0 z-50">
      {/* Navbar */}
      <nav className="w-full px-4 lg:px-6 h-16 flex items-center justify-between bg-maroon shadow-lg">

        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500 text-maroon border-2 border-orange-200 font-bold text-lg shadow-md">
            I
          </div>

          <Link to="/admin" className="flex flex-col leading-tight">
            <span className="font-bold text-white text-lg">
              Iravya
            </span>
            {/* <span className="text-sm font-semibold tracking-widest uppercase text-rose-200">
              Manager
            </span> */}
          </Link>
        </div>

      <div className="flex items-center gap-3">

        {/* <Link to={alertPath} className="relative">
                <Bell size={20} stroke="white" />
                {
                  hasUnread && (
                    <span className="inline-block w-2 h-2 absolute -top-0.5 right-0 bg-amber-500 rounded-full"></span>
                  )
                }
              </Link> */}

               {/* Right: User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm font-semibold text-white tracking-wide">
                {user ?
                  `${user.first_name} ${user.last_name} - (${ROLES[user.role].text})`
                  :
                  "Admin Manager"
                }
              </span>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-transparent focus-visible:ring-0"
              >

                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-amber-500 text-maroon font-bold border-2 border-orange-200">
                    {/* SA */}
                    {user?.first_name.charAt(0) || "A"}{user?.last_name.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 mt-2"
          >
            {/* Optional user info */}
            {/* 
            <div className="px-3 py-2 text-sm">
              <p className="font-semibold">Admin Manager</p>
              <p className="text-xs text-muted-foreground">
                admin@iravya.com
              </p>
            </div>
            <DropdownMenuSeparator />
            */}

            <DropdownMenuItem 
                // onClick={handleLogout} 
                className="text-red-500 focus:text-red-600">
              
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
       
      </nav>
    </div>
  );
}