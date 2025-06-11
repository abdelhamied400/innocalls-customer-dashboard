import { z } from "zod";

export const refillBalanceSchema = z.object({
  amount: z
    .number()
    .min(5, { message: "Amount must be at least 5" })
    .default(5),
});

export type RefillBalanceSchema = z.infer<typeof refillBalanceSchema>;
