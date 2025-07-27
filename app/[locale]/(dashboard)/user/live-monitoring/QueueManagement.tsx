import QueueCard from "@/components/LiveMonitoring/QueueCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import Timer from "@/components/ui/timer";
import liveMonitoringService from "@/services/live-monitoring.service";
import { People, Queue } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

const QueueManagement = () => {
  const { data: queueManagementData, isLoading } = useQuery({
    queryKey: ["queueManagementData"],
    queryFn: () => liveMonitoringService.fetchQueueData(),
  });

  console.log("QueueManagementData", queueManagementData);

  return (
    <div className="queue-management">
      <StatsDetailedCard
        title="Queue Management"
        subtitle="Real-time queue monitoring and management"
        value="5"
        valueSubtitle="Total Calls in Queue"
        icon={<Queue />}
        color="info"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {queueManagementData?.map((queue) => (
            <QueueCard
              key={queue.queue}
              title={queue.queue}
              subtitle={`Total Calls: ${queue.stats.totalCalls}`}
              color="primary"
              variant="default"
              activeCount={queue.activeCalls.length}
              waitingCount={queue.waitingCalls.length}
              activeCalls={queue.activeCalls.map((call) => ({
                phoneNumber: call.caller,
                agentName: call.name,
                callDuration: call.connectedAt
                  ? Math.floor(
                      (Date.now() -
                        new Date(call.connectedAt * 1000).getTime()) /
                        1000
                    )
                  : 0,
              }))}
              waitingCalls={queue.waitingCalls.map((call) => ({
                phoneNumber: call.caller,
                agentName: "Waiting",
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
