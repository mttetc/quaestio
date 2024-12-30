'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export function QAExport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/qa/export', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to export Q&As');
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Q&As exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export Q&As",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Q&A Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              name="title"
              placeholder="Enter export title"
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              name="description"
              placeholder="Enter export description"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Exporting..." : "Export Q&As"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 