"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WelcomeStep } from "./steps/welcome-step";
import { EmailConnectionStep } from "./steps/email-connection-step";
import { CompletionStep } from "./steps/completion-step";

interface OnboardingStepsProps {
  onComplete: () => void;
}

export function OnboardingSteps({ onComplete }: OnboardingStepsProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();

  const steps = [
    {
      title: "Welcome",
      component: <WelcomeStep />,
    },
    {
      title: "Connect Email",
      component: <EmailConnectionStep onSuccess={() => setStep(2)} />,
    },
    {
      title: "Complete",
      component: <CompletionStep />,
    },
  ];

  const handleNext = async () => {
    if (step === steps.length - 1) {
      try {
        await fetch("/api/user/onboarding", {
          method: "POST",
        });
        onComplete();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to complete onboarding",
          variant: "destructive",
        });
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-4">
        {steps[step].component}
      </div>
      <div className="flex justify-end gap-4">
        {step > 0 && step < steps.length - 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button onClick={handleNext}>
          {step === steps.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
}