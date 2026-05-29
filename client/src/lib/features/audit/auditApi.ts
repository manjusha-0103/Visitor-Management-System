import { api } from "../api";

export interface AuditRecord {
  id: string;
  created_at: string;
  ip_address: string;
  audit_record: string;
  action: string;
}

export interface AuditPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface GetAllAuditsResponse {
  success: boolean;
  message: string;
  data: {
    data: AuditRecord[];
    pagination: AuditPagination;
  };
}

export interface GetAllAuditsParams {
  page?: number;
  limit?: number;
  action?: string;
  date?: string;
}

export const auditApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getAllAudits: builder.query<
      GetAllAuditsResponse,
      GetAllAuditsParams
    >({
      query: ({
        page = 1,
        limit = 10,
        action,
        date,
      }) => ({
        url: "/api/v1/super-admin/audits",
        method: "GET",

        params: {
          page,
          limit,
          ...(action ? { action } : {}),
          ...(date ? { date } : {}),
        },
      }),
      extraOptions: {
        skipToast: true
      },

      providesTags: ["Audit"],
    }),

  }),
});

export const {
  useGetAllAuditsQuery,
  useLazyGetAllAuditsQuery,
} = auditApi;
