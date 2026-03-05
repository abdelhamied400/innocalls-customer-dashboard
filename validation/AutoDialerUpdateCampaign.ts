import { CSV_SIZE_LIMIT, fileSizeToString } from "@/constants/file";
import { z } from "zod";

export const AutoDialerUpdateStep1Schema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t("steps.details.form.campaignName.validation.min", { min: 2 }))
      .max(
        250,
        t("steps.details.form.campaignName.validation.max", { max: 250 }),
      ),
    waitingCustomerCount: z
      .number()
      .int()
      .min(
        0,
        t("steps.details.form.waitingCustomerCount.validation.min", { min: 0 }),
      )
      .max(
        10,
        t("steps.details.form.waitingCustomerCount.validation.max", {
          max: 10,
        }),
      ),
    trialsCount: z
      .number()
      .int()
      .min(1, t("steps.details.form.trialsCount.validation.min", { min: 1 }))
      .max(10, t("steps.details.form.trialsCount.validation.max", { max: 10 })),
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

export const AutoDialerUpdateStep2Schema = (t: any) =>
  z.object({
    loopSoundFile: z
      .custom<File>((val) => val instanceof File, {
        message: t("steps.callsDetails.form.loopSoundFile.validation.required"),
      })
      .refine((file) => file.type === "audio/mpeg", {
        message: t("steps.callsDetails.form.loopSoundFile.validation.type"),
      })
      .refine((file) => file.size <= 70000000, {
        message: t("steps.callsDetails.form.loopSoundFile.validation.size", {
          size: "70 KB",
        }),
      })
      .optional(),
    hasAnnouncement: z.boolean().default(false),
    mainSoundFile: z
      .custom<File>()
      .refine((file) => !file || file.type === "audio/mpeg", {
        message: t("steps.callsDetails.form.mainSoundFile.validation.type"),
      })
      .refine((file) => !file || file.size <= 70000000, {
        message: t("steps.callsDetails.form.mainSoundFile.validation.size", {
          size: "70 KB",
        }),
      })
      .optional(),
    agents: z
      .array(z.string())
      .min(1, t("steps.callsDetails.form.agents.validation.min", { min: 1 })),
    callers: z
      .array(
        z.object({
          destination: z
            .string({
              required_error: t(
                "steps.callsDetails.form.callerIds.validation.destination.required",
              ),
            })
            .nonempty(
              t(
                "steps.callsDetails.form.callerIds.validation.destination.required",
              ),
            ),
          callerNumber: z
            .string({
              required_error: t(
                "steps.callsDetails.form.callerIds.validation.callerNumber.required",
              ),
            })
            .nonempty(
              t(
                "steps.callsDetails.form.callerIds.validation.callerNumber.required",
              ),
            ),
        }),
      )
      .min(
        1,
        t("steps.callsDetails.form.callerIds.validation.min", { min: 1 }),
      ),
  });

export const AutoDialerUpdateStep3Schema = (t: any) =>
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

export const AutoDialerUpdateStep4Schema = z.object({
  customers: z
    .instanceof(File, { message: "Please upload a valid file" })
    .refine((file) => ["text/csv"].includes(file.type), {
      message: "Only CSV files are allowed",
    })
    .refine((file) => file.size <= CSV_SIZE_LIMIT, {
      message: `File size must be under ${fileSizeToString(CSV_SIZE_LIMIT)}`,
    })
    .optional(),
});

// join all schemas into one destructured schema
export const AutoDialerUpdateCampaignSchema = (t: any) =>
  AutoDialerUpdateStep1Schema(t)
    .merge(AutoDialerUpdateStep2Schema(t))
    .merge(AutoDialerUpdateStep3Schema(t))
    .merge(AutoDialerUpdateStep4Schema)
    .superRefine((data, ctx) => {
      if (data.durationType === "time-limited") {
        const hasFromTime = data.fromTime && data.fromTime.trim() !== "";
        const hasToTime = data.toTime && data.toTime.trim() !== "";
        const hasTimezone = data.timezone && data.timezone.trim() !== "";

        if (!hasFromTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("steps.scheduling.form.fromTime.validation.required"),
            path: ["fromTime"],
          });
        }
        if (!hasToTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("steps.scheduling.form.toTime.validation.required"),
            path: ["toTime"],
          });
        }
        if (!hasTimezone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("steps.scheduling.form.timeZone.validation.required"),
            path: ["timezone"],
          });
        }
        if (hasFromTime && hasToTime && data.fromTime! >= data.toTime!) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(
              "steps.scheduling.form.toTime.validation.greaterThanFromTime",
            ),
            path: ["toTime"],
          });
        }
      }
    });

// export types
export type AutoDialerUpdateStep1 = z.infer<
  ReturnType<typeof AutoDialerUpdateStep1Schema>
>;
export type AutoDialerUpdateStep2 = z.infer<
  ReturnType<typeof AutoDialerUpdateStep2Schema>
> & {
  loopSoundFileName?: string;
  mainSoundFileName?: string;
};
export type AutoDialerUpdateStep3 = z.infer<
  ReturnType<typeof AutoDialerUpdateStep3Schema>
>;
export type AutoDialerUpdateStep4 = z.infer<typeof AutoDialerUpdateStep4Schema>;
export type AutoDialerUpdateCampaign = z.infer<
  ReturnType<typeof AutoDialerUpdateCampaignSchema>
> & {
  loopSoundFileName?: string;
  mainSoundFileName?: string;
};
