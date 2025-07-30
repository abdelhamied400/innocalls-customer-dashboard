import StatsCard from "@/components/StatsCard";
import {
  AddIcCall,
  AssignmentTurnedIn,
  AvTimer,
  HourglassBottom,
  RingVolume,
} from "@mui/icons-material";
import { Clock } from "lucide-react";
import { InboundAnalyticsFilters } from "./page";
import { useQuery } from "@tanstack/react-query";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import { useTranslations } from "next-intl";

type QuickStatsProps = {
  filters: InboundAnalyticsFilters;
};
const QuickStats = ({ filters }: QuickStatsProps) => {
  const t = useTranslations("analytics.inbound.quickStats");

  const { data, isRefetching, isLoading, isError, error } = useQuery({
    queryKey: ["inbound-analytics-quick-stats", filters],
    queryFn: () => inboundAnalyticsService.fetchQuickStats(filters),
  });

  if (filters.filterBy === "team") {
    return (
      <div className="stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard
          icon={<AddIcCall className="w-6 h-6" />}
          title={t("totalCalls")}
          value={data?.totalCalls || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
        <StatsCard
          icon={<Clock className="w-6 h-6" />}
          title={t("avgWaitTime")}
          value={data?.averageWaitTime || "00:00:00"}
          color="info"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
        <StatsCard
          icon={<AvTimer className="w-6 h-6" />}
          title={t("avgTalkTime")}
          value={data?.averageTalkTime || "00:00:00"}
          color="primary"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
        <StatsCard
          icon={<AssignmentTurnedIn className="w-6 h-6" />}
          title={t("completedCalls")}
          value={data?.answeredCalls || "0"}
          color="success"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
        <StatsCard
          icon={<HourglassBottom className="w-6 h-6" />}
          title={t("timeoutCalls")}
          value={data?.timeoutCalls || "0"}
          color="warning"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />

        <StatsCard
          icon={<RingVolume className="w-6 h-6" />}
          title={t("abandonedCalls")}
          value={data?.abandonedCalls || "0"}
          color="destructive"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalCalls")}
        value={data?.totalCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<Clock className="w-6 h-6" />}
        title={t("answerRate")}
        value={data?.answerRate || "0%"}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<AvTimer className="w-6 h-6" />}
        title={t("avgTalkTime")}
        value={data?.avgDuration || "00:00:00"}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<AssignmentTurnedIn className="w-6 h-6" />}
        title={t("completedCalls")}
        value={data?.answeredCalls || "0"}
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<HourglassBottom className="w-6 h-6" />}
        title={t("externalCalls")}
        value={data?.externalCalls || "0"}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />

      <StatsCard
        icon={<RingVolume className="w-6 h-6" />}
        title={t("unansweredCalls")}
        value={data?.unansweredCalls || "0"}
        color="destructive"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default QuickStats;
