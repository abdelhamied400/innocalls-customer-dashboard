import { z } from "zod";

const phoneRegexPatterns = [
  /^20(10|11|12|15)\d{8}$/, // Egypt (EG)
  /^971(50|52|54|55|56|58|60)\d{7}$/, // United Arab Emirates (UAE)
  /^966(50|51|52|53|54|55|56|57|58|59)\d{7}$/, // Saudi Arabia (KSA)
  /^974[34567]\d{7}$/, // Qatar
  /^965([2569]\d{7})$/, // Kuwait (mobile 5,6,9 / landline 2)
  /^973[367]\d{7}$/, // Bahrain
  /^962(7[0-9]\d{7}|6\d{7})$/, // Jordan
  /^9689\d{7}$/, // Oman (mobile)
  /^9647\d{9}$/, // Iraq (mobile)
];

export const CorruptedRowSchema = (t: (key: string, params?: Record<string, unknown>) => string) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t("validation.nameMin", { min: 2 }))
      .max(250, t("validation.nameMax", { max: 250 })),
    phone: z
      .string()
      .trim()
      .min(1, t("validation.phoneRequired"))
      .regex(/^\d+$/, t("validation.phoneInvalid"))
      .refine(
        (val) => phoneRegexPatterns.some((pattern) => pattern.test(val)),
        { message: t("validation.phoneUnsupportedFormat") },
      ),
    information: z.string().optional().default(""),
  });

export type CorruptedRowFormValues = z.infer<
  ReturnType<typeof CorruptedRowSchema>
>;
