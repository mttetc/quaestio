"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LinkedEmail {
    id: string;
    email: string;
    provider: string;
}

interface LinkedEmailsProps {
    emails: LinkedEmail[];
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export function LinkedEmails({ emails, onDelete, isLoading }: LinkedEmailsProps) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!emails.length) {
        return <div className="text-muted-foreground">No email accounts linked yet</div>;
    }

    return (
        <div className="space-y-4">
            {emails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{email.email}</span>
                        <Badge variant="secondary">{email.provider}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(email.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
