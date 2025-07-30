import NoData from "@/components/Analytics/NoData";
import LiveCall from "@/components/LiveMonitoring/LiveCall";
import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import liveMonitoringService from "@/services/live-monitoring.service";
import { Call } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

const LiveCalls = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_monitoring_live_calls_interval"
  );
  const {
    data: liveCallsData,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["liveCalls"],
    queryFn: () => liveMonitoringService.fetchLiveCalls(),
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError) {
    return <StatsDetailedCardError error={error} />;
  }

  if (!liveCallsData || liveCallsData.length === 0) {
    return (
      <StatsDetailedCard
        value=""
        title="Live Calls"
        subtitle="Real-time call monitoring and management"
        icon={<Call />}
        color="primary"
        refetch={refetch}
        canRefetch
        isRefetching={isRefetching}
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
      >
        <NoData />
      </StatsDetailedCard>
    );
  }

  return (
    <div className="live-calls">
      <StatsDetailedCard
        title="Live Calls"
        subtitle="Real-time call monitoring and management"
        value={liveCallsData.length.toString()}
        renderValue={
          <div className="value flex items-center gap-2">
            <div className="flex flex-col items-center text-center">
              <p className="font-bold text-2xl text-primary-500 transition-colors">
                {liveCallsData.length}
              </p>
              <p className="text-sm">Active Calls</p>
            </div>
            <div className="live flex items-center gap-1">
              <span className="block w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-green-500">Live</p>
            </div>
          </div>
        }
        icon={<Call />}
        color="primary"
        refetch={refetch}
        canRefetch
        isRefetching={isRefetching}
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveCallsData.map((call, index) => (
            <LiveCall
              key={index}
              from={call.from}
              to={call.to}
              timestamp={call.timestamp}
            />
          ))}
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default LiveCalls;
