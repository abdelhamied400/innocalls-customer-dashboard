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
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import liveMonitoringService from "@/services/live-monitoring.service";
import { Group } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";

const Agents = () => {
  const t = useTranslations("liveMonitor.agents");

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_monitoring_agents_interval"
  );
  const {
    data: agents,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["agentsData"],
    queryFn: () => liveMonitoringService.fetchAgents(),
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
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
          title={t("title")}
          subtitle={t("subtitle")}
          value={0}
          valueSubtitle={t("total")}
          icon={<Group />}
          color="primary"
          refetch={refetch}
          canRefetch
          isRefetching={isRefetching}
          refetchInterval={refetchInterval}
          setRefetchInterval={setRefetchInterval}
        >
          <NoData />
        </StatsDetailedCard>
      </div>
    );
  }

  return (
    <div className="agents sticky top-0">
      <StatsDetailedCard
        title={t("title")}
        subtitle={t("subtitle")}
        value={
          agents?.online.length + agents?.onCall.length + agents?.offline.length
        }
        valueSubtitle={t("total")}
        icon={<Group />}
        color="primary"
        refetch={refetch}
        canRefetch
        isRefetching={isRefetching}
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
      >
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
          <Accordion
            type="multiple"
            defaultValue={["idle", "onCall", "onBreak"]}
          >
            <AccordionItem value="onCall">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {t("status.onCall")}
                  </span>
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
                  <span className="text-lg font-semibold">
                    {t("status.idle")}
                  </span>
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
                  <span className="text-lg font-semibold">
                    {t("status.offline")}
                  </span>
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
