import { z } from "zod";

export const refillBalanceSchema = z.object({
  amount: z
    .number()
    .min(0, { message: "Amount must be a positive number." })
    .max(10000, { message: "Amount cannot exceed 10,000." }),
});

export type RefillBalanceSchema = z.infer<typeof refillBalanceSchema>;
