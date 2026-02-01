import { useTranslations } from "@/providers/TranslationProvider";
import { z } from "zod";
import { differenceInDays } from "date-fns";
import { shouldShowQueue } from "@/constants/reports";
import { ReportType } from "@/types/api/report";

const createOneTimeReportSchema = (t: ReturnType<typeof useTranslations>) =>
  z
    .object({
      report: z.string().min(1, t("form.validation.report.required")),
      recipients: z
        .array(z.string().email(t("form.validation.recipients.invalidEmail")))
        .min(1, t("form.validation.recipients.required")),
      fromDate: z.date({
        required_error: t("form.validation.fromDate.required"),
        invalid_type_error: t("form.validation.fromDate.invalid"),
      }),
      toDate: z.date({
        required_error: t("form.validation.toDate.required"),
        invalid_type_error: t("form.validation.toDate.invalid"),
      }),
      queue: z.string().optional(),
      extensions: z.string().optional(),
      sla: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true;
            const num = parseInt(val, 10);
            return !isNaN(num) && num >= 1;
          },
          { message: t("form.validation.sla.invalid") }
        ),
      includeInternalCalls: z.boolean().optional().default(false),
    })
    .superRefine((data, ctx) => {
      const reportType = data.report as ReportType;

      // Validate date range (max 30 days)
      if (data.fromDate && data.toDate) {
        const daysDiff = differenceInDays(data.toDate, data.fromDate);
        if (daysDiff < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("form.validation.dateRange.invalid"),
            path: ["toDate"],
          });
        }
        if (daysDiff > 30) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("form.validation.dateRange.exceeds30Days"),
            path: ["toDate"],
          });
        }
      }

      // Validate queue is required for inbound queue reports
      if (shouldShowQueue(reportType) && (!data.queue || data.queue.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("form.validation.queue.required"),
          path: ["queue"],
        });
      }
    });

export type CreateOneTimeReportSchema = z.infer<
  ReturnType<typeof createOneTimeReportSchema>
>;

export default createOneTimeReportSchema;
