import StatsCard from "@/components/StatsCard";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";

// Import MUI icons
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import GroupIcon from "@mui/icons-material/Group";
import { UnansweredAnalyticsFilters } from "./page";
import { useTranslations } from "next-intl";

type QuickStatsFilters = {
  filters: UnansweredAnalyticsFilters;
};
const QuickStats = ({ filters }: QuickStatsFilters) => {
  const t = useTranslations("analytics.unanswered.quickStats");

  const { data, isLoading, isRefetching, error, isError } = useLocalizedQuery({
    queryKey: ["unanswered-quick-stats", filters],
    queryFn: () => unansweredAnalyticsService.fetchQuickStats(filters),
  });

  return (
    <div className="quick-stats grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatsCard
        title={t("totalUnansweredCalls")}
        value={data?.totalUnansweredCalls || 0}
        icon={<PhoneDisabledIcon fontSize="small" />}
        color="destructive"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("externalUnansweredIncoming")}
        value={data?.totalExternalUnansweredIncomingCalls || 0}
        icon={<ArrowDownwardIcon fontSize="small" />}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("externalUnansweredOutgoing")}
        value={data?.totalExternalUnansweredOutgoingCalls || 0}
        icon={<ArrowUpwardIcon fontSize="small" />}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("internalUnansweredCalls")}
        value={data?.totalInternalUnansweredCalls || 0}
        icon={<GroupIcon fontSize="small" />}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default QuickStats;
