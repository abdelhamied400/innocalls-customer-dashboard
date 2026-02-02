"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Select from "@/components/Select";
import VirtualizedSelect from "@/components/VirtualizedSelect";
import { StepperStep } from "@/components/ui/stepper";
import { timezones } from "@/constants/timezones";
import { useTranslations } from "@/providers/TranslationProvider";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { format, addDays, setHours, setMinutes, setDate } from "date-fns";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScheduleStepProps, WeekDay } from "@/types/scheduled-report-form";
import { WEEK_DAYS, DAY_MAP, TIME_OPTIONS, MONTH_DAY_OPTIONS } from "@/constants/scheduled-reports";

const ScheduleStep = ({ form, onSubmit, isSubmitting }: ScheduleStepProps) => {
  const t = useTranslations("reports.scheduled.createReport");

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const frequency = watch("frequency");
  const selectedDays = watch("daysOfWeek") || [];
  const atTime = watch("time");
  const monthDay = watch("dayOfMonth");

  const timezoneOptions = useMemo(
    () =>
      timezones.map((tz) => ({
        label: tz.name,
        value: tz.id,
      })),
    [],
  );

  const frequencyOptions = [
    { label: t("form.fields.frequency.options.daily"), value: "daily" },
    { label: t("form.fields.frequency.options.weekly"), value: "weekly" },
    { label: t("form.fields.frequency.options.monthly"), value: "monthly" },
  ];

  const handleDayToggle = (day: WeekDay) => {
    const currentDays = selectedDays as WeekDay[];
    if (currentDays.includes(day)) {
      setValue(
        "daysOfWeek",
        currentDays.filter((d) => d !== day),
      );
    } else {
      setValue("daysOfWeek", [...currentDays, day]);
    }
  };

  const calculateNextGeneration = () => {
    const now = new Date();
    const [hours, minutes] = (atTime || "10:00").split(":").map(Number);

    let nextDate = setHours(setMinutes(now, minutes), hours);

    if (frequency === "daily") {
      if (nextDate <= now) {
        nextDate = addDays(nextDate, 1);
      }
    } else if (frequency === "weekly" && selectedDays.length > 0) {
      const selectedDayNumbers = (selectedDays as WeekDay[]).map(
        (d) => DAY_MAP[d],
      );
      const currentDay = now.getDay();

      let daysUntilNext = 7;
      for (const dayNum of selectedDayNumbers) {
        const diff = (dayNum - currentDay + 7) % 7;
        if (diff === 0 && nextDate > now) {
          daysUntilNext = 0;
          break;
        } else if (diff > 0 && diff < daysUntilNext) {
          daysUntilNext = diff;
        }
      }
      if (daysUntilNext === 7)
        daysUntilNext = Math.min(
          ...selectedDayNumbers.map((d) => (d - currentDay + 7) % 7 || 7),
        );
      nextDate = addDays(
        setHours(setMinutes(now, minutes), hours),
        daysUntilNext,
      );
    } else if (frequency === "monthly" && monthDay) {
      const targetDay = parseInt(monthDay);
      nextDate = setDate(setHours(setMinutes(now, minutes), hours), targetDay);
      if (nextDate <= now) {
        nextDate = setDate(addDays(nextDate, 32), targetDay);
        nextDate = setDate(nextDate, targetDay);
      }
    }

    return nextDate;
  };

  const nextGeneration = calculateNextGeneration();

  return (
    <StepperStep idx={1} className="p-4 rounded-xl bg-white flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Timezone */}
        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <VirtualizedSelect
                  label={t("form.fields.timezone.label")}
                  options={timezoneOptions}
                  value={
                    field.value
                      ? timezoneOptions.find((opt) => opt.value === field.value)
                      : null
                  }
                  onChange={(option) =>
                    field.onChange(option?.value?.toString() || "")
                  }
                  placeholder={t("form.fields.timezone.placeholder")}
                  error={errors.timezone?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Frequency */}
        <FormField
          control={control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  classNames={{
                    valueContainer: () => "font-semibold",
                    menuList: () => "font-semibold",
                  }}
                  label={t("form.fields.frequency.label")}
                  options={frequencyOptions}
                  value={
                    field.value
                      ? frequencyOptions.find((opt) => opt.value === field.value)
                      : null
                  }
                  onChange={(option) =>
                    field.onChange(option?.value?.toString() || "")
                  }
                  placeholder={t("form.fields.frequency.placeholder")}
                  error={errors.frequency?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Weekly: Day checkboxes */}
        {frequency === "weekly" && (
          <div className="flex flex-col gap-2">
            <Label>{t("form.fields.days.label")}</Label>
            <div className="flex flex-wrap gap-3">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <Checkbox
                    id={day}
                    checked={(selectedDays as WeekDay[]).includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={day} className="cursor-pointer">
                    {t(`form.fields.days.options.${day}`)}
                  </Label>
                </div>
              ))}
            </div>
            {errors.daysOfWeek?.message && (
              <p className="text-sm text-destructive">
                {errors.daysOfWeek.message}
              </p>
            )}
          </div>
        )}

        {/* Monthly: Day number select */}
        {frequency === "monthly" && (
          <FormField
            control={control}
            name="dayOfMonth"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    classNames={{
                      valueContainer: () => "font-semibold",
                      menuList: () => "font-semibold",
                    }}
                    label={t("form.fields.monthDay.label")}
                    options={MONTH_DAY_OPTIONS}
                    value={
                      field.value
                        ? MONTH_DAY_OPTIONS.find(
                            (opt) => opt.value === field.value,
                          )
                        : null
                    }
                    onChange={(option) =>
                      field.onChange(option?.value?.toString() || "")
                    }
                    placeholder={t("form.fields.monthDay.placeholder")}
                    error={errors.dayOfMonth?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* At Time */}
        {frequency && (
          <FormField
            control={control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    classNames={{
                      valueContainer: () => "font-semibold",
                      menuList: () => "font-semibold",
                    }}
                    label={t("form.fields.atTime.label")}
                    options={TIME_OPTIONS}
                    value={
                      field.value
                        ? TIME_OPTIONS.find((opt) => opt.value === field.value)
                        : null
                    }
                    onChange={(option) =>
                      field.onChange(option?.value?.toString() || "")
                    }
                    placeholder={t("form.fields.atTime.placeholder")}
                    error={errors.time?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Next Generation Card */}
        {frequency && (
          <div className="p-4 rounded-lg border bg-info-200 mt-4">
            <h3 className="font-semibold mb-2">
              {t("form.nextGeneration.title")}
            </h3>
            <p className="font-medium">
              {format(nextGeneration, "d MMM yyyy")}{" "}
              {t("form.nextGeneration.at")} {format(nextGeneration, "h:mm a")}
            </p>
          </div>
        )}

        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("actions.submit")}
        </Button>
      </form>
    </StepperStep>
  );
};

export default ScheduleStep;
