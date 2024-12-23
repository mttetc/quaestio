"use client";

import { EmailLinkForm } from "@/components/settings/email-link-form";
import { LinkedEmails } from "@/components/settings/linked-emails";
import { useQuery } from "@tanstack/react-query";
import { removeEmailAccount } from "@/lib/actions/email";

export default function SettingsPage() {
    const { data: linkedEmails = [], isLoading } = useQuery({
        queryKey: ["linkedEmails"],
        queryFn: async () => {
            const response = await fetch("/api/email/accounts");
            if (!response.ok) throw new Error("Failed to fetch linked emails");
            return response.json();
        },
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Email Settings</h2>
                <p className="text-muted-foreground">Connect your email accounts to start extracting Q&As</p>
            </div>

            <LinkedEmails emails={linkedEmails} onDelete={removeEmailAccount} isLoading={isLoading} />

            <EmailLinkForm />
        </div>
    );
}
