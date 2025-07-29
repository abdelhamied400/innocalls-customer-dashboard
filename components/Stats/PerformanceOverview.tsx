"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "../ChartCard";
import { RocketLaunch } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import statsService from "@/services/stats.service";
import { StatsCardError, StatsCardSkeleton } from "../StatsCard";

const PerformanceOverview = () => {
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

  const {
    data: performanceData,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["performance-overview"],
    queryFn: statsService.getPerformanceOverview,
  });

  if (isLoading || isRefetching) {
    return <StatsCardSkeleton />;
  }

  if (isError || !performanceData) {
    return <StatsCardError error={error} />;
  }

  return (
    <ChartCard
      title={"Performance Overview"}
      icon={<RocketLaunch />}
      color="info"
      className="h-full"
      legends={Object.values(chartConfig).map((config) => ({
        label: config.label,
        color: config.color,
      }))}
    >
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData.dailyMetrics}>
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
                if (name === "talkTime") {
                  return [
                    `${Math.round(value / 60)}m ${value % 60}s`,
                    "Talk Time",
                  ];
                }
                return [`${value}s`, "Wait Time"];
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
    </ChartCard>
  );
};

export default PerformanceOverview;
