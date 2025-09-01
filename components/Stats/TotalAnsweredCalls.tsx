"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import { useTranslations } from "@/providers/TranslationProvider";
import ChartCard from "../ChartCard";
import { BarChart as BarChartIcon } from "@mui/icons-material";
import NoData from "../Analytics/NoData";

const TotalAnsweredCalls = () => {
  const t = useTranslations("dashboard.stats.totalAnsweredCalls");

  const chartConfig: ChartConfig = {
    totalCalls: {
      label: t("totalCalls"),
      color: "#5BC9F7",
    },
  };

  const {
    data: totalAnsweredCalls,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["total-answered-calls"],
    queryFn: statsService.getTotalAnsweredCalls,
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
      icon={<BarChartIcon />}
      color="primary"
      className="h-full"
      legends={Object.values(chartConfig).map((config) => ({
        label: config.label,
        color: config.color,
      }))}
    >
      {totalAnsweredCalls.length === 0 && <NoData />}
      {totalAnsweredCalls.length > 0 && (
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

            <Bar
              dataKey="totalCalls"
              fill="var(--color-totalCalls)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
};

export default TotalAnsweredCalls;
