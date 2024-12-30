"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Mail, Lock, Key, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { connectEmail } from "@/lib/actions/email";
import type { EmailFormState } from "@/lib/actions/email";

const STEPS = [
  {
    title: "Enable IMAP",
    description: "First, enable IMAP access in your Gmail settings",
    link: "https://mail.google.com/mail/u/0/#settings/fwdandpop",
    buttonText: "Open Gmail Settings",
    icon: Mail
  },
  {
    title: "Enable 2-Step Verification",
    description: "Set up 2-Step Verification for your Google Account",
    link: "https://myaccount.google.com/security",
    buttonText: "Security Settings",
    icon: Lock
  },
  {
    title: "Generate App Password",
    description: "Create an App Password specifically for Quaestio",
    link: "https://myaccount.google.com/apppasswords",
    buttonText: "App Passwords",
    icon: Key
  }
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit"
      className="ml-auto"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Gmail'
      )}
    </Button>
  );
}

interface StepState extends EmailFormState {
  step: number;
}

const initialState: StepState = {
  step: 1
};

async function stepAction(state: StepState, formData: FormData): Promise<StepState> {
  const step = Number(formData.get("step"));
  
  // Only process the form on the final step
  if (step === 3) {
    const result = await connectEmail(state, formData);
    if (result.success) {
      return { ...result, step: 1 }; // Reset to first step on success
    }
    return { ...result, step };
  }
  
  return state;
}

export function EmailSetupSteps() {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(stepAction, initialState);
  const [currentStep, setCurrentStep] = React.useState(1);
  const step = STEPS[currentStep - 1];

  React.useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    } else if (state.success) {
      toast({
        title: "Success",
        description: "Email account connected successfully",
      });
      setCurrentStep(1);
    }
  }, [state.error, state.success, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Gmail Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={dispatch}>
          <input type="hidden" name="step" value={currentStep} />
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <step.icon className="h-4 w-4" />
              Step {currentStep}: {step.title}
            </h3>
            
            <p className="text-sm text-muted-foreground">
              {step.description}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(step.link, '_blank')}
              className="w-full"
            >
              {step.buttonText}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Gmail Address"
                    required
                    pattern="[a-z0-9._%+-]+@gmail\.com$"
                    title="Please enter a valid Gmail address"
                  />
                  <Input
                    name="appPassword"
                    type="password"
                    placeholder="App Password"
                    required
                    minLength={16}
                    maxLength={16}
                    pattern="[A-Za-z0-9]{16}"
                    title="App password must be exactly 16 characters"
                  />
                </div>
                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <SubmitButton />
                </div>
              </div>
            )}

            {currentStep < 3 && (
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                )}
                <Button 
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="ml-auto"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}