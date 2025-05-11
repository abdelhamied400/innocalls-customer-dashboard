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
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { StatsCardError, StatsCardSkeleton } from "../StatsCard";

const chartConfig: ChartConfig = {
  totalCalls: {
    label: "Total Calls",
    color: "#5BC9F7",
  },
};
const TotalAnsweredCalls = () => {
  const {
    data: totalAnsweredCalls,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["total-answered-calls"],
    queryFn: statsService.getTotalAnsweredCalls,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading || isRefetching) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <div className="page h-full" id="callDistribution">
      <div className="bg-white p-4 rounded-lg h-full flex flex-col gap-2">
        <div className="mb-4">
          <h3>Total Answered Calls/Day</h3>
        </div>
        <ChartContainer
          config={chartConfig}
          className="w-full min-h-[200px] h-full"
        >
          <BarChart accessibilityLayer data={totalAnsweredCalls}>
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

export default TotalAnsweredCalls;
