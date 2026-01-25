import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

export const EditTagSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    nameAR: z.string().min(1, t("form.validation.nameAR.required")),
    nameEN: z.string().min(1, t("form.validation.nameEN.required")),
  });

export type EditTagFormValues = z.infer<ReturnType<typeof EditTagSchema>>;
