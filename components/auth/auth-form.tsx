"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/features/auth/actions/signIn";
import { signUp } from "@/lib/features/auth/actions/signUp";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

interface AuthFormProps {
    type: "login" | "signup";
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
    const action = type === "login" ? signIn : signUp;
    const [state, formAction] = useFormState(action, null);

    if (state?.error) {
        toast({
            title: "Error",
            description: state.error,
            variant: "destructive",
        });
    }

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            {type === "signup" && (
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                </div>
            )}
            <SubmitButton type={type} />
            {type === "login" ? (
                <p className="text-sm text-muted-foreground">
                    Don't have an account? <Link href="/signup">Sign up</Link>
                </p>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login">Sign in</Link>
                </p>
            )}
        </form>
    );
}
