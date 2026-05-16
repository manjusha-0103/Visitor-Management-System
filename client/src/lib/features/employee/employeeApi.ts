import { api } from "../api";

// ─────────────────────────────────────
// TYPES
// ─────────────────────────────────────

export interface Employee {
  id: string;
  user_id: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  last_login: string | null;
  full_name: string;
  department_name: string;
  created_at: string;
  company?: string;
  role?: string;
}

export interface EmployeePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EmployeesData {
  data: Employee[];
  pagination: EmployeePagination;
}

export interface GetAllEmployeesResponse {
  statusCode: number;
  data: EmployeesData;
  message: string;
  success: boolean;
}

export interface GetAllEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

// ─────────────────────────────────────
// API
// ─────────────────────────────────────

export const employeeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query<
      GetAllEmployeesResponse,
      GetAllEmployeesParams
    >({
      query: ({
        page = 1,
        limit = 10,
        search,
        department,
      }) => ({
        url: "/api/v1/super-admin/employees",
        method: "GET",
        params: {
          page,
          limit,
          ...(search?.trim() && {
            search,
          }),
          ...(department && {
            department,
          }),
        },
      }),
      extraOptions: {
        skipToast: true
      },

      providesTags: ["Employees"],
    }),


    addEmployee: builder.mutation({
      query: (body) => ({
        url: "/api/v1/super-admin/add",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Employees"],
    }),

    updateEmployee: builder.mutation({
      query: ({ employee_id, ...body }) => ({
        url: `/api/v1/super-admin/update/${employee_id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Employees"],
    }),


  }),
});

export const {
  useGetAllEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation
} = employeeApi;