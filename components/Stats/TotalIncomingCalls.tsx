import { CallReceived } from "@mui/icons-material";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useQuery } from "@tanstack/react-query";
import statsService from "@/services/stats.service";

const TotalIncomingCalls = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "total_incoming_calls_refetch_interval"
  );

  const {
    data: totalIncomingCalls,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["total-incoming-calls"],
    queryFn: statsService.getTotalIncomingCalls,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading) {
    return <StatsCardSkeleton />;
  }

  if (isError || !totalIncomingCalls) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      title="Total Incoming"
      value={totalIncomingCalls.totalCalls}
      info={`${totalIncomingCalls.totalCallsChangePercentage}% vs last month`}
      icon={<CallReceived />}
      color="primary"
      isRefetching={isRefetching}
    />
  );
};

export default TotalIncomingCalls;
