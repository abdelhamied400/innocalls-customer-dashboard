"use client";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";
import { useTranslations } from "@/providers/TranslationProvider";

const EditUserLoading = () => {
  const t = useTranslations("users.update");
  const commonT = useTranslations("common");

  return (
    <div className="edit-user-loading">
      <Stepper
        steps={[t("title")]}
        currentStep={0}
        className="h-full flex flex-col"
      >
        <StepperHeader>
          <StepperPrevious>
            <ChevronLeftIcon className="rtl:rotate-180" />
          </StepperPrevious>

          <div className="flex flex-1 justify-center gap-2">
            <StepperHeaderTitle idx={0}>
              <Skeleton className="w-32 h-6" />
            </StepperHeaderTitle>
          </div>
          <Button size="icon" asChild variant="unstyled">
            <SheetClose>
              <X className="h-4 w-4" />
              <span className="sr-only">{commonT("actions.close")}</span>
            </SheetClose>
          </Button>
        </StepperHeader>

        <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh - 200px)] overflow-auto">
          <div className="p-4 rounded-xl bg-white h-full flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-full" />
            ))}
          </div>
        </StepperSteps>
      </Stepper>
    </div>
  );
};

export default EditUserLoading;
