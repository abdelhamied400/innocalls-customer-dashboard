import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const ErgWaitingCallsCount = () => {
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgWaitingCallsCount"],
    queryFn: statsService.getErgWaitingCallsCount,
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
        <img src="/assets/icons/stats/phone.svg" alt="Waiting Calls Icon" />
      }
      title="Waiting Calls Count"
      value={ergStats.calls.length}
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgWaitingCallsCount;
