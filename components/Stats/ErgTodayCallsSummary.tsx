"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const ErgTodayCallsSummary = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgTodayCallsSummary"],
    queryFn: statsService.getErgTodayCallsSummary,
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
          alt="Today Calls Summary Icon"
        />
      }
      title="Today's Calls Summary"
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
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgTodayCallsSummary;
