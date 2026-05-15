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
  date_time: string;
  visitors: PreScheduleVisitor[];
}

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

      providesTags: ["Employee"],
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
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
  useVisitorCheckInMutation,
  usePreScheduleVisitorMutation
} = visitorApi;