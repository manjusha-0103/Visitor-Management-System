import type { Department } from "@/lib/features/visitor-check-in/visitorApi";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { CustomInputField } from "../form/FormFields";
import { Building, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useAddDepartmentMutation } from "@/lib/features/employee/employeeApi";

const departmentSchema = z.object({
    name: z.string().min(2, "Department is required")
})


type DepartmentFormValues =
    z.infer<typeof departmentSchema>;

interface DepartmentFormSheetProps {
    open: boolean;
    onClose: (
        open: boolean
    ) => void;
    employee?: Department | null;
    departments: Department[];
    mode?: "add" | "edit";
}


export default function DepartmentForm({
    open,
    onClose,
    // employee,
    // departments,
    mode = "add",
}: DepartmentFormSheetProps) {
    const isEdit = mode === "edit";

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: ""
        },
    });

    const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();

    const isLoading = isAdding;
    // const isLoading = isAdding || isUpdating;

    const onSubmit = async(data: DepartmentFormValues) => {
        console.log(data);
        try {
            await addDepartment(data).unwrap();
            reset();
            onClose(false)
        } catch (err) {
            console.error("error while adding a department.");

        }

    }

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
                                ? "Edit Department"
                                : "Add Department"}
                        </SheetTitle>

                        <SheetDescription>
                            {isEdit
                                ? "Update department information"
                                : "Create a new department"}
                        </SheetDescription>
                    </SheetHeader>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <CustomInputField<DepartmentFormValues>
                            name="name"
                            label="Depatment Name"
                            placeholder="Sales"
                            control={control}
                            icon={Building}
                        />
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
    )
}