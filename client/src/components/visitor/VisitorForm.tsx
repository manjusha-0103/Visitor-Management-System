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
            phone: "",
            email: "",
            position: "",
            company: "",
            is_laptop: false,
            make: "",
            model: "",
            serial_no: "",
            is_vehicle: false,
            vehicle_no: "",
            employee_id: ""
        }
    });

    const hasLaptop = watch("is_laptop");
    const hasVehicle = watch("is_vehicle");

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
                                name="phone"
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
                                name="company"
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

                        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomInputField<VisitorFormValues>
                                name="host_name"
                                label="Host Name"
                                placeholder="Amit Verma"
                                control={control}
                            />
                        </div> */}

                        <div className="space-y-4 rounded-xl border p-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...register("is_laptop")}
                                />

                                <span className="font-medium">
                                    Carrying Laptop?
                                </span>
                            </label>

                            {hasLaptop && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <CustomInputField<VisitorFormValues>
                                            name="make"
                                            label="Laptop Make"
                                            placeholder="Dell"
                                            control={control}
                                            required={false}
                                        />

                                        <CustomInputField<VisitorFormValues>
                                            name="model"
                                            label="Laptop Model"
                                            placeholder="Inspiron"
                                            control={control}
                                            required={false}
                                        />
                                    </div>

                                    <CustomInputField<VisitorFormValues>
                                        name="serial_no"
                                        label="Serial Number"
                                        placeholder="SN123456"
                                        control={control}
                                        required={false}
                                    />
                                </div>
                            )}
                        </div>


                        <div className="space-y-4 rounded-xl border p-4">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...register("is_vehicle")}
                                />

                                <span className="font-medium">
                                    Carrying Vehicle?
                                </span>
                            </label>

                            {hasVehicle && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <CustomInputField<VisitorFormValues>
                                        name="vehicle_no"
                                        label="Vehicle Number"
                                        placeholder="MH12AB1234"
                                        control={control}
                                        required={false}
                                    />
                                </div>
                            )}
                        </div>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, nobis! Aliquid unde necessitatibus veritatis fugit. Maxime, velit? Voluptatum voluptatem atque qui unde in omnis molestiae sapiente quis exercitationem, nam assumenda veritatis nemo cum beatae dolorem earum laudantium cumque enim labore vel ad nulla iste temporibus quos. Eligendi quae molestiae nemo vitae maiores, quod modi voluptate dignissimos expedita harum pariatur totam, impedit assumenda rem quibusdam! Odit quis ullam porro? Excepturi cum temporibus reiciendis, doloremque inventore unde cumque rem autem impedit, explicabo iure nobis quas consequuntur natus mollitia a nostrum alias deleniti minus facilis, eum libero ea voluptatum? Excepturi, culpa aut? Nulla.</p>

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