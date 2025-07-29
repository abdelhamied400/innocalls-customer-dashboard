import { useTranslations } from "next-intl";
import { z } from "zod";

export const unansweredFiltersSchema = (
  t: ReturnType<typeof useTranslations>
) =>
  z
    .object({
      fromDate: z.date({
        required_error: t("form.validation.fromDate.required"),
      }),
      toDate: z.date({
        required_error: t("form.validation.toDate.required"),
      }),
      agents: z.array(z.object({ value: z.string(), label: z.string() })),
    })
    .refine((data) => {
      const from = new Date(data.fromDate);
      const to = new Date(data.toDate);
    
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
    
      return from <= to;
    }, {
      message: t("form.validation.toDate.beforeFromDate"),
      path: ["toDate"],
    })
    .refine(
      (data) => {
        const diff =
          (data.toDate.getTime() - data.fromDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return diff <= 30;
      },
      {
        message: t("form.validation.dateRange.maxDays", { max: 30 }),
        path: ["toDate"],
      }
    )
    .refine((data) => data.fromDate <= new Date(), {
      message: t("form.validation.fromDate.futureDate"),
      path: ["fromDate"],
    })
    .refine((data) => data.toDate <= new Date(), {
      message: t("form.validation.toDate.futureDate"),
      path: ["toDate"],
    });
