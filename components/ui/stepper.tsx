"use client";

import { cn } from "@/lib/utils";
import React, { createContext, PropsWithChildren, use } from "react";
import { Button } from "./button";
import { CheckIcon } from "lucide-react";

export type StepperContextType = {
  currentStep: number;
  goToStep: (step: number) => void;
  totalSteps: number;
  enableStepping?: boolean;
};
const StepperContext = createContext<StepperContextType | null>(null);

// Stepper Component
export type StepperProps = PropsWithChildren<{
  className?: string;
  currentStep?: number; // Current Step
  onStepChange?: (step: number) => void; // Change Step
  steps?: Array<string>;
  enableStepping?: boolean;
}>;
const Stepper = ({
  children,
  className,
  currentStep = 0,
  steps,
  onStepChange,
  enableStepping = true,
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
          enableStepping,
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
  return (
    <div
      className={cn(
        "stepper-header bg-white gap-2 p-4 flex sticky top-0 z-10",
        className
      )}
    >
      {children}
    </div>
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
  const { currentStep, goToStep, totalSteps, enableStepping } = useStepper();
  const isActive = idx === currentStep;
  const isCompleted = idx < currentStep;

  const handleClick = () => enableStepping && goToStep(idx);

  return (
    <div
      className={cn("stepper-header-title flex gap-2 items-center ", className)}
      role="button"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center gap-2">
        <div
          className={cn(
            "rounded-full border-2 border-gray-200",
            isActive && "text-white border-primary-500",
            isCompleted && "border-green-500"
          )}
        >
          <div
            className={cn(
              "stepper-header-title-number m-0.5 w-4 h-4 bg-gray-200 rounded-full",
              isActive && "bg-primary-500",
              isCompleted && "bg-transparent"
            )}
          >
            {isCompleted && (
              <CheckIcon className="h-full w-3 m-0.5 text-green-500" />
            )}
          </div>
        </div>
        {children}
      </div>

      {
        // Add a line separator if not the last element
        idx !== totalSteps - 1 && (
          <div
            className={cn(
              "min-h-0 ms-0 min-w-10 flex-1 h-0.5",
              isCompleted ? "bg-green-500" : "bg-gray-200"
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
  ...props
}: StepperPreviousProps) => {
  const { currentStep, goToStep } = useStepper();

  const handleClick = () => goToStep(currentStep - 1);

  return (
    <Button
      className={cn("stepper-previous", className)}
      onClick={handleClick}
      disabled={currentStep === 0}
      variant="unstyled"
      size="icon"
      {...props}
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
