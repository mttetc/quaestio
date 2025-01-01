"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingStepsProps {
  steps: OnboardingStep[];
  currentStep: number;
  onComplete: () => void;
  isCompleting: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingSteps({
  steps,
  currentStep,
  onComplete,
  isCompleting,
  onBack,
  onNext,
}: OnboardingStepsProps) {
  const isLastStep = currentStep === steps.length - 1;
  const canGoBack = currentStep > 0;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Welcome to Quaestio</DialogTitle>
        <DialogDescription>
          Let's get you set up with everything you need to get started.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 ${
              index === currentStep ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                step.completed
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary"
                  : "border-muted"
              }`}
            >
              {step.completed ? "✓" : index + 1}
            </div>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <DialogFooter>
        <div className="flex w-full justify-end gap-4">
          {canGoBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          {isLastStep ? (
            <Button onClick={onComplete} disabled={isCompleting}>
              {isCompleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Started...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          ) : (
            <Button onClick={onNext}>Next</Button>
          )}
        </div>
      </DialogFooter>
    </div>
  );
}