"use client";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useReadUser } from "@/lib/features/auth/hooks/use-read-user";
import { useRouter } from "next/navigation";
import { ViewProps } from "@/lib/types/components";

export function OnboardingView({ className }: ViewProps) {
    const router = useRouter();
    const { data: user } = useReadUser();

    if (user?.hasCompletedOnboarding) {
        router.push("/dashboard");
        return null;
    }

    return (
        <div className={className}>
            <OnboardingWizard />
        </div>
    );
}
