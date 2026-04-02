"use client";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import SpinButton from "@/components/ui/spin-button";
import CallerIdSelector from "@/components/CallerIdSelector";
import {
  CallBridgeStep1,
  CallBridgeStep1Schema,
} from "@/validation/CallBridgeCreate";
import { useTranslations } from "@/providers/TranslationProvider";

type BridgeDetailsFormProps = {
  onNext: () => void;
};

const BridgeDetailsForm = ({ onNext }: BridgeDetailsFormProps) => {
  const t = useTranslations("callBridge.create");
  const form = useFormContext<CallBridgeStep1>();
  const {
    control,
    clearErrors,
    trigger,
    getValues,
    setError,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const res = await CallBridgeStep1Schema(t).safeParseAsync(getValues());

    if (!res.success) {
      setTimeout(() => {
        res.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof CallBridgeStep1, {
            type: "manual",
            message: issue.message,
          });
        });
      }, 0);
      return;
    }

    clearErrors();
    onNext();
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4 overflow-auto">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <Field
              label={t("form.name.label")}
              error={errors.name?.message}
              htmlFor="name"
              hint={t("form.name.hint")}
            >
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="name"
                    variant="field"
                    placeholder={t("form.name.placeholder")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />

        <FormField
          control={control}
          name="callers"
          render={() => (
            <FormItem className="flex-1">
              <h3>{t("form.callers.label")}</h3>
              <FormControl>
                <CallerIdSelector
                  menuPlacement="bottom"
                  countryHint={t("form.callers.countryHint")}
                  didHint={t("form.callers.didHint")}
                  onChangeCallback={() => {
                    clearErrors("callers");
                    trigger("callers");
                  }}
                />
              </FormControl>
              {errors.callers?.message && (
                <p className="text-destructive mt-2">
                  {errors.callers.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <hr />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="firstRecipientTrialsCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SpinButton
                    label={t("form.firstRecipientTrialsCount.label")}
                    labelAlign="center"
                    hint={t("form.firstRecipientTrialsCount.hint")}
                    error={errors.firstRecipientTrialsCount?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondRecipientTrialsCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SpinButton
                    label={t("form.secondRecipientTrialsCount.label")}
                    labelAlign="center"
                    hint={t("form.secondRecipientTrialsCount.hint")}
                    error={errors.secondRecipientTrialsCount?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="firstRecipientDelayMinutesBetweenTrials"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SpinButton
                    label={t(
                      "form.firstRecipientDelayMinutesBetweenTrials.label",
                    )}
                    labelAlign="center"
                    hint={t("form.firstRecipientDelayMinutesBetweenTrials.hint")}
                    error={
                      errors.firstRecipientDelayMinutesBetweenTrials?.message
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondRecipientDelayMinutesBetweenTrials"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SpinButton
                    label={t(
                      "form.secondRecipientDelayMinutesBetweenTrials.label",
                    )}
                    labelAlign="center"
                    hint={t("form.secondRecipientDelayMinutesBetweenTrials.hint")}
                    error={
                      errors.secondRecipientDelayMinutesBetweenTrials?.message
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button size="lg" onClick={handleNext} type="button">
          {t("form.next")}
        </Button>
      </div>
    </Form>
  );
};

export default BridgeDetailsForm;
