import { api } from "@/lib/api";

export interface EmailAccount {
    id: string;
    email: string;
    provider: string;
    lastSynced?: string;
}

export interface EmailSubscription {
    id: string;
    sender: string;
    domain: string;
    type: string;
    frequency: string;
    status: string;
}

export interface UnsubscribeResult {
    success: boolean;
    status: "completed" | "pending" | "failed";
    error?: string;
    message: string;
}

export async function getEmailAccounts() {
    return api.get<EmailAccount[]>("/api/email/accounts");
}

export async function getSubscriptions() {
    return api.get<EmailSubscription[]>("/api/email/subscriptions");
}

export async function unsubscribe(ids: string[]) {
    return api.post<UnsubscribeResult>("/api/email/unsubscribe", { ids });
}
