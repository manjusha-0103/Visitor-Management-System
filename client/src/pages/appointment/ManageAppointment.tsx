import { useEffect, useState } from "react";
import AdminSubHeader from "@/components/AdminSubHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AppointmentDataTable } from "@/components/appointment/table/data-table";
import {
  useGetWalkInAppointmentsQuery,
  useGetPastAppointmentsQuery,
  useGetPreScheduledAppointmentsQuery,
  useSetPassIdMutation,
  useCheckOutMutation,
  appointmentApi,
} from "@/lib/features/appointment/appointmentApi";
import { getSocket } from "@/lib/utils/socket";
import { useDispatch } from "react-redux";
import { pastColumns, preScheduleColumns, walkInColumns } from "@/components/appointment/table/column";


const socket = getSocket();

export default function ManageAppointment() {
  const dispatch = useDispatch();
  const [walkPage, setWalkPage] = useState(1);
  const [prePage, setPrePage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const [walkFilters, setWalkFilters] = useState<any[]>([]);
  const [preFilters, setPreFilters] = useState<any[]>([]);
  const [pastFilters, setPastFilters] = useState<any[]>([]);

  const [setPassIdMutation] =
    useSetPassIdMutation();

  const [checkOutMutation] =
    useCheckOutMutation();

  const walkInQuery = useGetWalkInAppointmentsQuery({
    page: walkPage,
    limit: 10,
  });

  const preQuery = useGetPreScheduledAppointmentsQuery({
    page: prePage,
    limit: 10,
  });

  const pastQuery = useGetPastAppointmentsQuery({
    page: pastPage,
    limit: 10,
  });


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


  const handleSetPass = async (appt: any) => {
    const pass_id = prompt("Enter Pass ID");

    if (!pass_id) return;

    try {
      await setPassIdMutation({
        appointment_id: appt.appointment_id,
        pass_id,
      }).unwrap();

    } catch (error: any) {
      console.error("Failed to set pass");
    }
  };

  const handleCheckOut = async (appointment_id: string) => {
    try {
      await checkOutMutation(appointment_id).unwrap();

    } catch (error: any) {
      console.error("Failed to check out");
    }
  };

  const handleView = (appt: any) => {
    console.log(appt);

    // open modal later
  };

  return (
    <section className="space-y-5 mb-10">

      <AdminSubHeader
        to={"/admin"}
        heading="Manage Appointment"
        subh={"View, filter and add appointments"}
      />

      <Tabs defaultValue="walkin" className="mt-6 px-4 lg:px-10">

        <TabsList>
          <TabsTrigger value="walkin">
            Walk-in
          </TabsTrigger>

          <TabsTrigger value="prescheduled">
            Pre Scheduled
          </TabsTrigger>

          <TabsTrigger value="past">
            Past
          </TabsTrigger>
        </TabsList>

        {/* WALK-IN */}
        <TabsContent value="walkin">

          <AppointmentDataTable
            columns={walkInColumns}
            data={walkInQuery.data?.data ?? []}
            page={walkPage}
            setPage={setWalkPage}
            totalPages={walkInQuery.data?.pagination.totalPages ?? 1}
            onPrevious={() => setWalkPage((p) => Math.max(p - 1, 1))}
            onNext={() => setWalkPage((p) => p + 1)}
            isFetching={walkInQuery.isFetching}
            columnFilters={walkFilters}
            setColumnFilters={setWalkFilters}
            meta={{
  onView: handleView,
  onCheckOut: handleCheckOut,
  onSetPass: handleSetPass,
  // onApprove: handleApprove,
  // onReject: handleReject,
}}
          />

        </TabsContent>

        {/* PRE-SCHEDULED */}
        <TabsContent value="prescheduled">

          <AppointmentDataTable
            columns={preScheduleColumns}
            data={preQuery.data?.data ?? []}
            page={prePage}
            setPage={setPrePage}
            totalPages={preQuery.data?.pagination.totalPages ?? 1}
            onPrevious={() => setPrePage((p) => Math.max(p - 1, 1))}
            onNext={() => setPrePage((p) => p + 1)}
            isFetching={preQuery.isFetching}
            columnFilters={preFilters}
            setColumnFilters={setPreFilters}
            meta={{
              onView: handleView,
              onCheckOut: handleCheckOut,
              onSetPass: handleSetPass,
            }}
          />

        </TabsContent>

        {/* PAST */}
        <TabsContent value="past">

          <AppointmentDataTable
            columns={pastColumns}
            data={pastQuery.data?.data ?? []}
            page={pastPage}
            setPage={setPastPage}
            totalPages={pastQuery.data?.pagination.totalPages ?? 1}
            onPrevious={() => setPastPage((p) => Math.max(p - 1, 1))}
            onNext={() => setPastPage((p) => p + 1)}
            isFetching={pastQuery.isFetching}
            columnFilters={pastFilters}
            setColumnFilters={setPastFilters}
            typeFilterKey="is_preschedule"
            typeOptions={[
              { label: "All types", value: "all" },
              { label: "Walk-in", value: "false" },
              { label: "Pre-scheduled", value: "true" },
            ]}
            meta={{
              onView: handleView,
            }}
          />

        </TabsContent>

      </Tabs>
    </section>
  );
}