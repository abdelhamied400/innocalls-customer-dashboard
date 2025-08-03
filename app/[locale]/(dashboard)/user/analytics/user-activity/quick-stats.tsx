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
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { UserActivityFilters } from "./page";
import { useTranslations } from "next-intl";

type QuickStatsProps = {
  filters: UserActivityFilters;
};

const QuickStats = ({ filters }: QuickStatsProps) => {
  const t = useTranslations("analytics.userActivity");

  const {
    data: quickStatsData,
    isLoading,
    isRefetching,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["quickStats", filters],
    queryFn: () => analyticsService.fetchQuickStats(filters),
  });

  return (
    <div className="quick-stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatsCard
        icon={<StackedLineChart className="w-6 h-6" />}
        title={t("quickStats.topAnsweredIncoming")}
        value={
          quickStatsData?.topAnsweredIncomingAgent
            ? `${quickStatsData.topAnsweredIncomingAgent.name} (${quickStatsData.topAnsweredIncomingAgent.answeredIncomingCount})`
            : t("quickStats.noDataAvailable")
        }
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<MilitaryTech className="w-6 h-6" />}
        title={t("quickStats.topConnectedOutbound")}
        value={
          quickStatsData?.topConnectedOutboundAgent
            ? `${quickStatsData.topConnectedOutboundAgent.name} (${quickStatsData.topConnectedOutboundAgent.connectedOutboundCount})`
            : t("quickStats.noDataAvailable")
        }
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<EmojiEvents className="w-6 h-6" />}
        title={t("quickStats.bestSlaAgent")}
        value={
          quickStatsData?.topSlaComplianceAgent
            ? `${quickStatsData.topSlaComplianceAgent.name} (${quickStatsData.topSlaComplianceAgent.slaPercentage}%)`
            : t("quickStats.noDataAvailable")
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
