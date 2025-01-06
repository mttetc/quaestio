"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Loader2, ExternalLink } from "lucide-react";
import { addEmailAccount } from "@/lib/features/email/actions/email";
import { useUser } from "@/services/auth/hooks/use-user";

interface EmailFormState {
    error?: string;
    success?: boolean;
}

async function emailAction(prevState: any, formData: FormData) {
    try {
        const email = formData.get("email") as string;
        const appPassword = formData.get("appPassword") as string;
        const userId = formData.get("userId") as string;

        await addEmailAccount(userId, email, appPassword, "gmail");
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Failed to connect email account" };
    }
}

function ConnectButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : (
                <>
                    <Mail className="mr-2 h-4 w-4" />
                    Connect Gmail
                </>
            )}
        </Button>
    );
}

const initialState: EmailFormState = {};

export function EmailLinkForm() {
    const { toast } = useToast();
    const { data: user } = useUser();
    const [state, formAction] = useFormState(emailAction, initialState);

    React.useEffect(() => {
        if (state.error) {
            toast({
                title: "Error",
                description: state.error,
                variant: "destructive",
            });
        } else if (state.success) {
            toast({
                title: "Success",
                description: "Email account connected successfully",
            });
        }
    }, [state, toast]);

    if (!user) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connect Gmail Account</CardTitle>
                <CardDescription>
                    Connect your Gmail account using an app password. Follow these steps:
                    <ol className="mt-2 ml-4 list-decimal text-sm">
                        <li>Enable 2-Step Verification in your Google Account</li>
                        <li>Generate an App Password for Mail</li>
                        <li>Enable IMAP in Gmail settings</li>
                    </ol>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="userId" value={user.id} />
                    <div className="space-y-2">
                        <Label htmlFor="email">Gmail Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@gmail.com"
                            required
                            pattern="[a-z0-9._%+-]+@gmail\.com$"
                            title="Please enter a valid Gmail address"
                        />
                        <p className="text-sm text-muted-foreground">Only Gmail accounts are supported</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appPassword">App Password</Label>
                        <Input
                            id="appPassword"
                            name="appPassword"
                            type="password"
                            placeholder="16-character app password"
                            required
                            minLength={16}
                            maxLength={16}
                            pattern="[A-Za-z0-9]{16}"
                            title="App password must be exactly 16 characters"
                        />
                        <p className="text-sm text-muted-foreground">
                            Generate an app password from your Google Account settings
                        </p>
                    </div>

                    <ConnectButton />
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                    Enable 2-Step Verification <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                    Generate App Password <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <a
                    href="https://mail.google.com/mail/u/0/#settings/fwdandpop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary flex items-center"
                >
                    Enable IMAP in Gmail <ExternalLink className="ml-1 h-3 w-3" />
                </a>
            </CardFooter>
        </Card>
    );
}
