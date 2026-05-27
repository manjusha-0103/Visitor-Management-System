import { api } from "../api";
import { clearUser } from "./authSlice";


export interface ChangePasswordPayload {
    old_pass: string;
    new_pass: string;
}

export interface UpdateMePayload {
    first_name?: string;
    last_name?: string;
    phone?: string;
    birth_date?: string | null;
    position?: string;
    company?: string;
    department?: string;
}

export interface ProfileResponse {
    statusCode: number;
    success: boolean;
    message: string;

    data: {
        id: string;
        name: string;
        email: string;
        phone: string;
        birth_date: string | null;
        role: string;

        position?: string;
        company?: string;
        department?: string;
    };
}


export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/signin",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ['Auth']
        }),
        getMe: builder.query({
            query: () => ({
                url: "/api/v1/auth/me"
            }),
            extraOptions: {
                skipToast: true
            },
            providesTags: ['Auth']
        }),
        signOut: builder.mutation<any, void>({
            query: () => ({
                url: "/api/v1/auth/signout",
                method: "POST"
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(clearUser());
                    // dispatch(api.util.resetApiState());
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            },

        }),

        // CHANGE PASSWORD
        changePassword: builder.mutation<
            ProfileResponse,
            ChangePasswordPayload
        >({
            query: (body) => ({
                url: "/api/v1/auth/change-password",
                method: "POST",
                body,
            }),
        }),

        // UPDATE PROFILE
        updateMe: builder.mutation<
            ProfileResponse,
            UpdateMePayload
        >({
            query: (body) => ({
                url: "/api/v1/auth/update-me",
                method: "PUT",
                body,
            }),
            invalidatesTags: ['Auth']
        }),


        // connectGoogleCalendar: builder.mutation<
        //     { url: string },
        //     string
        // >({
        //     query: (empEmail) => ({
        //         url: `/?email=${empEmail}`,
        //         method: "GET",
        //     }),
        // }),


    })
})

export const {
    useSignInMutation,
    useGetMeQuery,
    useSignOutMutation,
    useChangePasswordMutation,
    useUpdateMeMutation,
    // useConnectGoogleCalendarMutation
} = authApi