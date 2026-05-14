import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { visitorSchema } from "@/schema";
import { Button } from "../ui/button";
import { CustomInputField, SelectField } from "../form/FormFields";
import { Building2, User, Laptop, Car, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGetDepartmentsQuery, useGetEmployeesQuery, useVisitorCheckInMutation } from "@/lib/features/visitor-check-in/visitorApi";

type VisitorFormValues = z.infer<typeof visitorSchema>;

// Mock data - replace with actual API calls
// const DEPARTMENTS = [
//     { id: "1", name: "Engineering" },
//     { id: "2", name: "Human Resources" },
//     { id: "3", name: "Finance" },
//     { id: "4", name: "Marketing" },
//     { id: "5", name: "Operations" },
//     { id: "6", name: "Sales" },
// ];

// const EMPLOYEES_BY_DEPARTMENT: Record<string, Array<{ id: string; name: string; position: string }>> = {
//     "1": [
//         { id: "e1", name: "Amit Verma", position: "Senior Engineer" },
//         { id: "e2", name: "Priya Sharma", position: "Tech Lead" },
//         { id: "e3", name: "Rajesh Kumar", position: "Engineering Manager" },
//     ],
//     "2": [
//         { id: "e4", name: "Sneha Patel", position: "HR Manager" },
//         { id: "e5", name: "Vikram Singh", position: "Recruiter" },
//     ],
//     "3": [
//         { id: "e6", name: "Anita Desai", position: "Finance Manager" },
//         { id: "e7", name: "Rahul Mehta", position: "Accountant" },
//     ],
//     "4": [
//         { id: "e8", name: "Kavita Joshi", position: "Marketing Head" },
//         { id: "e9", name: "Sanjay Gupta", position: "Content Manager" },
//     ],
//     "5": [
//         { id: "e10", name: "Deepak Rao", position: "Operations Manager" },
//     ],
//     "6": [
//         { id: "e11", name: "Neha Kapoor", position: "Sales Director" },
//         { id: "e12", name: "Arjun Nair", position: "Sales Executive" },
//     ],
// };

interface SectionHeaderItem {
    icon: LucideIcon;
    heading: string;
    color: string;
}

// interface SectionHeaderProp {

// }

function SectionHeader({ icon, heading, color }: SectionHeaderItem) {
    const Icon = icon;
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 ${color} rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{heading}</h3>
        </div>
    )
}

