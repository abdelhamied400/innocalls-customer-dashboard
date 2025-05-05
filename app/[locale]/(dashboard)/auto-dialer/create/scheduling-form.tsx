import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Select from "@/components/ui/select";
import { VirtualizedSelect } from "@/components/ui/select-virtualized";
import SmartSelect from "@/components/ui/smart-select";
import SpinButton from "@/components/ui/spin-button";
import { timezones } from "@/constants/timezones";
import {
  AutoDialerCreateStep3,
  AutoDialerCreateStep3Schema,
} from "@/validation/AutoDialerCreateCampaign";
import React from "react";
import { useFormContext } from "react-hook-form";

type DurationType = {
  name: string;
  id: string;
};
const durationTypes: DurationType[] = [
  { name: "Time Limited", id: "time-limited" },
  { name: "Agent Availability", id: "agent-availability" },
];

type SchedulingFormProps = {
  onNext: () => void;
};
const SchedulingForm = ({ onNext }: SchedulingFormProps) => {
  const form = useFormContext<AutoDialerCreateStep3>();

  const {
    getValues,
    trigger,
    clearErrors,
    setError,
    control,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    // validate the form
    const res = await AutoDialerCreateStep3Schema.refine(
      (data) => {
        const { fromTime, toTime } = data;
        return fromTime && toTime && fromTime < toTime;
      },
      {
        path: ["toTime"],
        message: "To time must be greater than From time",
      }
    ).safeParseAsync(getValues());

    if (!res.success) {
      setTimeout(() => {
        res.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof AutoDialerCreateStep3, {
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
      <div className="schedule-form flex flex-col gap-4 overflow-auto h-full">
        <FormField
          control={control}
          name="durationType"
          render={({ field }) => (
            <Select
              {...field}
              label="Duration Type"
              options={durationTypes}
              value={durationTypes.find((option) => option.id === field.value)}
              onChange={(type) => type && field.onChange(type.id)}
              getLabel={(option) => option?.name || ""}
              getValue={(option) => option?.id || ""}
              placeholder="Select from the list...."
              error={errors.durationType?.message}
            ></Select>
          )}
        />

        <FormField
          control={control}
          name="maxWaitTime"
          render={({ field }) => (
            <div className="">
              <FormItem className="w-full">
                <FormControl>
                  <SpinButton
                    label="Max Wait Time (Seconds)"
                    labelAlign="center"
                    hint="The max (seconds) the customer will wait if the agent is not available before the call drops"
                    error={errors.maxWaitTime?.message}
                    htmlFor="maxWaitTime"
                    id="maxWaitTime"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            </div>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                    <DatePicker placeholder="test" id="fromTime" {...field} />
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
                    <DatePicker placeholder="test" id="fromTime" {...field} />
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
            <VirtualizedSelect
              label="Timezone"
              value={field.value}
              options={timezones}
              getLabel={(opt) => opt?.name}
              getValue={(opt) => opt?.id}
              onChange={field.onChange}
              placeholder="Select from the list...."
            />
          )}
        />
        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <SmartSelect
              options={timezones}
              value={field.value}
              onChange={field.onChange}
              label="Category"
              placeholder="Choose a category"
              isVirtualized
              isMulti
              showSelectedTags={false}
            />
          )}
        />

        <Button onClick={handleNext}>Next</Button>
      </div>
    </Form>
  );
};

export default SchedulingForm;
