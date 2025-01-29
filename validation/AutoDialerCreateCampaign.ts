import { z } from "zod";

const AutoDialerCreateCampaignSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  waitingCustomerCount: z
    .number()
    .int()
    .min(0, "Waiting customer count must be greater than or equal to 0"),
  trialsCount: z
    .number()
    .int()
    .min(0, "Trials count must be greater than or equal to 0"),
  wrapUpTime: z
    .number()
    .int()
    .min(0, "Wrap up time must be greater than or equal to 0"),
  delayMinutesBetweenTrials: z
    .number()
    .int()
    .min(0, "Delay minutes between trials must be greater than or equal to 0"),
  hideCallerInfo: z.boolean(),
  agentCanLogoutAndRejoin: z.boolean(),
  sound: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
    })
  ),
});

export type AutoDialerCreateCampaign = z.infer<
  typeof AutoDialerCreateCampaignSchema
>;
export default AutoDialerCreateCampaignSchema;
