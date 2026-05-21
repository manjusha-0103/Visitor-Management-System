import { useEffect } from "react";
import AdminSubHeader from "@/components/AdminSubHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  appointmentApi,
} from "@/lib/features/appointment/appointmentApi";
import { getSocket } from "@/lib/utils/socket";
import { useDispatch } from "react-redux";
import AppointmentTable from "@/components/appointment/AppointmentTable";
import AppointmentReportDownload from "@/components/appointment/AppointmentReportDownload";
// import { selectUser } from "@/lib/features/auth/authSlice";
// import AppointmentDetailSheet from "@/components/appointment/AppointmentDetailSheet";
// import type { AppointmentRow } from "@/types";

const socket = getSocket();

export default function ManageAppointment() {
  const dispatch = useDispatch();
  // const user = useSelector(selectUser);

  // const isReceptionist = user?.role === "receptionist";

  

  useEffect(() => {
    // const refreshAppointments = () => {
    //   walkInQuery.refetch();
    //   preQuery.refetch();
    //   pastQuery.refetch();
    // };

    const refreshAppointments = () => {
      dispatch(
        appointmentApi.util.invalidateTags([
          "Appointments",
        ])
      );
    };

    socket.on("appointment_created", refreshAppointments);
    socket.on("appointment_updated", refreshAppointments);
    socket.on("appointment_checked_out", refreshAppointments);
    socket.on("appointment_pass_set", refreshAppointments);

    return () => {
      socket.off("appointment_created", refreshAppointments);
      socket.off("appointment_updated", refreshAppointments);
      socket.off("appointment_checked_out", refreshAppointments);
      socket.off("appointment_pass_set", refreshAppointments);
    };

  }, [dispatch]);


  return (
    <section className="space-y-5 mb-10">

      <AdminSubHeader
        showBack={true}
        to={"/admin"}
        heading="Manage Appointments"
        subh={"View, approve, reject, check-out appointments"}
      />

     

      <Tabs defaultValue="walkin" className="mt-6 px-4 lg:px-10">
        {/* Tabs + Button Row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <TabsList>
            <TabsTrigger value="walkin" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
              All
            </TabsTrigger>

            <TabsTrigger value="prescheduled" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
              Pre Scheduled
            </TabsTrigger>

          </TabsList>

          <AppointmentReportDownload/>  
        </div>
      
        {/* WALK-IN */}
        <TabsContent value="walkin">
          <AppointmentTable type="walkin" />
        </TabsContent>

        {/* PRE-SCHEDULED */}
        <TabsContent value="prescheduled">
          <AppointmentTable type="prescheduled" />
        </TabsContent>

        {/* PAST */}
        <TabsContent value="past">
          <AppointmentTable type="past" />
        </TabsContent>

      </Tabs>
    </section>
  );
}