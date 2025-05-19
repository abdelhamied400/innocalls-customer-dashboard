import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email(),
});
