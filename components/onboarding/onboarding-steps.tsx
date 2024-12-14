"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailLinkForm } from "@/components/settings/email-link-form";
import { Mail, Zap, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingStepsProps {
  onComplete: () => void;
}

export function OnboardingSteps({ onComplete }: OnboardingStepsProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const steps = [
    {
      title: "Welcome to Quaestio",
      icon: Zap,
      content: (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Welcome to Quaestio!</h2>
          <p className="text-muted-foreground">
            Let's get you set up to extract Q&As from your email conversations.
          </p>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Mail className="h-8 w-8 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Connect Your Email</h3>
                <p className="text-sm text-muted-foreground">
                  Link your Gmail account to start processing emails
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Brain className="h-8 w-8 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">AI-Powered Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI automatically identifies and extracts Q&As
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Connect Email",
      icon: Mail,
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Connect Your Email</h2>
          <p className="text-center text-muted-foreground">
            Connect your Gmail account to start extracting Q&As
          </p>
          <EmailLinkForm onSuccess={() => setStep(2)} />
        </div>
      ),
    },
    {
      title: "All Set!",
      icon: Check,
      content: (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">You're All Set!</h2>
          <p className="text-muted-foreground">
            Your email is connected and you're ready to start extracting Q&As.
          </p>
        </div>
      ),
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
        {steps[step].content}
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