import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarUI } from "@/components/ui/calendar";

import {
  Search,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";

import React from "react";

import { format } from "date-fns";

type AppointmentType = "walkin" | "prescheduled" | "past";

interface AppointmentFilterProps {
  type: AppointmentType;
  searchInput: string;
  setSearchInput: React.Dispatch<
    React.SetStateAction<string>
  >;
  selectedDate: string;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<string>
  >;

  handleClear: () => void;
}

export default function AppointmentFilters({
  type,
  searchInput,
  setSearchInput,
  selectedDate,
  setSelectedDate,
  handleClear,
}: AppointmentFilterProps) {
  return (
    <section className="mt-2">
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
              setSearchInput(e.target.value)
            }
            placeholder="Search by visitor or employee name or company..."
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

        {/* Date Filter */}
        {
          (type === "prescheduled" || type === "past") &&  (
            <div className="flex items-center gap-1 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`justify-start text-xs text-left font-normal w-full sm:w-55 ${
                  !selectedDate
                    ? "text-muted-foreground"
                    : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {selectedDate ? (
                  format(
                    new Date(selectedDate),
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
                  selectedDate
                    ? new Date(selectedDate)
                    : undefined
                }
                onSelect={(date) =>
                  setSelectedDate(
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

          {selectedDate && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setSelectedDate("")
              }
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
          )
        }
        
      </div>
    </section>
  );
}