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
import { ChevronLeftIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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
import { Form } from "@/components/ui/form";
import { WeekDay } from "./types";
import { DAY_MAP } from "./constants";
import ReportDetailsStep from "./report-details-step";
import ScheduleStep from "./schedule-step";
import SuccessView from "./success-view";

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
    watch,
    trigger,
    formState: { isSubmitting },
  } = form;

  const reportType = watch("report") as ReportType | undefined;
  const showQueue = shouldShowQueue(reportType);

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
    const reportConfig: CreateScheduledReportPayload["reportConfig"] = {
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
          daysOfWeek: (data.daysOfWeek as WeekDay[]).map((d) => DAY_MAP[d]),
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

  const handleBackToReports = () => {
    router.push("/reports/scheduled");
  };

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
          <SuccessView onBackToReports={handleBackToReports} />
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
              />
            </>
          </Form>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default CreateReportForm;
