"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn, signUp } from "@/lib/features/auth/actions/auth";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";

interface AuthFormProps {
    type: "login" | "signup";
}

interface AuthState {
    error?: string;
}

function SubmitButton({ type }: { type: "login" | "signup" }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {type === "login" ? "Signing in..." : "Creating account..."}
                </>
            ) : type === "login" ? (
                "Sign In"
            ) : (
                "Sign Up"
            )}
        </Button>
    );
}

export function AuthForm({ type }: AuthFormProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState<AuthState, FormData>(
        async (prevState, formData) => {
            try {
                const action = type === "login" ? signIn : signUp;
                await action(prevState, formData);
                return { error: undefined };
            } catch (error) {
                return {
                    error: error instanceof Error ? error.message : "An error occurred",
                };
            }
        },
        { error: undefined }
    );

    useEffect(() => {
        if (state?.error) {
            toast({
                title: "Error",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state?.error, toast]);

    return (
        <form action={formAction} className="space-y-4 w-full max-w-sm">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>

            <SubmitButton type={type} />
        </form>
    );
}
