import { Suspense } from "react";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome to your Q&A management dashboard</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <QuickActions />
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <Suspense fallback={<div>Loading recent activity...</div>}>
                        <RecentActivity />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
