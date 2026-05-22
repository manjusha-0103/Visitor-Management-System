import { useGetDepartmentsQuery, type Department } from "@/lib/features/visitor-check-in/visitorApi";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { CustomInputField, SelectField } from "../form/FormFields";
import { Building, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useAddDepartmentMutation, useDeleteDepartmentMutation } from "@/lib/features/employee/employeeApi";

const departmentSchema = z.object({
    name: z.string().min(2, "Department is required"),

    department_id: z.string().optional(),
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
        watch
    } = useForm<DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: "",
            department_id: ""
        },
    });


    const selectedDepartment = watch("department_id");

    const { data: departments = [], isLoading: deptLoading } = useGetDepartmentsQuery();
    const departmentOptions = departments.map((d) => ({ label: d.name, value: String(d.id) }));

    const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();
    const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

    // const isLoading = isAdding;
    const isLoading = isAdding || isDeleting;

    const onSubmit = async (data: DepartmentFormValues) => {
        console.log(data);
        try {
            await addDepartment(data).unwrap();
            reset();
            onClose(false)
        } catch (err) {
            console.error("error while adding a department.");

        }

    }

    const handleDeleteDepartment = async () => {
        try {
            if (!selectedDepartment) return;

            await deleteDepartment(
                selectedDepartment
            ).unwrap();

            reset({
                name: "",
                department_id: "",
            });

            onClose(false);

        } catch (err) {
            console.error(
                "error while deleting department.",
                err
            );
        }
    };

    return (
        <Sheet
            open={open}
            onOpenChange={onClose}
        >
            <SheetContent className="w-full sm:max-w-md lg:max-w-xl bg-white p-0 flex flex-col">
                <Tabs
                    defaultValue="add"
                    className="h-full flex flex-col"
                >
                    {/* Header */}
                    <SheetHeader className="border-b border-gray-200 p-4 space-y-4">

                        <div>
                            <SheetTitle>
                                Department Management
                            </SheetTitle>

                            <SheetDescription>
                                Add or delete departments
                            </SheetDescription>
                        </div>

                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="add" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
                                Add Department
                            </TabsTrigger>

                            <TabsTrigger value="delete" className="
      text-[#701a40]
      data-[state=active]:bg-[#701a40]
      data-[state=active]:text-white
      data-[state=active]:shadow-none
    ">
                                Delete Department
                            </TabsTrigger>
                        </TabsList>
                    </SheetHeader>

                    {/* ADD TAB */}
                    <TabsContent
                        value="add"
                        className="flex-1 flex flex-col mt-0"
                    >
                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="h-full flex flex-col"
                        >
                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                                <CustomInputField<DepartmentFormValues>
                                    name="name"
                                    label="Department Name"
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
                                        "Update Department"
                                    ) : (
                                        "Add Department"
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
                    </TabsContent>

                    {/* DELETE TAB */}
                    <TabsContent
                        value="delete"
                        className="flex-1 flex flex-col mt-0"
                    >
                        <div className="flex-1 overflow-y-auto p-4 space-y-5">

                            {/* Warning */}
                            {/* <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-red-700">
                                            Delete Department
                                        </h3>

                                        <p className="text-sm text-red-600 leading-relaxed">
                                            Deleting a department will also permanently delete all
                                            employees associated with that department.
                                        </p>
                                    </div>
                                </div>
                            </div> */}

                            {/* Department Select */}
                            <SelectField<DepartmentFormValues>
                                name="department_id"
                                label="Selete department to delete"
                                placeholder={
                                    deptLoading
                                        ? "Loading departments..."
                                        : "Select department to delete"
                                }
                                control={control}
                                options={departmentOptions}
                            />

                        </div>

                        {/* Footer */}
                        <SheetFooter className="flex flex-row items-center w-full border-t border-gray-200 p-4">

                            <Button
                                type="button"
                                variant="destructive"
                                className="basis-1/2"
                                disabled={!selectedDepartment || isDeleting}
                                onClick={handleDeleteDepartment}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Department
                                    </>
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
                    </TabsContent>

                </Tabs>
            </SheetContent>
        </Sheet>
    )
}