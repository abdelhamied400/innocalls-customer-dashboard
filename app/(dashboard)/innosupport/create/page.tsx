"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import ticketsService from "@/services/tickets.service";
import { CreateTicketFormValues } from "@/validation/CreateTicket";
import CreateTicketForm from "../CreateTicketForm";
import withActiveOrganization from "@/containers/withActiveOrganization";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";

const CreateTicketPage = () => {
  const t = useTranslations("innoSupport.create");
  const commonT = useTranslations("common");
  const queryClient = useQueryClient();
  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateTicketFormValues) => {
    setIsSubmitting(true);
    try {
      await ticketsService.createTicket(data);
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(t("messages.success"));
      closeSheetRef.current?.click();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.error"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.error"));
      }
    }
    setIsSubmitting(false);
  };

  return (
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
            <p>{t("title")}</p>
          </StepperHeaderTitle>
        </div>
        <Button size="icon" asChild variant="unstyled">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">{commonT("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
        <StepperStep
          idx={0}
          className="p-4 rounded-xl bg-white flex flex-col gap-2"
        >
          <CreateTicketForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default withActiveOrganization(CreateTicketPage);
