import { z } from "zod";

const editUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  ext: z
    .number()
    .int()
    .refine(
      (val) => val >= 100 && val <= 9999,
      "Extension must be 3 or 4 digits"
    ),
  extensionId: z
    .number()
    .int()
    .min(1, "Extension ID must be a positive integer")
    .optional(),
  pin: z
    .string()
    .min(4, "PIN must be 4 characters")
    .max(4, "PIN must be 4 characters")
    .regex(/^\d{4}$/, "PIN must be numeric"),
  inbound: z.number().int().min(0).max(1).default(1),
  outbound: z.number().int().min(0).max(1).default(1),
  voicemail: z.number().int().min(0).max(1).default(0),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
export default editUserSchema;
