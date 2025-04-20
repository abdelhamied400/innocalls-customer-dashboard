"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  totalCalls: {
    label: "Total Calls",
    color: "#5BC9F7",
  },
};

const CallDistribution = () => {
  const chartData = [
    { day: "13 OCT", totalCalls: 186 },
    { day: "14 OCT", totalCalls: 305 },
    { day: "15 OCT", totalCalls: 237 },
    { day: "16 OCT", totalCalls: 73 },
    { day: "17 OCT", totalCalls: 209 },
    { day: "18 OCT", totalCalls: 214 },
    { day: "19 OCT", totalCalls: 186 },
    { day: "20 OCT", totalCalls: 305 },
    { day: "21 OCT", totalCalls: 237 },
    { day: "22 OCT", totalCalls: 73 },
    { day: "23 OCT", totalCalls: 209 },
    { day: "24 OCT", totalCalls: 214 },
    { day: "25 OCT", totalCalls: 186 },
    { day: "26 OCT", totalCalls: 305 },
    { day: "27 OCT", totalCalls: 237 },
    { day: "28 OCT", totalCalls: 73 },
    { day: "29 OCT", totalCalls: 209 },
    { day: "30 OCT", totalCalls: 214 },
    { day: "31 OCT", totalCalls: 186 },
  ];

  return (
    <div className="page h-full" id="callDistribution">
      <div className="bg-white p-4 ps-0 pe-8 pt-8 rounded-lg h-full">
        <ChartContainer
          config={chartConfig}
          className="w-full min-h-[200px] h-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="totalCalls"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}k`;
                }
                return value;
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="totalCalls"
              fill="var(--color-totalCalls)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default CallDistribution;
