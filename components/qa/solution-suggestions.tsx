"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSolutionSuggestions } from "@/services/qa/hooks/use-solutions";

interface SolutionSuggestionsProps {
  question: string;
}

export function SolutionSuggestions({ question }: SolutionSuggestionsProps) {
  const { data: solutionData, isLoading } = useSolutionSuggestions(question);

  if (isLoading) {
    return <div>Loading suggestions...</div>;
  }

  if (!solutionData?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Similar Solutions</h3>
      {solutionData.map((solution) => (
        <Card key={solution.id}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {solution.title}
              <span className="ml-2 text-xs text-muted-foreground">
                {Math.round(solution.confidence * 100)}% match
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{solution.content}</p>
            {solution.source && (
              <p className="mt-2 text-xs text-muted-foreground">
                Source: {solution.source}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}