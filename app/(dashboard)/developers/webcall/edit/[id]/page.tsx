"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import webcallService from "@/services/webcall.service";
import { WebCallAppFormValues } from "@/validation/WebCallApp";
import WebCallForm from "../../WebCallForm";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
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

const EditWebCallPage = () => {
  const t = useTranslations("developers.webcall");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: app, isLoading, dataUpdatedAt } = useLocalizedQuery({
    queryKey: ["webcall-app", params.id],
    queryFn: () => webcallService.getById(params.id),
    enabled: !!params.id,
    staleTime: 0,
  });

  const handleSubmit = async (data: WebCallAppFormValues) => {
    try {
      setIsSubmitting(true);
      await webcallService.update(params.id, data);
      await queryClient.invalidateQueries({ queryKey: ["webcall-apps"] });
      toast.success(t("messages.updateSuccess"));
      router.push("/developers/webcall");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.updateFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.updateFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stepper
      steps={[t("editPage.title")]}
      currentStep={0}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon className="rtl:rotate-180" />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("editPage.title")}</p>
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
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          )}
          {app && (
            <WebCallForm
              key={dataUpdatedAt}
              defaultValues={{
                iconText: app.iconText ?? "Call Us",
                iconBackgroundColor: app.iconBackgroundColor ?? "#c5d3c5",
                iconBaseColor: app.iconBaseColor ?? "#FFFFFF",
                iconFontColor: app.iconFontColor ?? "#000000",
                concurrentCalls: app.concurrentCalls ?? 10,
                destinationNumber: app.destinationNumber ?? "",
                callerId: app.callerId ?? "",
                domains: app.domains?.length ? app.domains : [""],
              }}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isEdit
            />
          )}
        </StepperStep>
      </StepperSteps>
    </Stepper>
  );
};

export default withActiveOrganization(
  withPermission(EditWebCallPage, "completeControlDeveloperTools"),
);
