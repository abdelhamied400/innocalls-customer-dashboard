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
import CampaignDetailsForm from "./campaign-details-form";
import CallDetailsForm from "./call-details-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AutoDialerCreateCampaign,
  AutoDialerCreateCampaignSchema,
} from "@/validation/AutoDialerCreateCampaign";
import SchedulingForm from "./scheduling-form";
import CustomersListForm from "./customers-list-form";
import withActiveOrganization from "@/containers/withActiveOrganization";
import { toast } from "sonner";
import autoDialerService from "@/services/auto-dialer.service";

const steps = [
  "Campaign Details",
  "Calls Details",
  "Scheduling",
  "Customers List",
];

const CreateAutoDialerCampaignSheet = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<AutoDialerCreateCampaign>({
    mode: "onChange",
    resolver: zodResolver(AutoDialerCreateCampaignSchema),
    defaultValues: {
      name: "",
      waitingCustomerCount: 0,
      trialsCount: 1,
      wrapUpTime: 10,
      delayMinutesBetweenTrials: 5,
      hideCallerInfo: false,
      agentCanLogoutAndRejoin: true,
      hasAnnouncement: false,
      agents: [],
      maxWaitTime: 50,
      durationType: "time-limited",
      callers: [
        {
          destination: "",
          callerNumber: "",
        },
      ],
    },
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      // Submit the form data to create the campaign
      try {
        const res = await autoDialerService.createCampaign(data);
        toast("Campaign Created", {
          description:
            "The auto dialer campaign has been created successfully.",
        });
        // router.back();
      } catch (error) {
        toast.error("Error", {
          description:
            "There was an error creating the campaign. Please try again.",
        });
      }
    },
    (error) => {
      console.log(error);
    },
  );

  return (
    <Sheet defaultOpen={true} onOpenChange={() => router.back()}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Create Auto Dialer Campaign</SheetTitle>
          <SheetDescription>
            Create a new auto dialer campaign to start calling your leads.
          </SheetDescription>
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

          <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh - 200px)] overflow-auto">
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

export default withActiveOrganization(CreateAutoDialerCampaignSheet);
