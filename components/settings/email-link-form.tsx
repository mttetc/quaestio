"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";
import { initiateEmailLink } from "@/lib/actions/email";
import type { EmailState } from "@/lib/actions/email";
import { useEffect } from "react";

function ConnectButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      <Mail className="mr-2 h-4 w-4" />
      {pending ? "Connecting..." : "Connect Gmail Account"}
    </Button>
  );
}

export function EmailLinkForm() {
  const [state, formAction] = useFormState<EmailState, FormData>(initiateEmailLink, {});
  const searchParams = useSearchParams();

  useEffect(() => {
    if (state.success) {
      window.location.href = state.success;
    }
  }, [state.success]);

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      // Show success message
    } else if (error === 'true') {
      // Show error message
    }
  }, [searchParams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Gmail Account</CardTitle>
        <CardDescription>
          Connect your Gmail account to start processing Q&As from your conversations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          
          <ConnectButton />
        </form>
      </CardContent>
    </Card>
  );
}