"use server";

import { Sidebar } from "@/components/ui/aceternity/sidebar";
import { Header } from "@/components/dashboard/header";
import { getQueryClient } from "@/lib/get-query-client";
import { readUser } from "@/lib/features/auth/queries/read-user";
import { readEmailAccounts } from "@/lib/features/email/queries/readEmailAccounts";
import { readTokenBalance } from "@/lib/features/tokens/queries/tokens";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    // Prefetch user data
    const user = await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: readUser,
    });

    if (!user) {
        redirect("/login");
    }

    // Prefetch email accounts
    await queryClient.prefetchQuery({
        queryKey: ["emailAccounts"],
        queryFn: readEmailAccounts,
    });

    // Prefetch token balance
    await queryClient.prefetchQuery({
        queryKey: ["tokenBalance", user.id],
        queryFn: () => readTokenBalance(user.id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6 overflow-y-auto">{children}</main>
                </div>
            </div>
        </HydrationBoundary>
    );
}
