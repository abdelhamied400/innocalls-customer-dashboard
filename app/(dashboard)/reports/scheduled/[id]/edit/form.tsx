"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { Option } from "@/components/Select";
import VirtualizedSelect from "@/components/VirtualizedSelect";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { timezones } from "@/constants/timezones";
import {
  REPORT_OPTIONS,
  shouldShowIncludeInternalCalls,
  shouldShowExtensions,
  shouldShowQueue,
  shouldShowSla,
} from "@/constants/reports";
import { useTranslations } from "@/providers/TranslationProvider";
import { CheckCircleOutline } from "@mui/icons-material";
import { ChevronLeftIcon, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { format, addDays, setHours, setMinutes, setDate, parse } from "date-fns";
import scheduledReportsService from "@/services/scheduled-reports.service";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  ReportType,
  ScheduledReportFrequency,
  UpdateScheduledReportPayload,
} from "@/types/api/report";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useVocab } from "@/hooks/useVocab";

type WeekDay = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

const WEEK_DAYS: WeekDay[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

type EditReportFormProps = {
  reportId: string;
};

const EditReportForm = ({ reportId }: EditReportFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const t = useTranslations("reports.scheduled.editReport");
  const tCreate = useTranslations("reports.scheduled.createReport");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { extensions: vocabExtensions, ergs } = useVocab();

  // Fetch report data
  const { data: report, isLoading } = useLocalizedQuery({
    queryKey: ["scheduled-report", reportId],
    queryFn: () => scheduledReportsService.fetchById(reportId),
  });

  // Step 1: Report Details
  const [reportName, setReportName] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedReport, setSelectedReport] = useState<Option | null>(null);
  const [dateRangeStart, setDateRangeStart] = useState<Option | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<Option | null>(null);
  const [queue, setQueue] = useState<Option | null>(null);
  const [extensions, setExtensions] = useState("");
  const [sla, setSla] = useState("");
  const [includeInternalCalls, setIncludeInternalCalls] = useState(false);

  // Step 2: Schedule
  const [timezone, setTimezone] = useState<Option | null>(null);
  const [frequency, setFrequency] = useState<Option | null>(null);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [monthDay, setMonthDay] = useState<Option | null>(null);
  const [atTime, setAtTime] = useState("10:00");

  // Get the selected report type
  const reportType = selectedReport?.value as ReportType | undefined;

  // Determine which fields to show based on selected report type
  const showIncludeInternalCalls = shouldShowIncludeInternalCalls(reportType);
  const showExtensions = shouldShowExtensions(reportType);
  const showQueue = shouldShowQueue(reportType);
  const showSla = shouldShowSla(reportType);

  // Options - Report types from constants
  const reportOptions: Option[] = REPORT_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  // Date range start options: today, previous_day, previous_week, previous_month
  const dateRangeStartOptions: Option[] = [
    { label: tCreate("form.fields.dateRange.options.today"), value: "today" },
    { label: tCreate("form.fields.dateRange.options.previousDay"), value: "previous_day" },
    { label: tCreate("form.fields.dateRange.options.previousWeek"), value: "previous_week" },
    { label: tCreate("form.fields.dateRange.options.previousMonth"), value: "previous_month" },
  ];

  // Date range end options: today, previous_day
  const dateRangeEndOptions: Option[] = [
    { label: tCreate("form.fields.dateRange.options.today"), value: "today" },
    { label: tCreate("form.fields.dateRange.options.previousDay"), value: "previous_day" },
  ];

  // Queue options from vocab
  const queueOptions: Option[] = useMemo(
    () =>
      ergs?.map((erg) => ({
        label: erg.name,
        value: erg.name,
      })) || [],
    [ergs]
  );

  // Extension options from vocab
  const extensionOptions: Option[] = useMemo(
    () =>
      vocabExtensions?.map((ext) => ({
        label: `${ext.name} (${ext.ext})`,
        value: ext.ext,
      })) || [],
    [vocabExtensions]
  );

  const timezoneOptions = useMemo(
    () =>
      timezones.map((tz) => ({
        label: tz.name,
        value: tz.id,
      })),
    []
  );

  const frequencyOptions: Option[] = [
    { label: tCreate("form.fields.frequency.options.daily"), value: "daily" },
    { label: tCreate("form.fields.frequency.options.weekly"), value: "weekly" },
    { label: tCreate("form.fields.frequency.options.monthly"), value: "monthly" },
  ];

  const monthDayOptions: Option[] = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));

  const handleReportChange = (option: Option | null) => {
    setSelectedReport(option);
    // Reset conditional fields when report type changes
    setIncludeInternalCalls(false);
    setExtensions("");
    setQueue(null);
    setSla("");
  };

  // Initialize form with report data
  useEffect(() => {
    if (report && !isInitialized) {
      setReportName(report.name);
      setRecipients(report.recipients);
      setEmailSubject(report.emailSubject);
      setIncludeInternalCalls(report.reportConfig?.includeInternalCalls ?? false);

      // Set report type
      const reportOption = reportOptions.find((o) => o.value === report.report);
      if (reportOption) setSelectedReport(reportOption);

      // Set date range
      const dateRangeStartOption = dateRangeStartOptions.find(
        (o) => o.value === report.reportConfig?.dateRangeStart
      );
      if (dateRangeStartOption) setDateRangeStart(dateRangeStartOption);

      const dateRangeEndOption = dateRangeEndOptions.find(
        (o) => o.value === report.reportConfig?.dateRangeEnd
      );
      if (dateRangeEndOption) setDateRangeEnd(dateRangeEndOption);

      // Set queue
      if (report.reportConfig?.queue) {
        const queueOption = queueOptions.find(
          (o) => o.value === report.reportConfig?.queue
        );
        if (queueOption) setQueue(queueOption);
      }

      // Set extensions (convert array to comma-separated string)
      if (report.reportConfig?.extensions && report.reportConfig.extensions.length > 0) {
        setExtensions(report.reportConfig.extensions.join(","));
      }

      // Set SLA
      if (report.reportConfig?.sla) {
        setSla(String(report.reportConfig.sla));
      }

      // Set timezone
      const timezoneOption = timezoneOptions.find(
        (o) => o.value === report.timezone
      );
      if (timezoneOption) setTimezone(timezoneOption);

      // Set frequency
      const frequencyOption = frequencyOptions.find(
        (o) => o.value === report.frequency
      );
      if (frequencyOption) setFrequency(frequencyOption);

      // Set time - convert from "06:00 PM" to "18:00" format if needed
      if (report.time.includes("AM") || report.time.includes("PM")) {
        try {
          const parsedTime = parse(report.time, "hh:mm a", new Date());
          setAtTime(format(parsedTime, "HH:mm"));
        } catch {
          setAtTime(report.time);
        }
      } else {
        setAtTime(report.time);
      }

      // Set days of week for weekly frequency
      if (report.frequency === "weekly" && report.daysOfWeek) {
        const dayMap: Record<number, WeekDay> = {
          0: "sun",
          1: "mon",
          2: "tue",
          3: "wed",
          4: "thu",
          5: "fri",
          6: "sat",
        };
        const days = report.daysOfWeek.map((d) => dayMap[d]).filter(Boolean);
        setSelectedDays(days);
      }

      // Set day of month for monthly frequency
      if (report.frequency === "monthly" && report.dayOfMonth) {
        const monthDayOption = monthDayOptions.find(
          (o) => o.value === String(report.dayOfMonth)
        );
        if (monthDayOption) setMonthDay(monthDayOption);
      }

      setIsInitialized(true);
    }
  }, [report, isInitialized, timezoneOptions, queueOptions]);

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) && !recipients.includes(email)) {
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
      if (daysUntilNext === 7)
        daysUntilNext = Math.min(
          ...selectedDayNumbers.map((d) => (d - currentDay + 7) % 7 || 7)
        );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReport || !timezone || !frequency || !dateRangeStart || !dateRangeEnd) {
      toast({
        title: tCreate("messages.validationError"),
        variant: "destructive",
      });
      return;
    }

    const dayMap: Record<WeekDay, number> = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    // Build reportConfig based on report type
    const reportConfig: UpdateScheduledReportPayload["reportConfig"] = {
      dateRangeStart: dateRangeStart.value as string,
      dateRangeEnd: dateRangeEnd.value as string,
    };

    if (showIncludeInternalCalls) {
      reportConfig.includeInternalCalls = includeInternalCalls;
    }

    if (showExtensions && extensions.trim()) {
      // Convert comma-separated string to array for API
      reportConfig.extensions = extensions
        .split(",")
        .map((ext) => ext.trim())
        .filter(Boolean);
    }

    if (showQueue && queue) {
      reportConfig.queue = queue.value as string;
    }

    if (showSla && sla.trim()) {
      reportConfig.sla = parseInt(sla, 10);
    }

    const payload: UpdateScheduledReportPayload = {
      name: reportName,
      recipients,
      emailSubject,
      report: selectedReport.value as ReportType,
      reportConfig,
      timezone: timezone.value as string,
      frequency: frequency.value as ScheduledReportFrequency,
      time: atTime,
      ...(frequency.value === "weekly" &&
        selectedDays.length > 0 && {
          daysOfWeek: selectedDays.map((d) => dayMap[d]),
        }),
      ...(frequency.value === "monthly" &&
        monthDay && {
          dayOfMonth: parseInt(monthDay.value as string),
        }),
    };

    try {
      setIsSubmitting(true);
      await scheduledReportsService.update(reportId, payload);

      toast({
        title: t("messages.updateSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
      queryClient.invalidateQueries({ queryKey: ["scheduled-report", reportId] });
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: t("messages.updateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextGeneration = calculateNextGeneration();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Stepper
      steps={[tCreate("steps.details"), tCreate("steps.schedule")]}
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
            <p>{tCreate("steps.details")}</p>
          </StepperHeaderTitle>
          <StepperHeaderTitle idx={1}>
            <p>{tCreate("steps.schedule")}</p>
          </StepperHeaderTitle>
        </div>
        <Button
          size="icon"
          variant="unstyled"
          onClick={() => router.push("/reports/scheduled")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{tCreate("actions.close")}</span>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        {isSuccess ? (
          <div className="p-8 rounded-xl bg-white flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-48 h-48 flex justify-center items-center border rounded-full bg-success-100">
              <CheckCircleOutline className="h-16 w-16 text-success-500" />
            </div>
            <h2 className="text-xl font-semibold">{t("success.title")}</h2>
            <p className="text-muted-foreground">{t("success.subtitle")}</p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Button asChild className="w-full">
                <Link href="/reports/scheduled">{t("success.backToReports")}</Link>
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
                <Field
                  label={tCreate("form.fields.reportName.label")}
                  htmlFor="reportName"
                >
                  <Input
                    id="reportName"
                    variant="field"
                    placeholder={tCreate("form.fields.reportName.placeholder")}
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </Field>

                {/* Recipients */}
                <Field
                  label={tCreate("form.fields.recipients.label")}
                  htmlFor="editRecipients"
                  hint={tCreate("form.fields.recipients.hint")}
                >
                  <Input
                    id="editRecipients"
                    variant="field"
                    type="email"
                    placeholder={tCreate("form.fields.recipients.placeholder")}
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
                <Field
                  label={tCreate("form.fields.emailSubject.label")}
                  htmlFor="emailSubject"
                >
                  <Input
                    id="emailSubject"
                    variant="field"
                    placeholder={tCreate("form.fields.emailSubject.placeholder")}
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </Field>

                {/* Report Select */}
                <Select
                  label={tCreate("form.fields.report.label")}
                  options={reportOptions}
                  value={selectedReport}
                  onChange={handleReportChange}
                  placeholder={tCreate("form.fields.report.placeholder")}
                />

                {/* Date Range Start */}
                <Select
                  label={tCreate("form.fields.dateRangeStart.label")}
                  options={dateRangeStartOptions}
                  value={dateRangeStart}
                  onChange={(option) => setDateRangeStart(option)}
                  placeholder={tCreate("form.fields.dateRangeStart.placeholder")}
                />

                {/* Date Range End */}
                <Select
                  label={tCreate("form.fields.dateRangeEnd.label")}
                  options={dateRangeEndOptions}
                  value={dateRangeEnd}
                  onChange={(option) => setDateRangeEnd(option)}
                  placeholder={tCreate("form.fields.dateRangeEnd.placeholder")}
                />

                {/* Queue Select - Only for Inbound Queue Reports */}
                {showQueue && (
                  <Select
                    label={tCreate("form.fields.queue.label")}
                    options={queueOptions}
                    value={queue}
                    onChange={(option) => setQueue(option)}
                    placeholder={tCreate("form.fields.queue.placeholder")}
                  />
                )}

                {/* Extensions Select */}
                {showExtensions && (() => {
                  // Parse comma-separated string to array for multi-select
                  const selectedValues = extensions
                    ? extensions.split(",").map((v) => v.trim()).filter(Boolean)
                    : [];
                  const selectedOptions = extensionOptions.filter((opt) =>
                    selectedValues.includes(String(opt.value))
                  );

                  return (
                    <Select
                      label={tCreate("form.fields.extensions.label")}
                      options={extensionOptions}
                      value={selectedOptions}
                      onChange={(options) => {
                        // Convert array of options to comma-separated string
                        const values = Array.isArray(options)
                          ? options.map((opt: any) => opt.value).join(",")
                          : "";
                        setExtensions(values);
                      }}
                      placeholder={tCreate("form.fields.extensions.placeholder")}
                      isMulti
                    />
                  );
                })()}

                {/* SLA Input */}
                {showSla && (
                  <Field
                    label={tCreate("form.fields.sla.label")}
                    hint={tCreate("form.fields.sla.hint")}
                    htmlFor="editSla"
                  >
                    <Input
                      id="editSla"
                      variant="field"
                      type="number"
                      min={1}
                      placeholder={tCreate("form.fields.sla.placeholder")}
                      value={sla}
                      onChange={(e) => setSla(e.target.value)}
                    />
                  </Field>
                )}

                {/* Include Internal Calls */}
                {showIncludeInternalCalls && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="editIncludeInternalCalls"
                      checked={includeInternalCalls}
                      onCheckedChange={(checked) =>
                        setIncludeInternalCalls(checked === true)
                      }
                    />
                    <Label htmlFor="editIncludeInternalCalls" className="cursor-pointer">
                      {tCreate("form.fields.includeInternalCalls.label")}
                    </Label>
                  </div>
                )}

                <Button onClick={handleNext} className="w-full mt-4">
                  {tCreate("actions.next")}
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
                  label={tCreate("form.fields.timezone.label")}
                  options={timezoneOptions}
                  value={timezone}
                  onChange={(option) => setTimezone(option)}
                  placeholder={tCreate("form.fields.timezone.placeholder")}
                />

                {/* Frequency */}
                <Select
                  label={tCreate("form.fields.frequency.label")}
                  options={frequencyOptions}
                  value={frequency}
                  onChange={(option) => setFrequency(option)}
                  placeholder={tCreate("form.fields.frequency.placeholder")}
                />

                {/* Weekly: Day checkboxes */}
                {frequency?.value === "weekly" && (
                  <div className="flex flex-col gap-2">
                    <Label>{tCreate("form.fields.days.label")}</Label>
                    <div className="flex flex-wrap gap-3">
                      {WEEK_DAYS.map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          <Checkbox
                            id={`edit-${day}`}
                            checked={selectedDays.includes(day)}
                            onCheckedChange={() => handleDayToggle(day)}
                          />
                          <Label htmlFor={`edit-${day}`} className="cursor-pointer">
                            {tCreate(`form.fields.days.options.${day}`)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly: Day number select */}
                {frequency?.value === "monthly" && (
                  <Select
                    label={tCreate("form.fields.monthDay.label")}
                    options={monthDayOptions}
                    value={monthDay}
                    onChange={(option) => setMonthDay(option)}
                    placeholder={tCreate("form.fields.monthDay.placeholder")}
                  />
                )}

                {/* At Time */}
                {frequency && (
                  <Field
                    label={tCreate("form.fields.atTime.label")}
                    htmlFor="editAtTime"
                  >
                    <Input
                      id="editAtTime"
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
                      {tCreate("form.nextGeneration.title")}
                    </h4>
                    <p className="text-lg font-medium">
                      {format(nextGeneration, "d MMM yyyy")}{" "}
                      {tCreate("form.nextGeneration.at")}{" "}
                      {format(nextGeneration, "h:mm a")}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {t("actions.update")}
                </Button>
              </form>
            </StepperStep>
          </>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default EditReportForm;
