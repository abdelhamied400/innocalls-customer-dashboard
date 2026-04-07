"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "@/providers/TranslationProvider";
import callSurveyService from "@/services/call-survey.service";
import { CallSurveyCreateSchema, type CreateSurveyForm } from "@/validation/CallSurveyCreate";
import SurveyDetailsStep from "./steps/SurveyDetailsStep";
import SoundsStep from "./steps/SoundsStep";
import QuestionsStep from "./steps/QuestionsStep";
import TimeAndCallersStep from "./steps/TimeAndCallersStep";
import CustomersListStep from "./steps/CustomersListStep";

const CreateSurveySheet = () => {
  const router = useRouter();
  const t = useTranslations("callSurvey.create");
  const tf = useTranslations("callSurvey.create.form");
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [createdSurveyId, setCreatedSurveyId] = useState<string | null>(null);

  const steps = [
    t("steps.surveyDetails"),
    t("steps.sounds"),
    t("steps.questions"),
    t("steps.timeAndCallers"),
    t("steps.customersList"),
  ];

  const form = useForm<CreateSurveyForm>({
    mode: "onChange",
    resolver: zodResolver(CallSurveyCreateSchema(tf)),
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

  const createSurvey = async () => {
    try {
      const values = form.getValues();

      // Upload all sound files in parallel
      const [
        startSoundRes,
        endSoundRes,
        wrongEntrySoundRes,
        ...questionSoundResults
      ] = await Promise.all([
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
      queryClient.invalidateQueries({
        queryKey: ["call-survey-active-list"],
      });
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
      await callSurveyService.uploadCustomersFile(
        createdSurveyId,
        customersFile,
        isDraft,
      );
      toast.success(isDraft ? t("toasts.saved") : t("toasts.created"), {
        description: isDraft
          ? t("toasts.savedDescription")
          : t("toasts.createdDescription"),
      });
      queryClient.invalidateQueries({
        queryKey: ["call-survey-active-list"],
      });
      router.replace("/call-survey/active");
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
    }
  };

  return (
    <Sheet
      defaultOpen={true}
      onOpenChange={() => router.replace("/call-survey/active")}
    >
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          enableStepping={false}
          className="h-full flex flex-col"
        >
          <StepperHeader>
            <StepperPrevious>
              <ChevronLeftIcon className="rtl:rotate-180" />
            </StepperPrevious>

            <div className="flex flex-1 justify-center gap-2">
              {steps.map((step, idx) => (
                <StepperHeaderTitle key={idx} idx={idx}>
                  <p>{step}</p>
                </StepperHeaderTitle>
              ))}
            </div>

            <SheetClose type="button">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </StepperHeader>

          <StepperSteps className="flex-1 mx-auto my-8 w-75 md:w-150 overflow-auto">
            <FormProvider {...form}>
              <div className="h-full">
                <StepperStep
                  idx={0}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <SurveyDetailsStep onNext={() => setCurrentStep(1)} />
                </StepperStep>

                <StepperStep
                  idx={1}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <SoundsStep onNext={() => setCurrentStep(2)} />
                </StepperStep>

                <StepperStep
                  idx={2}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <QuestionsStep onNext={() => setCurrentStep(3)} />
                </StepperStep>

                <StepperStep
                  idx={3}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <TimeAndCallersStep onNext={createSurvey} />
                </StepperStep>

                <StepperStep
                  idx={4}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <CustomersListStep onSave={handleSave} />
                </StepperStep>
              </div>
            </FormProvider>
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default CreateSurveySheet;
