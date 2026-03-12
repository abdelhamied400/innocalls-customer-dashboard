"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import webcallService from "@/services/webcall.service";
import { WebCallAppFormValues } from "@/validation/WebCallApp";
import WebCallForm from "../WebCallForm";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
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

const CreateWebCallPage = () => {
  const t = useTranslations("developers.webcall");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: WebCallAppFormValues) => {
    try {
      setIsSubmitting(true);
      await webcallService.create(data);
      await queryClient.invalidateQueries({ queryKey: ["webcall-apps"] });
      toast.success(t("messages.createSuccess"));
      router.push("/developers/webcall");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.createFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.createFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stepper
      steps={[t("createPage.title")]}
      currentStep={0}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon className="rtl:rotate-180" />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("createPage.title")}</p>
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
        <StepperStep idx={0} className="p-4 rounded-xl bg-white flex flex-col gap-2">
          <WebCallForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default withActiveOrganization(
  withPermission(CreateWebCallPage, "completeControlDeveloperTools"),
);
