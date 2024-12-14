"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OnboardingSteps } from "./onboarding-steps";
import { useQuery } from "@tanstack/react-query";

export function OnboardingModal() {
  const [open, setOpen] = useState(true);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
  });

  if (!user || user.hasCompletedOnboarding) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]" showClose={false}>
        <OnboardingSteps onComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}