import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default function OnboardingPage() {
    return (
        <div className="container max-w-3xl mx-auto py-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Connect Your Gmail Account</h1>
                <p className="text-muted-foreground">
                    Follow these steps to securely connect your Gmail account to Quaestio
                </p>
            </div>
            <OnboardingWizard />
        </div>
    );
}
