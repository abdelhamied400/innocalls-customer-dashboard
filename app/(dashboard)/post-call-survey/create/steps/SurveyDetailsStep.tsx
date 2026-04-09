"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import SpinButton from "@/components/ui/spin-button";
import type { CreatePostCallSurveyForm } from "@/validation/PostCallSurveyCreate";

type SurveyDetailsStepProps = {
  onNext: () => void;
};

const SurveyDetailsStep = ({ onNext }: SurveyDetailsStepProps) => {
  const t = useTranslations("postCallSurvey.create.form");
  const tActions = useTranslations("postCallSurvey.create.actions");
  const form = useFormContext<CreatePostCallSurveyForm>();
  const {
    trigger,
    clearErrors,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger(["name", "dtmfTimeout", "maxQuestionAttempts"]);
    if (isValid) {
      clearErrors();
      onNext();
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4 overflow-auto">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <Field
              label={t("name.label")}
              error={errors.name?.message}
              htmlFor="name"
            >
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="name"
                    variant="field"
                    placeholder={t("name.placeholder")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />

        <FormField
          control={control}
          name="dtmfTimeout"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("dtmfTimeout.label")}
                  labelAlign="center"
                  error={errors.dtmfTimeout?.message}
                  value={field.value}
                  onChange={field.onChange}
                  helperText={t("dtmfTimeout.hint")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="maxQuestionAttempts"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("maxQuestionAttempts.label")}
                  labelAlign="center"
                  error={errors.maxQuestionAttempts?.message}
                  value={field.value}
                  onChange={field.onChange}
                  helperText={t("maxQuestionAttempts.hint")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="button" size="lg" onClick={handleNext}>
          {tActions("next")}
        </Button>
      </div>
    </Form>
  );
};

export default SurveyDetailsStep;
