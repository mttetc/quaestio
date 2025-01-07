"use client";

import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/ui/aceternity/sidebar";
import { Header } from "@/components/dashboard/header";
import { useRouter } from "next/navigation";
import { useEmailAccounts } from "@/services/email/hooks/use-email";
import { useUser, useCompleteOnboarding } from "@/services/auth/hooks/use-user";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: emailAccounts, isLoading: isEmailLoading } = useEmailAccounts();
    const { data: user, isLoading: isUserLoading } = useUser();
    const { mutate: completeOnboarding, isError: isOnboardingError } = useCompleteOnboarding();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!emailAccounts?.length || user?.onboardingCompleted || isOnboardingError) return;
        completeOnboarding(undefined, {
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to complete onboarding. Some features might be limited.",
                    variant: "destructive",
                });
            },
        });
    }, [emailAccounts, user?.onboardingCompleted, completeOnboarding, isOnboardingError, toast]);

    if (isUserLoading || isEmailLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!emailAccounts?.length) {
        router.push("/onboarding");
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
