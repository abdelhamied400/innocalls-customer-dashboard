import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  ext: z
    .number()
    .int()
    .min(1000, "Extension must be 4 digits")
    .max(9999, "Extension must be 4 digits"),
  pin: z
    .string()
    .min(4, "PIN must be 4 characters")
    .max(4, "PIN must be 4 characters"),
  inbound: z.number().int().min(0).max(1).default(1),
  outbound: z.number().int().min(0).max(1).default(1),
  voicemail: z.number().int().min(0).max(1).default(0),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export default createUserSchema;
