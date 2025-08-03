import NoData from "@/components/Analytics/NoData";
import QueueCard from "@/components/LiveMonitoring/QueueCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import liveMonitoringService from "@/services/live-monitoring.service";
import { Queue } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";

const QueueManagement = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_monitoring_queue_management_interval"
  );
  const {
    data: queueManagementData,
    isLoading,
    isRefetching,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["queueManagementData"],
    queryFn: () => liveMonitoringService.fetchQueueData(),
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <div className="queue-management">
      <StatsDetailedCard
        title="Queue Management"
        subtitle="Real-time queue monitoring and management"
        value={queueManagementData?.length || 0}
        valueSubtitle="Total Calls in Queue"
        icon={<Queue />}
        color="info"
        refetch={refetch}
        canRefetch
        isRefetching={isRefetching}
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
      >
        {!isLoading && !queueManagementData?.length && <NoData />}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {queueManagementData?.map((queue) => (
            <QueueCard
              key={queue.queue}
              title={queue.queue}
              subtitle={`Total Calls: ${queue.stats.totalCalls}`}
              stats={queue.stats}
              activeCalls={queue.activeCalls.map((call) => ({
                ...call,
                phoneNumber: call.caller,
                callDuration: call.connectedAt
                  ? Math.floor(
                      (Date.now() -
                        new Date(call.connectedAt * 1000).getTime()) /
                        1000
                    )
                  : 0,
              }))}
              waitingCalls={queue.waitingCalls.map((call) => ({
                ...call,
                phoneNumber: call.caller,
                callDuration: call.enteredAt
                  ? Math.floor(
                      (Date.now() - new Date(call.enteredAt * 1000).getTime()) /
                        1000
                    )
                  : 0,
              }))}
              sla={`${queue.stats.slaCompliance}%`}
            />
          ))}
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default QueueManagement;
