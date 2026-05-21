import { api } from "../api";
import type { Department } from "../visitor-check-in/visitorApi";

// ─────────────────────────────────────
// TYPES
// ─────────────────────────────────────

export interface AddDepartmentPayload {
  name: string;
}

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

export interface DeleteDepartmentResponse {
  statusCode: number;
  data: Department;
  message: string;
  success: boolean;
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
        url: `/api/v1/super-admin/update-employee/${employee_id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Employees"],
    }),

    addDepartment: builder.mutation<
      Department,
      AddDepartmentPayload
    >({
      query: (body) => ({
        url: "api/v1/super-admin/add-departmemt",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Department"],
    }),

    deleteDepartment: builder.mutation<
      DeleteDepartmentResponse,
      string
    >({
      query: (id) => ({
        url: `/api/v1/super-admin/delete-dept/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        "Department",
        "Employees",
      ],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useAddDepartmentMutation,
  useDeleteDepartmentMutation
} = employeeApi;