export default function VisitorForm() {

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
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
            employee_id: "",
            department_id: "",
        }
    });

    const hasLaptop = watch("is_laptop");
    const hasVehicle = watch("is_vehicle");
    const watchedDepartment = watch("department_id");

    const { data: departments = [], isLoading: deptLoading } =
        useGetDepartmentsQuery();

    const {
        data: employees = [],
        isLoading: empLoading,
    } = useGetEmployeesQuery(watchedDepartment, {
        skip: !watchedDepartment,
    });

    console.log(departments, employees);



    const [checkInVisitor] = useVisitorCheckInMutation();


    const departmentOptions = departments.map((dept) => ({
        label: dept.name,
        value: String(dept.id),
    }));


    // const employeeOptions = employees.map((emp) => ({
    //   label: `${emp.first_name} ${emp.last_name} - ${emp.position}`,
    //   value: String(emp.id),
    // }));

    const employeeOptions = employees.map((emp) => ({
        label: `${emp.first_name} ${emp.last_name} | ${emp.position} | ${emp.email}`,
        value: String(emp.id),
    }));

    const onSubmit = async (data: VisitorFormValues) => {
  try {
    await checkInVisitor({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,

      company: data.company,
      position: data.position,

      is_laptop: data.is_laptop,
      make: data.make,
      model: data.model,
      serial_no: data.serial_no,

      is_vehicle: data.is_vehicle,
      vehicle_no: data.vehicle_no,

      employee_id: data.employee_id,
    }).unwrap();

    reset();

  } catch (error) {
    console.error(error);
  }
};


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            <div className="space-y-4">

                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8b1a30] to-[#6b1223] bg-clip-text text-transparent">
                        Visitor Registration
                    </h2>
                    <p className="text-gray-600">
                        Please fill in your details to complete the check-in process
                    </p>
                </div>

                {/* Whom to Meet Section - Most Important */}
                <div className="bg-gradient-to-br from-[#8b1a30]/5 to-[#6b1223]/5 rounded-2xl p-6 border-2 border-[#8b1a30]/20">
                    <SectionHeader icon={User} heading={'Whom to meet'} color={'bg-maroon'} />


                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <SelectField<VisitorFormValues>
                            name="department_id"
                            label="Department"
                            placeholder={
                                deptLoading
                                    ? "Loading departments..."
                                    : "Select Department"
                            }
                            control={control}
                            options={departmentOptions}
                        />

                        <SelectField<VisitorFormValues>
                            name="employee_id"
                            label="Employee"
                            placeholder={
                                !watchedDepartment
                                    ? "Select department first"
                                    : empLoading
                                        ? "Loading employees..."
                                        : "Select Employee"
                            }
                            control={control}
                            options={employeeOptions}
                            disabled={!watchedDepartment}
                        />

                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <SectionHeader icon={User} heading={'Personal Information'} color={'bg-cyan-700'} />
                    {/* <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-cyan-700 rounded-lg">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                    </div> */}

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
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <CustomInputField<VisitorFormValues>
                            name="phone"
                            label="Phone Number"
                            placeholder="+91 9876543210"
                            control={control}
                        />

                        <CustomInputField<VisitorFormValues>
                            name="email"
                            type="email"
                            label="Email Address"
                            placeholder="rahul@gmail.com"
                            control={control}
                        />
                    </div>
                </div>


                {/* Company Information */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <SectionHeader icon={Building2} heading={'Company Information'} color={'bg-cyan-700'} />
                    {/* <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-cyan-700 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Company Information</h3>
                    </div> */}

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
                </div>

                {/* Additional Items Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Additional Items (Optional)</h3>

                    {/* Laptop Section */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-[#8b1a30]/30 transition-all">
                        <label className="flex items-center gap-4 p-5 cursor-pointer group">
                            <input
                                type="checkbox"
                                {...register("is_laptop")}
                                className="w-5 h-5 text-[#8b1a30] border-gray-300 rounded focus:ring-[#8b1a30] cursor-pointer"
                            />
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <Laptop className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800 block">Carrying Laptop?</span>
                                    <span className="text-sm text-gray-500">Check if you're bringing a laptop</span>
                                </div>
                            </div>
                        </label>

                        {hasLaptop && (
                            <div className="px-5 pb-5 space-y-4 bg-purple-50/50 border-t border-purple-100">
                                <div className="pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                        placeholder="Inspiron 15"
                                        control={control}
                                        required={false}
                                    />
                                </div>

                                <CustomInputField<VisitorFormValues>
                                    name="serial_no"
                                    label="Serial Number"
                                    placeholder="SN123456789"
                                    control={control}
                                    required={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* Vehicle Section */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-[#8b1a30]/30 transition-all">
                        <label className="flex items-center gap-4 p-5 cursor-pointer group">
                            <input
                                type="checkbox"
                                {...register("is_vehicle")}
                                className="w-5 h-5 text-[#8b1a30] border-gray-300 rounded focus:ring-[#8b1a30] cursor-pointer"
                            />
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <Car className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800 block">Bringing Vehicle?</span>
                                    <span className="text-sm text-gray-500">Check if you need parking</span>
                                </div>
                            </div>
                        </label>

                        {hasVehicle && (
                            <div className="px-5 pb-5 bg-blue-50/50 border-t border-blue-100">
                                <div className="pt-4">
                                    <CustomInputField<VisitorFormValues>
                                        name="vehicle_no"
                                        label="Vehicle Registration Number"
                                        placeholder="MH12AB1234"
                                        control={control}
                                        required={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-white text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                    style={{
                        background: "linear-gradient(135deg, #8b1a30, #6b1223)",
                        boxShadow: "0 8px 24px rgba(139,26,48,0.35)",
                    }}
                >
                    <span className="flex items-center justify-center gap-2">
                        {isSubmitting ? "Submitting..." : "Complete Registration"}
                        {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </span>
                </Button>

                <p className="text-center text-sm text-gray-500">
                    By submitting, you agree to our visitor policies and security protocols
                </p>
            </div>
        </form>
    );
}