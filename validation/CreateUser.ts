import { useTranslations } from "@/providers/TranslationProvider";
import { z } from "zod";

const createUserSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("form.validation.name.required"))
      .min(2, t("form.validation.name.minLength", { min: 2 }))
      .max(50, t("form.validation.name.maxLength", { max: 50 }))
      .regex(/^[a-zA-Z0-9\s\p{P}]+$/u, t("form.validation.name.invalid")),
    email: z
      .string()
      .trim()
      .min(1, t("form.validation.email.required"))
      .email(t("form.validation.email.invalid")),
    ext: z
      .number()
      .int()
      .min(100, t("form.validation.ext.minLength"))
      .max(9999, t("form.validation.ext.maxLength")),
    pin: z
      .string()
      .min(4, t("form.validation.pin.minLength", { min: 4 }))
      .max(4, t("form.validation.pin.maxLength", { min: 4 }))
      .regex(/^\d+$/, t("form.validation.pin.invalid")),
    inbound: z
      .number()
      .int(t("form.validation.inbound.invalid"))
      .min(0, t("form.validation.inbound.invalid"))
      .max(1, t("form.validation.inbound.invalid"))
      .default(1),
    outbound: z
      .number()
      .int(t("form.validation.outbound.invalid"))
      .min(0, t("form.validation.outbound.invalid"))
      .max(1, t("form.validation.outbound.invalid"))
      .default(1),
    voicemail: z
      .number()
      .int(t("form.validation.voicemail.invalid"))
      .min(0, t("form.validation.voicemail.invalid"))
      .max(1, t("form.validation.voicemail.invalid"))
      .default(0),
  });

export type CreateUserSchema = z.infer<ReturnType<typeof createUserSchema>>;
export default createUserSchema;
