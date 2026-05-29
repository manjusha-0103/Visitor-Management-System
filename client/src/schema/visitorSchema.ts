import z from "zod";

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
  purpose: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  serial_no: z.string().optional(),
  is_vehicle: z.boolean().optional(),
  vehicle_no: z.string().optional(),
  // department_id: z.string().min(1, "Department is required"),
  employee_id: z.string().min(1, "Employee is required"),
});


export const walkinSchema = visitorSchema.extend({
    purpose: z.string().min(1, "Purpose is required"),
});

export type VisitorFormValues =
    z.infer<typeof visitorSchema>;

export type WalkinFormValues =
    z.infer<typeof walkinSchema>;