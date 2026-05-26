import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Calendar as CalendarIcon,
    Download,
    FileSpreadsheet,
    FileText,
    FileType2,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogDescription,
// } from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDownloadAppointmentsMutation } from "@/lib/features/appointment/appointmentApi";
// import { useState } from "react";

// ─────────────────────────────────────
// ZOD
// ─────────────────────────────────────

const reportSchema = z
    .object({
        fromDate: z.date({
            message: "From date is required",
        }),

        toDate: z.date({
            message: "To date is required",
        }),

        format: z.enum(["csv", "pdf", "xlsx"]),
    })
    .refine(
        (data) => data.fromDate <= data.toDate,
        {
            message:
                "From date cannot be after To date",
            path: ["fromDate"],
        }
    );

type ReportFormValues =
    z.infer<typeof reportSchema>;

export default function AppointmentReportDownload() {
    // const [open, setOpen] = useState(false);

    const [
        downloadAppointments,
        { isLoading }
    ] = useDownloadAppointmentsMutation();

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ReportFormValues>({
        resolver: zodResolver(
            reportSchema
        ),

        defaultValues: {
            format: "xlsx",
        },
    });

    const fromDate =
        watch("fromDate");

    const toDate =
        watch("toDate");

    const formatType =
        watch("format");

    const onSubmit = async (
        values: ReportFormValues
    ) => {

        try {

            const res =
                await downloadAppointments({
                    from_date: format(
                        values.fromDate,
                        "yyyy-MM-dd"
                    ),

                    to_date: format(
                        values.toDate,
                        "yyyy-MM-dd"
                    ),

                    format: values.format,
                }).unwrap();

            if (res?.data?.file_url) {

                window.open(
                    res.data.file_url,
                    "_blank"
                );

                reset({
                    fromDate: undefined,
                    toDate: undefined,
                    format: "xlsx",
                });
            }

        } catch (error) {

            console.error(
                "Failed to download report"
            );
        }
    };

    return (
         <Popover modal={true}>

        <PopoverTrigger asChild>

            <Button
                className="
                    bg-maroon max-w-[100px]
                    hover:bg-maroon-dark
                "
            >
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>

        </PopoverTrigger>

        <PopoverContent
             align="end"
    sideOffset={10}
    className="
        w-[360px]
        p-4
        shadow-md shadow-gray-300
        overflow-visible
    "
        >

            <div className="space-y-4">

                <div>

                    <h3 className="font-semibold text-base">
                        Export Past Appointment Report
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Select date range and format
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="
                flex flex-wrap
                items-start gap-3
            "
                >

                    {/* FROM DATE */}
                    <div className="space-y-1">

                        <p className="text-xs font-medium">
                            From
                        </p>

                        <Popover modal={true}>

                            <PopoverTrigger asChild>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-xs
                                w-[150px]
                                justify-start
                                text-left
                                font-normal
                            "
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />

                                    {fromDate ? (
                                        format(
                                            fromDate,
                                            "PPP"
                                        )
                                    ) : (
                                        <span>
                                            From Date
                                        </span>
                                    )}
                                </Button>

                            </PopoverTrigger>

                            <PopoverContent
                                className="w-auto p-0 z-[100]"
                                align="start"
                                side="bottom"
                                sideOffset={8}
                                avoidCollisions={true}
                            >
                                <Calendar
                                    mode="single"
                                    selected={fromDate}
                                    onSelect={(date) =>
                                        setValue(
                                            "fromDate",
                                            date as Date,
                                            {
                                                shouldValidate: true,
                                            }
                                        )
                                    }
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>

                        </Popover>

                        {errors.fromDate && (
                            <p className="text-xs text-red-500">
                                {
                                    errors.fromDate
                                        .message
                                }
                            </p>
                        )}

                    </div>

                    {/* TO DATE */}
                    <div className="space-y-1">

                        <p className="text-xs font-medium">
                            To
                        </p>

                        <Popover modal={true}>

                            <PopoverTrigger asChild>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-xs 
                                w-[150px]
                                justify-start
                                text-left
                                font-normal
                            "
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />

                                    {toDate ? (
                                        format(
                                            toDate,
                                            "PPP"
                                        )
                                    ) : (
                                        <span>
                                            To Date
                                        </span>
                                    )}
                                </Button>

                            </PopoverTrigger>

                            <PopoverContent
                                className="w-auto p-0 z-[100]"
                                align="start"
                                side="bottom"
                                sideOffset={8}
                                avoidCollisions={true}
                            >
                                <Calendar
                                    mode="single"
                                    selected={toDate}
                                    onSelect={(date) =>
                                        setValue(
                                            "toDate",
                                            date as Date,
                                            {
                                                shouldValidate: true,
                                            }
                                        )
                                    }
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>

                        </Popover>

                        {errors.toDate && (
                            <p className="text-xs text-red-500">
                                {
                                    errors.toDate
                                        .message
                                }
                            </p>
                        )}

                    </div>

                    {/* FORMAT */}
                    <div className="space-y-1">

                        <p className="text-xs font-medium">
                            Format
                        </p>

                        <Select
                            value={formatType}
                            onValueChange={(v) =>
                                setValue(
                                    "format",
                                    v as
                                    | "csv"
                                    | "pdf"
                                    | "xlsx"
                                )
                            }
                        >

                            <SelectTrigger className="w-[140px]">

                                <SelectValue />

                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="xlsx">

                                    <div className="flex items-center gap-2 text-xs">

                                        <FileSpreadsheet className="w-4 h-4" />

                                        XLSX

                                    </div>

                                </SelectItem>

                                <SelectItem value="csv">

                                    <div className="flex items-center gap-2 text-xs">

                                        <FileType2 className="w-4 h-4" />

                                        CSV

                                    </div>

                                </SelectItem>

                                <SelectItem value="pdf">

                                    <div className="flex items-center gap-2 text-xs">

                                        <FileText className="w-4 h-4" />

                                        PDF

                                    </div>

                                </SelectItem>

                            </SelectContent>

                        </Select>

                    </div>

                    {/* BUTTON */}
                    <div className="pt-6">

                        <Button
                            type="submit"
                            disabled={
                                !fromDate ||
                                !toDate ||
                                isLoading
                            }
                            className="
                        bg-maroon text-xs
                        hover:bg-maroon-dark
                    "
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Downloading
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </>
                            )}
                        </Button>

                    </div>

                </form>
           </div>
           </PopoverContent>
           </Popover>
    );
}























