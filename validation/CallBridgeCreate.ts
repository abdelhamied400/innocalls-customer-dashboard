import { z } from "zod";
import { SOUND_SIZE_LIMIT } from "@/constants/file";

const soundFileSchema = (t: any, fieldKey: string) =>
  z
    .custom<File>((val) => val instanceof File, {
      message: t(`form.${fieldKey}.validation.required`),
    })
    .refine((file) => file.type === "audio/mpeg", {
      message: t(`form.${fieldKey}.validation.type`),
    })
    .refine((file) => file.size <= SOUND_SIZE_LIMIT, {
      message: t(`form.${fieldKey}.validation.size`),
    });

const optionalSoundFileSchema = (t: any, fieldKey: string) =>
  z
    .custom<File | undefined>()
    .refine((file) => !file || file.type === "audio/mpeg", {
      message: t(`form.${fieldKey}.validation.type`),
    })
    .refine((file) => !file || file.size <= SOUND_SIZE_LIMIT, {
      message: t(`form.${fieldKey}.validation.size`),
    })
    .optional();

export const CallBridgeStep1Schema = (t: any) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, t("form.name.validation.min", { min: 2 }))
      .max(250, t("form.name.validation.max", { max: 250 })),
    callers: z
      .array(
        z.object({
          destination: z
            .string({ required_error: t("form.callers.validation.destination.required") })
            .nonempty(t("form.callers.validation.destination.required")),
          callerNumber: z
            .string({ required_error: t("form.callers.validation.callerNumber.required") })
            .nonempty(t("form.callers.validation.callerNumber.required")),
        }),
      )
      .min(1, t("form.callers.validation.min", { min: 1 })),
    firstRecipientTrialsCount: z
      .number()
      .int()
      .min(1, t("form.firstRecipientTrialsCount.validation.min", { min: 1 }))
      .max(10, t("form.firstRecipientTrialsCount.validation.max", { max: 10 })),
    secondRecipientTrialsCount: z
      .number()
      .int()
      .min(1, t("form.secondRecipientTrialsCount.validation.min", { min: 1 }))
      .max(10, t("form.secondRecipientTrialsCount.validation.max", { max: 10 })),
    firstRecipientDelayMinutesBetweenTrials: z
      .number()
      .int()
      .min(0, t("form.firstRecipientDelayMinutesBetweenTrials.validation.min", { min: 0 })),
    secondRecipientDelayMinutesBetweenTrials: z
      .number()
      .int()
      .min(0, t("form.secondRecipientDelayMinutesBetweenTrials.validation.min", { min: 0 }))
      .max(5, t("form.secondRecipientDelayMinutesBetweenTrials.validation.max", { max: 5 })),
    warningTimeBeforeEnd: z
      .number()
      .int()
      .min(1, t("form.warningTimeBeforeEnd.validation.min", { min: 1 }))
      .optional(),
  });

export const CallBridgeStep2Schema = (t: any) =>
  z.object({
    welcomeSoundFile: soundFileSchema(t, "welcomeSoundFile"),
    alertSoundFile: soundFileSchema(t, "alertSoundFile"),
    firstRecipientSorrySoundFile: soundFileSchema(t, "firstRecipientSorrySoundFile"),
    secondRecipientSorrySoundFile: soundFileSchema(t, "secondRecipientSorrySoundFile"),
    warningSoundFile: optionalSoundFileSchema(t, "warningSoundFile"),
  });

export const CallBridgeCreateSchema = (t: any) =>
  CallBridgeStep1Schema(t).merge(CallBridgeStep2Schema(t));

export type CallBridgeStep1 = z.infer<ReturnType<typeof CallBridgeStep1Schema>>;
export type CallBridgeStep2 = z.infer<ReturnType<typeof CallBridgeStep2Schema>>;
export type CallBridgeCreate = z.infer<ReturnType<typeof CallBridgeCreateSchema>>;
