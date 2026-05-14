import type { AdminSubHeadingProp } from "@/types"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"


export default function AdminSubHeader({to, heading,subh}: AdminSubHeadingProp){
    return(
         <div className="min-h-20 lg:min-h-18 py-2 px-4 lg:px-10 flex gap-3 lg:gap-4 items-center shadow-md">
                <Link to={to} className="bg-gold hover:bg-gold-dark p-1 rounded-full">
                    <ArrowLeft className="text-maroon w-4 h-4 lg:w-6 lg:h-6" />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1 flex-1">
                        <h1 className="text-md lg:text-lg mb-0.5 lg:mb-0">{heading}</h1>
                        <p className="text-sm text-gray-500">
                            {subh}
                        </p>
                    </div>
                </div>
            </div>
    )
}

