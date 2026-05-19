import { api } from "../api";

/* ================= COMMON API RESPONSE ================= */

export interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string;
    success: boolean;
}

/* ================= TYPES ================= */

export interface AnalyticsHeaderResponse {
    total_appointments: number;
    total_walk_ins: number;
    total_preschedule: number;
    total_checkout: number;
    total_pendings: number;
    total_laptop_registered: number;
    vehicles_registered: number;
    total_passes_issued: number;
}

export interface LineChartData {
    date?: string;
    month?: string;
    walkIn: number;
    preScheduled: number;
}

export interface DepartmentTraffic {
    department: string;
    count: number;
}

export interface ApprovalStatus {
    status: string;
    count: number;
    color: string;
}

export interface AnalyticsGraphResponse {
    line_chart: LineChartData[];
    department_traffic: DepartmentTraffic[];
    approval_status: ApprovalStatus[];
}

export interface AnalyticsGraphParams {
    year?: number;
    month?: number;
    last_15_days?: boolean;
}

/* ================= API ================= */

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // HEADER DATA
        getAnalyticsHeader: builder.query<
            ApiResponse<AnalyticsHeaderResponse>,
            void
        >({
            query: () => ({
                url: "/api/v1/analytics/analytics-header",
                method: "GET",
            }),
            extraOptions:{
                skipToast: true
            }
        }),

        // GRAPH DATA
        getAnalyticsGraph: builder.query<
            ApiResponse<AnalyticsGraphResponse>,
            AnalyticsGraphParams
        >({
            query: ({
                year,
                month,
                last_15_days,
            }) => ({
                url: "/api/v1/analytics/graph-data",
                method: "GET",
                params: {
                    ...(year && { year }),
                    ...(month && { month }),
                    ...(last_15_days && {
                        last_15_days: true,
                    }),
                },
            }),
            extraOptions: {
                skipToast: true
            }

        }),
    }),
});

export const {
    useGetAnalyticsHeaderQuery,
    useGetAnalyticsGraphQuery,
} = analyticsApi;