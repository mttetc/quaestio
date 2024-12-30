"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Clock, ArrowRight, Shield } from 'lucide-react';
import type { Solution } from '@/lib/infrastructure/ai/solution-generator';
import { generateStepKey, generateMeasureKey } from '@/lib/shared/utils/key-generation';

interface SolutionSuggestionsProps {
  qaId: string;
}

export function SolutionSuggestions({ qaId }: SolutionSuggestionsProps) {
  const [selectedSolution, setSelectedSolution] = useState<number>(0);

  const { data: solutionData, isLoading } = useQuery({
    queryKey: ['solutions', qaId],
    queryFn: async () => {
      const response = await fetch(`/api/qa/${qaId}/solutions`);
      if (!response.ok) throw new Error('Failed to fetch solutions');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generating Solutions...</CardTitle>
          <CardDescription>
            Our AI is analyzing the issue and generating potential solutions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!solutionData) return null;

  const solution: Solution = solutionData.solutions[selectedSolution];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Suggested Solutions
        </CardTitle>
        <CardDescription>{solutionData.problem}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{solution.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {solution.estimatedTime}
            </div>
          </div>
          
          <p className="text-muted-foreground">{solution.description}</p>
          
          <div className="space-y-4">
            <h4 className="font-medium">Implementation Steps:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {solution.steps.map((step) => (
                <li key={generateStepKey(step)} className="text-muted-foreground">{step}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Preventive Measures:
            </h4>
            <ul className="list-disc list-inside space-y-2">
              {solution.preventiveMeasures.map((measure) => (
                <li key={generateMeasureKey(measure)} className="text-muted-foreground">{measure}</li>
              ))}
            </ul>
          </div>

          {solutionData.solutions.length > 1 && (
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedSolution((prev) => 
                  prev > 0 ? prev - 1 : solutionData.solutions.length - 1
                )}
              >
                Previous Solution
              </Button>
              <span className="text-sm text-muted-foreground">
                Solution {selectedSolution + 1} of {solutionData.solutions.length}
              </span>
              <Button
                onClick={() => setSelectedSolution((prev) => 
                  prev < solutionData.solutions.length - 1 ? prev + 1 : 0
                )}
              >
                Next Solution
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}