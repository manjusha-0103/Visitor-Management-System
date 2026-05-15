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

export const appointmentApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ─────────────────────────────────────
    // WALK-IN
    // ─────────────────────────────────────
    getWalkInAppointments: builder.query<
      AppointmentResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `api/v1/appointments/walk-in?page=${page}&limit=${limit}`,
        method: "GET",
      }),

      providesTags: ["Appointments"],
    }),

    // ─────────────────────────────────────
    // PRE-SCHEDULED
    // ─────────────────────────────────────
    getPreScheduledAppointments: builder.query<
      AppointmentResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `api/v1/appointments/pre-scheduled?page=${page}&limit=${limit}`,
        method: "GET",
      }),

      providesTags: ["Appointments"],
    }),

    // ─────────────────────────────────────
    // PAST
    // ─────────────────────────────────────
    getPastAppointments: builder.query<
      AppointmentResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `api/v1/appointments/past?page=${page}&limit=${limit}`,
        method: "GET",
      }),

      providesTags: ["Appointments"],
    }),

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

  }),
});

export const {
  useGetWalkInAppointmentsQuery,
  useGetPreScheduledAppointmentsQuery,
  useGetPastAppointmentsQuery,
  useSetPassIdMutation,
  useCheckOutMutation,
} = appointmentApi;