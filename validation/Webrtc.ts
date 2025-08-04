import { useTranslations } from "next-intl";
import { z } from "zod";

export const createContactSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("form.validation.name.required"))
      .min(2, t("form.validation.name.minLength", { min: 2 }))
      .max(50, t("form.validation.name.maxLength", { max: 50 })),
    phone: z
      .string()
      .trim()
      .min(1, t("form.validation.phone.required"))
      .min(2, t("form.validation.phone.minLength", { min: 2 }))
      .max(25, t("form.validation.phone.maxLength", { max: 25 }))
      .regex(/^\d+$/, t("form.validation.phone.invalid")),
  });

export const editContactSchema = createContactSchema;
