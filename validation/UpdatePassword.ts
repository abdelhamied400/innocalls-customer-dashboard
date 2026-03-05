import z from "zod";

export const UpdatePasswordSchema = (t: any, tCommon: any) =>
  z
    .object({
      currentPassword: z
        .string()
        .trim()
        .min(1, { message: t("form.validation.currentPassword.required") }),
      newPassword: z
        .string()
        .trim()
        .min(8, {
          message: t("form.validation.newPassword.minLength", { min: 8 }),
        })
        .max(64, {
          message: t("form.validation.newPassword.maxLength", { max: 64 }),
        })
        .regex(/[A-Z]/, { message: t("form.validation.newPassword.uppercase") })
        .regex(/[a-z]/, { message: t("form.validation.newPassword.lowercase") })
        .regex(/[0-9]/, { message: t("form.validation.newPassword.number") })
        .regex(/[^A-Za-z0-9]/, {
          message: t("form.validation.newPassword.specialChar"),
        }),
      confirmedPassword: z.string().trim(),
    })
    .refine((data) => data.newPassword === data.confirmedPassword, {
      path: ["confirmedPassword"],
      message: t("form.validation.confirmPassword.mismatch"),
    });
