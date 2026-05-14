import type { AuthInitialState, User } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthInitialState = {
    user: null,
    isAuthenticated: false,
    isAuthChecked: false,
    loading: true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isAuthChecked = true;
            state.loading = false
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.isAuthChecked = true;
        },
        updateUserProfile: (state, action: PayloadAction<User>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },
        updateUserPassword: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.password = action.payload
            }
        },
    },

    selectors: {
        selectUser: (state) => state.user,
        selectAuth: (state) => state,
    }
})

export const { selectUser, selectAuth } = authSlice.selectors;

export const { 
    setUser, 
    clearUser,
    updateUserProfile, 
    updateUserPassword, 
} = authSlice.actions;

export default authSlice.reducer;