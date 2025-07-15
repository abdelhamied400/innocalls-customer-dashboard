import QueueCard from "@/components/LiveMonitoring/QueueCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { People, Queue } from "@mui/icons-material";

const QueueManagement = () => {
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
          <QueueCard
            title={"Support Queue"}
            subtitle={"Total Calls: 10"}
            color="primary"
            variant="default"
            activeCount={3}
            waitingCount={2}
            activeCalls={[
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "John Doe",
                status: "active",
                callDuration: "8:45",
              },
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Jane Smith",
                status: "waiting",
                callDuration: "5:30",
              },
            ]}
            waitingCalls={[
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Alice Johnson",
                status: "waiting",
                callDuration: "3:15",
              },
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Bob Brown",
                status: "waiting",
                callDuration: "2:45",
              },
            ]}
            sla="2:00"
          />
          <QueueCard
            title={"Support Queue"}
            subtitle={"Total Calls: 10"}
            color="primary"
            variant="default"
            activeCount={3}
            waitingCount={2}
            activeCalls={[
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "John Doe",
                status: "active",
                callDuration: "8:45",
              },
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Jane Smith",
                status: "waiting",
                callDuration: "5:30",
              },
            ]}
            waitingCalls={[
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Alice Johnson",
                status: "waiting",
                callDuration: "3:15",
              },
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Bob Brown",
                status: "waiting",
                callDuration: "2:45",
              },
            ]}
            sla="2:00"
          />
          <QueueCard
            title={"Support Queue"}
            subtitle={"Total Calls: 10"}
            color="primary"
            variant="default"
            activeCount={3}
            waitingCount={2}
            activeCalls={[
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "John Doe",
                status: "active",
                callDuration: "8:45",
              },
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Jane Smith",
                status: "waiting",
                callDuration: "5:30",
              },
            ]}
            waitingCalls={[
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Alice Johnson",
                status: "waiting",
                callDuration: "3:15",
              },
              {
                phoneNumber: "+1 (555) 234-5678",
                agentName: "Bob Brown",
                status: "waiting",
                callDuration: "2:45",
              },
            ]}
            sla="2:00"
          />
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default QueueManagement;
