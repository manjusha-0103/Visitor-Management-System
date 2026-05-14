import { Spinner } from "@/components/ui/spinner"

export default function LoadingSpinner(){
    return(
        <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Spinner className="size-10 text-maroon"/>
        </div>
    )
}