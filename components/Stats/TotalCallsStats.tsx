import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import PercentBarStat from "@/components/PercentBarStat";
import { Call } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";

const TotalCallsStats = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "total_calls_stats_refetch_interval"
  );

  const {
    data: totalCallsStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["total-calls-stats"],
    queryFn: statsService.getTotalCallsStats,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError || !totalCallsStats) {
    return <StatsDetailedCardError error={error} />;
  }

  return (
    <StatsDetailedCard
      title="Total Calls"
      value={totalCallsStats.totalCalls}
      subtitle="Last 30 Days"
      valueSubtitle={`${totalCallsStats.previousTotalCalls}% vs last month`}
      icon={<Call />}
      color="primary"
      isRefetching={isRefetching}
    >
      <PercentBarStat
        label="Completed Calls"
        value={totalCallsStats.completed.count}
        percentage={totalCallsStats.completed.percentage}
        color="green"
        showPercentage
      />
      <PercentBarStat
        label="Abandoned Calls"
        value={totalCallsStats.abandoned.count}
        percentage={totalCallsStats.abandoned.percentage}
        color="orange"
        showPercentage
      />
      <PercentBarStat
        label="Timeout Calls"
        value={totalCallsStats.timeout.count}
        percentage={totalCallsStats.timeout.percentage}
        color="red"
        showPercentage
      />
    </StatsDetailedCard>
  );
};

export default TotalCallsStats;
