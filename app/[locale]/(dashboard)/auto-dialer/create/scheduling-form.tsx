import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpinButton from "@/components/ui/spin-button";
import { AutoDialerCreateStep3 } from "@/validation/AutoDialerCreateCampaign";
import React from "react";
import { useFormContext } from "react-hook-form";

type SchedulingFormProps = {
  onNext: () => void;
};
const SchedulingForm = ({ onNext }: SchedulingFormProps) => {
  const form = useFormContext<AutoDialerCreateStep3>();

  const {
    trigger,
    clearErrors,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    const isValid = await trigger([
      "maxWaitTime",
      "fromTime",
      "toTime",
      "timezone",
      "durationType",
    ]);

    if (isValid) {
      clearErrors();
      onNext();
    }
  };

  return (
    <div className="schedule-form flex flex-col gap-4 overflow-auto">
      <Field
        label="Duration Type"
        hint="Choose the campaign duration option: Time-Limited (set a specific time period, e.g., 10 AM to 6 PM) or Agent Availability (run as long as an agent is online)."
      >
        <Select>
          <SelectTrigger className="border-0 shadow-none">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <FormField
        control={control}
        name="maxWaitTime"
        render={({ field }) => (
          <Field
            label="Max Wait Time (Seconds)"
            labelAlign="center"
            hint="The max (seconds) the customer will wait if the agent is not available before the call drops"
            error={errors.maxWaitTime?.message}
            htmlFor="maxWaitTime"
          >
            <FormItem className="w-full">
              <FormControl>
                <SpinButton id="maxWaitTime" {...field} />
              </FormControl>
            </FormItem>
          </Field>
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <FormField
          control={control}
          name="fromTime"
          render={({ field }) => (
            <Field
              label="From Time"
              labelAlign="center"
              hint=""
              error={errors.fromTime?.message}
              htmlFor="fromTime"
            >
              <FormItem className="w-full">
                <FormControl>
                  <Input type="date" id="fromTime" {...field} />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />
        <FormField
          control={control}
          name="toTime"
          render={({ field }) => (
            <Field
              label="To Time"
              labelAlign="center"
              hint=""
              error={errors.toTime?.message}
              htmlFor="toTime"
            >
              <FormItem className="w-full">
                <FormControl>
                  <Input type="date" id="toTime" {...field} />
                </FormControl>
              </FormItem>
            </Field>
          )}
        />
      </div>

      <FormField
        control={control}
        name="timezone"
        render={({ field }) => (
          <Field
            label="Time Zone"
            hint=""
            error={errors.timezone?.message}
            htmlFor="timezone"
          >
            <FormItem className="w-full">
              <FormControl>
                <Select>
                  <SelectTrigger className="border-0 shadow-none">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </Field>
        )}
      />

      <Button onClick={handleNext}>Next</Button>
    </div>
  );
};

export default SchedulingForm;
