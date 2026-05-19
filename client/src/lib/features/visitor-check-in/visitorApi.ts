import { api } from "../api";

export interface Department {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  user_id: string;
  department: string;
  position: string;

  first_name: string;
  last_name: string;
  email: string;
}

export interface CheckInPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  position: string;
  company: string;

  is_laptop?: boolean;
  make?: string;
  model?: string;
  serial_no?: string;

  is_vehicle?: boolean;
  vehicle_no?: string;

  employee_id: string;
}

export interface PreScheduleVisitor {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  position: string;
  company: string;
}

export interface PreSchedulePayload {
  employee_email: string | "";
  date_time: string;
  visitors: PreScheduleVisitor[];
}

type SendOtpPayload = {
  employee_email: string;
};

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

// type VisitorPayload = {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   company?: string;
//   position?: string;
// };

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export const visitorApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET DEPARTMENTS
    getDepartments: builder.query<Department[], void>({
      query: () => ({
        url: "/api/v1/visitors/departments",
        method: "GET",

      }),
      extraOptions: {
        skipToast: true
      },

      transformResponse: (response: ApiResponse<Department[]>) =>
        response.data,

      providesTags: ["Department"],
    }),

    // GET EMPLOYEES BY DEPARTMENT
    getEmployees: builder.query<Employee[], string>({
      query: (dept_id) => ({
        url: `/api/v1/visitors/employees/${dept_id}`,
        method: "GET",
      }),
      extraOptions: {
        skipToast: true
      },

      transformResponse: (response: ApiResponse<Employee[]>) =>
        response.data,

      providesTags: ["Employees"],
    }),

     preScheduleVisitor: builder.mutation<
      ApiResponse,
      PreSchedulePayload
    >({
      query: (body) => ({
        url: "/api/v1/employee/preschedule",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Appointments", "Visitor"],
    }),

    // VISITOR CHECK-IN
    visitorCheckIn: builder.mutation<
      ApiResponse,
      CheckInPayload
    >({
      query: (body) => ({
        url: "/api/v1/visitors/check-in",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Appointments", 'Visitor'],
    }),

     // SEND OTP
    sendOtp: builder.mutation<
      ApiResponse,
      SendOtpPayload
    >({
      query: (body) => ({
        url: "/api/v1/employee/send-otp",
        method: "POST",
        body,
      }),
    }),

    // VERIFY OTP
    verifyOtp: builder.mutation<
      ApiResponse,
      VerifyOtpPayload
    >({
      query: (body) => ({
        url: "/api/v1/employee/verify-otp",
        method: "POST",
        body,
      }),
    }),

  }),
});

export const {
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
  useVisitorCheckInMutation,
  usePreScheduleVisitorMutation,
  useSendOtpMutation,
  useVerifyOtpMutation
} = visitorApi;