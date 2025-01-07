"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signIn, signUp } from "@/lib/features/auth/actions/auth";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

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

    async function formAction(formData: FormData) {
        const action = type === "login" ? signIn : signUp;
        const result = await action(null, formData);

        if (!result.success) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            });
        }
    }

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="w-full"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required className="w-full" />
                </div>
            </div>

            <div className="space-y-4">
                <SubmitButton type={type} />

                {type === "signup" && (
                    <p className="text-sm text-center text-muted-foreground">
                        Already registered?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </form>
    );
}
