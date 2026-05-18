import { selectUser } from "@/lib/features/auth/authSlice"
import { RECEPTIONIST_TASKS, SUPER_ADMIN_TASKS } from "@/tasks"
import { useSelector } from "react-redux"
import DashHomeCard from "./DashHomeCard";

export default function DashHome() {
    const user = useSelector(selectUser);
    const isadmin = user?.role === 'super_admin';
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
    </div>
  )
}