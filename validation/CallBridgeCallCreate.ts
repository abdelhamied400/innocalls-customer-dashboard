import { z } from "zod";
import { fromZonedTime } from "date-fns-tz";

const isValidTimezone = (timezone: string) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

export const CallBridgeCallCreateSchema = (t: any) =>
  z
    .object({
      conferenceBridgeFlow: z
        .string({
          required_error: t("form.conferenceBridgeFlow.validation.required"),
        })
        .regex(/^[a-fA-F0-9]{24}$/, {
          message: t("form.conferenceBridgeFlow.validation.objectId"),
        }),
      duration: z
        .number({ required_error: t("form.duration.validation.required") })
        .int(t("form.duration.validation.integer"))
        .min(1, t("form.duration.validation.min", { min: 1 })),
      timezone: z
        .string({ required_error: t("form.timezone.validation.required") })
        .min(1, t("form.timezone.validation.required"))
        .refine((val) => isValidTimezone(val), {
          message: t("form.timezone.validation.invalid"),
        }),
      dateTime: z
        .string({ required_error: t("form.dateTime.validation.required") })
        .regex(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/, {
          message: t("form.dateTime.validation.format"),
        }),
      firstRecipient: z.object({
        name: z
          .string({
            required_error: t("form.firstRecipient.name.validation.required"),
          })
          .trim()
          .min(2, t("form.firstRecipient.name.validation.min", { min: 2 }))
          .max(250, t("form.firstRecipient.name.validation.max", { max: 250 })),
        phone: z
          .string({
            required_error: t("form.firstRecipient.phone.validation.required"),
          })
          .trim()
          .min(1, t("form.firstRecipient.phone.validation.required"))
          .regex(
            /^\d{7,15}$/,
            t("form.firstRecipient.phone.validation.invalid"),
          ),
      }),
      secondRecipient: z.object({
        name: z
          .string({
            required_error: t("form.secondRecipient.name.validation.required"),
          })
          .trim()
          .min(2, t("form.secondRecipient.name.validation.min", { min: 2 }))
          .max(
            250,
            t("form.secondRecipient.name.validation.max", { max: 250 }),
          ),
        phone: z
          .string({
            required_error: t("form.secondRecipient.phone.validation.required"),
          })
          .trim()
          .min(1, t("form.secondRecipient.phone.validation.required"))
          .regex(
            /^\d{7,15}$/,
            t("form.secondRecipient.phone.validation.invalid"),
          ),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.firstRecipient.phone === data.secondRecipient.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("form.secondRecipient.phone.validation.different"),
          path: ["secondRecipient", "phone"],
        });
      }

      if (data.dateTime && data.timezone) {
        const utcDate = fromZonedTime(
          data.dateTime.replace(" ", "T"),
          data.timezone,
        );
        if (Number.isNaN(utcDate.getTime()) || utcDate.getTime() <= Date.now()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("form.dateTime.validation.future"),
            path: ["dateTime"],
          });
        }
      }
    });

export type CallBridgeCallCreate = z.infer<
  ReturnType<typeof CallBridgeCallCreateSchema>
>;
