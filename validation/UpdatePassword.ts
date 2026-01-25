import z from "zod";

export const UpdatePasswordSchema = (t: any, tCommon: any) =>
  z
    .object({
      currentPassword: z
        .string()
        .min(8, { message: t("validation.passwordMinLength", { length: 8 }) })
        .max(64, { message: t("validation.passwordMaxLength", { length: 64 }) })
        .regex(/[A-Z]/, { message: t("validation.passwordUppercase") })
        .regex(/[a-z]/, { message: t("validation.passwordLowercase") })
        .regex(/[0-9]/, { message: t("validation.passwordNumber") })
        .regex(/[^A-Za-z0-9]/, {
          message: t("validation.passwordSpecialChar"),
        }),
      newPassword: z
        .string()
        .min(8, { message: t("validation.passwordMinLength", { length: 8 }) })
        .max(64, { message: t("validation.passwordMaxLength", { length: 64 }) })
        .regex(/[A-Z]/, { message: t("validation.passwordUppercase") })
        .regex(/[a-z]/, { message: t("validation.passwordLowercase") })
        .regex(/[0-9]/, { message: t("validation.passwordNumber") })
        .regex(/[^A-Za-z0-9]/, {
          message: t("validation.passwordSpecialChar"),
        }),
      confirmedPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmedPassword, {
      path: ["confirmedPassword"],
      message: tCommon("validation.passwordsMustMatch"),
    });
