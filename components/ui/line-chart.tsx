"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: any[];
  xField: string;
  yField: string;
  tooltipTitle?: string;
  tooltipUnit?: string;
}

export function LineChart({ data, xField, yField, tooltipTitle, tooltipUnit }: LineChartProps) {
  const chartData = {
    labels: data.map(item => item[xField]),
    datasets: [
      {
        label: tooltipTitle || yField,
        data: data.map(item => item[yField]),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const value = context.parsed.y;
            return `${value}${tooltipUnit ? ` ${tooltipUnit}` : ""}`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
} 