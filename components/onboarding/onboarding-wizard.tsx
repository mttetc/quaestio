"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { EmailSetupCore } from "@/components/email/email-setup-core";
import { addEmailAccount } from "@/lib/features/email/actions/add-account";
import { createClient, getURL } from "@/lib/infrastructure/supabase/client";

export function OnboardingWizard() {
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();

    // Add error handling for auth redirects
    useEffect(() => {
        const errorCode = searchParams.get("error_code");
        const errorDescription = searchParams.get("error_description");
        
        if (errorCode?.startsWith("4")) {
            toast({
                title: "Authentication Error",
                description: errorDescription,
                variant: "destructive",
            });
        }
    }, [searchParams, toast]);

    const handleSubmit = async (email: string, appPassword: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to continue",
                variant: "destructive",
            });
            return;
        }

        try {
            await addEmailAccount(user.id, email, appPassword, "gmail");
            toast({
                title: "Email account linked successfully",
                description: "You can now start managing your email subscriptions.",
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to link email account:", error);
            toast({
                title: "Failed to link email account",
                description: "Please try again or contact support if the issue persists.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="p-6">
            <EmailSetupCore onSubmit={handleSubmit} showStepIndicators={true} className="max-w-xl mx-auto" />
        </Card>
    );
}
