import { api } from "@/lib/shared/api";

export interface GmailAuthResponse {
    url: string;
}

export async function getGmailAuthUrl() {
    return api.get<GmailAuthResponse>('/api/auth/google');
}

export async function completeOnboarding() {
    return api.post('/api/onboarding/complete');
}

export async function updateOnboardingStep(step: number) {
    return api.post('/api/onboarding/update', { step });
}

export async function getOnboardingState() {
    return api.get('/api/onboarding/state');
} 