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
    <div className="page h-full" id="callDistribution">
      <div className="bg-white p-4 ps-0 pe-8 pt-2 rounded-lg h-full flex flex-col gap-4">
        <div className="head flex justify-between items-center ps-4 py-2">
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <div className="flex items-center gap-2">
            {Object.entries(chartConfig).map(([key, value]) => (
              <div className="legend flex items-center gap-2" key={key}>
                <div
                  className="color w-3 h-3 rounded-full"
                  style={{ backgroundColor: value.color }}
                />
                <span className="label text-sm font-medium text-gray-600">
                  {value.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ChartContainer config={chartConfig} className="w-full min-h-[120px]">
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
      </div>
    </div>
  );
};

export default CallDistribution;
