"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import ChartCard, { ChartCardSkeleton } from "@/components/ChartCard";
import { OutboundAnalyticsFilters } from "./page";
import NoData from "../../../../../components/Analytics/NoData";
import outboundAnalyticsService from "@/services/outbound-analytics.service";
import { Timer, TimeToLeave } from "@mui/icons-material";
import { useTranslations } from "next-intl";

type TalkTimeDistributionProps = {
  filters: OutboundAnalyticsFilters;
};

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E42",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

const TalkTimeDistribution = ({ filters }: TalkTimeDistributionProps) => {
  const t = useTranslations("analytics.outbound.talkTimeDistribution");

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["talkTimeDistribution", filters],
    queryFn: () =>
      outboundAnalyticsService.fetchTalkTimeDistributionAnalytics(filters),
  });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (!data || data.length === 0) {
    return <NoData />;
  }

  // chart.legends.timeBucket
  return (
    <div className="space-y-6">
      <ChartCard
        title={t("title")}
        icon={<Timer />}
        color="success"
        variant="compound"
      >  

      
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <Pie
              data={data}
              dataKey="totalCalls"
              nameKey="timeBucket"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <RechartsLegend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default TalkTimeDistribution;
