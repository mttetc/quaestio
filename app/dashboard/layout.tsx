import { Header } from "@/components/dashboard/header";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { TokenBalance } from "@/components/tokens/token-balance";
import { Sidebar } from "@/components/ui/aceternity/sidebar";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
            <ErrorBoundary>
                <Sidebar />
            </ErrorBoundary>
            <div className="flex-1 flex flex-col">
                <Header>
                    <Suspense fallback={<div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />}>
                        <ErrorBoundary>
                            <TokenBalance />
                        </ErrorBoundary>
                    </Suspense>
                </Header>
                <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
            <OnboardingModal />
        </div>
    );
}
