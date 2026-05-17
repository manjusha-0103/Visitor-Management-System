import { api } from "../api";
import type { AppointmentRow } from "@/types";

interface AppointmentResponse {
  success: boolean;

  data: AppointmentRow[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetAppointmentsParams {
  type: "walkin" | "prescheduled" | "past";

  page?: number;
  limit?: number;

  // filters
  search?: string;
  is_approve?: boolean | null;
  is_preschedule?: boolean | null;
  date?: string | null;
}

export const appointmentApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ─────────────────────────────────────
    // GET APPOINTMENTS
    // ─────────────────────────────────────
    getAppointments: builder.query<
      AppointmentResponse,
      GetAppointmentsParams
    >({
      query: ({
        type,
        page = 1,
        limit = 10,
        search = "",
        is_approve = null,
        is_preschedule = null,
        date = null,
      }) => {

        const params = new URLSearchParams();

        // required
        params.set("type", type);
        params.set("page", String(page));
        params.set("limit", String(limit));

        // optional
        if (search) {
          params.set("search", search);
        }

        if (is_approve !== null) {
          params.set("is_approve", String(is_approve));
        }

        if (is_preschedule !== null) {
          params.set("is_preschedule", String(is_preschedule));
        }

        if (date) {
          params.set("date", date);
        }

        return {
          url: `/api/v1/appointments/appointments?${params.toString()}`,
          method: "GET",
        };
      },

      providesTags: ["Appointments"],
    }),

    // ─────────────────────────────────────
    // WALK-IN
    // ─────────────────────────────────────
    // getWalkInAppointments: builder.query<
    //   AppointmentResponse,
    //   { page?: number; limit?: number }
    // >({
    //   query: ({ page = 1, limit = 10 }) => ({
    //     url: `api/v1/appointments/walk-in?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),

    //   providesTags: ["Appointments"],
    // }),

    // ─────────────────────────────────────
    // PRE-SCHEDULED
    // ─────────────────────────────────────
    // getPreScheduledAppointments: builder.query<
    //   AppointmentResponse,
    //   { page?: number; limit?: number }
    // >({
    //   query: ({ page = 1, limit = 10 }) => ({
    //     url: `api/v1/appointments/pre-scheduled?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),

    //   providesTags: ["Appointments"],
    // }),

    // ─────────────────────────────────────
    // PAST
    // ─────────────────────────────────────
    // getPastAppointments: builder.query<
    //   AppointmentResponse,
    //   { page?: number; limit?: number }
    // >({
    //   query: ({ page = 1, limit = 10 }) => ({
    //     url: `api/v1/appointments/past?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),

    //   providesTags: ["Appointments"],
    // }),

    // ─────────────────────────────────────
    // SET PASS
    // ─────────────────────────────────────
    setPassId: builder.mutation({
      query: ({ appointment_id, pass_id }) => ({
        url: `/api/v1/receptionist/set-pass/${appointment_id}`,
        method: "PUT",
        body: { pass_id },
      }),

      invalidatesTags: ["Appointments"],
    }),

    // ─────────────────────────────────────
    // CHECK OUT
    // ─────────────────────────────────────
    checkOut: builder.mutation({
      query: (appointment_id) => ({
        url: `/api/v1/receptionist/check-out/${appointment_id}`,
        method: "PUT",
      }),

      invalidatesTags: ["Appointments"],
    }),

    // ─────────────────────────────────────
    // APPROVE APPOINTMENT
    // ─────────────────────────────────────

    approveAppointment: builder.mutation<
      any,
      {
        appointment_id: string;
        is_approve: boolean;
      }
    >({
      query: ({
        appointment_id,
        is_approve,
      }) => ({
        url: `/api/v1/receptionist/is-approve/${appointment_id}`,
        method: "PUT",

        body: {
          is_approve,
        },
      }),

      invalidatesTags: ["Appointments"],
    }),

  }),
});

export const {
  useGetAppointmentsQuery,
  // useGetWalkInAppointmentsQuery,
  // useGetPreScheduledAppointmentsQuery,
  // useGetPastAppointmentsQuery,
  useSetPassIdMutation,
  useApproveAppointmentMutation,
  useCheckOutMutation,
} = appointmentApi;