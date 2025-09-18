"use client";

import {
  Line,
  LineChart,
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
import { CallMerge, Insights } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import statsService from "@/services/stats.service";
import { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import { useTranslations } from "@/providers/TranslationProvider";

const CallsTrend = () => {
  const t = useTranslations("dashboard.stats.callTrend");

  const chartConfig: ChartConfig = {
    total: {
      label: t("chart.total.label"),
      color: "#3B82F6",
    },
    answered: {
      label: t("chart.answered.label"),
      color: "#10B981",
    },
    missed: {
      label: t("chart.missed.label"),
      color: "#EF4444",
    },
  };

  const {
    data: callsTrendData,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["calls-trend"],
    queryFn: statsService.getCallsTrend,
  });

  if (isLoading || isRefetching) {
    return <StatsCardSkeleton />;
  }

  if (isError || !callsTrendData) {
    return <StatsCardError error={error} />;
  }

  return (
    <ChartCard
      title={t("title")}
      icon={<Insights />}
      color="success"
      className="h-full"
      legends={Object.values(chartConfig).map((config) => ({
        label: config.label,
        color: config.color,
      }))}
    >
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer
          style={{ direction: "ltr" }}
          width="100%"
          height="100%"
        >
          <LineChart data={callsTrendData.calls}>
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
              dataKey="total"
              stroke="var(--color-total)"
              strokeWidth={3}
              dot={{ fill: "var(--color-total)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "var(--color-total)", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="answered"
              stroke="var(--color-answered)"
              strokeWidth={3}
              dot={{ fill: "var(--color-answered)", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "var(--color-answered)",
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="missed"
              stroke="var(--color-missed)"
              strokeWidth={3}
              dot={{ fill: "var(--color-missed)", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "var(--color-missed)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  );
};

export default CallsTrend;
