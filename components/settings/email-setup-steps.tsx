"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { EmailSetupCore } from "@/components/email/email-setup-core";
import { addEmailAccount } from "@/lib/features/email/actions/add-account";
import { createClient, getURL } from "@/lib/infrastructure/supabase/client";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";

export function EmailSetupSteps() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    // Add error handling for auth redirects
    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.slice(1));
        if (params.get("error_code")?.startsWith("4")) {
            toast({
                title: "Authentication Error",
                description: params.get("error_description"),
                variant: "destructive",
            });
        }
    }, [toast]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const handleSubmit = async (email: string, appPassword: string) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
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
