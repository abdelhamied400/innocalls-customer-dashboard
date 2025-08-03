import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(2, "Contact name is required"),
  phone: z
    .string()
    .min(2, "Phone number is required")
    .regex(
      /^\+?[0-9]+$/,
      "Invalid phone number format. Only numbers and + are allowed"
    ),
});

export const editContactSchema = createContactSchema;
