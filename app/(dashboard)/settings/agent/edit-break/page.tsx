"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import breakTypesService from "@/services/break-types.service";
import EditBreakForm from "./form";
import { useTranslations } from "@/providers/TranslationProvider";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";
import withActiveOrganization from "@/containers/withActiveOrganization";

const EditBreakPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const t = useTranslations("settings.agent.breaks.editBreak");

  const { data: breakType, isLoading } = useQuery({
    queryKey: ["break-type", id],
    queryFn: () => breakTypesService.getBreakType(id!),
    enabled: !!id,
  });

  if (!id || (!isLoading && !breakType)) {
    return (
      <Stepper
        steps={[t("title")]}
        currentStep={0}
        onStepChange={() => {}}
        className="h-full flex flex-col"
      >
        <StepperHeader>
          <StepperPrevious>
            <ChevronLeftIcon />
          </StepperPrevious>

          <div className="flex flex-1 justify-center gap-2">
            <StepperHeaderTitle idx={0}>
              <p>{t("title")}</p>
            </StepperHeaderTitle>
          </div>
          <Button size="icon" asChild variant="unstyled">
            <SheetClose>
              <X className="h-4 w-4" />
              <span className="sr-only">{t("actions.close")}</span>
            </SheetClose>
          </Button>
        </StepperHeader>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-500">
            {t("messages.breakNotFound")}
          </p>
        </div>
      </Stepper>
    );
  }

  if (isLoading) {
    return (
      <Stepper
        steps={[t("title")]}
        currentStep={0}
        onStepChange={() => {}}
        className="h-full flex flex-col"
      >
        <StepperHeader>
          <StepperPrevious>
            <ChevronLeftIcon />
          </StepperPrevious>

          <div className="flex flex-1 justify-center gap-2">
            <StepperHeaderTitle idx={0}>
              <p>{t("title")}</p>
            </StepperHeaderTitle>
          </div>
          <Button size="icon" asChild variant="unstyled">
            <SheetClose>
              <X className="h-4 w-4" />
              <span className="sr-only">{t("actions.close")}</span>
            </SheetClose>
          </Button>
        </StepperHeader>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </Stepper>
    );
  }

  return (
    <div className="page h-full" id="edit-break">
      <EditBreakForm breakType={breakType!} />
    </div>
  );
};

export default withActiveOrganization(EditBreakPage);
