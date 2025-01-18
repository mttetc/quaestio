'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useFormState, useFormStatus } from 'react-dom';
import { exportQAs } from '@/lib/features/exports/actions/export-qas';
import { useEffect } from 'react';

const initialState = {
  error: undefined,
  success: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Exporting..." : "Export Q&As"}
    </Button>
  );
}

export function QAExport() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(exportQAs, initialState);

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    } else if (state.success) {
      toast({
        title: "Success",
        description: "Q&As exported successfully",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Export Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              type="submit"
              name="format"
              value="csv"
              variant="outline"
            >
              CSV
            </Button>
            <Button
              type="submit"
              name="format"
              value="html"
              variant="outline"
            >
              HTML
            </Button>
            <Button
              type="submit"
              name="format"
              value="react"
              variant="outline"
            >
              React
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}