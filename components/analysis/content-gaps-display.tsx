"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ContentAnalysis, ContentGap } from '@/lib/analysis/content-comparison';
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ContentGapsDisplayProps {
  analysis: ContentAnalysis;
}

function GapCard({ gap }: { gap: ContentGap }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{gap.topic}</h3>
            <Badge variant={gap.relevance > 0.7 ? "destructive" : "secondary"}>
              {gap.frequency} occurrences
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Relevance</span>
              <span>{Math.round(gap.relevance * 100)}%</span>
            </div>
            <Progress value={gap.relevance * 100} />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {gap.suggestedContent}
            </p>
            <div className="flex flex-wrap gap-2">
              {gap.relatedQuestions.map((question, i) => (
                <Badge key={i} variant="outline">
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContentGapsDisplay({ analysis }: ContentGapsDisplayProps) {
  const coveragePercentage = Math.round(analysis.coverage * 100);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {coveragePercentage >= 80 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : coveragePercentage >= 50 ? (
              <Info className="h-5 w-5 text-yellow-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            Content Coverage: {coveragePercentage}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={coveragePercentage} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {analysis.gaps.map((gap, index) => (
          <GapCard key={index} gap={gap} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}