"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailConnectionSchema } from '@/lib/email/validation';
import { useToast } from "@/components/ui/use-toast";
import { Mail, Loader2, ExternalLink } from "lucide-react";

export function EmailLinkForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = emailConnectionSchema.parse({
        email,
        appPassword
      });

      const response = await fetch('/api/email/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect email account');
      }

      toast({
        title: "Success",
        description: "Email account connected successfully. You can now start using it.",
      });

      setEmail("");
      setAppPassword("");
    } catch (error) {
      console.error('Email connection error:', error);
      
      let errorMessage = 'Failed to connect email account';
      if (error instanceof Error) {
        if (error.message.includes('IMAP')) {
          errorMessage = 'Failed to connect to Gmail. Please verify your app password and ensure IMAP is enabled.';
        } else if (error.message.includes('already connected')) {
          errorMessage = 'This email account is already connected to your account.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Gmail Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              required
              pattern="[a-z0-9._%+-]+@gmail\.com$"
              title="Please enter a valid Gmail address"
            />
            <p className="text-sm text-muted-foreground">
              Only Gmail accounts are supported
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="appPassword">App Password</Label>
            <Input
              id="appPassword"
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
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