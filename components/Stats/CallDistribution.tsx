"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import statsService from "@/services/stats.service";
import { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import { useTranslations } from "next-intl";
import ChartCard from "../ChartCard";
import { StackedBarChart } from "@mui/icons-material";

const CallDistribution = () => {
  const t = useTranslations("dashboard.stats.callDistribution");

  const chartConfig: ChartConfig = {
    incomingCalls: {
      label: t("incomingCalls"),
      color: "#23C998",
    },
    outgoingCalls: {
      label: t("outgoingCalls"),
      color: "#5BC9F7",
    },
  };

  const {
    data: callDistributionData,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["call-distribution"],
    queryFn: statsService.getCallDistribution,
    refetchOnWindowFocus: false,
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
    <ChartCard
      title={t("title")}
      icon={<StackedBarChart />}
      color="primary"
      className="h-full"
      legends={Object.values(chartConfig).map((config) => ({
        label: config.label,
        color: config.color,
      }))}
    >
      <ChartContainer
        config={chartConfig}
        className="w-full h-full min-h-[120px]"
      >
        <BarChart accessibilityLayer data={callDistributionData} barGap={0}>
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
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

          <Bar
            dataKey="incomingCalls"
            fill="var(--color-incomingCalls)"
            radius={4}
          />
          <Bar
            dataKey="outgoingCalls"
            fill="var(--color-outgoingCalls)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
};

export default CallDistribution;
