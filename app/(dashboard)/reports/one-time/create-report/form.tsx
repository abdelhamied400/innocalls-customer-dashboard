"use client";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { useTranslations } from "@/providers/TranslationProvider";
import { ChevronLeftIcon, X } from "lucide-react";
import { useState } from "react";

const CreateReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations("reports.oneTime.createReport");

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
          <SheetClose>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        <StepperStep
          idx={0}
          className="p-4 rounded-xl bg-white flex flex-col gap-4 items-center justify-center min-h-[200px]"
        >
          <p className="text-gray-500">{t("placeholder")}</p>
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default CreateReportForm;
