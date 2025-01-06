export interface User {
    id: string;
    email: string;
    name?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string | null;
    onboardingCompleted?: boolean;
}
