"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/analytics/date-range-picker';
import { Mail, Calendar, Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface EmailAccount {
  id: string;
  email: string;
  provider: string;
}

interface ExtractionFormProps {
  onSubmit: (data: {
    emailAccountId: string;
    dateRange: DateRange;
  }) => Promise<void>;
}

export function ExtractionForm({ onSubmit }: ExtractionFormProps) {
  const [selectedEmailId, setSelectedEmailId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: emailAccounts, isLoading } = useQuery({
    queryKey: ['emailAccounts'],
    queryFn: async () => {
      const response = await fetch('/api/email/accounts');
      if (!response.ok) throw new Error('Failed to fetch email accounts');
      return response.json();
    },
  });

  const handleSubmit = async () => {
    if (!selectedEmailId || !dateRange.from || !dateRange.to) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        emailAccountId: selectedEmailId,
        dateRange,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extract Q&As</CardTitle>
        <CardDescription>
          Select an email account and date range to extract Q&As
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Account</label>
          <Select
            value={selectedEmailId}
            onValueChange={setSelectedEmailId}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an email account">
                {emailAccounts?.find((acc: EmailAccount) => acc.id === selectedEmailId)?.email}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {emailAccounts?.map((account: EmailAccount) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {account.email}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedEmailId || !dateRange.from || !dateRange.to || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Extracting...
            </>
          ) : (
            'Extract Q&As'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}