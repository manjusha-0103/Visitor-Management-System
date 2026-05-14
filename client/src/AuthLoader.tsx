import { useDispatch, useSelector } from "react-redux"
import React, { useEffect } from "react"
import { clearUser, selectUser, setUser } from "./lib/features/auth/authSlice"
import LoadingSpinner from "./components/LoadinSpinner"
import { useGetMeQuery } from "./lib/features/auth/authApi"

interface AuthLoaderProps {
  children: React.ReactNode
}

export default function AuthLoader({ children }: AuthLoaderProps) {

    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const user = useSelector(selectUser)


    const { data, isLoading } = useGetMeQuery(undefined, {
        skip: !!user,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false
    })

    useEffect(() => {
        if (data?.data) {

            dispatch(setUser(data.data))
        }else if (!isLoading) {
    dispatch(clearUser()) 
  }
    }, [data, dispatch, isLoading])

    if (isLoading && !user) {
        return <LoadingSpinner/>
    }

    return children
}