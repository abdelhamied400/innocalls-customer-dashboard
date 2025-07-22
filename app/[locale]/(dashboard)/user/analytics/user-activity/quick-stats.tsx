"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import analyticsService from "@/services/analytics.service";
import {
  EmojiEvents,
  MilitaryTech,
  StackedLineChart,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { UserActivityAnalyticsFilters } from "./page";

type QuickStatsProps = {
  filters: UserActivityAnalyticsFilters;
};

const QuickStats = ({ filters }: QuickStatsProps) => {
  const {
    data: quickStatsData,
    isLoading,
    isRefetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["quickStats", filters],
    queryFn: () => analyticsService.fetchQuickStats(filters),
  });

  return (
    <div className="quick-stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatsCard
        icon={<StackedLineChart className="w-6 h-6" />}
        title="Top Answered Incoming"
        value={
          quickStatsData?.topAnsweredIncomingAgent
            ? `${quickStatsData.topAnsweredIncomingAgent.name} (${quickStatsData.topAnsweredIncomingAgent.answeredIncomingCount})`
            : "No data available"
        }
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<MilitaryTech className="w-6 h-6" />}
        title="Top Connected Outbound"
        value={
          quickStatsData?.topConnectedOutboundAgent
            ? `${quickStatsData.topConnectedOutboundAgent.name} (${quickStatsData.topConnectedOutboundAgent.connectedOutboundCount})`
            : "No data available"
        }
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<EmojiEvents className="w-6 h-6" />}
        title="Best SLA Agent"
        value={
          quickStatsData?.topSlaComplianceAgent
            ? `${quickStatsData.topSlaComplianceAgent.name} (${quickStatsData.topSlaComplianceAgent.slaPercentage}%)`
            : "No data available"
        }
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
