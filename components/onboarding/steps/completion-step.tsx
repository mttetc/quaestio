import { Check } from 'lucide-react';

export function CompletionStep() {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="h-6 w-6 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold">You're All Set!</h2>
      <p className="text-muted-foreground">
        Your email is connected and you're ready to start extracting Q&As.
        Head to your dashboard to begin analyzing your conversations.
      </p>
    </div>
  );
}