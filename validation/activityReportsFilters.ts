import { useTranslations } from "next-intl";
import { z } from "zod";

export const activityReportsFiltersSchema = (
  t: ReturnType<typeof useTranslations>,
  tCommon: ReturnType<typeof useTranslations>
) =>
  z
    .object({
      fromDate: z.date(),
      toDate: z.date(),
    })
    .refine(
      (data) => {
        const from = new Date(data.fromDate);
        const to = new Date(data.toDate);

        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);

        return from <= to;
      },
      {
        message: tCommon("form.validation.toDate.beforeFromDate"),
        path: ["toDate"],
      }
    )
    .refine(
      (data) => {
        const diff =
          (data.toDate.getTime() - data.fromDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return diff <= 30;
      },
      {
        message: tCommon("form.validation.dateRange.maxDays", { max: 30 }),
        path: ["toDate"],
      }
    )
    .refine((data) => data.fromDate <= new Date(), {
      message: tCommon("form.validation.fromDate.futureDate"),
      path: ["fromDate"],
    })
    .refine((data) => data.toDate <= new Date(), {
      message: tCommon("form.validation.toDate.futureDate"),
      path: ["toDate"],
    });
