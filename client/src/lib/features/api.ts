import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryWithToast } from "./baseQuery"

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithToast,
    tagTypes: [
        'Auth', 
        'Users',
        'Department',
        'Employees',
        'Appointments',
        'Visitor'
    ],
    endpoints: () => ({})
})