"use client";

import { useState } from 'react';
import { ExtractionForm } from '@/components/qa/extraction-form';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from 'react-day-picker';

export default function DashboardPage() {
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtraction = async ({
    emailAccountId,
    dateRange,
  }: {
    emailAccountId: string;
    dateRange: DateRange;
  }) => {
    if (!dateRange.from || !dateRange.to) return;

    setIsExtracting(true);
    try {
      const response = await fetch('/api/qa/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAccountId,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract Q&As');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: `Extracted ${data.results.length} Q&As from your emails`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to extract Q&As',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Q&A Library</h2>
        <p className="text-muted-foreground">
          Extract and analyze Q&As from your email conversations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExtractionForm onSubmit={handleExtraction} />
      </div>
    </div>
  );
}