import { selectUser } from "@/lib/features/auth/authSlice"
import { RECEPTIONIST_TASKS, SUPER_ADMIN_TASKS } from "@/tasks"
import { useSelector } from "react-redux"
import DashHomeCard from "./DashHomeCard";
import { getSocket } from "@/lib/utils/socket";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import {
  Cake,
  Sparkles,
} from "lucide-react";

const socket = getSocket();

export default function DashHome() {
  const user = useSelector(selectUser);
  const isadmin = user?.role === 'super_admin';

  const [
    birthdayNotification,
    setBirthdayNotification
  ] = useState<{
    title: string;
    message: string;
  }[]>([]);

  useEffect(() => {

    const handleBirthdayNotification = (
      data: {
        title: string;
        message: string;
      }
    ) => {

      setBirthdayNotification((prev) => [
        ...prev,
        data
      ]);
    };

    socket.on(
      "birthdayNotification",
      handleBirthdayNotification
    );

    return () => {

      socket.off(
        "birthdayNotification",
        handleBirthdayNotification
      );
    };

  }, []);

  return (
    <div className="min-h-screen  p-6"
      style={{
        background: `
    radial-gradient(
      circle at 50% 0%,
      var(--color-maroon) 0%,
      var(--color-maroon-dark) 100%
    )
  `
      }}
    >
      <div className="text-center mb-10">
        <p className="text-white/70 text-lg lg:text-xl mt-2 leading-6 tracking-tight">
          {
            isadmin
              ?
              'Manage users, team, appointments and view analytics.'
              :
              'Create walk-in or pre-schedule appointment'
          }
        </p>
      </div>

      {/* Super Admin Task In Card Grid */}
      <DashHomeCard tasks={isadmin ? SUPER_ADMIN_TASKS : RECEPTIONIST_TASKS} />


      {/* Birthday Notification */}
      {birthdayNotification.length > 0 && (

        <div className="fixed bottom-5 right-5 z-50">

          <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-white/95 backdrop-blur shadow-2xl p-3 min-w-[320px]">

            {/* Icon */}
            <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Cake className="w-5 h-5 text-yellow-700" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-sm text-maroon">
                  Birthday Wishes
                </h3>

                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>

              <p className="text-xs text-gray-600 truncate mt-0.5">
                {
                  birthdayNotification[0]
                    ?.message
                }
              </p>

            </div>

            {/* More Button */}
            {birthdayNotification.length > 1 && (

              <Popover>

                <PopoverTrigger asChild>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                  >
                    +{birthdayNotification.length - 1} more
                  </Button>

                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-80 p-0 overflow-hidden"
                >

                  <div className="border-b px-4 py-3 bg-muted/40">

                    <h4 className="font-semibold text-sm">
                      Today's Birthdays 🎉
                    </h4>

                  </div>

                  <div className="max-h-72 overflow-y-auto">

                    {birthdayNotification.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex gap-3 px-4 py-3 border-b last:border-b-0"
                        >

                          <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                            🎂
                          </div>

                          <div>

                            <p className="text-sm font-medium text-gray-800">
                              {item.title}
                            </p>

                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.message}
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </PopoverContent>

              </Popover>
            )}

          </div>

        </div>
      )}

    </div>
  )
}