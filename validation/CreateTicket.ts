import { z } from "zod";
import { useTranslations } from "@/providers/TranslationProvider";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "text/plain",
  "text/csv",
];

export const ACCEPTED_FILE_EXTENSIONS = ".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.mp4,.mov,.webm,.txt,.csv";

export const PRIORITY_OPTIONS = ["High", "Medium", "Low"] as const;
export const CLASSIFICATION_OPTIONS = [
  "Problem",
  "Question",
  "Request",
  "Others",
] as const;

export const CreateTicketSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    subject: z
      .string()
      .trim()
      .min(2, t("form.validation.subjectRequired"))
      .max(250, t("form.validation.subjectMax")),
    departmentId: z
      .string()
      .min(1, t("form.validation.departmentRequired")),
    phone: z
      .string()
      .trim()
      .min(1, t("form.validation.phoneRequired"))
      .regex(/^\d+$/, t("form.validation.phoneInvalid")),
    description: z
      .string()
      .trim()
      .min(2, t("form.validation.descriptionRequired"))
      .max(5000, t("form.validation.descriptionMax")),
    priority: z.enum(PRIORITY_OPTIONS).optional(),
    classification: z.enum(CLASSIFICATION_OPTIONS).optional(),
    file: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, t("form.validation.fileTooLarge"))
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        t("form.validation.fileTypeNotAllowed")
      )
      .optional()
      .or(z.undefined()),
  });

export type CreateTicketFormValues = z.infer<
  ReturnType<typeof CreateTicketSchema>
>;
