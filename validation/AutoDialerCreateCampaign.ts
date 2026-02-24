import { z } from "zod";

export const AutoDialerCreateStep1Schema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t("steps.details.form.campaignName.validation.min", { min: 2 }))
      .max(250, t("steps.details.form.campaignName.validation.max", { max: 250 })),
    waitingCustomerCount: z
      .number()
      .int()
      .min(
        0,
        t("steps.details.form.waitingCustomerCount.validation.min", { min: 0 }),
      ),
    trialsCount: z
      .number()
      .int()
      .min(1, t("steps.details.form.trialsCount.validation.min", { min: 1 })),
    wrapUpTime: z
      .number()
      .int()
      .min(10, t("steps.details.form.wrapUpTime.validation.min", { min: 10 })),
    delayMinutesBetweenTrials: z
      .number()
      .int()
      .min(
        5,
        t("steps.details.form.delayMinutesBetweenTrials.validation.min", {
          min: 5,
        }),
      ),
    hideCallerInfo: z.boolean().default(false),
    agentCanLogoutAndRejoin: z.boolean().default(false),
  });

export const AutoDialerCreateStep2Schema = (t: any) =>
  z.object({
    loopSoundFile: z
      .instanceof(File, {
        message: t("steps.callsDetails.form.loopSoundFile.validation.required"),
      })
      .refine((file) => file.type === "audio/mpeg", {
        message: t("steps.callsDetails.form.loopSoundFile.validation.type"),
      })
      .refine((file) => file.size <= 70000000, {
        message: t("steps.callsDetails.form.loopSoundFile.validation.size", {
          size: "70 KB",
        }),
      }),
    hasAnnouncement: z.boolean().default(false),
    mainSoundFile: z
      .instanceof(File, {
        message: t("steps.callsDetails.form.mainSoundFile.validation.required"),
      })
      .refine((file) => file.type === "audio/mpeg", {
        message: t("steps.callsDetails.form.mainSoundFile.validation.type"),
      })
      .refine((file) => file.size <= 70000000, {
        message: t("steps.callsDetails.form.mainSoundFile.validation.size", {
          size: "70 KB",
        }),
      })
      .optional(),
    agents: z.array(z.string()).min(1, t("steps.callsDetails.form.agents.validation.min", { min: 1 })),
    callers: z
      .array(
        z.object({
          destination: z
            .string({
              required_error: t("steps.callsDetails.form.callerIds.validation.destination.required"),
            })
            .nonempty(t("steps.callsDetails.form.callerIds.validation.destination.required")),
          callerNumber: z
            .string({
              required_error: t("steps.callsDetails.form.callerIds.validation.callerNumber.required"),
            })
            .nonempty(t("steps.callsDetails.form.callerIds.validation.callerNumber.required")),
        }),
      )
      .min(1, t("steps.callsDetails.form.callerIds.validation.min", { min: 1 })),
  });

export const AutoDialerCreateStep3Schema = (t: any) =>
  z.object({
    durationType: z.string({
      required_error: t(
        "steps.scheduling.form.durationType.validation.required",
      ),
    }),
    maxWaitTime: z
      .number()
      .int()
      .min(
        50,
        t("steps.scheduling.form.maxWaitTime.validation.min", { min: 50 }),
      ),
    fromTime: z.string().optional(),
    toTime: z.string().optional(),
    timezone: z.string().optional(),
  });

// join all schemas into one destructured schema
export const AutoDialerCreateCampaignSchema = (t: any) =>
  AutoDialerCreateStep1Schema(t)
    .merge(AutoDialerCreateStep2Schema(t))
    .merge(AutoDialerCreateStep3Schema(t));

// export types
export type AutoDialerCreateStep1 = z.infer<
  ReturnType<typeof AutoDialerCreateStep1Schema>
>;
export type AutoDialerCreateStep2 = z.infer<
  ReturnType<typeof AutoDialerCreateStep2Schema>
>;
export type AutoDialerCreateStep3 = z.infer<
  ReturnType<typeof AutoDialerCreateStep3Schema>
>;
export type AutoDialerCreateCampaign = z.infer<
  ReturnType<typeof AutoDialerCreateCampaignSchema>
>;
