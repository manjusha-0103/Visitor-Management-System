import { Button } from "@/components/ui/button";
import { Calendar as CalendarUI } from "@/components/ui/calendar";

import {
  X,
  Calendar as CalendarIcon,
//   Plus,
//   Loader2,
//   Upload,
//   Download,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useState } from "react";
// import Papa from "papaparse";
import { format } from "date-fns";
import React from "react";

interface AuditFilterProps {
  // searchInput: string;
  // setSearchInput: React.Dispatch<
  //   React.SetStateAction<string>
  // >;
  // handleClear: () => void;
   date: string;
    setDate: React.Dispatch<
      React.SetStateAction<string>
    >;
//   onCreate?: () => void;
//   onAddDept?: () => void;
}

export default function AuditFilters({
  // searchInput,
  // setSearchInput,
  // handleClear,
   date,
  setDate,
//   onCreate,
//   onAddDept,
}: AuditFilterProps) {
  

//   const [
//     importErrors,
//     setImportErrors
//   ] = useState<any[]>([]);
//   const [importEmployees, { isLoading: isImporting }] = useImportEmployeesMutation();

//   const handleImport = async (
//     file: File
//   ) => {
//     const formData = new FormData();

//     formData.append("file", file);

//     try {
//       const res =
//         await importEmployees(
//           formData
//         ).unwrap();

//       // setImportSummary(res.data);

//       setImportErrors(
//         res.data.failed || []
//       );


//       console.log(res);
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   const downloadFailedCSV = () => {

//     const rows = importErrors.map(
//       (item) => ({
//         ...item.row,
//         reason: item.reason
//       })
//     );

//     const csv =
//       Papa.unparse(rows);

//     const blob = new Blob(
//       [csv],
//       {
//         type:
//           "text/csv;charset=utf-8;"
//       }
//     );

//     const url =
//       URL.createObjectURL(blob);

//     const link =
//       document.createElement("a");

//     link.href = url;

//     link.setAttribute(
//       "download",
//       "failed_imports.csv"
//     );

//     document.body.appendChild(link);

//     link.click();

//     document.body.removeChild(link);
//   };

  return (
    <section className="mt-6 px-4 lg:px-10">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        {/* Search */}
        {/* <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />

          <Input
            value={searchInput}
            onChange={(e) =>
              setSearchInput(
                e.target.value
              )
            }
            placeholder="Search by employee name or email..."
            className="pl-9 pr-9 bg-transparent border border-input"
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div> */}


        
         
                <div className="flex gap-3 items-center border border-red-300 bg-red-50 py-2.5 px-4 sm:px-6 rounded-xl">
                  {/* <CircleX
                    size={24}
                    className="fill-red-500"
                    stroke="white"
                    strokeWidth={1}
                  />
                  <Lock size={18} stroke="gray" /> */}
                  <p className="text-sm sm:text-md text-gray-700">
                    This log is append-only and cannot be edited or deleted by any user
                    - single source of truth for compliance & forensics.
                  </p>
                </div>


          <div className="flex items-center gap-1 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start text-xs text-left font-normal w-full sm:w-55 ${
                  !date
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {date ? (
                  format(
                    new Date(date),
                    "dd MMM yyyy"
                  )
                ) : (
                  <span>Filter by date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0"
              align="end"
            >
              <CalendarUI
                mode="single"
                selected={
                  date
                    ? new Date(date)
                    : undefined
                }
                onSelect={(date) =>
                  setDate(
                    date
                      ? format(
                          date,
                          "yyyy-MM-dd"
                        )
                      : ""
                  )
                }
                captionLayout="dropdown"
                // initialFocus
              />
            </PopoverContent>
          </Popover>

          {date && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setDate("")
              }
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* <div className="flex flex-wrap gap-3">
        
          <div className="">
            <label>
              <input
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    handleImport(file);
                  }

                  e.target.value = "";
                }}
              />

              <Button
                type="button"
                asChild
                className="bg-maroon hover:bg-maroon-dark cursor-pointer"
                disabled={isImporting}
              >
                <div className="flex gap-2 items-center">
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import Employees
                    </>
                  )}
                </div>
              </Button>

            </label>
            {importErrors.length > 0 && (
              <div className="mt-4 ">

                <p className="text-sm text-red-700">
                  {importErrors.length} records failed to import.
                </p>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={downloadFailedCSV}
                >
                  <Download size={12}/>
                  Download Error File
                </Button>

              </div>
            )}
          </div>

          <Button
            className="bg-maroon hover:bg-maroon-dark"
            onClick={onCreate}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div> */}

      </div>
    </section>
  );
}