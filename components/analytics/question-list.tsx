"use client";

import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendBadge } from "./trend-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionListProps {
  dateRange: DateRange;
}

export function QuestionList({ dateRange }: QuestionListProps) {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["topQuestions", dateRange],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: dateRange.from?.toISOString() || "",
        endDate: dateRange.to?.toISOString() || "",
        limit: "10",
      });
      const response = await fetch(`/api/analytics/questions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      return response.json();
    },
    enabled: !!(dateRange.from && dateRange.to),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Occurrences</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions?.results.map((question: any) => (
              <TableRow key={question.questionHash}>
                <TableCell className="font-medium">
                  {question.question}
                </TableCell>
                <TableCell>{question.category || "Uncategorized"}</TableCell>
                <TableCell className="text-right">
                  {question.occurrences}
                </TableCell>
                <TableCell className="text-right">
                  <TrendBadge trend={question.trend} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}