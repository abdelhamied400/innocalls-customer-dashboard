import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Select, { Option } from "@/components/Select";
import VirtualizedSelect from "@/components/VirtualizedSelect";
import SpinButton from "@/components/ui/spin-button";
import { timezones } from "@/constants/timezones";
import {
  AutoDialerUpdateStep3,
  AutoDialerUpdateStep3Schema,
} from "@/validation/AutoDialerUpdateCampaign";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import TimePicker from "@/components/ui/time-picker";
import autoDialerService from "@/services/auto-dialer.service";
import { useParams } from "next/navigation";

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
  const { id } = useParams();
  const form = useFormContext<AutoDialerUpdateStep3>();

  const durationTypesOptions = durationTypes.map((type) => ({
    label: type.name,
    value: type.id,
  }));

  const timezonesOptions = timezones.map((tz) => ({
    label: tz.name,
    value: tz.id,
  }));

  const {
    getValues,
    watch,
    clearErrors,
    setError,
    control,
    setValue,
    formState: { errors },
  } = form;

  const handleNext = async () => {
    // validate the form
    const res = await AutoDialerUpdateStep3Schema.refine(
      (data) => {
        const { fromTime, toTime, durationType } = data;
        if (durationType === "time-limited" && fromTime && toTime) {
          return fromTime < toTime;
        }
        return true;
      },
      {
        path: ["toTime"],
        message: "To time must be greater than From time",
      }
    )
      .refine(
        (data) => {
          if (data.durationType === "time-limited" && !data.timezone) {
            return false;
          }
          return true;
        },
        {
          path: ["timezone"],
          message: "Timezone is required when duration type is time-limited",
        }
      )
      .refine(
        (data) => {
          if (data.durationType === "time-limited" && !data.fromTime) {
            return false;
          }
          return true;
        },
        {
          path: ["fromTime"],
          message: "From time is required when duration type is time-limited",
        }
      )
      .refine(
        (data) => {
          if (data.durationType === "time-limited" && !data.toTime) {
            return false;
          }
          return true;
        },
        {
          path: ["toTime"],
          message: "To time is required when duration type is time-limited",
        }
      )
      .safeParseAsync(getValues());

    if (!res.success) {
      setTimeout(() => {
        res.error.issues.forEach((issue) => {
          setError(issue.path[0] as keyof AutoDialerUpdateStep3, {
            type: "manual",
            message: issue.message,
          });
        });
      }, 0);

      return;
    }

    clearErrors();

    // sending to server
    try {
      const res = await autoDialerService.updateCampaign(
        id as string,
        getValues()
      );
      console.log(res);
    } catch (error) {
      console.log("Error creating campaign scheduling:", error);
    }

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
              durationTypesOptions.find((type) => type.value === field.value) ||
              null;
            return (
              <Select
                {...field}
                label="Duration Type"
                options={durationTypesOptions}
                value={selectedType}
                onChange={(option) => {
                  const value = option?.value || "";
                  setValue(`durationType`, value, {
                    shouldValidate: true,
                  });
                }}
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
                        <TimePicker
                          value={field.value}
                          onChange={(time) => setValue("fromTime", time)}
                          placeholder="Select time"
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
                        <TimePicker
                          value={field.value}
                          onChange={(time) => setValue("toTime", time)}
                          placeholder="Select time"
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
                return (
                  <VirtualizedSelect
                    label="Select City"
                    options={timezonesOptions}
                    placeholder="Select a timezone..."
                    error={errors.timezone?.message}
                    value={
                      timezonesOptions.find((tz) => tz.value === field.value) ||
                      null
                    }
                    onChange={(option) => {
                      const value = option?.value || "";
                      setValue(`timezone`, value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                );
              }}
            />
          </>
        )}
        <Button onClick={handleNext}>Next</Button>
      </div>
    </Form>
  );
};

export default SchedulingForm;
