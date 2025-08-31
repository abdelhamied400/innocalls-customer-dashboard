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

type CampaignDetailsFormProps = {
  onNext: () => void;
};
const CampaignDetailsForm = ({ onNext }: CampaignDetailsFormProps) => {
  const form = useFormContext<AutoDialerCreateStep1>();

  const {
    trigger,
    clearErrors,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger([
      "campaignName",
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
          name="campaignName"
          render={({ field }) => (
            <Field
              label="Campaign name"
              error={errors.campaignName?.message}
              htmlFor="campaignName"
            >
              <FormItem>
                <FormControl>
                  <Input
                    id="campaignName"
                    variant="field"
                    placeholder="Enter campaign name..."
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
                  label="Waiting Customer Count*"
                  labelAlign="center"
                  hint="The number of customers that can wait in the queue"
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
                  label="Trials Count*"
                  labelAlign="center"
                  hint="The number of trials to call each customer"
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
                  label="Wrap Up Time"
                  labelAlign="center"
                  hint="The time (seconds) between the end of a call and the start of the next call"
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
                  label="Delay Minutes Between Trials"
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
              <FormLabel>Hide Caller Info</FormLabel>
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
              <FormLabel>Agent Can Logout And Rejoin</FormLabel>
            </FormItem>
          )}
        />

        <Button size="lg" onClick={handleNext}>
          Next
        </Button>
      </div>
    </Form>
  );
};

export default CampaignDetailsForm;
