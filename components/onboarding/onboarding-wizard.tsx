"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { linkEmailAccount } from "@/lib/core/auth/email-linking";
import { useToast } from "@/components/ui/use-toast";
import { EmailSetupCore } from "@/components/email/email-setup-core";
import { createClient } from "@/services/supabase/client";

export function OnboardingWizard() {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [linkingStatus, setLinkingStatus] = useState<{
        success?: boolean;
        error?: string;
    }>({});

    // Get user on mount
    startTransition(async () => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
            router.push("/login");
        }
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleSubmit = async (email: string, appPassword: string) => {
        try {
            await linkEmailAccount(user.id, email, "gmail", appPassword);
            setLinkingStatus({ success: true });
            toast({
                title: "Email account linked successfully",
                description: "You can now start managing your email subscriptions.",
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to link email account:", error);
            setLinkingStatus({ error: "Failed to link account" });
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
