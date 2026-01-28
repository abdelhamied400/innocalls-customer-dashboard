"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { Option } from "@/components/Select";
import VirtualizedSelect from "@/components/VirtualizedSelect";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { timezones } from "@/constants/timezones";
import { useTranslations } from "@/providers/TranslationProvider";
import { HourglassEmpty } from "@mui/icons-material";
import { Calendar, ChevronLeftIcon, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useMemo } from "react";
import { format, addDays, setHours, setMinutes, setDate } from "date-fns";

type FrequencyType = "daily" | "weekly" | "monthly";
type WeekDay = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

const WEEK_DAYS: WeekDay[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

const CreateReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("reports.scheduled.createReport");
  const closeSheetRef = useRef<HTMLButtonElement>(null);

  // Step 1: Report Details
  const [reportName, setReportName] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [report, setReport] = useState<Option | null>(null);
  const [type, setType] = useState<Option | null>(null);
  const [queue, setQueue] = useState<Option | null>(null);

  // Step 2: Schedule
  const [timezone, setTimezone] = useState<Option | null>(null);
  const [frequency, setFrequency] = useState<Option | null>(null);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [monthDay, setMonthDay] = useState<Option | null>(null);
  const [atTime, setAtTime] = useState("10:00");

  // Options
  const reportOptions: Option[] = [
    { label: t("form.fields.report.options.agent"), value: "agent" },
    { label: t("form.fields.report.options.admin"), value: "admin" },
  ];

  const typeOptions: Option[] = [
    { label: t("form.fields.type.options.perQueue"), value: "per_queue" },
  ];

  const queueOptions: Option[] = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];

  const timezoneOptions = useMemo(
    () =>
      timezones.map((tz) => ({
        label: tz.name,
        value: tz.id,
      })),
    []
  );

  const frequencyOptions: Option[] = [
    { label: t("form.fields.frequency.options.daily"), value: "daily" },
    { label: t("form.fields.frequency.options.weekly"), value: "weekly" },
    { label: t("form.fields.frequency.options.monthly"), value: "monthly" },
  ];

  const monthDayOptions: Option[] = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim();
      if (email.includes("@") && !recipients.includes(email)) {
        setRecipients([...recipients, email]);
        setEmailInput("");
      }
    }
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter((email) => email !== emailToRemove));
  };

  const handleDayToggle = (day: WeekDay) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const calculateNextGeneration = () => {
    const now = new Date();
    const [hours, minutes] = atTime.split(":").map(Number);

    let nextDate = setHours(setMinutes(now, minutes), hours);

    if (frequency?.value === "daily") {
      if (nextDate <= now) {
        nextDate = addDays(nextDate, 1);
      }
    } else if (frequency?.value === "weekly" && selectedDays.length > 0) {
      // Find the next occurrence of a selected day
      const dayMap: Record<WeekDay, number> = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
      };
      const selectedDayNumbers = selectedDays.map((d) => dayMap[d]);
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
      if (daysUntilNext === 7) daysUntilNext = Math.min(...selectedDayNumbers.map((d) => (d - currentDay + 7) % 7 || 7));
      nextDate = addDays(setHours(setMinutes(now, minutes), hours), daysUntilNext);
    } else if (frequency?.value === "monthly" && monthDay) {
      const targetDay = parseInt(monthDay.value as string);
      nextDate = setDate(setHours(setMinutes(now, minutes), hours), targetDay);
      if (nextDate <= now) {
        nextDate = setDate(addDays(nextDate, 32), targetDay);
        nextDate = setDate(nextDate, targetDay);
      }
    }

    return nextDate;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      reportName,
      recipients,
      emailSubject,
      report: report?.value,
      type: type?.value,
      queue: queue?.value,
      timezone: timezone?.value,
      frequency: frequency?.value,
      selectedDays,
      monthDay: monthDay?.value,
      atTime,
    });
    setIsSuccess(true);
  };

  const nextGeneration = calculateNextGeneration();

  return (
    <Stepper
      steps={[t("steps.details"), t("steps.schedule")]}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("steps.details")}</p>
          </StepperHeaderTitle>
          <StepperHeaderTitle idx={1}>
            <p>{t("steps.schedule")}</p>
          </StepperHeaderTitle>
        </div>
        <Button size="icon" asChild variant="unstyled">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        {isSuccess ? (
          <div className="p-8 rounded-xl bg-white flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-48 h-48 flex justify-center items-center border rounded-full bg-warning-100">
              <HourglassEmpty className="h-16 w-16 text-warning-500" />
            </div>
            <h2 className="text-xl font-semibold">{t("success.title")}</h2>
            <p className="text-muted-foreground">{t("success.subtitle")}</p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Button asChild className="w-full">
                <Link href="/reports/scheduled">
                  {t("success.backToReports")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">{t("success.backToDashboard")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Report Details */}
            <StepperStep
              idx={0}
              className="p-4 rounded-xl bg-white flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4">
                {/* Report Name */}
                <Field label={t("form.fields.reportName.label")} htmlFor="reportName">
                  <Input
                    id="reportName"
                    variant="field"
                    placeholder={t("form.fields.reportName.placeholder")}
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </Field>

                {/* Recipients */}
                <Field label={t("form.fields.recipients.label")} htmlFor="recipients">
                  <Input
                    id="recipients"
                    variant="field"
                    type="email"
                    placeholder={t("form.fields.recipients.placeholder")}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleAddRecipient}
                  />
                </Field>
                {recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 -mt-2">
                    {recipients.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1">
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(email)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Email Subject */}
                <Field label={t("form.fields.emailSubject.label")} htmlFor="emailSubject">
                  <Input
                    id="emailSubject"
                    variant="field"
                    placeholder={t("form.fields.emailSubject.placeholder")}
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </Field>

                {/* Report Select */}
                <Select
                  label={t("form.fields.report.label")}
                  options={reportOptions}
                  value={report}
                  onChange={(option) => setReport(option)}
                  placeholder={t("form.fields.report.placeholder")}
                />

                {/* Type Select */}
                <Select
                  label={t("form.fields.type.label")}
                  options={typeOptions}
                  value={type}
                  onChange={(option) => setType(option)}
                  placeholder={t("form.fields.type.placeholder")}
                />

                {/* Queue Select */}
                <Select
                  label={t("form.fields.queue.label")}
                  options={queueOptions}
                  value={queue}
                  onChange={(option) => setQueue(option)}
                  placeholder={t("form.fields.queue.placeholder")}
                />

                <Button onClick={handleNext} className="w-full mt-4">
                  {t("actions.next")}
                </Button>
              </div>
            </StepperStep>

            {/* Step 2: Schedule */}
            <StepperStep
              idx={1}
              className="p-4 rounded-xl bg-white flex flex-col gap-4"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Timezone */}
                <VirtualizedSelect
                  label={t("form.fields.timezone.label")}
                  options={timezoneOptions}
                  value={timezone}
                  onChange={(option) => setTimezone(option)}
                  placeholder={t("form.fields.timezone.placeholder")}
                />

                {/* Frequency */}
                <Select
                  label={t("form.fields.frequency.label")}
                  options={frequencyOptions}
                  value={frequency}
                  onChange={(option) => setFrequency(option)}
                  placeholder={t("form.fields.frequency.placeholder")}
                />

                {/* Weekly: Day checkboxes */}
                {frequency?.value === "weekly" && (
                  <div className="flex flex-col gap-2">
                    <Label>{t("form.fields.days.label")}</Label>
                    <div className="flex flex-wrap gap-3">
                      {WEEK_DAYS.map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          <Checkbox
                            id={day}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={() => handleDayToggle(day)}
                          />
                          <Label htmlFor={day} className="cursor-pointer">
                            {t(`form.fields.days.options.${day}`)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly: Day number select */}
                {frequency?.value === "monthly" && (
                  <Select
                    label={t("form.fields.monthDay.label")}
                    options={monthDayOptions}
                    value={monthDay}
                    onChange={(option) => setMonthDay(option)}
                    placeholder={t("form.fields.monthDay.placeholder")}
                  />
                )}

                {/* At Time */}
                {frequency && (
                  <Field label={t("form.fields.atTime.label")} htmlFor="atTime">
                    <Input
                      id="atTime"
                      variant="field"
                      type="time"
                      value={atTime}
                      onChange={(e) => setAtTime(e.target.value)}
                    />
                  </Field>
                )}

                {/* Next Generation Card */}
                {frequency && (
                  <div className="p-4 rounded-lg border bg-gray-50 mt-4">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                      {t("form.nextGeneration.title")}
                    </h4>
                    <p className="text-lg font-medium">
                      {format(nextGeneration, "d MMM yyyy")} {t("form.nextGeneration.at")}{" "}
                      {format(nextGeneration, "h:mm a")}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full mt-4">
                  {t("actions.submit")}
                </Button>
              </form>
            </StepperStep>
          </>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default CreateReportForm;
