import { UseFormReturn } from "react-hook-form";
import { CreateScheduledReportSchema } from "@/validation/CreateScheduledReport";

export type WeekDay = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

export type Option = {
  label: string;
  value: string;
};

export type ReportDetailsStepProps = {
  form: UseFormReturn<CreateScheduledReportSchema>;
  emailInput: string;
  setEmailInput: (value: string) => void;
  emailError: string | null;
  setEmailError: (value: string | null) => void;
  onNext: () => void;
  queueOptions: Option[];
  extensionOptions: Option[];
};

export type ScheduleStepProps = {
  form: UseFormReturn<CreateScheduledReportSchema>;
  onSubmit: (data: CreateScheduledReportSchema) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
};

export type SuccessViewProps = {
  onBackToReports: () => void;
};
