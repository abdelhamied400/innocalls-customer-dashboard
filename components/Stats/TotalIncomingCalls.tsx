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
  });

  return (
    <StatsCard
      title="Total Incoming"
      value={totalIncomingCalls?.totalCalls || "0"}
      info={`${Math.round(
        totalIncomingCalls?.totalCallsChangePercentage || 0
      )}% vs last month`}
      icon={<CallReceived />}
      color="primary"
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  );
};

export default TotalIncomingCalls;
