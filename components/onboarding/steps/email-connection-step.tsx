"use client";

import { Input } from '@/components/ui/input';

export function EmailConnectionStep() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Connect Your Gmail Account</h2>
        <p className="text-sm text-muted-foreground">
          Connect your Gmail account to start extracting Q&As from your emails
        </p>
      </div>

      <div className="space-y-2">
        <Input
          name="email"
          type="email"
          placeholder="Gmail Address"
          required
          pattern="[a-z0-9._%+-]+@gmail\.com$"
          title="Please enter a valid Gmail address"
        />
        <Input
          name="appPassword"
          type="password"
          placeholder="App Password"
          required
          minLength={16}
          maxLength={16}
          pattern="[A-Za-z0-9]{16}"
          title="App password must be exactly 16 characters"
        />
        <p className="text-sm text-muted-foreground">
          You'll need to generate an App Password from your Google Account settings
        </p>
      </div>
    </div>
  );
}