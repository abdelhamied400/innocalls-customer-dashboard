import { useTranslations } from "@/providers/TranslationProvider";
import { z } from "zod";

export const SummarySchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    comment: z.string().trim().min(2, t("form.validation.tags.min")),
    postCallTags: z
      .array(
        z.object({
          label: z.string().min(2).max(100),
          value: z.string().min(2).max(100),
        })
      )
      .min(1, t("form.validation.tags.min")),
  });
