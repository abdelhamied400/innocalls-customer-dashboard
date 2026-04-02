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
import {
  type CallBridgeCreate,
  CallBridgeCreateSchema,
} from "@/validation/CallBridgeCreate";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import callBridgeService from "@/services/call-bridge.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import BridgeDetailsForm from "./bridge-details-form";
import SoundFilesForm from "./sound-files-form";

const CreateCallBridgeSheet = () => {
  const router = useRouter();
  const t = useTranslations("callBridge.create");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [t("steps.details.title"), t("steps.soundFiles.title")];

  const form = useForm<CallBridgeCreate>({
    mode: "onChange",
    resolver: zodResolver(CallBridgeCreateSchema(t)),
    defaultValues: {
      name: "",
      callers: [{ destination: "", callerNumber: "" }],
      firstRecipientTrialsCount: 1,
      secondRecipientTrialsCount: 1,
      firstRecipientDelayMinutesBetweenTrials: 0,
      secondRecipientDelayMinutesBetweenTrials: 0,
      warningTimeBeforeEnd: 1,
      enableWarningSound: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      // Upload all sound files in parallel
      const uploadPromises: Promise<{ path: string; originalName: string }>[] =
        [
          callBridgeService.uploadSound(data.welcomeSoundFile),
          callBridgeService.uploadSound(data.alertSoundFile),
          callBridgeService.uploadSound(data.firstRecipientSorrySoundFile),
          callBridgeService.uploadSound(data.secondRecipientSorrySoundFile),
        ];

      if (data.enableWarningSound) {
        uploadPromises.push(
          callBridgeService.uploadSound(data.warningSoundFile!),
        );
      }

      const uploadResults = await Promise.all(uploadPromises);

      const [welcome, alert, firstSorry, secondSorry, warning] = uploadResults;

      const payload: Record<string, unknown> = {
        name: data.name,
        callers: data.callers,
        welcomeSoundFileName: welcome.originalName,
        welcomeSoundFilePath: welcome.path,
        alertSoundFileName: alert.originalName,
        alertSoundFilePath: alert.path,
        firstRecipientSorrySoundFileName: firstSorry.originalName,
        firstRecipientSorrySoundFilePath: firstSorry.path,
        secondRecipientSorrySoundFileName: secondSorry.originalName,
        secondRecipientSorrySoundFilePath: secondSorry.path,
        firstRecipientTrialsCount: data.firstRecipientTrialsCount,
        secondRecipientTrialsCount: data.secondRecipientTrialsCount,
        firstRecipientDelayMinutesBetweenTrials:
          data.firstRecipientDelayMinutesBetweenTrials,
        secondRecipientDelayMinutesBetweenTrials:
          data.secondRecipientDelayMinutesBetweenTrials,
      };

      if (data.enableWarningSound && warning) {
        payload.warningSoundFileName = warning.originalName;
        payload.warningSoundFilePath = warning.path;
        payload.warningTimeBeforeEnd = data.warningTimeBeforeEnd;
      }

      await callBridgeService.createBridge(payload);

      toast.success(t("toasts.success"), {
        description: t("toasts.successDescription"),
      });

      router.replace("/call-bridge");
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
  });

  return (
    <Sheet defaultOpen={true} onOpenChange={() => router.back()}>
      <SheetContent side="bottom" className="h-screen p-0 overflow-hidden">
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

            <Button size="icon" asChild variant="unstyled">
              <SheetClose>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </Button>
          </StepperHeader>

          <StepperSteps className="flex-1 mx-auto my-8 w-[320px] md:w-160 max-h-[calc(100vh-200px)] overflow-hidden">
            <FormProvider {...form}>
              <form className="h-full" onSubmit={onSubmit}>
                <StepperStep
                  idx={0}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <BridgeDetailsForm onNext={() => setCurrentStep(1)} />
                </StepperStep>
                <StepperStep
                  idx={1}
                  className="p-4 rounded-xl bg-white h-full overflow-auto"
                >
                  <SoundFilesForm />
                </StepperStep>
              </form>
            </FormProvider>
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default withActiveOrganization(
  withPermission(CreateCallBridgeSheet, "fullAccessConferenceBridge"),
);
