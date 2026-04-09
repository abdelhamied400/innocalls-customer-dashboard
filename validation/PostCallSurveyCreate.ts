import { z } from "zod";

export const PostCallSurveyCreateSchema = (t: (key: string) => string) =>
  z.object({
    // Step 0 - Survey Details
    name: z.string().min(1, t("name.required")),
    dtmfTimeout: z.number().min(5, t("dtmfTimeout.min")),
    maxQuestionAttempts: z.number().min(1, t("maxQuestionAttempts.min")),

    // Step 1 - Sounds
    startSound: z
      .any()
      .refine((v) => v instanceof File, t("startSound.required")),
    endSound: z
      .any()
      .refine((v) => v instanceof File, t("endSound.required")),
    wrongEntrySound: z
      .any()
      .refine((v) => v instanceof File, t("wrongEntrySound.required")),

    // Step 2 - Questions
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
  });

export type CreatePostCallSurveyForm = {
  name: string;
  dtmfTimeout: number;
  maxQuestionAttempts: number;
  startSound: File | null;
  endSound: File | null;
  wrongEntrySound: File | null;
  questions: { type: string; sound: File | null }[];
};

export const STEP_FIELDS: (keyof CreatePostCallSurveyForm)[][] = [
  ["name", "dtmfTimeout", "maxQuestionAttempts"],
  ["startSound", "endSound", "wrongEntrySound"],
  ["questions"],
];
