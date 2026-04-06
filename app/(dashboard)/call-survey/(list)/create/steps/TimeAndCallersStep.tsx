"use client";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import Select from "@/components/Select";
import TimePicker from "@/components/ui/time-picker";
import CallerIdSelector from "@/components/CallerIdSelector";
import { Add, DeleteOutline, Info, InfoOutlined } from "@mui/icons-material";
import { timezones } from "@/constants/timezones";
import type { CreateSurveyForm } from "../schema";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const timezoneOptions = timezones.map((tz) => ({
  label: tz.name,
  value: tz.id,
}));

type TimeAndCallersStepProps = {
  onNext: () => void;
};

const TimeAndCallersStep = ({ onNext }: TimeAndCallersStepProps) => {
  const t = useTranslations("callSurvey.create.form");
  const tActions = useTranslations("callSurvey.create.actions");
  const form = useFormContext<CreateSurveyForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    trigger,
    clearErrors,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const {
    fields: timeSlotFields,
    append: appendTimeSlot,
    remove: removeTimeSlot,
  } = useFieldArray({ control, name: "timeSlots" });

  const handleNext = async () => {
    const isValid = await trigger(["timezone", "timeSlots", "callers"]);
    if (!isValid) return;
    clearErrors();

    try {
      setIsSubmitting(true);
      await onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <h4 className="m-0">{t("timeSlots.title")}</h4>
        {/* Timezone */}
        <FormField
          control={control}
          name="timezone"
          render={({ field }) => (
            <Select
              options={timezoneOptions}
              value={
                timezoneOptions.find((opt) => opt.value === field.value) || null
              }
              label={t("timezone.label")}
              onChange={(opt) => field.onChange(opt?.value || "")}
              placeholder={t("timezone.placeholder")}
            />
          )}
        />

        {/* Time Slots */}
        <div className="flex flex-col gap-4 border rounded-lg p-4">
          {timeSlotFields.map((field, idx) => (
            <div key={field.id} className="flex items-start gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 gap-4">
                <Field
                  label={t("timeSlots.from.label")}
                  error={errors.timeSlots?.[idx]?.fromTime?.message}
                >
                  <TimePicker
                    value={watch(`timeSlots.${idx}.fromTime`)}
                    onChange={(val) =>
                      setValue(`timeSlots.${idx}.fromTime`, val || "", {
                        shouldValidate: true,
                      })
                    }
                    placeholder={t("timeSlots.from.placeholder")}
                  />
                </Field>
                <Field
                  label={t("timeSlots.to.label")}
                  error={errors.timeSlots?.[idx]?.toTime?.message}
                >
                  <TimePicker
                    value={watch(`timeSlots.${idx}.toTime`)}
                    onChange={(val) =>
                      setValue(`timeSlots.${idx}.toTime`, val || "", {
                        shouldValidate: true,
                      })
                    }
                    placeholder={t("timeSlots.to.placeholder")}
                  />
                </Field>
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
        <div className="">
          <Button
            type="button"
            variant="link"
            onClick={() => appendTimeSlot({ fromTime: "", toTime: "" })}
          >
            <Add sx={{ fontSize: 16 }} className="me-1" />
            {t("timeSlots.add")}
          </Button>
        </div>

        {/* Caller IDs */}
        <div className="flex flex-col gap-4">
          <h4 className="m-0">{t("callers.title")}</h4>
          <Alert variant="info">
            <InfoOutlined />
            <AlertTitle>
              {t("callers.hint")}
            </AlertTitle>
          </Alert>
          <CallerIdSelector />
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? tActions("creating") : tActions("submit")}
        </Button>
      </div>
    </Form>
  );
};

export default TimeAndCallersStep;
