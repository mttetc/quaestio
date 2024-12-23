"use client";

import { EmailSetupSteps } from "@/components/settings/email-setup-steps";

export default function EmailOnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <EmailSetupSteps />
      </div>
    </div>
  );
}