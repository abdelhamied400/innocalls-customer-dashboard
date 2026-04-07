"use client";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import SpinButton from "@/components/ui/spin-button";
import type { CreateSurveyForm } from "@/validation/CallSurveyCreate";

type SurveyDetailsStepProps = {
  onNext: () => void;
};

const SurveyDetailsStep = ({ onNext }: SurveyDetailsStepProps) => {
  const t = useTranslations("callSurvey.create.form");
  const tActions = useTranslations("callSurvey.create.actions");
  const form = useFormContext<CreateSurveyForm>();
  const {
    trigger,
    clearErrors,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger([
      "name",
      "trialsCount",
      "concurrencyCalls",
      "delayMinutesBetweenTrials",
      "dtmfTimeout",
    ]);
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
          name="trialsCount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("trialsCount.label")}
                  labelAlign="center"
                  error={errors.trialsCount?.message}
                  value={field.value}
                  onChange={field.onChange}
                  helperText={t("trialsCount.hint")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="delayMinutesBetweenTrials"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("delayMinutesBetweenTrials.label")}
                  labelAlign="center"
                  error={errors.delayMinutesBetweenTrials?.message}
                  value={field.value}
                  onChange={field.onChange}
                  step={5}
                  helperText={t("delayMinutesBetweenTrials.hint")}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="concurrencyCalls"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("concurrencyCalls.label")}
                  labelAlign="center"
                  error={errors.concurrencyCalls?.message}
                  value={field.value}
                  onChange={field.onChange}
                  helperText={t("concurrencyCalls.hint")}
                />
              </FormControl>
            </FormItem>
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
                  step={5}
                  helperText={t("dtmfTimeout.hint")}
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
