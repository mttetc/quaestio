"use client";

import { LinkedEmails } from "@/components/settings/linked-emails";
import { useReadEmailAccounts } from "@/lib/features/email/hooks/use-read-accounts";
import { useDeleteEmailAccount } from "@/lib/features/email/hooks/use-delete-account";

export function SettingsContent() {
    const { data: emails = [], isLoading } = useReadEmailAccounts();
    const { mutate: deleteAccount } = useDeleteEmailAccount();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <LinkedEmails 
                emails={emails} 
                onDelete={deleteAccount} 
                isLoading={isLoading} 
            />
        </div>
    );
}
