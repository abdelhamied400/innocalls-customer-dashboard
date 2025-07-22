"use client";

import React from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import PhoneIcon from "@mui/icons-material/Phone";
import PercentIcon from "@mui/icons-material/Percent";
import PublicIcon from "@mui/icons-material/Public";
import TimerIcon from "@mui/icons-material/Timer";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import outboundAnalyticsService from "@/services/outbound-analytics.service";
import { useQuery } from "@tanstack/react-query";
import { OutboundAnalyticsFilters } from "./page";

type QuickStatsProps = {
  filters: OutboundAnalyticsFilters;
};

const QuickStats = ({ filters }: QuickStatsProps) => {
  const {
    data: quickStatsData,
    isLoading,
    isRefetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["outboundQuickStats", filters],
    queryFn: () => outboundAnalyticsService.fetchQuickStats(filters),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
      <StatsCard
        key="Total Calls"
        icon={<BarChartIcon fontSize="medium" />}
        title="Total Calls"
        value={quickStatsData?.totalCalls || 0}
        color="default"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        key="Unanswered Calls"
        icon={<PhoneDisabledIcon fontSize="medium" />}
        title="Unanswered Calls"
        value={quickStatsData?.unansweredCalls || 0}
        color="destructive"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        key="Answered Calls"
        icon={<PhoneIcon fontSize="medium" />}
        title="Answered Calls"
        value={quickStatsData?.answeredCalls || 0}
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        key="Answer Rate"
        icon={<PercentIcon fontSize="medium" />}
        title="Answer Rate"
        value={`${quickStatsData?.answerRate || 0}%`}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        key="External Calls"
        icon={<PublicIcon fontSize="medium" />}
        title="External Calls"
        value={quickStatsData?.externalCalls || 0}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        key="Avg Duration"
        icon={<TimerIcon fontSize="medium" />}
        title="Avg Duration"
        value={quickStatsData?.avgDuration || "00:00:00"}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default QuickStats;
