import { z } from "zod";
import { PasswordSchema } from "./shared/Password";
import { useTranslations } from "next-intl";

export const LoginSchema = (t: ReturnType<typeof useTranslations>, tCommon: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z
      .string()
      .min(1, t("form.validation.email.required"))
      .email(t("form.validation.email.invalid")),
    password: PasswordSchema(tCommon),
    userType: z.enum(["user", "agent"], {
      errorMap: () => ({ message: t("form.validation.userType.required") }),
    }),
  });
