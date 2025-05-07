"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const ErgTodayTalkTime = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgTodayTalkTime"],
    queryFn: statsService.getErgTodayTalkTime,
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
        <img src="/assets/icons/stats/phone.svg" alt="Today Talk Time Icon" />
      }
      title="Today's Talk Time"
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

export default ErgTodayTalkTime;
