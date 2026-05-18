import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import AppointmentTable from "@/components/appointment/AppointmentTable";
import { Plus } from "lucide-react";
import { selectUser } from "@/lib/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import AppointmentForm from "@/components/appointment/AppointmentForm";

const socket = getSocket();

export default function ManageAppointment() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const isReceptionist =
    user?.role === "receptionist";

  const [
    openAppointmentSheet,
    setOpenAppointmentSheet,
  ] = useState(false);

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
        showBack={isReceptionist ? false : true}
        to={"/admin"}
        heading="Manage Appointment"
        subh={"View, filter and add appointments"}
      />

      <AppointmentForm
        open={openAppointmentSheet}
        onClose={
          setOpenAppointmentSheet
        }
      />

      <Tabs defaultValue="walkin" className="mt-6 px-4 lg:px-10">
        {/* Tabs + Button Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <TabsList>
            <TabsTrigger value="walkin" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
              Walk-in
            </TabsTrigger>

            <TabsTrigger value="prescheduled" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
              Pre Scheduled
            </TabsTrigger>

            <TabsTrigger value="past" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
              Past
            </TabsTrigger>
          </TabsList>

          {/* Receptionist Only */}
          {/* {isReceptionist && ( */}
            <Button
              className="bg-maroon hover:bg-maroon-dark"
              onClick={() =>
                setOpenAppointmentSheet(
                  true
                )
              }
            >
              <Plus className="w-4 h-4" />
              Create Appointment
            </Button>
          {/* )} */}
        </div>
        {/* <TabsList>
          <TabsTrigger value="walkin">Walk-in</TabsTrigger>
          <TabsTrigger value="prescheduled">Pre Scheduled</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList> */}
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