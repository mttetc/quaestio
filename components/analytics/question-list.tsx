"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuestionList } from "@/services/analytics/hooks/use-questions";

export function QuestionList() {
  const { data: questions, isLoading } = useQuestionList();

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (!questions?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.question} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{question.question}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(question.lastAsked).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {question.frequency}× asked
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}