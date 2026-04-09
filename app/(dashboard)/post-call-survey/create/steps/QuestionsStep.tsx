"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Select from "@/components/Select";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import { Add, DeleteOutline } from "@mui/icons-material";
import type { CreatePostCallSurveyForm } from "@/validation/PostCallSurveyCreate";

type QuestionsStepProps = {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
};

const QuestionsStep = ({ onSubmit, isSubmitting }: QuestionsStepProps) => {
  const t = useTranslations("postCallSurvey.create.form");
  const tActions = useTranslations("postCallSurvey.create.actions");

  const ANSWER_TYPES = [
    { label: t("questions.answerTypes.oneFive"), value: "one_five" },
    { label: t("questions.answerTypes.oneTen"), value: "one_ten" },
    { label: t("questions.answerTypes.yesNo"), value: "yes_no" },
  ];

  const form = useFormContext<CreatePostCallSurveyForm>();
  const {
    trigger,
    clearErrors,
    control,
    setValue,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleSubmit = async () => {
    const isValid = await trigger(["questions"]);
    if (isValid) {
      clearErrors();
      await onSubmit();
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <h4 className="m-0">{t("questions.title")}</h4>

        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 flex flex-row items-center gap-4"
          >
            <div className="flex flex-col gap-4 flex-1">
              <Select
                label={t("questions.answerType.label")}
                options={ANSWER_TYPES}
                value={
                  ANSWER_TYPES.find(
                    (opt) => opt.value === form.watch(`questions.${idx}.type`),
                  ) || null
                }
                onChange={(opt) =>
                  setValue(`questions.${idx}.type`, opt?.value || "", {
                    shouldValidate: true,
                  })
                }
                placeholder={t("questions.answerType.placeholder")}
                error={errors.questions?.[idx]?.type?.message}
              />

              <div>
                <h5 className="mb-2">{t("questions.sound.label")}</h5>
                <Dropzone
                  options={{
                    accept: { "audio/mpeg": [".mp3"] },
                    maxSize: SOUND_SIZE_LIMIT,
                    multiple: false,
                    maxFiles: 1,
                  }}
                  value={form.watch(`questions.${idx}.sound`)}
                  onChange={(file) => {
                    setValue(`questions.${idx}.sound`, file, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <DropzoneTrigger />
                  <DropzoneFileList />
                </Dropzone>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("questions.sound.hint")}
                </p>
                {errors.questions?.[idx]?.sound?.message && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.questions[idx].sound.message as string}
                  </p>
                )}
              </div>
            </div>

            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost-destructive"
                size="icon"
                onClick={() => remove(idx)}
              >
                <DeleteOutline fontSize="small" />
              </Button>
            )}
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => append({ type: "", sound: null })}
          >
            <Add sx={{ fontSize: 16 }} className="me-1" />
            {t("questions.add")}
          </Button>
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {tActions("submit")}
        </Button>
      </div>
    </Form>
  );
};

export default QuestionsStep;
