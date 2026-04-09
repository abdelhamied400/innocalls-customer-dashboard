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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "@/providers/TranslationProvider";
import callSurveyService from "@/services/call-survey.service";
import postCallSurveyService from "@/services/post-call-survey.service";
import {
  PostCallSurveyCreateSchema,
  type CreatePostCallSurveyForm,
} from "@/validation/PostCallSurveyCreate";
import SurveyDetailsStep from "./steps/SurveyDetailsStep";
import SoundsStep from "./steps/SoundsStep";
import QuestionsStep from "./steps/QuestionsStep";

const CreatePostCallSurveySheet = () => {
  const router = useRouter();
  const t = useTranslations("postCallSurvey.create");
  const tf = useTranslations("postCallSurvey.create.form");
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const open = pathname === "/post-call-survey/create";

  const steps = [
    t("steps.surveyDetails"),
    t("steps.sounds"),
    t("steps.questions"),
  ];

  const form = useForm<CreatePostCallSurveyForm>({
    mode: "onChange",
    resolver: zodResolver(PostCallSurveyCreateSchema(tf)),
    defaultValues: {
      name: "",
      dtmfTimeout: 5,
      maxQuestionAttempts: 1,
      startSound: null,
      endSound: null,
      wrongEntrySound: null,
      questions: [{ type: "", sound: null }],
    },
  });

  const handleClose = () => {
    router.replace("/post-call-survey");
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = form.getValues();

      const [
        startSoundRes,
        endSoundRes,
        wrongEntrySoundRes,
        ...questionSoundResults
      ] = await Promise.all([
        callSurveyService.uploadSurveySound(values.startSound!),
        callSurveyService.uploadSurveySound(values.endSound!),
        callSurveyService.uploadSurveySound(values.wrongEntrySound!),
        ...values.questions.map((q) =>
          callSurveyService.uploadSurveySound(q.sound!),
        ),
      ]);

      const surveyData = {
        name: values.name,
        dtmfTimeout: values.dtmfTimeout,
        maxQuestionAttempts: values.maxQuestionAttempts,
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
      };

      await postCallSurveyService.create(surveyData);
      toast.success(t("toasts.created"), {
        description: t("toasts.createdDescription"),
      });
      queryClient.invalidateQueries({
        queryKey: ["post-call-surveys"],
      });
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
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
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
                  <QuestionsStep onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </StepperStep>
              </div>
            </FormProvider>
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default CreatePostCallSurveySheet;
