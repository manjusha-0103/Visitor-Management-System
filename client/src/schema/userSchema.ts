import z from "zod";

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
    "user",
    // "visitor",
  ]),
});