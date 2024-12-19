"use client";

import { Button } from "@/components/ui/button";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperNext,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";

const StepperDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Step 1", "Step 2", "Step 3"];

  return (
    <div className="page" id="stepper">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      >
        <StepperHeader className="flex lg:flex-row flex-col flex-wrap items-center gap-4 lg:gap-36 p-4">
          <StepperPrevious>
            <ChevronLeftIcon />
          </StepperPrevious>
          <div className="flex lg:flex-row flex-col flex-1 items-center gap-2 steps-titles">
            {steps.map((step, idx) => (
              <StepperHeaderTitle key={idx} idx={idx}>
                {step}
              </StepperHeaderTitle>
            ))}
          </div>
          <Button onClick={() => setCurrentStep(2)}>Skip</Button>
        </StepperHeader>

        <StepperSteps>
          <StepperStep idx={0}>
            <div className="bg-gray-50 shadow p-4 rounded-md">
              <h2 className="font-semibold text-lg">Step 1 Content</h2>
              <p>Welcome to Step 1!</p>
            </div>
          </StepperStep>

          <StepperStep idx={1}>
            <div className="bg-gray-50 shadow p-4 rounded-md">
              <h2 className="font-semibold text-lg">Step 2 Content</h2>
              <p>Here is Step 2.</p>
            </div>
          </StepperStep>

          <StepperStep idx={2}>
            <div className="bg-gray-50 shadow p-4 rounded-md">
              <h2 className="font-semibold text-lg">Step 3 Content</h2>
              <p>Final Step!</p>
            </div>
          </StepperStep>
        </StepperSteps>

        <StepperPrevious />
        <StepperNext />
      </Stepper>
    </div>
  );
};

export default StepperDemo;
