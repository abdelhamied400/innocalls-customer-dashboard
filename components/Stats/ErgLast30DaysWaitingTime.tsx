"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import MiniStatsCard from "../MiniStatsCard";

const ErgLast30DaysWaitingTime = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgLast30DaysWaitingTime"],
    queryFn: statsService.getErgLast30DaysWaitingTime,
    refetchOnWindowFocus: false,
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
          src="/assets/icons/stats/erg/date_range.png"
          alt="Last 30 Days Waiting Time Icon"
        />
      }
      title="Last 30 Days Waiting Time"
      value={ergStats.totalWaitTime}
      info={
        <div className="flex flex-col gap-1">
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/alarm_on.png"
            label="Completed"
            variant="success"
            value={ergStats.totalWaitTimeCompletedCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer_2.png"
            label="Avg-Completed"
            variant="default"
            value={ergStats.avgWaitTimeCompletedCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/ring_volume.png"
            label="Abandoned"
            variant="warning"
            value={ergStats.totalWaitTimeAbandonCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer.png"
            label="Avg-Abandoned"
            variant="info"
            value={ergStats.avgWaitTimeAbandonCalls}
          />
        </div>
      }
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgLast30DaysWaitingTime;
