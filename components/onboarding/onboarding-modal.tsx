"use client";

import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OnboardingSteps, useOnboarding } from "./onboarding-steps";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function OnboardingModal() {
  const [open, setOpen] = React.useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentStep, setCurrentStep, isLastStep, canGoBack } = useOnboarding();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
  });

  const { mutate: completeOnboarding, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/onboarding", { method: "POST" });
      if (!response.ok) throw new Error("Failed to complete onboarding");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete onboarding",
        variant: "destructive",
      });
    }
  });

  if (isLoadingUser) {
    return null;
  }

  if (!user || user.hasCompletedOnboarding) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Welcome to Quaestio</DialogTitle>
          <DialogDescription>
            Let's get you set up with everything you need to get started.
          </DialogDescription>
        </DialogHeader>

        <OnboardingSteps currentStep={currentStep} />

        <DialogFooter>
          <div className="flex w-full justify-end gap-4">
            {canGoBack && (
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(step => step - 1)}
              >
                Back
              </Button>
            )}
            {isLastStep ? (
              <Button 
                onClick={() => completeOnboarding()} 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Started...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            ) : (
              <Button onClick={() => setCurrentStep(step => step + 1)}>
                Next
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}