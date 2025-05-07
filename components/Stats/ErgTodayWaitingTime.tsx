"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const ErgTodayWaitingTime = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgTodayWaitingTime"],
    queryFn: statsService.getErgTodayWaitingTime,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/phone.svg"
          alt="Today Waiting Time Icon"
        />
      }
      title="Today's Waiting Time"
      value={ergStats.totalWaitTimeCompletedCalls}
      info={
        <div className="flex flex-wrap gap-1">
          <Badge variant="warning" className="text-sm">
            Abandon: {ergStats.totalWaitTimeAbandonCalls}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Completed: {ergStats.totalWaitTimeCompletedCalls}
          </Badge>
          <Badge variant="default" className="text-sm">
            Avg Abandon: {ergStats.avgWaitTimeAbandonCalls}
          </Badge>
          <Badge variant="default" className="text-sm">
            Avg Completed: {ergStats.avgWaitTimeCompletedCalls}
          </Badge>
        </div>
      }
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgTodayWaitingTime;
