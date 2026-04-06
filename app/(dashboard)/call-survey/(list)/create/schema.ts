import { z } from "zod";

export const createSurveySchema = (t: (key: string) => string) =>
  z.object({
    // Step 0 - Survey Details
    name: z.string().min(1, t("name.required")),
    trialsCount: z
      .number()
      .min(1, t("trialsCount.min"))
      .max(10, t("trialsCount.max")),
    concurrencyCalls: z
      .number()
      .min(1, t("concurrencyCalls.min"))
      .max(10, t("concurrencyCalls.max")),
    delayMinutesBetweenTrials: z
      .number()
      .min(5, t("delayMinutesBetweenTrials.min")),
    dtmfTimeout: z.number().min(5, t("dtmfTimeout.min")),

    // Step 1 - Sounds
    startSound: z.any().refine((v) => v instanceof File, t("startSound.required")),
    endSound: z.any().refine((v) => v instanceof File, t("endSound.required")),
    wrongEntrySound: z
      .any()
      .refine((v) => v instanceof File, t("wrongEntrySound.required")),

    // Step 2 - Questions
    maxQuestionAttempts: z.number().min(1, t("maxQuestionAttempts.min")),
    questions: z
      .array(
        z.object({
          type: z.string().min(1, t("questions.answerType.required")),
          sound: z
            .any()
            .refine(
              (v) => v instanceof File,
              t("questions.sound.required"),
            ),
        }),
      )
      .min(1, t("questions.min")),

    // Step 3 - Time & Callers
    timezone: z.string().min(1),
    timeSlots: z
      .array(
        z.object({
          fromTime: z.string().min(1, t("timeSlots.from.required")),
          toTime: z.string().min(1, t("timeSlots.to.required")),
        }),
      )
      .min(1, t("timeSlots.min")),
    callers: z
      .array(
        z.object({
          destination: z.string().min(1),
          callerNumber: z.string().min(1),
        }),
      )
      .min(1),

    // Step 4 - Customers List
    customersFile: z.any().nullable().optional(),
  });

export type CreateSurveyForm = z.infer<ReturnType<typeof createSurveySchema>>;

// Fields per step for validation
export const STEP_FIELDS: (keyof CreateSurveyForm)[][] = [
  // Step 0 - Survey Details
  ["name", "trialsCount", "concurrencyCalls", "delayMinutesBetweenTrials", "dtmfTimeout"],
  // Step 1 - Sounds
  ["startSound", "endSound", "wrongEntrySound"],
  // Step 2 - Questions
  ["maxQuestionAttempts", "questions"],
  // Step 3 - Time & Callers
  ["timezone", "timeSlots", "callers"],
  // Step 4 - Customers List
  ["customersFile"],
];
