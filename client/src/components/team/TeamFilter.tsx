import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Search,
  X,
  Plus,
  Loader2,
  Upload,
  Download,
} from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";

import React from "react";
import { useImportEmployeesMutation } from "@/lib/features/employee/employeeApi";

interface TeamFilterProps {
  searchInput: string;
  setSearchInput: React.Dispatch<
    React.SetStateAction<string>
  >;
  handleClear: () => void;
  onCreate?: () => void;
  onAddDept?: () => void;
  //  onImport?: (
  //   file: File
  // ) => void;

  // isImporting?: boolean;
}

export default function TeamFilters({
  searchInput,
  setSearchInput,
  handleClear,
  onCreate,
  onAddDept,
  // onImport,
  // isImporting
}: TeamFilterProps) {
  // const [
  //   importSummary,
  //   setImportSummary
  // ] = useState<any>(null);

  const [
    importErrors,
    setImportErrors
  ] = useState<any[]>([]);
  const [importEmployees, { isLoading: isImporting }] = useImportEmployeesMutation();

  const handleImport = async (
    file: File
  ) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const res =
        await importEmployees(
          formData
        ).unwrap();

      // setImportSummary(res.data);

      setImportErrors(
        res.data.failed || []
      );


      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };


  const downloadFailedCSV = () => {

    const rows = importErrors.map(
      (item) => ({
        ...item.row,
        reason: item.reason
      })
    );

    const csv =
      Papa.unparse(rows);

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "failed_imports.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <section className="mt-6 px-4 lg:px-10">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
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
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Create Button */}
          <Button
            className="bg-maroon hover:bg-maroon-dark"
            onClick={onAddDept}
          >
            {/* <Plus className="w-4 h-4" /> */}
            Add / Delete Department
          </Button>

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

              {/* {importSummary && (

              <div className="mt-5 rounded-xl border bg-white p-4 space-y-4">

                <h2 className="text-lg font-semibold">
                  Import Summary
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Total Rows
                    </p>

                    <p className="text-2xl font-bold">
                      {importSummary.total}
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm text-green-700">
                      Imported
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      {importSummary.importedCount}
                    </p>
                  </div>

                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      Failed
                    </p>

                    <p className="text-2xl font-bold text-red-700">
                      {importSummary.failedCount}
                    </p>
                  </div>

                </div>

              </div>
            )}

            {importErrors.length > 0 && (

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                <div className="flex items-center justify-between mb-4">

                  <h2 className="text-lg font-semibold text-red-700">
                    Failed Records
                  </h2>

                  <Button
                    variant="destructive"
                    onClick={downloadFailedCSV}
                  >
                    Download Failed CSV
                  </Button>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">
                          Name
                        </th>

                        <th className="text-left py-2">
                          Email
                        </th>

                        <th className="text-left py-2">
                          Department
                        </th>

                        <th className="text-left py-2">
                          Reason
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {importErrors.map(
                        (item, index) => (

                          <tr
                            key={index}
                            className="border-b"
                          >

                            <td className="py-2">
                              {item.row.first_name}{" "}
                              {item.row.last_name}
                            </td>

                            <td className="py-2">
                              {item.email}
                            </td>

                            <td className="py-2">
                              {item.row.department}
                            </td>

                            <td className="py-2 text-red-600">
                              {item.reason}
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>
            )} */}
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
        </div>




      </div>
    </section>
  );
}