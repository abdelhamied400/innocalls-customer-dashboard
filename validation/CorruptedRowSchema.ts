import { z } from "zod";

export const CorruptedRowSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t("validation.nameRequired")),
    phone: z
      .string()
      .trim()
      .min(1, t("validation.phoneRequired"))
      .regex(/^\d+$/, t("validation.phoneInvalid")),
    information: z.string().optional().default(""),
  });

export type CorruptedRowFormValues = z.infer<
  ReturnType<typeof CorruptedRowSchema>
>;
