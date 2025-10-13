import { useTranslations } from "@/providers/TranslationProvider";
import { z } from "zod";

export const refillBalanceSchema = (
  t: ReturnType<typeof useTranslations>,
  tCommon: ReturnType<typeof useTranslations>,
  { currency }: { currency?: string }
) =>
  z.object({
    amount: z
      .number({ message: "form.validation.amount.invalid" })
      .int({ message: "form.validation.amount.invalid" })
      .min(5, {
        message:
          t("form.validation.amount.minimum", { min: 5 }) +
          " " +
          tCommon(`currencies.${currency}`),
      })
      .default(5),
  });

export type RefillBalanceSchema = z.infer<
  ReturnType<typeof refillBalanceSchema>
>;
export default refillBalanceSchema;
