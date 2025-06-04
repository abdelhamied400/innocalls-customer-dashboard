import { z } from "zod";

export const refillBalanceSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+$/, { message: "Amount must be an integer number" }),
});

export type RefillBalanceSchema = z.infer<typeof refillBalanceSchema>;
