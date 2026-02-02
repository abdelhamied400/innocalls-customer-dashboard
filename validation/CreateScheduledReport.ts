import { useTranslations } from "@/providers/TranslationProvider";
import { z } from "zod";
import { shouldShowQueue } from "@/constants/reports";
import { ReportType } from "@/types/api/report";

const createScheduledReportSchema = (t: ReturnType<typeof useTranslations>) =>
  z
    .object({
      // Step 1: Report Details
      name: z.string().min(1, t("form.validation.name.required")),
      recipients: z
        .array(z.string().email(t("form.validation.recipients.invalidEmail")))
        .min(1, t("form.validation.recipients.required")),
      emailSubject: z.string().min(1, t("form.validation.emailSubject.required")),
      report: z.string().min(1, t("form.validation.report.required")),
      dateRangeStart: z.string().min(1, t("form.validation.dateRangeStart.required")),
      dateRangeEnd: z.string().min(1, t("form.validation.dateRangeEnd.required")),
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

      // Step 2: Schedule
      timezone: z.string().min(1, t("form.validation.timezone.required")),
      frequency: z.string().min(1, t("form.validation.frequency.required")),
      daysOfWeek: z.array(z.string()).optional(),
      dayOfMonth: z.string().optional(),
      time: z.string().min(1, t("form.validation.time.required")),
    })
    .superRefine((data, ctx) => {
      const reportType = data.report as ReportType;

      // Validate queue is required for inbound queue reports
      if (shouldShowQueue(reportType) && (!data.queue || data.queue.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("form.validation.queue.required"),
          path: ["queue"],
        });
      }

      // Validate daysOfWeek is required for weekly frequency
      if (data.frequency === "weekly" && (!data.daysOfWeek || data.daysOfWeek.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("form.validation.daysOfWeek.required"),
          path: ["daysOfWeek"],
        });
      }

      // Validate dayOfMonth is required for monthly frequency
      if (data.frequency === "monthly" && (!data.dayOfMonth || data.dayOfMonth.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("form.validation.dayOfMonth.required"),
          path: ["dayOfMonth"],
        });
      }
    });

export type CreateScheduledReportSchema = z.infer<
  ReturnType<typeof createScheduledReportSchema>
>;

export default createScheduledReportSchema;
