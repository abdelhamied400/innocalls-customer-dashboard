"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "@/providers/TranslationProvider";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
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
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { X } from "lucide-react";
import callSurveyService from "@/services/call-survey.service";
import CustomersListStep from "@/app/(dashboard)/call-survey/(list)/create/steps/CustomersListStep";
import type { CreateSurveyForm } from "@/validation/CallSurveyCreate";

const CUSTOMERS_STEP = 4;

const EditSurveyPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("callSurvey.create");
  const tf = useTranslations("callSurvey.create.form");
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);

  const { data: survey } = useLocalizedQuery({
    queryKey: ["call-survey-detail", id],
    queryFn: () => callSurveyService.getSurvey(id),
    enabled: !!id,
  });

  const steps = [
    t("steps.surveyDetails"),
    t("steps.sounds"),
    t("steps.questions"),
    t("steps.timeAndCallers"),
    t("steps.customersList"),
  ];

  const form = useForm<CreateSurveyForm>({
    defaultValues: {
      customersFile: null,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    router.replace("/call-survey/active");
  };

  const handleSave = async (isDraft: boolean) => {
    const customersFile = form.getValues("customersFile");
    if (!customersFile) {
      toast.error(t("toasts.error"), {
        description: tf("customersFile.required"),
      });
      return;
    }

    try {
      await callSurveyService.uploadCustomersFile(id, customersFile, isDraft);
      toast.success(
        isDraft ? t("toasts.saved") : t("toasts.created"),
        {
          description: isDraft
            ? t("toasts.savedDescription")
            : t("toasts.createdDescription"),
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["call-survey-active-list"],
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
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>
            {t("steps.customersList")} - {survey?.name}
          </SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <Stepper
          steps={steps}
          currentStep={CUSTOMERS_STEP}
          enableStepping={false}
          className="h-full flex flex-col"
        >
          <StepperHeader>
            <div className="w-8" />

            <div className="flex flex-1 justify-center gap-2">
              {steps.map((step, idx) => (
                <StepperHeaderTitle key={idx} idx={idx}>
                  <p>{step}</p>
                </StepperHeaderTitle>
              ))}
            </div>

            <Button
              size="icon"
              variant="unstyled"
              type="button"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </StepperHeader>

          <StepperSteps className="flex-1 mx-auto my-8 w-75 md:w-150 overflow-auto">
            <FormProvider {...form}>
              <div className="h-full">
                <StepperStep
                  idx={CUSTOMERS_STEP}
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

export default EditSurveyPage;
