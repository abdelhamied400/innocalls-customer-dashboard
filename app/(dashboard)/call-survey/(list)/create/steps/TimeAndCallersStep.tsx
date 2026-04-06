"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Select from "@/components/Select";
import TimePicker from "@/components/ui/time-picker";
import CallerIdSelector from "@/components/CallerIdSelector";
import { Add, DeleteOutline } from "@mui/icons-material";
import { timezones, Timezone } from "@/constants/timezones";
import type { CreateSurveyForm } from "../schema";

const timezoneOptions = timezones.map((tz) => ({
  label: tz.name,
  value: tz.id,
}));

const TimeAndCallersStep = () => {
  const t = useTranslations("callSurvey.create.form");
  const { control, formState: { errors } } = useFormContext<CreateSurveyForm>();
  const {
    fields: timeSlotFields,
    append: appendTimeSlot,
    remove: removeTimeSlot,
  } = useFieldArray({ control, name: "timeSlots" });

  return (
    <div className="flex flex-col gap-8">
      {/* Timezone */}
      <FormField
        control={control}
        name="timezone"
        render={({ field }) => (
          <FormItem className="max-w-md">
            <FormLabel>{t("timezone.label")}</FormLabel>
            <FormControl>
              <Select
                options={timezoneOptions}
                value={
                  timezoneOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(opt) => field.onChange(opt?.value || "")}
                placeholder={t("timezone.placeholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Time Slots */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="m-0">{t("timeSlots.title")}</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendTimeSlot({ fromTime: "", toTime: "" })}
          >
            <Add sx={{ fontSize: 16 }} className="me-1" />
            {t("timeSlots.add")}
          </Button>
        </div>

        {timeSlotFields.map((field, idx) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 flex items-start gap-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-4">
              <FormField
                control={control}
                name={`timeSlots.${idx}.fromTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("timeSlots.from.label")}</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("timeSlots.from.placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`timeSlots.${idx}.toTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("timeSlots.to.label")}</FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("timeSlots.to.placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {timeSlotFields.length > 1 && (
              <Button
                type="button"
                variant="ghost-destructive"
                size="icon"
                className="mt-7"
                onClick={() => removeTimeSlot(idx)}
              >
                <DeleteOutline fontSize="small" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Caller IDs */}
      <div className="flex flex-col gap-4">
        <h4 className="m-0">{t("callers.title")}</h4>
        <CallerIdSelector />
      </div>
    </div>
  );
};

export default TimeAndCallersStep;
