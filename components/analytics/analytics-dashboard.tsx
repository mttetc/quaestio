"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "../ui/date-picker";
import { QuestionChart } from "./question-chart";
import { QuestionList } from "./question-list";
import { ResponseTimeCard } from "./response-time-card";
import { VolumeByTagCard } from "./volume-by-tag-card";

const DEFAULT_DATE_RANGE: DateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
  to: new Date(),
};

interface DashboardTab {
  value: string;
  label: string;
  content: React.ReactNode;
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);

  const handleDateChange = (date: DateRange | undefined) => {
    if (date) {
      setDateRange(date);
    }
  };

  const tabs: DashboardTab[] = [
    {
      value: "trends",
      label: "Trends",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Question Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionChart dateRange={dateRange} />
          </CardContent>
        </Card>
      ),
    },
    {
      value: "questions",
      label: "Top Questions",
      content: <QuestionList dateRange={dateRange} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DatePickerWithRange
          date={dateRange}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResponseTimeCard dateRange={dateRange} />
        <VolumeByTagCard dateRange={dateRange} />
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}