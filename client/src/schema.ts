import z from "zod";


export const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const visitorSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),

    licence_class: z.string().optional(),
    position: z.string().optional(),
    company_name: z.string().optional(),

    host_department: z.string().min(1, "Department is required"),
    host_name: z.string().min(1, "Host name is required"),

    has_laptop: z.boolean(),
    laptops: z.array(
        z.object({
            laptop_make: z.string(),
            laptop_model: z.string(),
            laptop_serial_no: z.string(),
        })
    ),

    has_vehicle: z.boolean(),
    vehicles: z.array(
        z.object({
            vehicle_no: z.string(),
        })
    ),
});