import { useTranslations } from "next-intl";
import { z } from "zod";

export const refillBalanceSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    amount: z
      .number({ message: "form.validation.amount.invalid" })
      .int({ message: "form.validation.amount.invalid" })
      .min(5, {
        message: t("form.validation.amount.minimum", { min: 5 }),
      })
      .default(5),
  });

export type RefillBalanceSchema = z.infer<
  ReturnType<typeof refillBalanceSchema>
>;
export default refillBalanceSchema;
