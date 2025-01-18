"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SentimentHeatmapData } from "../../schemas/sentiment"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SentimentChartProps {
  data?: SentimentHeatmapData
}

export function SentimentChart({ data }: SentimentChartProps) {
  if (!data?.sentiment.length) return null

  // Transform data for the chart
  const chartData = data.sentiment.map(item => ({
    date: item.date,
    positive: item.sentiment === "positive" ? item.count / item.volume : 0,
    negative: item.sentiment === "negative" ? item.count / item.volume : 0,
    neutral: item.sentiment === "neutral" ? item.count / item.volume : 0,
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
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [(value * 100).toFixed(0) + '%']}
              />
              <Line 
                type="monotone" 
                dataKey="positive" 
                name="Positive"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                name="Negative"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                name="Neutral"
                stroke="#6b7280"
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
