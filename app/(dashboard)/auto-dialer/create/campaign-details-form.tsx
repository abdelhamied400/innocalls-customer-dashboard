"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import SpinButton from "@/components/ui/spin-button";
import { Checkbox } from "@/components/ui/checkbox";
import { AutoDialerCreateStep1 } from "@/validation/AutoDialerCreateCampaign";
import { useTranslations } from "@/providers/TranslationProvider";

type CampaignDetailsFormProps = {
  onNext: () => void;
};
const CampaignDetailsForm = ({ onNext }: CampaignDetailsFormProps) => {
  const t = useTranslations("autoDialer.createCampaign.steps.details.form");
  const form = useFormContext<AutoDialerCreateStep1>();

  const {
    trigger,
    clearErrors,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger([
      "name",
      "waitingCustomerCount",
      "trialsCount",
      "wrapUpTime",
      "delayMinutesBetweenTrials",
      "hideCallerInfo",
      "agentCanLogoutAndRejoin",
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
              label={t("campaignName.label")}
              error={errors.name?.message}
              htmlFor="name"
            >
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    id="name"
                    variant="field"
                    placeholder={t("campaignName.placeholder")}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />

        <FormField
          control={control}
          name="waitingCustomerCount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("waitingCustomerCount.label")}
                  labelAlign="center"
                  hint={t("waitingCustomerCount.hint")}
                  error={errors.waitingCustomerCount?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
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
                  hint={t("trialsCount.hint")}
                  error={errors.trialsCount?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="wrapUpTime"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SpinButton
                  label={t("wrapUpTime.label")}
                  labelAlign="center"
                  hint={t("wrapUpTime.hint")}
                  error={errors.wrapUpTime?.message}
                  {...field}
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
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hideCallerInfo"
          render={({ field }) => (
            <FormItem className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>{t("hideCallerInfo.label")}</FormLabel>
            </FormItem>
          )}
        />

        {/* Agent Can Logout And Rejoin */}
        <FormField
          control={control}
          name="agentCanLogoutAndRejoin"
          render={({ field }) => (
            <FormItem className="flex items-start gap-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>{t("agentCanLogoutAndRejoin.label")}</FormLabel>
            </FormItem>
          )}
        />

        <Button size="lg" onClick={handleNext}>
          {t("next")}
        </Button>
      </div>
    </Form>
  );
};

export default CampaignDetailsForm;
