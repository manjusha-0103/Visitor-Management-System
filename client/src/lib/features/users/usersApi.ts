import { api } from "../api";
import type { UserRole } from "@/components/user/table/column";
export interface User {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  last_login: string | null;
  created_at: string;
}

export interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersData {
  data: User[];
  pagination: UserPagination;
}

export interface GetAllUsersResponse {
  statusCode: number;
  data: UsersData;
  message: string;
  success: boolean;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      GetAllUsersResponse,
      GetAllUsersParams
    >({
      query: ({
        page = 1,
        limit = 10,
        search,
        role,
      }) => ({
        url: "/api/v1/super-admin/users",
        method: "GET",
        params: {
          page,
          limit,

          ...(search?.trim() && {
            search,
          }),

          ...(role && {
            role,
          }),
        },
      }),

      providesTags: ["Users"],

      extraOptions: {
        skipToast: true,
      },
    }),

    updateUser: builder.mutation({
      query: ({ user_id, ...body }) => ({
        url: `/api/v1/super-admin/update-user/${user_id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation
} = usersApi;