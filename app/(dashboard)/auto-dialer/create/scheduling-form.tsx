import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Select from "@/components/Select";
import VirtualizedSelect from "@/components/VirtualizedSelect";
import SpinButton from "@/components/ui/spin-button";
import { timezones } from "@/constants/timezones";
import { AutoDialerCreateStep3 } from "@/validation/AutoDialerCreateCampaign";
import { useFormContext } from "react-hook-form";
import TimePicker from "@/components/ui/time-picker";
import { useTranslations } from "@/providers/TranslationProvider";

type DurationType = {
  name: string;
  id: string;
};
const durationTypes: DurationType[] = [
  { name: "timeLimited", id: "time-limited" },
  { name: "agentAvailability", id: "agent-availability" },
];

type SchedulingFormProps = {
  onNext: () => void;
};
const SchedulingForm = ({}: SchedulingFormProps) => {
  const form = useFormContext<AutoDialerCreateStep3>();
  const t = useTranslations("autoDialer.createCampaign.steps.scheduling.form");

  const durationTypesOptions = durationTypes.map((type) => ({
    label: t(`durationType.options.${type.name}`),
    value: type.id,
  }));

  const timezonesOptions = timezones.map((tz) => ({
    label: tz.name,
    value: tz.id,
  }));

  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = form;

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
                label={t("durationType.label")}
                options={durationTypesOptions}
                value={selectedType}
                onChange={(option) => {
                  const value = option?.value || "";
                  setValue(`durationType`, value, {
                    shouldValidate: true,
                  });
                }}
                placeholder={t("durationType.placeholder")}
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
                    label={t("maxWaitTime.label")}
                    labelAlign="center"
                    hint={t("maxWaitTime.hint")}
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
                    label={t("fromTime.label")}
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
                          placeholder={t("fromTime.placeholder")}
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
                    label={t("toTime.label")}
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
                          placeholder={t("toTime.placeholder")}
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
                    label={t("timeZone.label")}
                    options={timezonesOptions}
                    placeholder={t("timeZone.placeholder")}
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("submitting") : t("next")}
        </Button>
      </div>
    </Form>
  );
};

export default SchedulingForm;
