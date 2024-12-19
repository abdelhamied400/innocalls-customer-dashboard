"use client";

import { cn } from "@/lib/utils";
import React, { createContext, PropsWithChildren, use } from "react";
import { Button } from "./button";
import { CheckIcon } from "lucide-react";

export type StepperContextType = {
  currentStep: number;
  goToStep: (step: number) => void;
  totalSteps: number;
};
const StepperContext = createContext<StepperContextType | null>(null);

// Stepper Component
export type StepperProps = PropsWithChildren<{
  className?: string;
  currentStep?: number; // Current Step
  onStepChange?: (step: number) => void; // Change Step
  steps?: Array<string>;
}>;
const Stepper = ({
  children,
  className,
  currentStep = 0,
  steps,
  onStepChange,
}: StepperProps) => {
  const goToStep = (step: number) => {
    if (onStepChange) onStepChange(step);
  };

  return (
    <div className={cn("stepper", className)}>
      <StepperContext
        value={{
          currentStep,
          goToStep,
          totalSteps: steps?.length || React.Children.count(children),
        }}
      >
        {children}
      </StepperContext>
    </div>
  );
};

// Stepper Header (Navigation with Titles)
export type StepperHeaderProps = PropsWithChildren<{
  className?: string;
}>;
export const StepperHeader = ({ children, className }: StepperHeaderProps) => {
  const context = useStepper();

  return (
    <div className={cn("stepper-header bg-white", className)}>{children}</div>
  );
};

// Stepper Header Title (Individual Title)
export type StepperHeaderTitleProps = PropsWithChildren<{
  idx: number;
  className?: string;
}>;
export const StepperHeaderTitle = ({
  children,
  className,
  idx,
}: StepperHeaderTitleProps) => {
  const { currentStep, goToStep, totalSteps } = useStepper();
  const isActive = idx === currentStep;

  const handleClick = () => goToStep(idx);

  return (
    <div
      className={cn(
        "stepper-header-title flex gap-2 items-center",
        idx !== totalSteps - 1 && "flex-1",
        className
      )}
      role="button"
      onClick={handleClick}
    >
      <div
        className={cn(
          "bg-gray-200 p-2 rounded-full",
          isActive && "bg-primary text-white"
        )}
      >
        <div
          className={cn(
            "stepper-header-title-number w-6 h-6 flex justify-center items-center "
          )}
        >
          {currentStep > idx ? <CheckIcon className="w-full" /> : idx + 1}
        </div>
      </div>
      {children}
      {
        // Add a line separator if not the last element
        idx !== totalSteps - 1 && (
          <div
            className={cn(
              "flex-1 h-0.5",
              currentStep > idx ? "bg-primary" : "bg-gray-200"
            )}
          ></div>
        )
      }
    </div>
  );
};

// Stepper Steps (Container for Steps)
export type StepperStepsProps = PropsWithChildren<{
  className?: string;
}>;
export const StepperSteps = ({ children, className }: StepperStepsProps) => {
  const context = useStepper();

  return <div className={cn("stepper-steps", className)}>{children}</div>;
};

// Stepper Step (Individual Step)
export type StepperStepProps = PropsWithChildren<{
  idx: number;
  className?: string;
}>;
export const StepperStep = ({ children, className, idx }: StepperStepProps) => {
  const { currentStep } = useStepper();

  if (idx !== currentStep) return null;

  return <div className={cn("stepper-step", className)}>{children}</div>;
};

// Stepper Previous Button
export type StepperPreviousProps = PropsWithChildren<{
  className?: string;
}>;
export const StepperPrevious = ({
  children,
  className,
}: StepperPreviousProps) => {
  const { currentStep, goToStep } = useStepper();

  const handleClick = () => goToStep(currentStep - 1);

  return (
    <Button
      className={cn("stepper-previous", className)}
      onClick={handleClick}
      disabled={currentStep === 0}
    >
      {children || "Previous"}
    </Button>
  );
};

// Stepper Next Button
export type StepperNextProps = PropsWithChildren<{
  className?: string;
}>;
export const StepperNext = ({ children, className }: StepperNextProps) => {
  const { currentStep, totalSteps, goToStep } = useStepper();

  const handleClick = () => goToStep(currentStep + 1);

  return (
    <Button
      className={cn("stepper-next", className)}
      onClick={handleClick}
      disabled={currentStep === totalSteps - 1}
    >
      {children || "Next"}
    </Button>
  );
};

// use Stepper Context Hook
export const useStepper = () => {
  const context = use(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }

  return context;
};

export default Stepper;
