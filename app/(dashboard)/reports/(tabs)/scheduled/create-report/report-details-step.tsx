"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/Select";
import { StepperStep } from "@/components/ui/stepper";
import {
  shouldShowIncludeInternalCalls,
  shouldShowExtensions,
  shouldShowQueue,
  shouldShowSla,
} from "@/constants/reports";
import { useTranslations } from "@/providers/TranslationProvider";
import { useReportOptions } from "@/hooks/useReportOptions";
import { X } from "lucide-react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { ReportType } from "@/types/api/report";
import { ReportDetailsStepProps } from "@/types/scheduled-report-form";

const ReportDetailsStep = ({
  form,
  emailInput,
  setEmailInput,
  emailError,
  setEmailError,
  onNext,
  queueOptions,
  extensionOptions,
}: ReportDetailsStepProps) => {
  const t = useTranslations("reports.scheduled.createReport");
  const tCommon = useTranslations("common");
  const reportOptions = useReportOptions();
  const noOptionsMessage = tCommon("select.noOptionsMessage");

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const reportType = watch("report") as ReportType | undefined;
  const recipients = watch("recipients");

  // Determine which fields to show based on selected report type
  const showIncludeInternalCalls = shouldShowIncludeInternalCalls(reportType);
  const showExtensions = shouldShowExtensions(reportType);
  const showQueue = shouldShowQueue(reportType);
  const showSla = shouldShowSla(reportType);

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

  const handleReportChange = (value: string) => {
    const newReportType = value as ReportType;
    setValue("report", value);
    // Reset conditional fields only if the new report type doesn't support them
    if (!shouldShowIncludeInternalCalls(newReportType)) {
      setValue("includeInternalCalls", false);
    }
    if (!shouldShowExtensions(newReportType)) {
      setValue("extensions", "");
    }
    if (!shouldShowQueue(newReportType)) {
      setValue("queue", "");
    }
    if (!shouldShowSla(newReportType)) {
      setValue("sla", "");
    }
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setEmailError(t("form.validation.recipients.invalidEmail"));
        setTimeout(() => setEmailError(null), 2000);
        return;
      }

      if (recipients.some((r) => r.toLowerCase() === email)) {
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

  return (
    <StepperStep idx={0} className="p-4 rounded-xl bg-white flex flex-col gap-4">
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
                    placeholder={t("form.fields.reportName.placeholder")}
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
                    placeholder={t("form.fields.emailSubject.placeholder")}
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
                  options={reportOptions}
                  value={
                    field.value
                      ? reportOptions.find((opt) => opt.value === field.value)
                      : null
                  }
                  onChange={(option) =>
                    handleReportChange(option?.value?.toString() || "")
                  }
                  placeholder={t("form.fields.report.placeholder")}
                  error={errors.report?.message}
                  noOptionsMessage={noOptionsMessage}
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
                  placeholder={t("form.fields.dateRangeStart.placeholder")}
                  error={errors.dateRangeStart?.message}
                  noOptionsMessage={noOptionsMessage}
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
                  placeholder={t("form.fields.dateRangeEnd.placeholder")}
                  error={errors.dateRangeEnd?.message}
                  noOptionsMessage={noOptionsMessage}
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
                        ? queueOptions.find((opt) => opt.value === field.value)
                        : null
                    }
                    onChange={(option) =>
                      field.onChange(option?.value?.toString() || "")
                    }
                    placeholder={t("form.fields.queue.placeholder")}
                    error={errors.queue?.message}
                    noOptionsMessage={noOptionsMessage}
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
                          ? options.map((opt: any) => opt.value).join(",")
                          : "";
                        field.onChange(values);
                      }}
                      placeholder={t("form.fields.extensions.placeholder")}
                      error={errors.extensions?.message}
                      isMulti
                      noOptionsMessage={noOptionsMessage}
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

        <Button type="button" onClick={onNext} className="w-full mt-4">
          {t("actions.next")}
        </Button>
      </div>
    </StepperStep>
  );
};

export default ReportDetailsStep;
