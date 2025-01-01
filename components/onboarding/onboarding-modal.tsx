"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingSteps, OnboardingStep } from "./onboarding-steps";
import { useCompleteOnboarding } from "@/services/auth/hooks/use-user";

const STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Get started with Quaestio and learn how it can help you manage your email subscriptions.",
    completed: false,
  },
  {
    id: "email",
    title: "Connect Email",
    description: "Connect your Gmail account to start managing your email subscriptions.",
    completed: false,
  },
  {
    id: "complete",
    title: "Complete",
    description: "You're all set! Start managing your email subscriptions.",
    completed: false,
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(STEPS);
  const { mutate: completeOnboarding, isPending: isCompleting } = useCompleteOnboarding();

  const handleComplete = () => {
    completeOnboarding(undefined, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setSteps((prev) =>
        prev.map((step, index) =>
          index === currentStep ? { ...step, completed: true } : step
        )
      );
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <OnboardingSteps
          steps={steps}
          currentStep={currentStep}
          onComplete={handleComplete}
          isCompleting={isCompleting}
          onBack={handleBack}
          onNext={handleNext}
        />
      </DialogContent>
    </Dialog>
  );
}