import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

export const OrganizationDetailsSchema = (
  t: ReturnType<typeof useTranslations>,
) =>
  z.object({
    organizationName: z
      .string()
      .trim()
      .min(2, t("form.validation.organizationName.minTwoChars")),
  });

export type OrganizationDetailsFormValues = z.infer<
  ReturnType<typeof OrganizationDetailsSchema>
>;
