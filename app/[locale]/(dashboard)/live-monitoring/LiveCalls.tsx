import NoData from "@/components/Analytics/NoData";
import LiveCall from "@/components/LiveMonitoring/LiveCall";
import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import liveMonitoringService from "@/services/live-monitoring.service";
import { Call } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";
import useLayoutManager from "@/hooks/use-layout-manager";
import { cn } from "@/lib/utils";

const LiveCalls = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_monitoring_live_calls_interval"
  );
  const { layoutVariant } = useLayoutManager();

  const t = useTranslations("liveMonitor.liveCalls");

  const {
    data: liveCallsData,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useLocalizedQuery({
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
        title={t("title")}
        subtitle={t("subtitle")}
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
        title={t("title")}
        subtitle={t("subtitle")}
        value={liveCallsData.length.toString()}
        renderValue={
          <div className="value flex items-center gap-2">
            <div className="flex flex-col items-center text-center">
              <p className="font-bold text-2xl text-primary-500 transition-colors">
                {liveCallsData.length}
              </p>
              <p className="text-sm">{t("activeCalls")}</p>
            </div>
            <div className="live flex items-center gap-1">
              <span className="block w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-green-500">{t("live")}</p>
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
        <div
          className={cn(
            "grid gap-4",
            layoutVariant === "both-closed" &&
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            layoutVariant === "sidebar-only" && "grid-cols-1 lg:grid-cols-2",
            layoutVariant === "webrtc-only" && "grid-cols-1 lg:grid-cols-2",
            layoutVariant === "both-open" && "grid-cols-1"
          )}
        >
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
