import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const CreateTicketSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    subject: z
      .string()
      .trim()
      .min(1, t("form.validation.subjectRequired"))
      .max(255, t("form.validation.subjectMax")),
    departmentId: z
      .string()
      .min(1, t("form.validation.departmentRequired")),
    description: z
      .string()
      .trim()
      .min(1, t("form.validation.descriptionRequired")),
    file: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, t("form.validation.fileTooLarge"))
      .optional()
      .or(z.undefined()),
  });

export type CreateTicketFormValues = z.infer<
  ReturnType<typeof CreateTicketSchema>
>;
