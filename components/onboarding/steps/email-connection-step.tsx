"use client";

import { useState } from 'react';
import { useGmailAuth } from '@/lib/hooks/use-gmail-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2 } from 'lucide-react';

interface EmailConnectionStepProps {
  onSuccess: () => void;
}

export function EmailConnectionStep({ onSuccess }: EmailConnectionStepProps) {
  const [email, setEmail] = useState('');
  const { mutate: connectGmail, isLoading } = useGmailAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@gmail.com')) {
      return;
    }
    connectGmail(undefined, {
      onSuccess: () => onSuccess(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Gmail Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          pattern=".*@gmail\.com$"
        />
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
  );
}