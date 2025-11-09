import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Select from "@/components/select";
import SpinButton from "@/components/ui/spin-button";
import { Timezone, timezones } from "@/constants/timezones";
import {
  AutoDialerCreateStep3,
  AutoDialerCreateStep3Schema,
} from "@/validation/AutoDialerCreateCampaign";
import React from "react";
import { useFormContext } from "react-hook-form";
import { SmartSelect } from "@/components/SmartSelect";

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
  const [selectedTimeZones, setSelectedTimezones] = React.useState<Timezone[]>(
    []
  );

  const {
    getValues,
    watch,
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
          render={({ field }) => {
            const selectedType =
              durationTypes.find((type) => type.id === field.value) || null;
            return (
              <Select
                {...field}
                label="Duration Type"
                options={durationTypes}
                value={selectedType}
                onChange={(type: DurationType | DurationType[] | null) => {
                  if (type && !Array.isArray(type)) {
                    field.onChange(type.id);
                  }
                }}
                getLabel={(option) => option?.name || ""}
                getValue={(option) => option?.id || ""}
                placeholder="Select from the list...."
                error={errors.durationType?.message}
              ></Select>
            );
          }}
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

        {watch("durationType") === "time-limited" && (
          <>
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
                        <DatePicker
                          placeholder="Select from time..."
                          id="fromTime"
                          {...field}
                        />
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
                        <DatePicker
                          placeholder="Select to time..."
                          id="toTime"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  </Field>
                )}
              />
            </div>

            <FormField
              control={control}
              name="timezone"
              render={({ field }) => {
                const selectedTimezone = timezones.find(
                  (tz) => tz.id === field.value
                );
                return (
                  <SmartSelect
                    label="Select City"
                    options={timezones}
                    value={selectedTimezone || null}
                    onChange={(timezone) => {
                      if (timezone && !Array.isArray(timezone)) {
                        field.onChange(timezone.id);
                      }
                    }}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => String(o.id)}
                  />
                );
              }}
            />

            <SmartSelect<Timezone, true>
              label="Tags"
              options={timezones}
              value={selectedTimeZones}
              onChange={setSelectedTimezones}
              getOptionLabel={(o) => o.name}
              getOptionValue={(o) => o.id}
              isMulti
              isCreatable
              menuPortalTarget={document.body}
            />
          </>
        )}
        <Button onClick={handleNext}>Next</Button>
      </div>
    </Form>
  );
};

export default SchedulingForm;
