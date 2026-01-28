import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

export const EditTagSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    nameAR: z
      .string()
      .trim()
      .min(2, t("form.validation.nameAR.minTwoChars")),
    nameEN: z
      .string()
      .trim()
      .min(2, t("form.validation.nameEN.minTwoChars")),
  });

export type EditTagFormValues = z.infer<ReturnType<typeof EditTagSchema>>;
