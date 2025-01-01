"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: any[];
  xField: string;
  yField: string;
  tooltipTitle?: string;
  tooltipUnit?: string;
}

export function LineChart({
  data,
  xField,
  yField,
  tooltipTitle = "Value",
  tooltipUnit = "",
}: LineChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey={xField}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [
              `${value.toLocaleString()}${tooltipUnit}`,
              tooltipTitle,
            ]}
          />
          <Line
            type="monotone"
            dataKey={yField}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name={tooltipTitle}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
} 