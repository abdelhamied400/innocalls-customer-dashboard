import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { UnAnsweredAnalyticsFilters } from "./page";
import { useQuery } from "@tanstack/react-query";
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";

// Import MUI icons
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import GroupIcon from "@mui/icons-material/Group";

type QuickStatsFilters = {
  filters: UnAnsweredAnalyticsFilters;
};
const QuickStats = ({ filters }: QuickStatsFilters) => {
  const { data, isLoading, isRefetching, error, isError } = useQuery({
    queryKey: ["unanswered-quick-stats", filters],
    queryFn: () => unansweredAnalyticsService.fetchQuickStats(filters),
  });

  if (isLoading) {
    return (
      <div className="quick-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="quick-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCardError error={error} />
      </div>
    );
  }

  return (
    <div className="quick-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatsCard
        title="Total Unanswered Calls"
        value={data?.totalExternalUnansweredIncomingCalls || 0}
        icon={<PhoneDisabledIcon fontSize="small" />}
        color="destructive"
        isRefetching={isRefetching}
      />
      <StatsCard
        title="External Unanswered Incoming"
        value={data?.totalExternalUnansweredIncomingCalls || 0}
        icon={<ArrowDownwardIcon fontSize="small" />}
        color="primary"
        isRefetching={isRefetching}
      />
      <StatsCard
        title="External Unanswered Outgoing"
        value={data?.totalExternalUnansweredOutgoingCalls || 0}
        icon={<ArrowUpwardIcon fontSize="small" />}
        color="warning"
        isRefetching={isRefetching}
      />
      <StatsCard
        title="Internal Unanswered Calls"
        value={data?.totalInternalUnansweredCalls || 0}
        icon={<GroupIcon fontSize="small" />}
        color="info"
        isRefetching={isRefetching}
      />
    </div>
  );
};

export default QuickStats;
