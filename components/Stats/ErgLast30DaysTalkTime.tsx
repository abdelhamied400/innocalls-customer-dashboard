"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const ErgLast30DaysTalkTime = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgLast30DaysTalkTime"],
    queryFn: statsService.getErgLast30DaysTalkTime,
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
          alt="Last 30 Days Talk Time Icon"
        />
      }
      title="Last 30 Days Talk Time"
      value={ergStats.total}
      info={
        <div className="flex flex-wrap gap-1">
          <Badge variant="default" className="text-sm">
            Average: {ergStats.average}
          </Badge>
        </div>
      }
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgLast30DaysTalkTime;
