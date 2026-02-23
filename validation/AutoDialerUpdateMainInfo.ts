import { z } from "zod";

export const AutoDialerUpdateMainInfoSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t("form.campaignName.validation.min", { min: 2 }))
      .max(250, t("form.campaignName.validation.max", { max: 250 })),
    agents: z
      .array(z.string())
      .min(1, t("form.agents.validation.min", { min: 1 })),
    callers: z
      .array(
        z.object({
          destination: z
            .string({
              required_error: t("form.callerIds.validation.destination.required"),
            })
            .nonempty(t("form.callerIds.validation.destination.required")),
          callerNumber: z
            .string({
              required_error: t("form.callerIds.validation.callerNumber.required"),
            })
            .nonempty(t("form.callerIds.validation.callerNumber.required")),
        }),
      )
      .min(1, t("form.callerIds.validation.min", { min: 1 })),
  });

export type AutoDialerUpdateMainInfo = z.infer<
  ReturnType<typeof AutoDialerUpdateMainInfoSchema>
>;
