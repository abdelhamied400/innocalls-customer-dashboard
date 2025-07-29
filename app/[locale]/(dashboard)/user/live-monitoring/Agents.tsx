import NoData from "@/components/Analytics/NoData";
import AgentCard from "@/components/LiveMonitoring/AgentCard";
import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import liveMonitoringService from "@/services/live-monitoring.service";
import { Group } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

const Agents = () => {
  const {
    data: agents,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agentsData"],
    queryFn: () => liveMonitoringService.fetchAgents(),
  });

  if (isLoading) {
    return (
      <div className="agents sticky top-0">
        <StatsDetailedCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="agents sticky top-0">
        <StatsDetailedCardError error={error} />
      </div>
    );
  }
  if (!agents) {
    return (
      <div className="agents sticky top-0">
        <StatsDetailedCard
          title="Agents"
          subtitle="Live status & performance"
          value={0}
          valueSubtitle="Total"
          icon={<Group />}
          color="primary"
        >
          <NoData />
        </StatsDetailedCard>
      </div>
    );
  }

  return (
    <div className="agents sticky top-0">
      <StatsDetailedCard
        title="Agents"
        subtitle="Live status & performance"
        value={
          agents?.online.length + agents?.onCall.length + agents?.offline.length
        }
        valueSubtitle="Total"
        icon={<Group />}
        color="primary"
      >
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
          <Accordion
            type="multiple"
            defaultValue={["idle", "onCall", "onBreak"]}
          >
            <AccordionItem value="onCall">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">On Call Agents</span>
                  <span className="text-sm text-gray-500">
                    ({agents?.onCall.length || 0})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                {agents?.onCall.map((agent) => (
                  <AgentCard
                    key={agent.ext}
                    name={agent.name}
                    status="onCall"
                    extension={agent.ext}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="idle">
              <AccordionTrigger className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Idle Agents</span>
                  <span className="text-sm text-gray-500">
                    ({agents?.online.length || 0})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                {agents?.online.map((agent) => (
                  <AgentCard
                    key={agent.ext}
                    name={agent.name}
                    status="idle"
                    extension={agent.ext}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="onBreak">
              <AccordionTrigger className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Offline Agents</span>
                  <span className="text-sm text-gray-500">
                    ({agents?.offline.length || 0})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-2 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                {agents?.offline.map((agent) => (
                  <AgentCard
                    key={agent.ext}
                    name={agent.name}
                    status="onBreak"
                    extension={agent.ext}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default Agents;
