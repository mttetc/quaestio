"use client";

import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/ui/aceternity/sidebar";
import { Header } from "@/components/dashboard/header";
import { useRouter } from "next/navigation";
import { useReadEmailAccounts } from "@/lib/features/email/hooks/use-read-accounts";
import { useReadUser, useUpdateUser } from "@/lib/features/auth/hooks/use-read-user";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { toast } = useToast();
    const { data: user } = useReadUser();
    const updateUser = useUpdateUser();
    const { data: emailAccounts } = useReadEmailAccounts();

    useEffect(() => {
        if (!emailAccounts?.length || user?.hasCompletedOnboarding || updateUser.isError) return;

        updateUser.mutate(
            { hasCompletedOnboarding: true },
            {
                onSuccess: () => {
                    toast({
                        title: "Onboarding completed",
                        description: "You can now start managing your email subscriptions.",
                    });
                },
            }
        );
    }, [emailAccounts?.length, user?.hasCompletedOnboarding, updateUser]);

    if (!user) {
        router.push("/login");
        return null;
    }

    if (!user.hasCompletedOnboarding && !emailAccounts?.length) {
        router.push("/onboarding");
        return null;
    }

    return <div className="flex h-screen">{children}</div>;
}
