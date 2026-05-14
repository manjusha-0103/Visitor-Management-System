import { api } from "../api";
import { clearUser } from "./authSlice";

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

        changePassword: builder.mutation({
            query: ({ id, old_pass, new_pass }) => ({
                url: `/api/v1/auth/reset_pass/${id}`,
                method: "POST",
                body: { old_pass, new_pass },
            }),
        }),
    })
})

export const {
    useSignInMutation,
    useGetMeQuery,
    useSignOutMutation,
    useChangePasswordMutation
} = authApi