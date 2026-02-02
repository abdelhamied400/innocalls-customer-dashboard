"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/Select";
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
import { ChevronLeftIcon, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { format, addDays, setHours, setMinutes, setDate } from "date-fns";
import scheduledReportsService from "@/services/scheduled-reports.service";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreateScheduledReportPayload,
  ReportType,
  ScheduledReportFrequency,
} from "@/types/api/report";
import { useVocab } from "@/hooks/useVocab";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createScheduledReportSchema, {
  CreateScheduledReportSchema,
} from "@/validation/CreateScheduledReport";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

type WeekDay = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

const WEEK_DAYS: WeekDay[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

const CreateReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const t = useTranslations("reports.scheduled.createReport");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { extensions: vocabExtensions, ergs } = useVocab();

  const form = useForm<CreateScheduledReportSchema>({
    resolver: zodResolver(createScheduledReportSchema(t)),
    defaultValues: {
      name: "",
      recipients: [],
      emailSubject: "",
      report: "",
      dateRangeStart: "",
      dateRangeEnd: "",
      queue: "",
      extensions: "",
      sla: "",
      includeInternalCalls: false,
      timezone: "",
      frequency: "",
      daysOfWeek: [],
      dayOfMonth: "",
      time: "10:00",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const reportType = watch("report") as ReportType | undefined;
  const recipients = watch("recipients");
  const frequency = watch("frequency");
  const selectedDays = watch("daysOfWeek") || [];
  const atTime = watch("time");
  const monthDay = watch("dayOfMonth");

  // Determine which fields to show based on selected report type
  const showIncludeInternalCalls = shouldShowIncludeInternalCalls(reportType);
  const showExtensions = shouldShowExtensions(reportType);
  const showQueue = shouldShowQueue(reportType);
  const showSla = shouldShowSla(reportType);

  // Queue options from vocab
  const queueOptions = useMemo(
    () =>
      ergs?.map((erg) => ({
        label: erg.name,
        value: erg.name,
      })) || [],
    [ergs],
  );

  // Extension options from vocab
  const extensionOptions = useMemo(
    () =>
      vocabExtensions?.map((ext) => ({
        label: `${ext.name} (${ext.ext})`,
        value: ext.ext,
      })) || [],
    [vocabExtensions],
  );

  const timezoneOptions = useMemo(
    () =>
      timezones.map((tz) => ({
        label: tz.name,
        value: tz.id,
      })),
    [],
  );

  // Date range start options
  const dateRangeStartOptions = [
    { label: t("form.fields.dateRange.options.today"), value: "today" },
    {
      label: t("form.fields.dateRange.options.previousDay"),
      value: "previous_day",
    },
    {
      label: t("form.fields.dateRange.options.previousWeek"),
      value: "previous_week",
    },
    {
      label: t("form.fields.dateRange.options.previousMonth"),
      value: "previous_month",
    },
  ];

  // Date range end options
  const dateRangeEndOptions = [
    { label: t("form.fields.dateRange.options.today"), value: "today" },
    {
      label: t("form.fields.dateRange.options.previousDay"),
      value: "previous_day",
    },
  ];

  const frequencyOptions = [
    { label: t("form.fields.frequency.options.daily"), value: "daily" },
    { label: t("form.fields.frequency.options.weekly"), value: "weekly" },
    { label: t("form.fields.frequency.options.monthly"), value: "monthly" },
  ];

  const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));

  // Generate time options for every hour (12:00 AM to 11:00 PM)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour24 = i;
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 < 12 ? "AM" : "PM";
    const label = `${hour12}:00 ${period}`;
    const value = `${hour24.toString().padStart(2, "0")}:00`;
    return { label, value };
  });

  const handleReportChange = (value: string) => {
    setValue("report", value);
    // Reset conditional fields when report type changes
    setValue("includeInternalCalls", false);
    setValue("extensions", "");
    setValue("queue", "");
    setValue("sla", "");
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setEmailError(t("form.validation.recipients.invalidEmail"));
        setTimeout(() => setEmailError(null), 2000);
        return;
      }

      if (recipients.includes(email)) {
        setEmailError(t("form.validation.recipients.duplicate"));
        setTimeout(() => setEmailError(null), 2000);
        return;
      }

      setValue("recipients", [...recipients, email]);
      setEmailInput("");
      setEmailError(null);
    }
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setValue(
      "recipients",
      recipients.filter((email) => email !== emailToRemove),
    );
  };

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
      const dayMap: Record<WeekDay, number> = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
      };
      const selectedDayNumbers = (selectedDays as WeekDay[]).map(
        (d) => dayMap[d],
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

  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate step 1 fields
      const step1Fields: (keyof CreateScheduledReportSchema)[] = [
        "name",
        "recipients",
        "emailSubject",
        "report",
        "dateRangeStart",
        "dateRangeEnd",
      ];

      // Add conditional fields to validation
      if (showQueue) {
        step1Fields.push("queue");
      }

      const isValid = await trigger(step1Fields);
      if (isValid) {
        setCurrentStep(1);
      }
    }
  };

  const onSubmit = async (data: CreateScheduledReportSchema) => {
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
    const reportConfig: CreateScheduledReportPayload["reportConfig"] = {
      dateRangeStart: data.dateRangeStart,
      dateRangeEnd: data.dateRangeEnd,
    };

    if (showIncludeInternalCalls) {
      reportConfig.includeInternalCalls = data.includeInternalCalls;
    }

    if (showExtensions && data.extensions?.trim()) {
      // Convert comma-separated string to array for API
      reportConfig.extensions = data.extensions;
    }

    if (showQueue && data.queue) {
      reportConfig.queue = data.queue;
    }

    if (showSla && data.sla?.trim()) {
      reportConfig.sla = parseInt(data.sla, 10);
    }

    const payload: CreateScheduledReportPayload = {
      name: data.name,
      recipients: data.recipients,
      emailSubject: data.emailSubject,
      report: data.report as ReportType,
      reportConfig,
      timezone: data.timezone,
      frequency: data.frequency as ScheduledReportFrequency,
      time: data.time,
      ...(data.frequency === "weekly" &&
        data.daysOfWeek &&
        data.daysOfWeek.length > 0 && {
          daysOfWeek: (data.daysOfWeek as WeekDay[]).map((d) => dayMap[d]),
        }),
      ...(data.frequency === "monthly" &&
        data.dayOfMonth && {
          dayOfMonth: parseInt(data.dayOfMonth),
        }),
    };

    try {
      await scheduledReportsService.create(payload);

      toast({
        title: t("messages.createSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: t("messages.createFailed"),
        variant: "destructive",
      });
    }
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
        <Button
          size="icon"
          variant="unstyled"
          onClick={() => router.push("/reports/scheduled")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("actions.close")}</span>
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
          <Form {...form}>
            <>
              {/* Step 1: Report Details */}
              <StepperStep
                idx={0}
                className="p-4 rounded-xl bg-white flex flex-col gap-4"
              >
                <div className="flex flex-col gap-4">
                  {/* Report Name */}
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Field
                            label={t("form.fields.reportName.label")}
                            htmlFor="reportName"
                            error={errors.name?.message}
                          >
                            <Input
                              id="reportName"
                              variant="field"
                              className="font-semibold placeholder:font-normal"
                              placeholder={t(
                                "form.fields.reportName.placeholder",
                              )}
                              {...field}
                            />
                          </Field>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Recipients */}
                  <Field
                    label={t("form.fields.recipients.label")}
                    htmlFor="recipients"
                    error={emailError || errors.recipients?.message}
                    hint={t("form.fields.recipients.hint")}
                  >
                    <Input
                      id="recipients"
                      variant="field"
                      type="email"
                      className="font-semibold placeholder:font-normal"
                      placeholder={t("form.fields.recipients.placeholder")}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleAddRecipient}
                    />
                  </Field>
                  {recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 -mt-2">
                      {recipients.map((email) => (
                        <Badge
                          key={email}
                          variant="secondary"
                          className="gap-1"
                        >
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
                  <FormField
                    control={control}
                    name="emailSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Field
                            label={t("form.fields.emailSubject.label")}
                            htmlFor="emailSubject"
                            error={errors.emailSubject?.message}
                          >
                            <Input
                              id="emailSubject"
                              variant="field"
                              className="font-semibold placeholder:font-normal"
                              placeholder={t(
                                "form.fields.emailSubject.placeholder",
                              )}
                              {...field}
                            />
                          </Field>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Report Select */}
                  <FormField
                    control={control}
                    name="report"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            classNames={{
                              valueContainer: () => "font-semibold",
                              menuList: () => "font-semibold",
                            }}
                            label={t("form.fields.report.label")}
                            options={REPORT_OPTIONS.map((opt) => ({
                              label: opt.label,
                              value: opt.value,
                            }))}
                            value={
                              field.value
                                ? REPORT_OPTIONS.find(
                                    (opt) => opt.value === field.value,
                                  )
                                : null
                            }
                            onChange={(option) =>
                              handleReportChange(
                                option?.value?.toString() || "",
                              )
                            }
                            placeholder={t("form.fields.report.placeholder")}
                            error={errors.report?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Date Range Start */}
                  <FormField
                    control={control}
                    name="dateRangeStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            classNames={{
                              valueContainer: () => "font-semibold",
                              menuList: () => "font-semibold",
                            }}
                            label={t("form.fields.dateRangeStart.label")}
                            options={dateRangeStartOptions}
                            value={
                              field.value
                                ? dateRangeStartOptions.find(
                                    (opt) => opt.value === field.value,
                                  )
                                : null
                            }
                            onChange={(option) =>
                              field.onChange(option?.value?.toString() || "")
                            }
                            placeholder={t(
                              "form.fields.dateRangeStart.placeholder",
                            )}
                            error={errors.dateRangeStart?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Date Range End */}
                  <FormField
                    control={control}
                    name="dateRangeEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            classNames={{
                              valueContainer: () => "font-semibold",
                              menuList: () => "font-semibold",
                            }}
                            label={t("form.fields.dateRangeEnd.label")}
                            options={dateRangeEndOptions}
                            value={
                              field.value
                                ? dateRangeEndOptions.find(
                                    (opt) => opt.value === field.value,
                                  )
                                : null
                            }
                            onChange={(option) =>
                              field.onChange(option?.value?.toString() || "")
                            }
                            placeholder={t(
                              "form.fields.dateRangeEnd.placeholder",
                            )}
                            error={errors.dateRangeEnd?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Queue Select - Only for Inbound Queue Reports */}
                  {showQueue && (
                    <FormField
                      control={control}
                      name="queue"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              classNames={{
                                valueContainer: () => "font-semibold",
                                menuList: () => "font-semibold",
                              }}
                              label={t("form.fields.queue.label")}
                              options={queueOptions}
                              value={
                                field.value
                                  ? queueOptions.find(
                                      (opt) => opt.value === field.value,
                                    )
                                  : null
                              }
                              onChange={(option) =>
                                field.onChange(option?.value?.toString() || "")
                              }
                              placeholder={t("form.fields.queue.placeholder")}
                              error={errors.queue?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Extensions Select */}
                  {showExtensions && (
                    <FormField
                      control={control}
                      name="extensions"
                      render={({ field }) => {
                        // Parse comma-separated string to array for multi-select
                        const selectedValues = field.value
                          ? field.value
                              .split(",")
                              .map((v) => v.trim())
                              .filter(Boolean)
                          : [];
                        const selectedOptions = extensionOptions.filter((opt) =>
                          selectedValues.includes(opt.value),
                        );

                        return (
                          <FormItem>
                            <FormControl>
                              <Select
                                classNames={{
                                  valueContainer: () => "font-semibold",
                                  menuList: () => "font-semibold",
                                }}
                                label={t("form.fields.extensions.label")}
                                options={extensionOptions}
                                value={selectedOptions}
                                onChange={(options) => {
                                  // Convert array of options to comma-separated string
                                  const values = Array.isArray(options)
                                    ? options
                                        .map((opt: any) => opt.value)
                                        .join(",")
                                    : "";
                                  field.onChange(values);
                                }}
                                placeholder={t(
                                  "form.fields.extensions.placeholder",
                                )}
                                error={errors.extensions?.message}
                                isMulti
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  )}

                  {/* SLA Input */}
                  {showSla && (
                    <FormField
                      control={control}
                      name="sla"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Field
                              label={t("form.fields.sla.label")}
                              hint={t("form.fields.sla.hint")}
                              htmlFor="sla"
                              error={errors.sla?.message}
                            >
                              <Input
                                id="sla"
                                variant="field"
                                className="font-semibold placeholder:font-normal"
                                type="number"
                                min={1}
                                placeholder={t("form.fields.sla.placeholder")}
                                {...field}
                              />
                            </Field>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Include Internal Calls */}
                  {showIncludeInternalCalls && (
                    <FormField
                      control={control}
                      name="includeInternalCalls"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="includeInternalCalls"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <Label
                                htmlFor="includeInternalCalls"
                                className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t("form.fields.includeInternalCalls.label")}
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full mt-4"
                  >
                    {t("actions.next")}
                  </Button>
                </div>
              </StepperStep>

              {/* Step 2: Schedule */}
              <StepperStep
                idx={1}
                className="p-4 rounded-xl bg-white flex flex-col gap-4"
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
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
                                ? timezoneOptions.find(
                                    (opt) => opt.value === field.value,
                                  )
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
                                ? frequencyOptions.find(
                                    (opt) => opt.value === field.value,
                                  )
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
                              checked={(selectedDays as WeekDay[]).includes(
                                day,
                              )}
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
                              options={monthDayOptions}
                              value={
                                field.value
                                  ? monthDayOptions.find(
                                      (opt) => opt.value === field.value,
                                    )
                                  : null
                              }
                              onChange={(option) =>
                                field.onChange(option?.value?.toString() || "")
                              }
                              placeholder={t(
                                "form.fields.monthDay.placeholder",
                              )}
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
                              options={timeOptions}
                              value={
                                field.value
                                  ? timeOptions.find(
                                      (opt) => opt.value === field.value,
                                    )
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
                        {t("form.nextGeneration.at")}{" "}
                        {format(nextGeneration, "h:mm a")}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("actions.submit")}
                  </Button>
                </form>
              </StepperStep>
            </>
          </Form>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default CreateReportForm;
