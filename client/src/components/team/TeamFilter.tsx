import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Search,
  X,
  Plus,
} from "lucide-react";

import React from "react";

interface TeamFilterProps {
  searchInput: string;
  setSearchInput: React.Dispatch<
    React.SetStateAction<string>
  >;
  handleClear: () => void;
  onCreate?: () => void;
  onAddDept?: () => void;
}

export default function TeamFilters({
  searchInput,
  setSearchInput,
  handleClear,
  onCreate,
  onAddDept
}: TeamFilterProps) {
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
            placeholder="Search employees..."
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

        <div className="space-x-4">
          {/* Create Button */}
          <Button
            className="bg-maroon hover:bg-maroon-dark"
            onClick={onAddDept}
          >
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
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