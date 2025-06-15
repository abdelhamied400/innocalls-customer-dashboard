import { useTranslations } from "next-intl";
import { z } from "zod";

const editUserSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t("create.form.validation.name.required"))
      .min(2, t("create.form.validation.name.minLength", { min: 2 }))
      .max(50, t("create.form.validation.name.maxLength", { max: 50 }))
      .regex(
        /^[a-zA-Z0-9\s\p{P}]+$/u,
        t("create.form.validation.name.invalid")
      ),
    email: z
      .string()
      .trim()
      .min(1, t("create.form.validation.email.required"))
      .email(t("create.form.validation.email.invalid")),
    ext: z
      .number()
      .int()
      .min(100, t("create.form.validation.ext.minLength"))
      .max(9999, t("create.form.validation.ext.maxLength")),
    pin: z
      .string()
      .min(4, t("create.form.validation.pin.minLength", { min: 4 }))
      .max(4, t("create.form.validation.pin.maxLength", { min: 4 }))
      .regex(/^\d+$/, t("create.form.validation.pin.invalid")),
    extensionId: z
      .number()
      .int(t("update.form.validation.extensionId.invalid"))
      .min(1, t("update.form.validation.extensionId.invalid"))
      .optional(),
    inbound: z
      .number()
      .int(t("create.form.validation.inbound.invalid"))
      .min(0, t("create.form.validation.inbound.invalid"))
      .max(1, t("create.form.validation.inbound.invalid"))
      .default(1),
    outbound: z
      .number()
      .int(t("create.form.validation.outbound.invalid"))
      .min(0, t("create.form.validation.outbound.invalid"))
      .max(1, t("create.form.validation.outbound.invalid"))
      .default(1),
    voicemail: z
      .number()
      .int(t("create.form.validation.voicemail.invalid"))
      .min(0, t("create.form.validation.voicemail.invalid"))
      .max(1, t("create.form.validation.voicemail.invalid"))
      .default(0),
  });

export type EditUserSchema = z.infer<ReturnType<typeof editUserSchema>>;
export default editUserSchema;
