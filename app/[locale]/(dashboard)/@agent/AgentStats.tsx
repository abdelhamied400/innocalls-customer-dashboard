import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";
import {
  AddIcCall,
  Call,
  HourglassBottom,
  LockClock,
  Phone,
  RingVolume,
  Timer,
} from "@mui/icons-material";

const AgentStats = () => {
  const t = useTranslations("dashboard.stats.todayCallsDuration");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "today_calls_duration_refetch_interval"
  );
  const { data, isRefetching, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["agent-stats"],
    queryFn: () => statsService.getAgentStats(),
  });

  return (
    <div className="stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalAnsweredCalls")}
        value={data?.totalAnsweredCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="success"
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
        canRefetch
      />
      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalCalls")}
        value={data?.totalCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="primary"
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
        canRefetch
      />
      <StatsCard
        icon={<RingVolume className="w-6 h-6" />}
        title={t("totalIncomingCalls")}
        value={data?.totalIncomingCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="warning"
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
        canRefetch
      />

      <StatsCard
        icon={<AddIcCall className="w-6 h-6" />}
        title={t("totalOutgoingCalls")}
        value={data?.totalOutgoingCalls || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="info"
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
        canRefetch
      />
      <StatsCard
        icon={<LockClock className="w-6 h-6" />}
        title={t("totalTalkTime")}
        value={data?.totalTalkTime || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="success"
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
        canRefetch
      />
      <StatsCard
        icon={<HourglassBottom className="w-6 h-6" />}
        title={t("totalWaitTime")}
        value={data?.totalWaitTime || "0"}
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
        color="warning"
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
        canRefetch
      />
    </div>
  );
};

export default AgentStats;
