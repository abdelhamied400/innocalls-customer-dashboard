"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Select from "@/components/Select";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  ArrowBackIos,
  CalendarToday,
  HourglassEmpty,
} from "@mui/icons-material";
import { ChevronLeftIcon, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import oneTimeReportsService from "@/services/one-time-reports.service";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { ReportType } from "@/types/api/report";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createOneTimeReportSchema, {
  CreateOneTimeReportSchema,
} from "@/validation/CreateOneTimeReport";
import {
  shouldShowIncludeInternalCalls,
  shouldShowExtensions,
  shouldShowQueue,
  shouldShowSla,
} from "@/constants/reports";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useVocab } from "@/hooks/useVocab";
import { useReportOptions } from "@/hooks/useReportOptions";
import Image from "next/image";

const CreateReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const t = useTranslations("reports.oneTime.createReport");
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { extensions: vocabExtensions, ergs } = useVocab();
  const reportOptions = useReportOptions();

  const form = useForm<CreateOneTimeReportSchema>({
    resolver: zodResolver(createOneTimeReportSchema(t)),
    defaultValues: {
      name: "",
      report: "",
      recipients: [],
      fromDate: undefined,
      toDate: undefined,
      queue: "",
      extensions: "",
      sla: "",
      includeInternalCalls: false,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const reportType = watch("report") as ReportType | undefined;
  const recipients = watch("recipients");

  // Determine which fields to show based on selected report type
  const showIncludeInternalCalls = shouldShowIncludeInternalCalls(reportType);
  const showExtensions = shouldShowExtensions(reportType);
  const showQueue = shouldShowQueue(reportType);
  const showSla = shouldShowSla(reportType);

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim().toLowerCase();
      // Email validation regex
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

  const handleReportChange = (value: string) => {
    setValue("report", value);
    // Reset conditional fields when report type changes
    setValue("includeInternalCalls", false);
    setValue("extensions", "");
    setValue("queue", "");
    setValue("sla", "");
  };

  const onSubmit = async (data: CreateOneTimeReportSchema) => {
    try {
      const reportValue = data.report as ReportType;

      // Build reportConfig based on report type
      const reportConfig: Record<string, unknown> = {
        fromDate: format(data.fromDate, "yyyy-MM-dd"),
        toDate: format(data.toDate, "yyyy-MM-dd"),
      };

      if (showIncludeInternalCalls) {
        reportConfig.includeInternalCalls = data.includeInternalCalls;
      }

      if (showExtensions && data.extensions?.trim()) {
        reportConfig.extensions = data.extensions.trim();
      }

      if (showQueue && data.queue) {
        reportConfig.queue = data.queue.trim();
      }

      if (showSla && data.sla?.trim()) {
        reportConfig.sla = parseInt(data.sla, 10);
      }

      const reportOption = reportOptions.find(
        (opt) => opt.value === reportValue,
      );

      await oneTimeReportsService.create({
        name: data.name,
        recipients: data.recipients,
        emailSubject: reportOption?.label || reportValue,
        report: reportValue,
        reportConfig: reportConfig as any,
      });

      queryClient.invalidateQueries({ queryKey: ["one-time-reports"] });
      toast({
        title: t("success.title"),
        description: t("success.subtitle"),
      });
      setIsSuccess(true);
      setCurrentStep(1);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: t("messages.error"),
          description:
            error.response?.data?.message || t("messages.unknownError"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("messages.error"),
          description:
            error instanceof Error ? error.message : t("messages.unknownError"),
        });
      }
    }
  };

  return (
    <Stepper
      steps={[t("steps.createReport")]}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ArrowBackIos className="rtl:rotate-180" />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("steps.createReport")}</p>
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
            <Image
              src="/assets/icons/report-generated.svg"
              alt="Report Generated"
              width={80}
              height={80}
            />
            <h2 className="text-xl font-semibold">{t("success.title")}</h2>
            <p className="text-muted-foreground">{t("success.subtitle")}</p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => closeSheetRef.current?.click()}
              >
                {t("success.backToReports")}
              </Button>
              <Button asChild variant="link" className="w-full" size="lg">
                <Link href="/">{t("success.backToDashboard")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <StepperStep
            idx={0}
            className="p-4 rounded-xl bg-white flex flex-col gap-4"
          >
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Name Input */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.fields.name.label")}
                          htmlFor="name"
                          error={errors.name?.message}
                        >
                          <Input
                            id="name"
                            variant="field"
                            className="font-semibold placeholder:font-normal"
                            placeholder={t("form.fields.name.placeholder")}
                            maxLength={200}
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
                              ? reportOptions.find(
                                  (opt) => opt.value === field.value,
                                )
                              : null
                          }
                          onChange={(option) =>
                            handleReportChange(option?.value?.toString() || "")
                          }
                          placeholder={t("form.fields.report.placeholder")}
                          error={errors.report?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Recipients Input */}
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

                {/* Date Pickers */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Field
                            label={t("form.fields.fromDate.label")}
                            htmlFor="fromDate"
                            postIcon={
                              <CalendarToday className="text-gray-400 h-4 w-4" />
                            }
                            error={errors.fromDate?.message}
                          >
                            <DatePicker
                              id="fromDate"
                              className="flex-1"
                              placeholder={t(
                                "form.fields.fromDate.placeholder",
                              )}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </Field>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="toDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Field
                            label={t("form.fields.toDate.label")}
                            htmlFor="toDate"
                            postIcon={
                              <CalendarToday className="text-gray-400 h-4 w-4" />
                            }
                            error={errors.toDate?.message}
                          >
                            <DatePicker
                              id="toDate"
                              className="flex-1"
                              placeholder={t("form.fields.toDate.placeholder")}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </Field>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

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
                            options={
                              ergs?.map((erg) => ({
                                label: erg.name,
                                value: erg.name,
                              })) || []
                            }
                            value={
                              field.value
                                ? ergs
                                    ?.map((erg) => ({
                                      label: erg.name,
                                      value: erg.name,
                                    }))
                                    .find((opt) => opt.value === field.value)
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
                      const selectedOptions = vocabExtensions
                        .filter((ext) => selectedValues.includes(ext.ext))
                        .map((ext) => ({
                          label: `${ext.name} (${ext.ext})`,
                          value: ext.ext,
                        }));

                      return (
                        <FormItem>
                          <FormControl>
                            <Select
                              label={t("form.fields.extensions.label")}
                              classNames={{
                                valueContainer: () => "font-semibold",
                                menuList: () => "font-semibold",
                              }}
                              options={
                                vocabExtensions?.map((ext) => ({
                                  label: `${ext.name} (${ext.ext})`,
                                  value: ext.ext,
                                })) || []
                              }
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
                            <label
                              htmlFor="includeInternalCalls"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {t("form.fields.includeInternalCalls.label")}
                            </label>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
            </Form>
          </StepperStep>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default CreateReportForm;
