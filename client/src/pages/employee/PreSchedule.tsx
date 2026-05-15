import { Button } from "@/components/ui/button";
import {
    CustomInputField,
} from "@/components/form/FormFields";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    usePreScheduleVisitorMutation,
} from "@/lib/features/visitor-check-in/visitorApi";

import { visitorSchema } from "@/schema";
import z from "zod";
import { useState } from "react";

import {
    CalendarIcon,
    Clock3,
    Plus,
    Trash2,
} from "lucide-react";

import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { FormLabel } from "@/components/form/FormFields";

const singleVisitorSchema = visitorSchema.pick({
    first_name: true,
    last_name: true,
    phone: true,
    email: true,
    position: true,
    company: true,
});

const formSchema = z.object({
    visitors: z.array(singleVisitorSchema),
});

type FormValues = z.infer<typeof formSchema>;


function VisitorCard({
    index,
    field,
    control,
    remove,
    fieldsLength,
}: any) {

    // const selectedDepartment = watch(
    //     `visitors.${index}.department_id`
    // );

    // const { data: departments = [] } =
    //     useGetDepartmentsQuery();

    // const { data: employees = [] } =
    //     useGetEmployeesQuery(selectedDepartment, {
    //         skip: !selectedDepartment,
    //     });

    // const departmentOptions = departments.map((d) => ({
    //     label: d.name,
    //     value: String(d.id),
    // }));


    // const employeeOptions = employees.map((e: any) => ({
    //     label: `${e.first_name} ${e.last_name}`,
    //     value: String(e.id),
    // }));

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

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField<FormValues>
                    name={`visitors.${index}.department_id`}
                    label="Department"
                    placeholder="Select Department"
                    control={control}
                    options={departmentOptions}
                />

                <SelectField<FormValues>
                    name={`visitors.${index}.employee_id`}
                    label="Employee"
                    placeholder={
                        !selectedDepartment
                            ? "Select department first"
                            : "Select Employee"
                    }
                    control={control}
                    options={employeeOptions}
                    disabled={!selectedDepartment}
                />
            </div> */}
        </div>
    );
}

export default function PreSchedule() {
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const {
        control,
        handleSubmit,
        watch,
        formState: {isSubmitting}
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visitors: [
                {
                    first_name: "",
                    last_name: "",
                    phone: "",
                    email: "",
                    position: "",
                    company: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "visitors",
    });

    const [preScheduleVisitor] =
  usePreScheduleVisitorMutation();

const onSubmit = async (data: FormValues) => {
  if (!date || !time) return;

  const date_time = new Date(
    `${format(date, "yyyy-MM-dd")}T${time}`
  ).toISOString();

  try {
    const res = await preScheduleVisitor({
      date_time,
      visitors: data.visitors,
    }).unwrap();

    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

// const onError = (err    ) => {
//     console.log(err);
    
// }

    return (
        <div className="mx-auto max-w-xl p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <div className="border-b p-4">
                        <h2 className="text-lg font-semibold">
                            Pre Schedule Visitors
                        </h2>

                        <p className="text-sm text-muted-foreground mt-1">
                            Add one or multiple visitors
                        </p>
                    </div>

                    {/* Schedule Section */}
                    <div className="rounded-2xl border bg-white p-4 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Schedule Visit
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Select date and time first
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Date */}
                            <div className="space-y-2">
                                <FormLabel
                                    htmlFor="visit-date"
                                    label="Visit Date"
                                    required
                                />

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="
              h-9 w-full justify-start rounded-md
              border-gray-200 bg-white text-left font-normal
            "
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-[#8b1a30]" />

                                            {date ? (
                                                format(date, "PPP")
                                            ) : (
                                                <span className="text-gray-400">
                                                    Select visit date
                                                </span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="w-auto rounded-2xl p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={(date) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);

                                                return date < today;
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Time */}
                            <div className="space-y-2">
                                <FormLabel
                                    htmlFor="visit-time"
                                    label="Visit Time"
                                    required
                                />

                                <Select value={time} onValueChange={setTime}>
                                    <SelectTrigger className="h-11 w-full rounded-md">
                                        <div className="flex items-center gap-2">
                                            <Clock3 className="h-4 w-4 text-[#8b1a30]" />

                                            <SelectValue placeholder="Select time" />
                                        </div>
                                    </SelectTrigger>

                                    <SelectContent className="max-h-72">
                                        {Array.from({ length: 48 }).map((_, index) => {
                                            const hour = Math.floor(index / 2);

                                            const minute =
                                                index % 2 === 0 ? "00" : "30";

                                            const time24 = `${String(hour).padStart(
                                                2,
                                                "0"
                                            )}:${minute}`;

                                            const hour12 =
                                                hour === 0
                                                    ? 12
                                                    : hour > 12
                                                        ? hour - 12
                                                        : hour;

                                            const ampm =
                                                hour >= 12 ? "PM" : "AM";

                                            return (
                                                <SelectItem
                                                    key={time24}
                                                    value={time24}
                                                >
                                                    {`${String(hour12).padStart(
                                                        2,
                                                        "0"
                                                    )}:${minute} ${ampm}`}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {date && time && (
                        <div className="space-y-5">
                            {fields.map((field, index) => (
                                <VisitorCard
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    control={control}
                                    watch={watch}
                                    remove={remove}
                                    fieldsLength={fields.length}
                                />
                            ))}

                            {/* Add Visitor */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border border-gray-300 hover:border-gray-400"
                                onClick={() =>
                                    append({
                                        first_name: "",
                                        last_name: "",
                                        phone: "",
                                        email: "",
                                        position: "",
                                        company: "",
                                    })
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Another Visitor
                            </Button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t p-4 flex justify-end">
                        <Button
                            type="submit"
                              disabled={isSubmitting}
                            className="min-w-36 bg-maroon hover:bg-maroon-dark"
                        >
                            {/* Schedule Visit */}
                            {isSubmitting
                ? "Submitting..."
                : "Schedule Visit"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}