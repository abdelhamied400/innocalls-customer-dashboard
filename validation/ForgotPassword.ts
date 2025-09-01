import { useTranslations } from "@/providers/TranslationProvider";
import { z } from "zod";

export const ForgotPasswordSchema = (
  t: ReturnType<typeof useTranslations>
) =>
  z.object({
    email: z
      .string()
      .min(2, {
        message: t("form.validation.email.minLength", { min: 2 }),
      })
      .email({
        message: t("form.validation.email.invalid"),
      }),
  });
