"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLinkedEmails } from "@/services/email/hooks/use-linked-emails";

export default function SettingsPage() {
  const { data: linkedEmails = [], isLoading } = useLinkedEmails();

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linked Email Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {linkedEmails.length === 0 ? (
            <p className="text-sm text-muted-foreground">No email accounts linked yet.</p>
          ) : (
            <div className="space-y-4">
              {linkedEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{email.email}</p>
                    <p className="text-xs text-muted-foreground">{email.provider}</p>
                  </div>
                  {email.lastSynced && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {new Date(email.lastSynced).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
