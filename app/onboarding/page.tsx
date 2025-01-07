"use client";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useUser } from "@/services/auth/hooks/use-user";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const { isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <OnboardingWizard />;
}
