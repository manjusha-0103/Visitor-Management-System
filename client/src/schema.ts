import z from "zod";


export const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const visitorSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email"),
  position: z.string(),
  company: z.string().min(1, "Company is required"),
  is_laptop: z.boolean(),

  make: z.string().optional(),
  model: z.string().optional(),
  serial_no: z.string().optional(),
  is_vehicle: z.boolean().optional(),
  vehicle_no: z.string().optional(),
  department_id: z.string().min(1, "Department is required"),
  employee_id: z.string().min(1, "Employee is required"),
});


export const employeeSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .email("Enter a valid email"),

  birth_date: z.date().max(new Date(), { message: "Birthday cannot be in the future" }),

  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(15, "Phone number is too long"),

  company: z
    .string()
    .min(2, "Company name is required"),

  department: z
    .string()
    .min(1, "Department is required"),

  position: z
    .string()
    .min(2, "Position is required"),

  role: z
    .string()
    .min(1, "Role is required"),
});


export const userSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name is required"),

  last_name: z
    .string()
    .min(2, "Last name is required"),

  email: z
    .email("Invalid email"),

  phone: z
    .string()
    .min(10, "Phone number is required"),

  role: z.enum([
    "super_admin",
    "receptionist",
    "visitor",
  ]),
});