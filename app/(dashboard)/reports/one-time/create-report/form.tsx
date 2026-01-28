"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Select, { Option } from "@/components/Select";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { useTranslations } from "@/providers/TranslationProvider";
import { HourglassEmpty } from "@mui/icons-material";
import { Calendar, ChevronLeftIcon, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const CreateReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("reports.oneTime.createReport");
  const closeSheetRef = useRef<HTMLButtonElement>(null);

  // Form state
  const [report, setReport] = useState<Option | null>(null);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [type, setType] = useState<Option | null>(null);
  const [queue, setQueue] = useState<Option | null>(null);

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

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim();
      // Basic email validation
      if (email.includes("@") && !recipients.includes(email)) {
        setRecipients([...recipients, email]);
        setEmailInput("");
      }
    }
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit form data to API
    console.log({
      report: report?.value,
      recipients,
      fromDate,
      toDate,
      type: type?.value,
      queue: queue?.value,
    });
    setIsSuccess(true);
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
          <ChevronLeftIcon />
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
            <div className="w-20 h-20 flex justify-center items-center border-8 rounded-full border-warning-400">
              <HourglassEmpty className="h-16 w-16 text-warning-400" />
            </div>
            <h2 className="text-xl font-semibold">{t("success.title")}</h2>
            <p className="text-muted-foreground">{t("success.subtitle")}</p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Button asChild className="w-full">
                <Link href="/reports/one-time">
                  {t("success.backToReports")}
                </Link>
              </Button>
              <Button asChild variant="link" className="w-full">
                <Link href="/">{t("success.backToDashboard")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <StepperStep
            idx={0}
            className="p-4 rounded-xl bg-white flex flex-col gap-4"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Report Select */}
              <Select
                label={t("form.fields.report.label")}
                options={reportOptions}
                value={report}
                onChange={(option) => setReport(option)}
                placeholder={t("form.fields.report.placeholder")}
              />

              {/* Recipients Input */}
              <Field
                label={t("form.fields.recipients.label")}
                htmlFor="recipients"
              >
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

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label={t("form.fields.fromDate.label")}
                  htmlFor="fromDate"
                  postIcon={<Calendar className="text-gray-400 h-4 w-4" />}
                >
                  <DatePicker
                    id="fromDate"
                    className="flex-1"
                    placeholder={t("form.fields.fromDate.placeholder")}
                    value={fromDate}
                    onChange={(date) => setFromDate(date)}
                  />
                </Field>
                <Field
                  label={t("form.fields.toDate.label")}
                  htmlFor="toDate"
                  postIcon={<Calendar className="text-gray-400 h-4 w-4" />}
                >
                  <DatePicker
                    id="toDate"
                    className="flex-1"
                    placeholder={t("form.fields.toDate.placeholder")}
                    value={toDate}
                    onChange={(date) => setToDate(date)}
                  />
                </Field>
              </div>

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

              <Button type="submit" className="w-full mt-4">
                {t("actions.submit")}
              </Button>
            </form>
          </StepperStep>
        )}
      </StepperSteps>
    </Stepper>
  );
};

export default CreateReportForm;
