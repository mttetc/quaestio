"use client";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useReadUser } from "@/lib/features/auth/hooks/use-read-user";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const { isLoading } = useReadUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <OnboardingWizard />;
}
