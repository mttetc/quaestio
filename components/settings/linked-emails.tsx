"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedEmail {
  id: string;
  email: string;
  provider: string;
}

interface LinkedEmailsProps {
  emails: LinkedEmail[];
  onDelete: (id: string) => void;
}

export function LinkedEmails({ emails, onDelete }: LinkedEmailsProps) {
  if (emails.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked Email Accounts</CardTitle>
        <CardDescription>
          Manage your connected email accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{email.email}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {email.provider}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(email.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}