import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
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

type QuickStatsProps = {
  filters: InboundAnalyticsFilters;
};
const QuickStats = ({ filters }: QuickStatsProps) => {
  const { data, isRefetching, isLoading, isError, error } = useQuery({
    queryKey: ["inbound-analytics-quick-stats", filters],
    queryFn: () => inboundAnalyticsService.fetchQuickStats(filters),
  });

  return (
    <div className="stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title="Total Calls"
        value={data?.totalCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<Clock className="w-6 h-6" />}
        title="Avg Wait Time"
        value={data?.avgDuration || "00:00:00"}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<AvTimer className="w-6 h-6" />}
        title="Avg Talk Time"
        value={data?.avgDuration || "00:00:00"}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<AssignmentTurnedIn className="w-6 h-6" />}
        title="Completed Calls"
        value={data?.answeredCalls || "0"}
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<HourglassBottom className="w-6 h-6" />}
        title="Timeout Calls"
        value={data?.unansweredCalls || "0"}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        icon={<RingVolume className="w-6 h-6" />}
        title="Abandoned Calls"
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
