import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().min(2, "Contact name is required"),
  phone: z.string().min(2, "Phone number is required"),
});

export const editContactSchema = createContactSchema;
