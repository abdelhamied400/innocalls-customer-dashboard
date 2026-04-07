"use client";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Dropzone, {
  DropzoneFileList,
  DropzoneTrigger,
} from "@/components/ui/dropzone";
import { SOUND_SIZE_LIMIT } from "@/constants/file";
import type { CreateSurveyForm } from "@/validation/CallSurveyCreate";

type SoundsStepProps = {
  onNext: () => void;
};

const SoundsStep = ({ onNext }: SoundsStepProps) => {
  const t = useTranslations("callSurvey.create.form");
  const tActions = useTranslations("callSurvey.create.actions");
  const form = useFormContext<CreateSurveyForm>();
  const {
    trigger,
    clearErrors,
    control,
    setValue,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger([
      "startSound",
      "endSound",
      "wrongEntrySound",
    ]);
    if (isValid) {
      clearErrors();
      onNext();
    }
  };

  const soundFields = [
    {
      name: "startSound" as const,
      label: t("startSound.label"),
      hint: t("startSound.hint"),
    },
    {
      name: "wrongEntrySound" as const,
      label: t("wrongEntrySound.label"),
      hint: t("wrongEntrySound.hint"),
    },
    {
      name: "endSound" as const,
      label: t("endSound.label"),
      hint: t("endSound.hint"),
    },
  ];

  return (
    <Form {...form}>
      <div className="flex flex-col divide-y gap-4">
        {soundFields.map(({ name, label, hint }) => (
          <div key={name}>
            <h4 className="mb-2">{label}</h4>
            <Dropzone
              options={{
                accept: { "audio/mpeg": [".mp3"] },
                maxSize: SOUND_SIZE_LIMIT,
                multiple: false,
                maxFiles: 1,
              }}
              value={form.watch(name)}
              onChange={(file) => {
                setValue(name, file, { shouldValidate: true });
              }}
            >
              <DropzoneTrigger />
              <DropzoneFileList />
            </Dropzone>
            {hint && (
              <p className="text-sm text-muted-foreground mt-1">{hint}</p>
            )}
            {errors[name]?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors[name]?.message as string}
              </p>
            )}
          </div>
        ))}

        <Button type="button" size="lg" onClick={handleNext}>
          {tActions("next")}
        </Button>
      </div>
    </Form>
  );
};

export default SoundsStep;
