"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import MiniStatsCard from "../MiniStatsCard";

const ErgLast30DaysCallsSummary = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgLast30DaysCallsSummary"],
    queryFn: statsService.getErgLast30DaysCallsSummary,
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
          src="/assets/icons/stats/phone.svg"
          alt="Last 30 Days Calls Summary Icon"
        />
      }
      isRefetching={isRefetching}
      title="Last 30 Days Calls Summary"
      value={ergStats.total}
      info={
        <div className="flex flex-col gap-1">
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/ring_volume.png"
            label="Abandon"
            variant="warning"
            value={ergStats.abandon}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer_2.png"
            label="Completed"
            variant="default"
            value={ergStats.completed}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer_2.png"
            label="Timeout"
            variant="destructive"
            value={ergStats.timeout}
          />
        </div>
      }
    ></StatsCard>
  );
};

export default ErgLast30DaysCallsSummary;
