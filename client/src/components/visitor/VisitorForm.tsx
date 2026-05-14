import { useFieldArray, useForm } from "react-hook-form";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { visitorSchema } from "@/schema";
import { Button } from "../ui/button";
import { CustomInputField } from "../form/FormFields";

type VisitorFormValues = z.infer<typeof visitorSchema>;

export default function VisitorForm() {
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState,
        // formState: { errors, isSubmitSuccessful },
    } = useForm<VisitorFormValues>({
        resolver: zodResolver(visitorSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            position: "",
            company_name: "",
            has_laptop: false,
            laptops: [
                {
                    laptop_make: "",
                    laptop_model: "",
                    laptop_serial_no: "",
                },
            ],

            has_vehicle: false,
            vehicles: [
                {
                    vehicle_no: "",
                },
            ],
        }
    });

    const hasLaptop = watch("has_laptop");
    const hasVehicle = watch("has_vehicle");

    const {
        fields: laptopFields,
        append: appendLaptop,
        remove: removeLaptop,
    } = useFieldArray({
        control,
        name: "laptops",
    });

    const {
        fields: vehicleFields,
        append: appendVehicle,
        remove: removeVehicle,
    } = useFieldArray({
        control,
        name: "vehicles",
    });


    const onSubmit = (data: VisitorFormValues) => {
        console.log(data);
        
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="">
            <FieldGroup>
                <FieldSet>
                     <FieldLegend>
                        Visitor Information
                    </FieldLegend>

                    <FieldDescription>
                        Enter visitor details below.
                    </FieldDescription>
                    <FieldGroup className="gap-4">
                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomInputField<VisitorFormValues>
                                name="first_name"
                                label="First Name"
                                placeholder="Rahul"
                                control={control}
                            />

                            <CustomInputField<VisitorFormValues>
                                name="last_name"
                                label="Last Name"
                                placeholder="Sharma"
                                control={control}
                            />
                        </div>

                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomInputField<VisitorFormValues>
                                name="phone_number"
                                label="Phone Number"
                                placeholder="+91 9876543210"
                                control={control}
                            />

                            <CustomInputField<VisitorFormValues>
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="rahul@gmail.com"
                                control={control}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomInputField<VisitorFormValues>
                                name="company_name"
                                label="Company Name"
                                placeholder="Infosys"
                                control={control}
                            />

                            <CustomInputField<VisitorFormValues>
                                name="position"
                                label="Position"
                                placeholder="Software Engineer"
                                control={control}
                            />
                        </div>

                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomInputField<VisitorFormValues>
                                name="host_name"
                                label="Host Name"
                                placeholder="Amit Verma"
                                control={control}
                            />

                            <CustomInputField<VisitorFormValues>
                                name="host_department"
                                label="Department"
                                placeholder="Engineering"
                                control={control}
                            />
                        </div>


                        <div className="space-y-4 rounded-xl border p-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...control.register?.("has_laptop")}
                                />

                                <span className="font-medium">
                                    Carrying Laptop?
                                </span>
                            </label>

                            {hasLaptop && (
                                <div className="space-y-5">
                                    {laptopFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="space-y-4 rounded-lg border p-4"
                                        >
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <CustomInputField<VisitorFormValues>
                                                    name={`laptops.${index}.laptop_make`}
                                                    label="Laptop Make"
                                                    placeholder="Dell"
                                                    control={control}
                                                />

                                                <CustomInputField<VisitorFormValues>
                                                    name={`laptops.${index}.laptop_model`}
                                                    label="Laptop Model"
                                                    placeholder="Inspiron"
                                                    control={control}
                                                />
                                            </div>

                                            <CustomInputField<VisitorFormValues>
                                                name={`laptops.${index}.laptop_serial_no`}
                                                label="Serial Number"
                                                placeholder="SN123456"
                                                control={control}
                                            />

                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        removeLaptop(index)
                                                    }
                                                >
                                                    Remove Laptop
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            appendLaptop({
                                                laptop_make: "",
                                                laptop_model: "",
                                                laptop_serial_no: "",
                                            })
                                        }
                                    >
                                        Add Another Laptop
                                    </Button>
                                </div>
                            )}
                        </div>


                        <div className="space-y-4 rounded-xl border p-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...control.register?.("has_vehicle")}
                                />

                                <span className="font-medium">
                                    Carrying Vehicle?
                                </span>
                            </label>

                            {hasVehicle && (
                                <div className="space-y-4">
                                    {vehicleFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="space-y-4 rounded-lg border p-4"
                                        >
                                            <CustomInputField<VisitorFormValues>
                                                name={`vehicles.${index}.vehicle_no`}
                                                label="Vehicle Number"
                                                placeholder="MH12AB1234"
                                                control={control}
                                            />

                                            {index > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        removeVehicle(index)
                                                    }
                                                >
                                                    Remove Vehicle
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            appendVehicle({
                                                vehicle_no: "",
                                            })
                                        }
                                    >
                                        Add Another Vehicle
                                    </Button>
                                </div>
                            )}
                        </div>

                         <Button
                            type="submit"
                            className="btn-signin w-full py-3.5 text-white text-sm font-semibold rounded-[10px] mt-3 tracking-wide cursor-pointer border-none transition-all duration-150"

                            style={{
                                background: "linear-gradient(135deg, #8b1a30, #6b1223)",
                                boxShadow: "0 4px 18px rgba(139,26,48,0.32)",
                            }}
                        >
                            Submit visit request
                        </Button>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </form>
    )
}