"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const ErgInProgressCallsCount = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgInProgressCallsCount"],
    queryFn: statsService.getErgInProgressCallsCount,
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
      icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
      title="In Progress Calls Count"
      value={ergStats.inProgressCallsCount}
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgInProgressCallsCount;
