"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for 30 days
const generatePerformanceData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      talkTime: Math.floor(Math.random() * 120) + 180, // 180-300 seconds (3-5 minutes)
      waitTime: Math.floor(Math.random() * 30) + 10, // 10-40 seconds
    });
  }
  
  return data;
};

const PerformanceOverviewChart = () => {
  const sampleData = generatePerformanceData();

  const chartConfig: ChartConfig = {
    talkTime: {
      label: "Talk Time (min)",
      color: "#10B981",
    },
    waitTime: {
      label: "Wait Time (sec)",
      color: "#F59E0B",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData}>
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
              if (value >= 60) {
                return `${Math.round(value / 60)}m`;
              }
              return `${value}s`;
            }}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: number, name: string) => {
              if (name === 'talkTime') {
                return [`${Math.round(value / 60)}m ${value % 60}s`, 'Talk Time'];
              }
              return [`${value}s`, 'Wait Time'];
            }}
          />
          
          <Area
            type="monotone"
            dataKey="talkTime"
            stackId="1"
            stroke="var(--color-talkTime)"
            fill="var(--color-talkTime)"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="waitTime"
            stackId="2"
            stroke="var(--color-waitTime)"
            fill="var(--color-waitTime)"
            fillOpacity={0.6}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PerformanceOverviewChart; 