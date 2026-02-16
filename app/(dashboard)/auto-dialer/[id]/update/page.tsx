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
import { X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CampaignDetailsForm from "./campaign-details-form";
import CallDetailsForm from "./call-details-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AutoDialerUpdateCampaign,
  AutoDialerUpdateCampaignSchema,
} from "@/validation/AutoDialerUpdateCampaign";
import SchedulingForm from "./scheduling-form";
import CustomersListForm from "./customers-list-form";
import { toast } from "sonner";
import autoDialerService from "@/services/auto-dialer.service";
import { useQuery } from "@tanstack/react-query";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import queryExtensions from "@/queries/queryExtensions";
import { ArrowBackIos } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";

const UpdateAutoDialerCampaignSheet = () => {
  const { id } = useParams();
  const t = useTranslations("autoDialer.updateCampaign");
  const steps = [
    t("steps.details.title"),
    t("steps.callsDetails.title"),
    t("steps.scheduling.title"),
    t("steps.customersList.title"),
  ];
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const { data: extensions, isLoading: isExtensionsLoading } =
    useLocalizedQuery(queryExtensions({}));

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  const form = useForm<AutoDialerUpdateCampaign>({
    mode: "onChange",
    resolver: zodResolver(AutoDialerUpdateCampaignSchema(t)),
    defaultValues: campaign,
  });

  useEffect(() => {
    if (isExtensionsLoading || !extensions || !campaign) return;

    const selectedAgents = campaign?.assignedAgents.map(
      (ex: number) => `${ex}`,
    );

    form.reset({
      ...campaign,
      agents: selectedAgents,
      hasAnnouncement: !!campaign.mainSoundFileName,
    });
  }, [isExtensionsLoading, extensions, campaign, form]);

  useEffect(() => {
    const actionParam = searchParams.get("action");

    if (actionParam === "continue") {
      // Use setTimeout to avoid setState during render
      setTimeout(() => setCurrentStep(3), 0);
    }
  }, [searchParams]);

  const onSubmit = form.handleSubmit(
    async (data, e) => {
      // Submit the form data to update the campaign
      const action = (e?.nativeEvent as any).submitter.value;
      try {
        const { customers, ...rest } = data;
        await Promise.all([
          autoDialerService.updateCampaign(id as string, {
            ...rest,
            isDraft: action === "save",
          }),
          customers &&
            autoDialerService.updateCampaignCustomersFile(id as string, {
              file: customers,
              isDraft: action === "save",
            }),
        ]);
        toast(t("toasts.success"), {
          description: t("toasts.successDescription"),
        });
        router.push("/auto-dialer/active");
      } catch {
        toast.error(t("toasts.error"), {
          description: t("toasts.errorDescription"),
        });
      }
    },
    (error) => {
      console.log(error);
    },
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        router.back();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-screen p-0"
        onPointerDownOutside={(event) => {
          // Prevent closing on outside click
          event.preventDefault();
        }}
        onInteractOutside={(event) => {
          // Prevent closing on escape key press
          event.preventDefault();
        }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          className="h-full flex flex-col"
        >
          <StepperHeader>
            <StepperPrevious>
              <ArrowBackIos className="rtl:rotate-180" />
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

          <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh - 200px)] overflow-auto">
            {isLoading && <div>{t("loading")}</div>}
            {!isLoading && !campaign && (
              <div className="text-center text-muted-foreground">
                {t("notFound")}
              </div>
            )}
            {!isLoading && campaign && (
              <FormProvider {...form}>
                <form className="h-full" onSubmit={onSubmit}>
                  <StepperStep
                    idx={0}
                    className="p-4 rounded-xl bg-white h-full"
                  >
                    <CampaignDetailsForm onNext={() => setCurrentStep(1)} />
                  </StepperStep>
                  <StepperStep
                    idx={1}
                    className="p-4 rounded-xl bg-white h-full"
                  >
                    <CallDetailsForm onNext={() => setCurrentStep(2)} />
                  </StepperStep>
                  <StepperStep
                    idx={2}
                    className="p-4 rounded-xl bg-white h-full"
                  >
                    <SchedulingForm onNext={() => setCurrentStep(3)} />
                  </StepperStep>
                  <StepperStep
                    idx={3}
                    className="p-4 rounded-xl bg-white h-full"
                  >
                    <CustomersListForm onNext={() => setCurrentStep(4)} />
                  </StepperStep>
                </form>
              </FormProvider>
            )}
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateAutoDialerCampaignSheet;
