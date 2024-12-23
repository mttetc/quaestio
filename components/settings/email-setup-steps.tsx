"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Mail, Lock, Key, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { emailConnectionSchema } from '@/lib/email/validation';

export function EmailSetupSteps() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      title: "Enable IMAP",
      description: "First, enable IMAP access in your Gmail settings",
      link: "https://mail.google.com/mail/u/0/#settings/fwdandpop",
      buttonText: "Open Gmail Settings"
    },
    {
      title: "Enable 2-Step Verification",
      description: "Set up 2-Step Verification for your Google Account",
      link: "https://myaccount.google.com/security",
      buttonText: "Security Settings"
    },
    {
      title: "Generate App Password",
      description: "Create an App Password specifically for Quaestio",
      link: "https://myaccount.google.com/apppasswords",
      buttonText: "App Passwords"
    }
  ];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      setIsLoading(true);
      
      // Validate input
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
        throw new Error(data.error || 'Failed to connect email');
      }

      toast({
        title: "Success",
        description: "Email account connected successfully",
      });

      // Reset form
      setEmail('');
      setAppPassword('');
      setStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to connect email',
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
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            {step === 1 && <Mail className="h-4 w-4" />}
            {step === 2 && <Lock className="h-4 w-4" />}
            {step === 3 && <Key className="h-4 w-4" />}
            Step {step}: {steps[step - 1].title}
          </h3>
          
          <p className="text-sm text-muted-foreground">
            {steps[step - 1].description}
          </p>

          <Button
            variant="outline"
            onClick={() => window.open(steps[step - 1].link, '_blank')}
            className="w-full"
          >
            {steps[step - 1].buttonText}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          {step === 3 && (
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Gmail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="App Password"
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            className="ml-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              step === 3 ? 'Connect Gmail' : 'Next'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}