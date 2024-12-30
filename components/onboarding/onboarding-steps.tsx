"use client";

import * as React from "react";
import { WelcomeStep } from "./steps/welcome-step";
import { EmailConnectionStep } from "./steps/email-connection-step";
import { CompletionStep } from "./steps/completion-step";

const STEPS = [
  {
    title: "Welcome",
    component: WelcomeStep,
  },
  {
    title: "Connect Email",
    component: EmailConnectionStep,
  },
  {
    title: "Complete",
    component: CompletionStep,
  },
] as const;

interface OnboardingStepsProps {
  currentStep: number;
}

export function OnboardingSteps({ currentStep }: OnboardingStepsProps) {
  const StepComponent = STEPS[currentStep].component;

  return (
    <div className="py-6">
      <StepComponent />
    </div>
  );
}

export { STEPS };
export type { OnboardingStepsProps };
export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const isLastStep = currentStep === STEPS.length - 1;
  const canGoBack = currentStep > 0 && !isLastStep;

  return {
    currentStep,
    setCurrentStep,
    isLastStep,
    canGoBack,
    totalSteps: STEPS.length
  };
};