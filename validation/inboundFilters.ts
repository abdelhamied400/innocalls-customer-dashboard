import { z } from "zod";

export const inboundFiltersSchema = z
  .object({
    fromDate: z.date(),
    toDate: z.date(),
    agents: z.array(z.string()).optional(),
    queue: z.string().optional(),
    filterBy: z.enum(["all", "team"]),
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
