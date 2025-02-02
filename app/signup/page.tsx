import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
            <div className="w-full max-w-sm space-y-8 px-4 sm:px-0">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
                    <p className="text-muted-foreground">Enter your details to get started</p>
                </div>
                <AuthForm type="signup" />
            </div>
        </div>
    );
}
