"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { EmailSetupCore } from "@/components/email/email-setup-core";
import { addEmailAccount } from "@/lib/features/email/actions/email";
import { useUser } from "@/services/auth/hooks/use-user";

export function EmailSetupSteps() {
    const { toast } = useToast();
    const { data: user } = useUser();

    const handleSubmit = async (email: string, appPassword: string) => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to connect an email account",
                variant: "destructive",
            });
            return;
        }

        try {
            await addEmailAccount(user.id, email, appPassword, "gmail");
            toast({
                title: "Success",
                description: "Email account connected successfully",
            });
        } catch (error) {
            console.error("Failed to connect email:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to connect email account",
                variant: "destructive",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connect Gmail Account</CardTitle>
            </CardHeader>
            <CardContent>
                <EmailSetupCore onSubmit={handleSubmit} />
            </CardContent>
        </Card>
    );
}
