import { CustomInputField } from "@/components/form/FormFields";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { type FormValues } from "./PreSchedule";

export default function VisitorCard({
    index,
    field,
    control,
    remove,
    fieldsLength,
}: any) {

   
    return (
        <div
            key={field.id}
            className="rounded-2xl border p-4 space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                    Visitor {index + 1}
                </h3>

                {fieldsLength > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInputField<FormValues>
                    name={`visitors.${index}.first_name`}
                    label="First Name"
                    placeholder="Rahul"
                    control={control}
                />

                <CustomInputField<FormValues>
                    name={`visitors.${index}.last_name`}
                    label="Last Name"
                    placeholder="Sharma"
                    control={control}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInputField<FormValues>
                    name={`visitors.${index}.phone`}
                    label="Phone Number"
                    placeholder="+91 9876543210"
                    control={control}
                />

                <CustomInputField<FormValues>
                    name={`visitors.${index}.email`}
                    type="email"
                    label="Email"
                    placeholder="rahul@gmail.com"
                    control={control}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInputField<FormValues>
                    name={`visitors.${index}.company`}
                    label="Company"
                    placeholder="Infosys"
                    control={control}
                />

                <CustomInputField<FormValues>
                    name={`visitors.${index}.position`}
                    label="Position"
                    placeholder="Software Engineer"
                    control={control}
                />
            </div>

        </div>
    );
}