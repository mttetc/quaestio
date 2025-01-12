"use client";

import { useReadEmailAccounts } from "@/lib/features/email/hooks/use-read-accounts";
import { emailAccounts } from "@/lib/core/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type EmailAccount = InferSelectModel<typeof emailAccounts>;

export default function SettingsPage() {
    const { data: linkedEmails = [], isLoading } = useReadEmailAccounts();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and email connections</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Connected Email Accounts</h3>
                <div className="space-y-2">
                    {linkedEmails.map((email: EmailAccount) => (
                        <div key={email.id} className="flex items-center justify-between">
                            <span>{email.email}</span>
                            <span className="text-sm text-muted-foreground">{email.provider}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
