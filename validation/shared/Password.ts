import { z } from "zod";
import { useTranslations } from "next-intl";

export const PasswordSchema = (t: ReturnType<typeof useTranslations>) =>
  z
    .string()
    .min(8, {
      message: t("form.validation.password.minLength",{ min: 8 }), 
    })
    .regex(/[a-z]/, {
      message: t("form.validation.password.lowercase"),
    })
    .regex(/[A-Z]/, {
      message: t("form.validation.password.uppercase"),
    })
    .regex(/[0-9]/, {
      message: t("form.validation.password.number"),
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: t("form.validation.password.special"),
    });


