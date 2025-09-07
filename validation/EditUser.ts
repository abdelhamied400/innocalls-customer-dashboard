import { useTranslations } from "@/providers/TranslationProvider";
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
    password: z
      .string({
        required_error: t("create.form.validation.password.required"),
      })
      .trim()
      .min(8, t("create.form.validation.password.minLength", { min: 8 }))
      // uppercase
      .regex(/[A-Z]/, t("create.form.validation.password.uppercase"))
      // lowercase
      .regex(/[a-z]/, t("create.form.validation.password.lowercase"))
      // number
      .regex(/\d/, t("create.form.validation.password.number"))
      // special character
      .regex(/[%$*!@_\\-]/, t("create.form.validation.password.special"))
      // Only allow supported characters (English letters, digits, allowed symbols)
      .regex(
        /^[a-zA-Z0-9%$*!@_\-]+$/,
        t("create.form.validation.password.unsupportedChars")
      ),
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
      .default(1),
    outbound: z
      .number()
      .int(t("create.form.validation.outbound.invalid"))
      .min(0, t("create.form.validation.outbound.invalid"))
      .default(1),
    voicemail: z
      .number()
      .int(t("create.form.validation.voicemail.invalid"))
      .min(0, t("create.form.validation.voicemail.invalid"))
      .max(1, t("create.form.validation.voicemail.invalid"))
      .default(0),
  });

export type EditUserSchema = z.infer<ReturnType<typeof editUserSchema>>;

// Type for the data sent to the API (password is optional)
export type EditUserSubmitSchema = Omit<EditUserSchema, "password"> & {
  password?: string;
};

export default editUserSchema;
