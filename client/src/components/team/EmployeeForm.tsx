import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import {
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
} from "lucide-react";

import {
  CustomInputField,
  SelectField,
} from "@/components/form/FormFields";

import {
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  type Employee,
} from "@/lib/features/employee/employeeApi";

import type { Department } from "@/lib/features/visitor-check-in/visitorApi";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "@/schema";


type EmployeeFormValues =
  z.infer<typeof employeeSchema>;

// type EmployeeFormValues = {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   company: string;
//   department: string;
//   position: string;
//   role: string;
// };

interface EmployeeFormSheetProps {
  open: boolean;

  onClose: (
    open: boolean
  ) => void;

  employee?: Employee | null;

  departments: Department[];

  mode?: "add" | "edit";
}

export default function EmployeeForm({
  open,
  onClose,
  employee,
  departments,
  mode = "add",
}: EmployeeFormSheetProps) {
  const isEdit =
    mode === "edit";

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<EmployeeFormValues>({
     resolver: zodResolver(
    employeeSchema
  ),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      department: "",
      position: "",
      role: "employee",
    },
  });

  const [
    addEmployee,
    { isLoading: isAdding },
  ] = useAddEmployeeMutation();

  const [
    updateEmployee,
    { isLoading: isUpdating },
  ] = useUpdateEmployeeMutation();

  const isLoading =
    isAdding || isUpdating;

  // ── Prefill ───────────────────────────────
  useEffect(() => {
    if (employee && isEdit) {
      const names =
        employee.full_name?.split(
          " "
        ) || [];

      reset({
        first_name:
          names[0] || "",

        last_name:
          names[1] || "",

        email:
          employee.email || "",

        phone:
          employee.phone || "",

        company:
          employee.company || "",

        department:
          employee.department || "",

        position:
          employee.position || "",

        role:
          employee.role || "employee",
      });
    } else {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        department: "",
        position: "",
        role: "employee",
      });
    }
  }, [
    employee,
    isEdit,
    reset,
    open,
  ]);

  // ── Submit ───────────────────────────────
  const onSubmit = async (
    values: EmployeeFormValues
  ) => {
    try {
      if (
        isEdit &&
        employee
      ) {
        await updateEmployee({
          employee_id:
            employee.id,
          ...values,
        }).unwrap();
      } else {
        await addEmployee(
          values
        ).unwrap();
      }

      reset();

      onClose(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onClose}
    >
      <SheetContent className="w-full sm:max-w-md lg:max-w-xl bg-white p-0 flex flex-col">
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="border-b border-gray-200 p-4">
            <SheetTitle>
              {isEdit
                ? "Edit Employee"
                : "Add Employee"}
            </SheetTitle>

            <SheetDescription>
              {isEdit
                ? "Update employee information"
                : "Create a new employee account"}
            </SheetDescription>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputField<EmployeeFormValues>
                name="first_name"
                label="First Name"
                placeholder="Rahul"
                control={control}
                icon={User}
              />

              <CustomInputField<EmployeeFormValues>
                name="last_name"
                label="Last Name"
                placeholder="Sharma"
                control={control}
                icon={User}
              />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputField<EmployeeFormValues>
                name="email"
                label="Email"
                placeholder="rahul@gmail.com"
                control={control}
                type="email"
                icon={Mail}
                disabled={isEdit}
              />

              <CustomInputField<EmployeeFormValues>
                name="phone"
                label="Phone"
                placeholder="9876543210"
                control={control}
                icon={Phone}
              />
            </div>

            {/* Company + Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomInputField<EmployeeFormValues>
                name="company"
                label="Company"
                placeholder="VisitMi"
                control={control}
                icon={Building2}
              />

              <CustomInputField<EmployeeFormValues>
                name="position"
                label="Position"
                placeholder="Software Engineer"
                control={control}
                icon={Briefcase}
              />
            </div>

            {/* Department + Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField<EmployeeFormValues>
                name="department"
                label="Department"
                control={control}
                placeholder="Select department"
                options={departments.map(
                  (d) => ({
                    label: d.name,
                    value: d.id,
                  })
                )}
              />

              <SelectField<EmployeeFormValues>
                name="role"
                label="Role"
                control={control}
                options={[
                  {
                    label:
                      "Employee",
                    value:
                      "employee",
                  },
                  {
                    label:
                      "Receptionist",
                    value:
                      "receptionist",
                  },
                ]}
              />
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200 p-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="basis-1/2 bg-maroon hover:bg-maroon-dark"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                  {isEdit
                    ? "Updating..."
                    : "Adding..."}
                </>
              ) : isEdit ? (
                "Update Employee"
              ) : (
                "Add Employee"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="basis-1/2"
              onClick={() =>
                onClose(false)
              }
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}