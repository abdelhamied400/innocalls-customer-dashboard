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
  AutoDialerCreateStep3,
  AutoDialerCreateStep3Schema,
} from "@/validation/AutoDialerCreateCampaign";
import SchedulingForm from "./scheduling-form";
import withActiveOrganization from "@/containers/withActiveOrganization";
import autoDialerService from "@/services/auto-dialer.service";
import { useTranslations } from "@/providers/TranslationProvider";

const CreateAutoDialerCampaignSheet = () => {
  const router = useRouter();
  const t = useTranslations("autoDialer.createCampaign");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    t("steps.details.title"),
    t("steps.callsDetails.title"),
    t("steps.scheduling.title"),
    t("steps.customersList.title"),
  ];

  const form = useForm<AutoDialerCreateCampaign>({
    mode: "onChange",
    resolver: zodResolver(AutoDialerCreateCampaignSchema(t)),
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
      // validate the form
      const res = await AutoDialerCreateStep3Schema(t)
        .refine(
          (data) => {
            const { fromTime, toTime, durationType } = data;
            if (durationType === "time-limited" && fromTime && toTime) {
              return fromTime < toTime;
            }
            return true;
          },
          {
            path: ["toTime"],
            message: t(
              "steps.scheduling.form.toTime.validation.greaterThanFromTime",
            ),
          },
        )
        .refine(
          (data) => {
            if (data.durationType === "time-limited" && !data.timezone) {
              return false;
            }
            return true;
          },
          {
            path: ["timezone"],
            message: t("steps.scheduling.form.timeZone.validation.required"),
          },
        )
        .refine(
          (data) => {
            if (data.durationType === "time-limited" && !data.fromTime) {
              return false;
            }
            return true;
          },
          {
            path: ["fromTime"],
            message: t("steps.scheduling.form.fromTime.validation.required"),
          },
        )
        .refine(
          (data) => {
            if (data.durationType === "time-limited" && !data.toTime) {
              return false;
            }
            return true;
          },
          {
            path: ["toTime"],
            message: t("steps.scheduling.form.toTime.validation.required"),
          },
        )
        .safeParseAsync(data);

      if (!res.success) {
        setTimeout(() => {
          res.error.issues.forEach((issue) => {
            form.setError(issue.path[0] as keyof AutoDialerCreateStep3, {
              type: "manual",
              message: issue.message,
            });
          });
        }, 0);

        return;
      }

      form.clearErrors();

      // sending to server
      try {
        const res = await autoDialerService.createCampaign(data);
        router.replace(`/auto-dialer/${res.id}/update?action=continue`);
      } catch (error) {
        console.log("Error creating campaign scheduling:", error);
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
              </form>
            </FormProvider>
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default withActiveOrganization(CreateAutoDialerCampaignSheet);
