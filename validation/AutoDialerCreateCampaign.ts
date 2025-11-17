import { CSV_SIZE_LIMIT, fileSizeToString } from "@/constants/file";
import { z } from "zod";

export const AutoDialerCreateStep1Schema = z.object({
  name: z.string().min(1, "Campaign name is required"),
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
  loopSoundFile: z
    .instanceof(File, { message: "Please upload a valid file" })
    .refine((file) => file.type === "audio/mpeg", {
      message: "Only MP3 files are allowed",
    })
    .refine((file) => file.size <= 70000000, {
      message: "File size must be under 70 KB",
    }),
  hasAnnouncement: z.boolean().default(false),
  announcement: z
    .instanceof(File, { message: "Please upload a valid file" })
    .refine((file) => file.type === "audio/mpeg", {
      message: "Only MP3 files are allowed",
    })
    .refine((file) => file.size <= 70000000, {
      message: "File size must be under 70 KB",
    })
    .optional(),
  agents: z.array(z.string()).min(1, "At least one agent is required"),
  callerIds: z
    .array(
      z.object({
        destination: z
          .string({
            required_error: "Destination is required",
          })
          .nonempty("Destination is required"),
        callerNumber: z
          .string({
            required_error: "Caller Number is required",
          })
          .nonempty("Caller Number is required"),
      })
    )
    .min(1, "At least one caller Number is required"),
});

export const AutoDialerCreateStep3Schema = z.object({
  durationType: z.string({
    required_error: "Duration type is required",
  }),
  maxWaitTime: z
    .number()
    .int()
    .min(0, "Max wait time must be greater than or equal to 0"),
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
  timezone: z.string().optional(),
});

export const AutoDialerCreateStep4Schema = z.object({
  customers: z
    .instanceof(File, { message: "Please upload a valid file" })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      {
        message: "Only MP3 files are allowed",
      }
    )
    .refine((file) => file.size <= CSV_SIZE_LIMIT, {
      message: `File size must be under ${fileSizeToString(CSV_SIZE_LIMIT)}`,
    }),
});

// join all schemas into one destructured schema
export const AutoDialerCreateCampaignSchema = AutoDialerCreateStep1Schema.merge(
  AutoDialerCreateStep2Schema
)
  .merge(AutoDialerCreateStep3Schema)
  .merge(AutoDialerCreateStep4Schema)
  .refine(
    (data) => {
      if (data.durationType === "time-limited") {
        return (
          data.fromTime !== undefined &&
          data.toTime !== undefined &&
          data.timezone !== undefined
        );
      }
      return true;
    },
    {
      message:
        "From time, to time, and timezone are required for time-limited campaigns",
      path: ["durationType"],
    }
  )
  .refine(
    (data) => {
      if (
        data.durationType === "time-limited" &&
        data.fromTime &&
        data.toTime
      ) {
        return data.fromTime < data.toTime;
      }
      return true;
    },
    {
      message: "To time must be greater than From time",
      path: ["toTime"],
    }
  );

// export types
export type AutoDialerCreateStep1 = z.infer<typeof AutoDialerCreateStep1Schema>;
export type AutoDialerCreateStep2 = z.infer<typeof AutoDialerCreateStep2Schema>;
export type AutoDialerCreateStep3 = z.infer<typeof AutoDialerCreateStep3Schema>;
export type AutoDialerCreateStep4 = z.infer<typeof AutoDialerCreateStep4Schema>;
export type AutoDialerCreateCampaign = z.infer<
  typeof AutoDialerCreateCampaignSchema
>;
