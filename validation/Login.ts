import { z } from "zod";
import { PasswordSchema } from "./shared/Password";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email(),
  password: PasswordSchema,
  userType: z.enum(["user", "agent"], {
    errorMap: () => ({ message: "Please select a user type." }),
  }),
});
