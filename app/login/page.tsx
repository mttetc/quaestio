// This page is automatically static because it has no dynamic features
import { AuthForm } from "@/components/auth/auth-form";

export const dynamic = "force-static";

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
            <div className="w-full max-w-sm space-y-8 px-4 sm:px-0">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account to continue</p>
                </div>
                <AuthForm type="login" />
            </div>
        </div>
    );
}
