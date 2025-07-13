"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for 30 days
const generateSampleData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls: Math.floor(Math.random() * 200) + 800, // 800-1000 calls per day
      answered: Math.floor(Math.random() * 150) + 700, // 700-850 answered per day
      missed: Math.floor(Math.random() * 50) + 50, // 50-100 missed per day
    });
  }
  
  return data;
};

const CallsTrendChart = () => {
  const sampleData = generateSampleData();

  const chartConfig: ChartConfig = {
    calls: {
      label: "Total Calls",
      color: "#3B82F6",
    },
    answered: {
      label: "Answered",
      color: "#10B981",
    },
    missed: {
      label: "Missed",
      color: "#EF4444",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}k`;
              }
              return value;
            }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          
          <Line
            type="monotone"
            dataKey="calls"
            stroke="var(--color-calls)"
            strokeWidth={3}
            dot={{ fill: "var(--color-calls)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "var(--color-calls)", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="answered"
            stroke="var(--color-answered)"
            strokeWidth={3}
            dot={{ fill: "var(--color-answered)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "var(--color-answered)", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="missed"
            stroke="var(--color-missed)"
            strokeWidth={3}
            dot={{ fill: "var(--color-missed)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "var(--color-missed)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CallsTrendChart; 