// import { format } from "date-fns";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//     Calendar as CalendarIcon,
//     Download,
//     FileSpreadsheet,
//     FileText,
//     FileType2,
//     Loader2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { useDownloadAppointmentsMutation } from "@/lib/features/appointment/appointmentApi";

// // ─────────────────────────────────────
// // ZOD
// // ─────────────────────────────────────

// const reportSchema = z
//     .object({
//         fromDate: z.date({
//             message: "From date is required",
//         }),

//         toDate: z.date({
//             message: "To date is required",
//         }),

//         format: z.enum(["csv", "pdf", "xlsx"]),
//     })
//     .refine(
//         (data) => data.fromDate <= data.toDate,
//         {
//             message:
//                 "From date cannot be after To date",
//             path: ["fromDate"],
//         }
//     );

// type ReportFormValues =
//     z.infer<typeof reportSchema>;

// export default function AppointmentReportDownload() {
//     const [
//         downloadAppointments,
//         { isLoading }
//     ] = useDownloadAppointmentsMutation();

//     const {
//         handleSubmit,
//         setValue,
//         watch,
//         reset,
//         formState: { errors },
//     } = useForm<ReportFormValues>({
//         resolver: zodResolver(
//             reportSchema
//         ),

//         defaultValues: {
//             format: "xlsx",
//         },
//     });

//     const fromDate = watch("fromDate");
//     const toDate = watch("toDate");
//     const formatType = watch("format");

//     const onSubmit = async (
//         values: ReportFormValues
//     ) => {
//         try {
//             const res =
//                 await downloadAppointments({
//                     from_date: format(
//                         values.fromDate,
//                         "yyyy-MM-dd"
//                     ),

//                     to_date: format(
//                         values.toDate,
//                         "yyyy-MM-dd"
//                     ),

//                     format: values.format,
//                 }).unwrap();

//             if (res?.data?.file_url) {
//                 window.open(
//                     res.data.file_url,
//                     "_blank"
//                 );

//                 reset({
//                     fromDate: undefined,
//                     toDate: undefined,
//                     format: "xlsx",
//                 });
//             }
//         } catch (error) {
//             console.error(
//                 "Failed to download report"
//             );
//         }
//     };

//     return (
//         <Popover modal={true}>
//             <PopoverTrigger asChild>
//                 <Button
//                     className="
//                         bg-maroon max-w-[100px]
//                         hover:bg-maroon-dark
//                     "
//                 >
//                     <Download className="w-4 h-4 mr-2" />
//                     Export
//                 </Button>
//             </PopoverTrigger>

//             <PopoverContent
//                 align="end"
//                 sideOffset={10}
//                 className="
//                     w-[360px]
//                     p-4
//                     shadow-md shadow-gray-300
//                     overflow-visible
//                     z-[60]
//                 "
//             >
//                 <div className="space-y-4">
//                     <div>
//                         <h3 className="font-semibold text-base">
//                             Export Past Appointment Report
//                         </h3>

//                         <p className="text-sm text-muted-foreground">
//                             Select date range and format
//                         </p>
//                     </div>

//                     <form
//                         onSubmit={handleSubmit(onSubmit)}
//                         className="
//                             flex flex-wrap
//                             items-start gap-3
//                         "
//                     >
//                         {/* FROM DATE */}
//                         <div className="space-y-1">
//                             <p className="text-xs font-medium">
//                                 From
//                             </p>

