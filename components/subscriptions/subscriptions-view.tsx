"use client";

import { SubscriptionList } from "@/components/email/subscription-list";
import { PageHeader } from "@/components/ui/page-header";
import { ViewProps } from "@/lib/types/components";

export function SubscriptionsView({ className }: ViewProps) {
    return (
        <div className={`space-y-6 ${className ?? ""}`}>
            <PageHeader 
                title="Email Subscriptions" 
                description="Manage your email subscriptions" 
            />
            <SubscriptionList />
        </div>
    );
}
