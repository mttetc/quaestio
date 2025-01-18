"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useReadSentiment } from "../../hooks/use-sentiment"
import type { DateRange } from "react-day-picker"

interface SentimentChartProps {
  dateRange: DateRange | undefined
}

export function SentimentChart({ dateRange }: SentimentChartProps) {
  const { data } = useReadSentiment(dateRange);
  
  if (!data?.length) return null

  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    index,
    value: item.percentage,
    type: item.type
  }))

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="index" 
              />
              <YAxis 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                formatter={(value: number) => [(value * 100).toFixed(0) + '%']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Sentiment"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
