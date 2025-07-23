import { z } from "zod";

export const userActivityFiltersSchema = z
  .object({
    fromDate: z.date(),
    toDate: z.date(),
    agents: z.array(z.object({ value: z.string(), label: z.string() })),
    slaCompliance: z.number().min(0).max(100),
  })
  .refine(
    (data) => {
      const diff =
        (data.toDate.getTime() - data.fromDate.getTime()) /
        (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    },
    {
      message: "Date range must be between 0 and 30 days.",
      path: ["toDate"],
    }
  );
