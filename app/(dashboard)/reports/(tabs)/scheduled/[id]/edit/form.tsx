"use client";

import { Button } from "@/components/ui/button";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperSteps,
} from "@/components/ui/stepper";
import { shouldShowQueue } from "@/constants/reports";
import { useTranslations } from "@/providers/TranslationProvider";
import { ArrowBackIos } from "@mui/icons-material";
import { X } from "lucide-react";
import Image from "next/image";
import { DAY_MAP } from "@/constants/scheduled-reports";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { format, parse } from "date-fns";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createScheduledReportSchema, {
  CreateScheduledReportSchema,
} from "@/validation/CreateScheduledReport";
import { Form } from "@/components/ui/form";
import { WeekDay } from "@/types/scheduled-report-form";
import ReportDetailsStep from "../../create-report/report-details-step";
import ScheduleStep from "../../create-report/schedule-step";

type EditReportFormProps = {
  reportId: string;
};

const EditReportForm = ({ reportId }: EditReportFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const t = useTranslations("reports.scheduled.editReport");
  const tCreate = useTranslations("reports.scheduled.createReport");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backUrl = searchParams.get("from") || "/reports/scheduled";
  const { extensions: vocabExtensions, ergs } = useVocab();

  // Fetch report data
  const { data: report, isLoading } = useLocalizedQuery({
    queryKey: ["scheduled-report", reportId],
    queryFn: () => scheduledReportsService.fetchById(reportId),
  });

  const form = useForm<CreateScheduledReportSchema>({
    resolver: zodResolver(createScheduledReportSchema(tCreate)),
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
    watch,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = form;

  const reportType = watch("report") as ReportType | undefined;
  const showQueue = shouldShowQueue(reportType);

  // Queue options from vocab
  const queueOptions = useMemo(
    () => ergs?.map((erg) => ({ label: erg.name, value: erg.name })) || [],
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

  // Initialize form with report data
  useEffect(() => {
    if (report && !isInitialized) {
      setValue("name", report.name);
      setValue("recipients", report.recipients);
      setValue("emailSubject", report.emailSubject);
      setValue("report", report.report);
      setValue("includeInternalCalls", report.reportConfig?.includeInternalCalls ?? false);

      if (report.reportConfig?.dateRangeStart) {
        setValue("dateRangeStart", report.reportConfig.dateRangeStart);
      }
      if (report.reportConfig?.dateRangeEnd) {
        setValue("dateRangeEnd", report.reportConfig.dateRangeEnd);
      }
      if (report.reportConfig?.queue) {
        setValue("queue", report.reportConfig.queue);
      }
      if (report.reportConfig?.extensions && report.reportConfig.extensions.length > 0) {
        setValue("extensions", report.reportConfig.extensions.join(","));
      }
      if (report.reportConfig?.sla) {
        setValue("sla", String(report.reportConfig.sla));
      }

      setValue("timezone", report.timezone);
      setValue("frequency", report.frequency);

      // Set time - convert from "06:00 PM" to "18:00" format if needed
      if (report.time.includes("AM") || report.time.includes("PM")) {
        try {
          const parsedTime = parse(report.time, "hh:mm a", new Date());
          setValue("time", format(parsedTime, "HH:mm"));
        } catch {
          setValue("time", report.time);
        }
      } else {
        setValue("time", report.time);
      }

      // Set days of week for weekly frequency
      if (report.frequency === "weekly" && report.daysOfWeek) {
        const dayMap: Record<number, WeekDay> = {
          0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat",
        };
        const days = report.daysOfWeek.map((d) => dayMap[d]).filter(Boolean);
        setValue("daysOfWeek", days);
      }

      // Set day of month for monthly frequency
      if (report.frequency === "monthly" && report.dayOfMonth) {
        setValue("dayOfMonth", String(report.dayOfMonth));
      }

      setIsInitialized(true);
    }
  }, [report, isInitialized, setValue]);

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
    // Build reportConfig based on report type
    const reportConfig: UpdateScheduledReportPayload["reportConfig"] = {
      dateRangeStart: data.dateRangeStart,
      dateRangeEnd: data.dateRangeEnd,
    };

    if (data.includeInternalCalls) {
      reportConfig.includeInternalCalls = data.includeInternalCalls;
    }

    if (data.extensions?.trim()) {
      reportConfig.extensions = data.extensions;
    }

    if (data.queue) {
      reportConfig.queue = data.queue;
    }

    if (data.sla?.trim()) {
      reportConfig.sla = parseInt(data.sla, 10);
    }

    const payload: UpdateScheduledReportPayload = {
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
          daysOfWeek: (data.daysOfWeek as WeekDay[]).map((d) => DAY_MAP[d]),
        }),
      ...(data.frequency === "monthly" &&
        data.dayOfMonth && {
          dayOfMonth: parseInt(data.dayOfMonth),
        }),
    };

    try {
      await scheduledReportsService.update(reportId, payload);

      toast({
        title: t("messages.updateSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
      queryClient.invalidateQueries({ queryKey: ["scheduled-report", reportId] });
      setIsSuccess(true);
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message;
      toast({
        title: t("messages.updateFailed"),
        description: backendMessage,
        variant: "destructive",
      });
    }
  };

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
          <ArrowBackIos className="rtl:rotate-180" />
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
          onClick={() => router.push(backUrl)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{tCreate("actions.close")}</span>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        {isSuccess ? (
          <div className="p-8 rounded-xl bg-white flex flex-col items-center justify-center gap-4 text-center">
            <Image
              src="/assets/icons/report-generated.svg"
              alt="Report Updated"
              width={80}
              height={80}
            />
            <h2 className="text-xl font-semibold">{t("success.title")}</h2>
            <p className="text-muted-foreground">{t("success.subtitle")}</p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Button asChild className="w-full" size="lg">
                <Link href={backUrl}>{t("success.backToReports")}</Link>
              </Button>
              <Button asChild variant="link" className="w-full" size="lg">
                <Link href="/">{t("success.backToDashboard")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <>
              <ReportDetailsStep
                form={form}
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                emailError={emailError}
                setEmailError={setEmailError}
                onNext={handleNext}
                queueOptions={queueOptions}
                extensionOptions={extensionOptions}
              />
              <ScheduleStep
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                submitButtonText={t("actions.update")}
              />
            </>
          </Form>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default EditReportForm;
