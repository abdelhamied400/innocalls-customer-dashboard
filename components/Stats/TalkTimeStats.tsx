import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { AvTimer } from "@mui/icons-material";
import StatsSubCard from "@/components/StatsSubCard";
import StatsMetricCard from "@/components/StatsMetricCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useQuery } from "@tanstack/react-query";
import statsService from "@/services/stats.service";
import { formatDurationShort } from "@/lib/date";

const TalkTimeStats = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "talk_time_stats_refetch_interval"
  );

  const {
    data: talkTimeStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["talk-time-stats"],
    queryFn: statsService.getTalkTimeStats,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError || !talkTimeStats) {
    return <StatsDetailedCardError error={error} />;
  }

  return (
    <StatsDetailedCard
      title="Talk Time"
      value={`${talkTimeStats.totalTalkTimeHours}h`}
      subtitle="Last 30 Days"
      valueSubtitle={`${talkTimeStats.totalTalkTimeChangePercentage}% vs last month`}
      icon={<AvTimer />}
      color="success"
      isRefetching={isRefetching}
    >
      {/* Talk Time Metrics */}
      <div className="space-y-4">
        <StatsMetricCard
          label="Average per Call"
          value={formatDurationShort(talkTimeStats.averageTalkTime)}
          color="success"
          performanceChange={`${talkTimeStats.averageTalkTimeChangePercentage}% vs last month`}
        />

        <div className="grid grid-cols-2 gap-3">
          <StatsSubCard
            color="success"
            value={`${talkTimeStats.dailyAverageHours}h`}
            label="Daily Average"
          />
          <StatsSubCard
            color="success"
            value={`${talkTimeStats.peakHourTalkTimeHours}h`}
            label="Peak Hour"
          />
        </div>
      </div>
    </StatsDetailedCard>
  );
};

export default TalkTimeStats;