//                             <Popover modal={true}>
//                                 <PopoverTrigger asChild>
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         className="text-xs
//                                             w-[150px]
//                                             justify-start
//                                             text-left
//                                             font-normal
//                                         "
//                                     >
//                                         <CalendarIcon className="mr-2 h-4 w-4" />

//                                         {fromDate ? (
//                                             format(
//                                                 fromDate,
//                                                 "PPP"
//                                             )
//                                         ) : (
//                                             <span>
//                                                 From Date
//                                             </span>
//                                         )}
//                                     </Button>
//                                 </PopoverTrigger>

//                                 <PopoverContent
//                                     className="w-auto p-0 z-[120]"
//                                     align="start"
//                                     side="bottom"
//                                     sideOffset={8}
//                                     avoidCollisions={true}
//                                     collisionPadding={20}
//                                     sticky="always"
//                                 >
//                                     <Calendar
//                                         mode="single"
//                                         selected={fromDate}
//                                         onSelect={(date) =>
//                                             setValue(
//                                                 "fromDate",
//                                                 date as Date,
//                                                 {
//                                                     shouldValidate: true,
//                                                 }
//                                             )
//                                         }
//                                         // initialFocus
//                                     />
//                                 </PopoverContent>
//                             </Popover>

//                             {errors.fromDate && (
//                                 <p className="text-xs text-red-500">
//                                     {
//                                         errors.fromDate
//                                             .message
//                                     }
//                                 </p>
//                             )}
//                         </div>

//                         {/* TO DATE */}
//                         <div className="space-y-1">
//                             <p className="text-xs font-medium">
//                                 To
//                             </p>

//                             <Popover modal={true}>
//                                 <PopoverTrigger asChild>
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         className="text-xs 
//                                             w-[150px]
//                                             justify-start
//                                             text-left
//                                             font-normal
//                                         "
//                                     >
//                                         <CalendarIcon className="mr-2 h-4 w-4" />

//                                         {toDate ? (
//                                             format(
//                                                 toDate,
//                                                 "PPP"
//                                             )
//                                         ) : (
//                                             <span>
//                                                 To Date
//                                             </span>
//                                         )}
//                                     </Button>
//                                 </PopoverTrigger>

//                                 <PopoverContent
//                                     className="w-auto p-0 z-[120]"
//                                     align="start"
//                                     side="bottom"
//                                     sideOffset={8}
//                                     avoidCollisions={true}
//                                     collisionPadding={20}
//                                     sticky="always"
//                                 >
//                                     <Calendar
//                                         mode="single"
//                                         selected={toDate}
//                                         onSelect={(date) =>
//                                             setValue(
//                                                 "toDate",
//                                                 date as Date,
//                                                 {
//                                                     shouldValidate: true,
//                                                 }
//                                             )
//                                         }
//                                         // initialFocus
//                                     />
//                                 </PopoverContent>
//                             </Popover>

//                             {errors.toDate && (
//                                 <p className="text-xs text-red-500">
//                                     {
//                                         errors.toDate
//                                             .message
//                                     }
//                                 </p>
//                             )}
//                         </div>

//                         {/* FORMAT */}
//                         <div className="space-y-1">
//                             <p className="text-xs font-medium">
//                                 Format
//                             </p>

//                             <Select
//                                 value={formatType}
//                                 onValueChange={(v) =>
//                                     setValue(
//                                         "format",
//                                         v as
//                                         | "csv"
//                                         | "pdf"
//                                         | "xlsx"
//                                     )
//                                 }
//                             >
//                                 <SelectTrigger className="w-[140px]">
//                                     <SelectValue />
//                                 </SelectTrigger>

//                                 <SelectContent>
//                                     <SelectItem value="xlsx">
//                                         <div className="flex items-center gap-2 text-xs">
//                                             <FileSpreadsheet className="w-4 h-4" />
//                                             XLSX
//                                         </div>
//                                     </SelectItem>

//                                     <SelectItem value="csv">
//                                         <div className="flex items-center gap-2 text-xs">
//                                             <FileType2 className="w-4 h-4" />
//                                             CSV
//                                         </div>
//                                     </SelectItem>

//                                     <SelectItem value="pdf">
//                                         <div className="flex items-center gap-2 text-xs">
//                                             <FileText className="w-4 h-4" />
//                                             PDF
//                                         </div>
//                                     </SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* BUTTON */}
//                         <div className="pt-6">
//                             <Button
//                                 type="submit"
//                                 disabled={
//                                     !fromDate ||
//                                     !toDate ||
//                                     isLoading
//                                 }
//                                 className="
//                                     bg-maroon text-xs
//                                     hover:bg-maroon-dark
//                                 "
//                             >
//                                 {isLoading ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                         Downloading
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Download className="w-4 h-4 mr-2" />
//                                         Download
//                                     </>
//                                 )}
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </PopoverContent>
//         </Popover>
//     );
// }