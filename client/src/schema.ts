import z from "zod";


export const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const visitorSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),

    position: z.string().optional(),
    company: z.string().optional(),
    employee_id: z.string(),

    is_laptop: z.boolean(),
    make: z.string(),
    model: z.string(),
    serial_no: z.string(),
   
    is_vehicle: z.boolean(),
    vehicle_no: z.string(),
});