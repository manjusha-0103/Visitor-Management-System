import z from "zod";

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

  birth_date: z
    .date("Date of birth is required")
    .max(new Date(), {
      message:
        "Birthday cannot be in the future",
    }),

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