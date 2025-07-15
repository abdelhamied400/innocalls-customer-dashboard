import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { HourglassEmpty } from "@mui/icons-material";
import StatsMetricCard from "@/components/StatsMetricCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useQuery } from "@tanstack/react-query";
import statsService from "@/services/stats.service";
import { formatDurationShort } from "@/lib/date";

const WaitTimeStats = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "wait_time_stats_refetch_interval"
  );

  const {
    data: waitTimeStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["wait-time-stats"],
    queryFn: statsService.getWaitingTimeStats,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError || !waitTimeStats) {
    return <StatsDetailedCardError error={error} />;
  }

  return (
    <StatsDetailedCard
      title="Wait Time"
      value={`${waitTimeStats.totalWaitTime}`}
      subtitle="Last 30 Days"
      valueSubtitle={`${Math.round(
        waitTimeStats.totalWaitTimeChangePercentage
      )}% vs last month`}
      icon={<HourglassEmpty />}
      color="info"
    >
      {/* Wait Time Metrics */}
      <div className="space-y-4">
        <StatsMetricCard
          label="Average Wait"
          value={formatDurationShort(waitTimeStats.averageWaitTime)}
          color="info"
          performanceChange={`${Math.round(
            waitTimeStats.averageWaitTimeChange
          )}% vs last month`}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Completed Calls</span>
            <span className="font-medium text-gray-800">
              {formatDurationShort(
                waitTimeStats.completedCalls.averageWaitTime
              )}{" "}
              avg
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Abandoned Calls</span>
            <span className="font-medium text-gray-800">
              {formatDurationShort(
                waitTimeStats.abandonedCalls.averageWaitTime
              )}{" "}
              avg
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Timeout Calls</span>
            <span className="font-medium text-gray-800">
              {formatDurationShort(waitTimeStats.timeoutCalls.averageWaitTime)}{" "}
              avg
            </span>
          </div>
        </div>
      </div>
    </StatsDetailedCard>
  );
};

export default WaitTimeStats;
