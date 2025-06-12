import { z } from "zod";
import { PasswordSchema } from "./shared/Password";
import { useTranslations } from "next-intl";

export const ResetPasswordSchema =  (t: ReturnType<typeof useTranslations>, tCommon: ReturnType<typeof useTranslations>) =>
  z
  .object({
    password: PasswordSchema(tCommon),
    passwordConfirm: PasswordSchema(tCommon),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: t('form.validation.passwordConfirm.mismatch'),
    path: ["passwordConfirm"],
  });
