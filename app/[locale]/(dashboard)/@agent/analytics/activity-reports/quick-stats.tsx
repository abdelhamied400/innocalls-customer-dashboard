import StatsCard from "@/components/StatsCard";
import { AddIcCall, HourglassBottom, RingVolume } from "@mui/icons-material";
import { Clock } from "lucide-react";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";
import { ActivityReportsFilters } from "./page";
import activityReportsService from "@/services/activity-reports.service";

type QuickStatsProps = {
  filters: ActivityReportsFilters;
};
const QuickStats = ({ filters }: QuickStatsProps) => {
  const t = useTranslations("analytics.activityAnalysis.quickStats");

  const { data, isRefetching, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["activity-reports-quick-stats", filters],
    queryFn: () => activityReportsService.fetchQuickStats(filters),
  });

  return (
    <div className="stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalAnsweredCalls")}
        value={data?.totalAnsweredCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="success"
      />
      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalCalls")}
        value={data?.totalCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="primary"
      />
      <StatsCard
        icon={<RingVolume className="w-6 h-6" />}
        title={t("totalIncomingCalls")}
        value={data?.totalIncomingCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="warning"
      />

      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalOutgoingCalls")}
        value={data?.totalOutgoingCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="info"
      />
      <StatsCard
        icon={<Clock className="w-6 h-6" />}
        title={t("totalTalkTime")}
        value={data?.totalTalkTime || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="success"
      />
      <StatsCard
        icon={<HourglassBottom className="w-6 h-6" />}
        title={t("totalWaitTime")}
        value={data?.totalWaitTime || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="warning"
      />
    </div>
  );
};

export default QuickStats;
