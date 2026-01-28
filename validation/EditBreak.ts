import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

export const EditBreakSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    nameAR: z
      .string()
      .trim()
      .min(1, t("form.validation.nameAR.required"))
      .refine(
        (val) => /^[a-zA-Z\u0600-\u06FF]{2}/.test(val),
        t("form.validation.nameAR.firstTwoCharsAlphabetic"),
      ),
    nameEN: z
      .string()
      .trim()
      .min(1, t("form.validation.nameEN.required"))
      .refine(
        (val) => /^[a-zA-Z]{2}/.test(val),
        t("form.validation.nameEN.firstTwoCharsAlphabetic"),
      ),
  });

export type EditBreakFormValues = z.infer<ReturnType<typeof EditBreakSchema>>;
