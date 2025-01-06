"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuthRedirect } from "@/services/auth/hooks/use-auth-redirect";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const { isLoading } = useAuthRedirect();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container max-w-lg mx-auto py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your account to continue</p>
            </div>
            <AuthForm type="login" />
        </div>
    );
}
