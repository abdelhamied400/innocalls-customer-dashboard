"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Close, ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperSteps,
  StepperStep,
} from "@/components/ui/stepper";
import callSurveyService from "@/services/call-survey.service";
import { useQueryClient } from "@tanstack/react-query";
import { createSurveySchema, CreateSurveyForm, STEP_FIELDS } from "./schema";
import SurveyDetailsStep from "./steps/SurveyDetailsStep";
import SoundsStep from "./steps/SoundsStep";
import QuestionsStep from "./steps/QuestionsStep";
import TimeAndCallersStep from "./steps/TimeAndCallersStep";
import CustomersListStep from "./steps/CustomersListStep";

const STEPS = [
  "surveyDetails",
  "sounds",
  "questions",
  "timeAndCallers",
  "customersList",
] as const;

const CreateSurveySheet = () => {
  const t = useTranslations("callSurvey.create");
  const tf = useTranslations("callSurvey.create.form");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [createdSurveyId, setCreatedSurveyId] = useState<string | null>(null);

  const form = useForm<CreateSurveyForm>({
    resolver: zodResolver(createSurveySchema(tf)),
    defaultValues: {
      name: "",
      trialsCount: 1,
      concurrencyCalls: 1,
      delayMinutesBetweenTrials: 5,
      dtmfTimeout: 5,
      startSound: null,
      endSound: null,
      wrongEntrySound: null,
      maxQuestionAttempts: 1,
      questions: [{ type: "", sound: null }],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timeSlots: [{ fromTime: "", toTime: "" }],
      callers: [{ destination: "", callerNumber: "" }],
      customersFile: null,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const validateStep = async (step: number): Promise<boolean> => {
    const fields = STEP_FIELDS[step];
    const result = await form.trigger(fields as any);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // After step 3 (Time & Callers), create the survey
    if (currentStep === 3) {
      await createSurvey();
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const createSurvey = async () => {
    try {
      setIsCreating(true);
      const values = form.getValues();

      // Upload all sound files in parallel
      const [startSoundRes, endSoundRes, wrongEntrySoundRes, ...questionSoundResults] =
        await Promise.all([
          callSurveyService.uploadSurveySound(values.startSound),
          callSurveyService.uploadSurveySound(values.endSound),
          callSurveyService.uploadSurveySound(values.wrongEntrySound),
          ...values.questions.map((q) =>
            callSurveyService.uploadSurveySound(q.sound),
          ),
        ]);

      const surveyData = {
        name: values.name,
        trialsCount: values.trialsCount,
        concurrencyCalls: values.concurrencyCalls,
        delayMinutesBetweenTrials: values.delayMinutesBetweenTrials,
        dtmfTimeout: values.dtmfTimeout,
        maxQuestionAttempts: values.maxQuestionAttempts,
        timezone: values.timezone,
        allowDTMFInputDuringPlayback: false,
        startSoundFileName: startSoundRes.originalName,
        startSoundFilePath: startSoundRes.path,
        endSoundFileName: endSoundRes.originalName,
        endSoundFilePath: endSoundRes.path,
        wrongAnswerSoundFileName: wrongEntrySoundRes.originalName,
        wrongAnswerSoundFilePath: wrongEntrySoundRes.path,
        questions: values.questions.map((q, idx) => ({
          type: q.type,
          soundFileName: questionSoundResults[idx].originalName,
          soundFilePath: questionSoundResults[idx].path,
        })),
        timeSlots: values.timeSlots,
        callers: values.callers,
      };

      const survey = await callSurveyService.createSurvey(surveyData);
      setCreatedSurveyId(survey.id);
      toast.success(t("toasts.created"), {
        description: t("toasts.createdDescription"),
      });

      queryClient.invalidateQueries({ queryKey: ["call-survey-active-list"] });
      setCurrentStep(4);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    if (!createdSurveyId) return;

    const customersFile = form.getValues("customersFile");
    if (!customersFile) {
      toast.error(t("toasts.error"), {
        description: tf("customersFile.required"),
      });
      return;
    }

    try {
      setIsCreating(true);
      await callSurveyService.uploadCustomersFile(
        createdSurveyId,
        customersFile,
        isDraft,
      );

      toast.success(
        isDraft ? t("toasts.saved") : t("toasts.created"),
        {
          description: isDraft
            ? t("toasts.savedDescription")
            : t("toasts.createdDescription"),
        },
      );

      queryClient.invalidateQueries({ queryKey: ["call-survey-active-list"] });
      handleClose();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsCreating(false);
    }
  };

  const isCustomersStep = currentStep === 4;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-screen p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{t("title")}</h2>
              <Button size="icon" variant="unstyled" onClick={handleClose}>
                <Close className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Stepper */}
            <Stepper
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              steps={[...STEPS]}
              enableStepping={false}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <StepperHeader className="border-b px-6">
                {STEPS.map((step, idx) => (
                  <StepperHeaderTitle key={step} idx={idx}>
                    <span className="text-sm whitespace-nowrap">
                      {t(`steps.${step}`)}
                    </span>
                  </StepperHeaderTitle>
                ))}
              </StepperHeader>

              <StepperSteps className="flex-1 overflow-auto">
                <StepperStep idx={0} className="p-6">
                  <div className="mx-auto max-w-200">
                    <SurveyDetailsStep />
                  </div>
                </StepperStep>

                <StepperStep idx={1} className="p-6">
                  <div className="mx-auto max-w-200">
                    <SoundsStep />
                  </div>
                </StepperStep>

                <StepperStep idx={2} className="p-6">
                  <div className="mx-auto max-w-200">
                    <QuestionsStep />
                  </div>
                </StepperStep>

                <StepperStep idx={3} className="p-6">
                  <div className="mx-auto max-w-200">
                    <TimeAndCallersStep />
                  </div>
                </StepperStep>

                <StepperStep idx={4} className="p-6">
                  <div className="mx-auto max-w-200">
                    <CustomersListStep />
                  </div>
                </StepperStep>
              </StepperSteps>
            </Stepper>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              {!isCustomersStep ? (
                <>
                  <Button
                    variant="unstyled"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft sx={{ fontSize: 16 }} className="me-1" />
                    {t("actions.previous")}
                  </Button>

                  <Button onClick={handleNext} disabled={isCreating}>
                    {currentStep === 3
                      ? isCreating
                        ? t("actions.creating")
                        : t("actions.submit")
                      : t("actions.next")}
                    {currentStep < 3 && (
                      <ArrowRight sx={{ fontSize: 16 }} className="ms-1" />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div />
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSave(true)}
                      disabled={isCreating}
                    >
                      {t("actions.saveAsDraft")}
                    </Button>
                    <Button
                      onClick={() => handleSave(false)}
                      disabled={isCreating}
                    >
                      {t("actions.save")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
};

export default CreateSurveySheet;
