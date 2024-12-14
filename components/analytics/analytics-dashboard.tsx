"use client";

import { useState } from "react";
import { DateRangePicker } from "./date-range-picker";
import { QuestionChart } from "./question-chart";
import { QuestionList } from "./question-list";
import { ResponseTimeCard } from "./response-time-card";
import { VolumeByTagCard } from "./volume-by-tag-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResponseTimeCard dateRange={dateRange} />
        <VolumeByTagCard dateRange={dateRange} />
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="questions">Top Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="questions">
          <QuestionList dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}