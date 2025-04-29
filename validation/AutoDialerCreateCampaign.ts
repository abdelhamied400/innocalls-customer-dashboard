import { z } from "zod";

export const AutoDialerCreateStep1Schema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  waitingCustomerCount: z
    .number()
    .int()
    .min(0, "Waiting customer count must be greater than or equal to 0"),
  trialsCount: z
    .number()
    .int()
    .min(1, "Trials count must be greater than or equal to 1"),
  wrapUpTime: z
    .number()
    .int()
    .min(10, "Wrap up time must be greater than or equal to 10"),
  delayMinutesBetweenTrials: z
    .number()
    .int()
    .min(5, "Delay minutes between trials must be greater than or equal to 5"),
  hideCallerInfo: z.boolean().default(false),
  agentCanLogoutAndRejoin: z.boolean().default(false),
});

export const AutoDialerCreateStep2Schema = z.object({
  sound: z
    .instanceof(File, { message: "Please upload a valid file" })
    .refine((file) => file.type === "audio/mpeg", {
      message: "Only MP3 files are allowed",
    })
    .refine((file) => file.size <= 70000000, {
      message: "File size must be under 70 KB",
    }),
  playAnnouncement: z.boolean().default(false),
  agents: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string(),
      })
    )
    .min(1, "At least one agent is required"),
  callerIds: z.array(
    z.object({
      destination: z.string(),
      callerId: z.string(),
    })
  ),
});

export const AutoDialerCreateStep3Schema = z.object({
  durationType: z.string(),
  maxWaitTime: z.number().int(),
  fromTime: z.string(),
  toTime: z.string(),
  timezone: z.string(),
});

export const AutoDialerCreateStep4Schema = z.object({
  customers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
    })
  ),
});

// join all schemas into one destructured schema
export const AutoDialerCreateCampaignSchema = AutoDialerCreateStep1Schema.merge(
  AutoDialerCreateStep2Schema
)
  .merge(AutoDialerCreateStep3Schema)
  .merge(AutoDialerCreateStep4Schema);

// export types
export type AutoDialerCreateStep1 = z.infer<typeof AutoDialerCreateStep1Schema>;
export type AutoDialerCreateStep2 = z.infer<typeof AutoDialerCreateStep2Schema>;
export type AutoDialerCreateStep3 = z.infer<typeof AutoDialerCreateStep3Schema>;
export type AutoDialerCreateStep4 = z.infer<typeof AutoDialerCreateStep4Schema>;
export type AutoDialerCreateCampaign = z.infer<
  typeof AutoDialerCreateCampaignSchema
>;
