import { z } from "zod";
import { PasswordSchema } from "./shared/Password";

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    passwordConfirm: PasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });
