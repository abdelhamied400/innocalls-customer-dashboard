"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

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
          alt="Last 30 Days Calls Summary Icon"
        />
      }
      isRefetching={isRefetching}
      title="Last 30 Days Calls Summary"
      value={ergStats.total}
      info={
        <div className="flex flex-wrap gap-1">
          <Badge variant="warning" className="text-sm">
            Abandon: {ergStats.abandon}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Completed: {ergStats.completed}
          </Badge>
        </div>
      }
    ></StatsCard>
  );
};

export default ErgLast30DaysCallsSummary;
