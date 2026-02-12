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

const steps = [
  "Campaign Details",
  "Calls Details",
  "Scheduling",
  "Customers List",
];

const UpdateAutoDialerCampaignSheet = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: extensions, isLoading: isExtensionsLoading } =
    useLocalizedQuery(queryExtensions({}));

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  const form = useForm<AutoDialerUpdateCampaign>({
    mode: "onChange",
    resolver: zodResolver(AutoDialerUpdateCampaignSchema),
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
    async (data) => {
      // Submit the form data to update the campaign
      try {
        await autoDialerService.updateCampaign(id as string, data);
        toast("Campaign Updated", {
          description:
            "The auto dialer campaign has been updated successfully.",
        });
        // router.back();
      } catch {
        toast.error("Error", {
          description:
            "There was an error creating the campaign. Please try again.",
        });
      }
    },
    (error) => {
      console.log(error);
      toast.error("Form Error", {
        description: "Please fix the errors in the form before proceeding.",
      });
    },
  );

  return (
    <Sheet defaultOpen={true} onOpenChange={() => router.back()}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Update Auto Dialer Campaign</SheetTitle>
          <SheetDescription>
            Update a new auto dialer campaign to start calling your leads.
          </SheetDescription>
        </SheetHeader>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          className="h-full flex flex-col"
        >
          <StepperHeader>
            <StepperPrevious>
              <ChevronLeftIcon />
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
            {isLoading && <div>Loading campaign data...</div>}
            <FormProvider {...form}>
              <form className="h-full" onSubmit={onSubmit}>
                <StepperStep idx={0} className="p-4 rounded-xl bg-white h-full">
                  <CampaignDetailsForm onNext={() => setCurrentStep(1)} />
                </StepperStep>
                <StepperStep idx={1} className="p-4 rounded-xl bg-white h-full">
                  <CallDetailsForm onNext={() => setCurrentStep(2)} />
                </StepperStep>
                <StepperStep idx={2} className="p-4 rounded-xl bg-white h-full">
                  <SchedulingForm onNext={() => setCurrentStep(3)} />
                </StepperStep>
                <StepperStep idx={3} className="p-4 rounded-xl bg-white h-full">
                  <CustomersListForm onNext={() => setCurrentStep(4)} />
                </StepperStep>
              </form>
            </FormProvider>
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateAutoDialerCampaignSheet;
