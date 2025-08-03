import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { HourglassEmpty } from "@mui/icons-material";
import StatsMetricCard from "@/components/StatsMetricCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import statsService from "@/services/stats.service";
import { formatDurationShort } from "@/lib/date";
import { useTranslations } from "next-intl";

const WaitTimeStats = () => {
  const t = useTranslations("dashboard.stats.waitTimeStats");

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "wait_time_stats_refetch_interval"
  );

  const {
    data: waitTimeStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["wait-time-stats"],
    queryFn: statsService.getWaitingTimeStats,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError || !waitTimeStats) {
    return <StatsDetailedCardError error={error} />;
  }

  return (
    <StatsDetailedCard
      title={t("title")}
      value={`${waitTimeStats?.totalWaitTime}`}
      subtitle={t("subtitle")}
      valueSubtitle={`${Math.round(
        waitTimeStats?.totalWaitTimeChangePercentage
      )}% ${t("valueSubtitle")}`}
      icon={<HourglassEmpty />}
      color="info"
    >
      {/* Wait Time Metrics */}
      <div className="space-y-4">
        <StatsMetricCard
          label={t("averageWait")}
          value={formatDurationShort(waitTimeStats?.averageWaitTime)}
          color="info"
          performanceChange={`${Math.round(
            waitTimeStats?.averageWaitTimeChange
          )}% ${t("valueSubtitle")}`}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("completedCalls")}</span>
            <span className="font-medium text-gray-800">
              {formatDurationShort(
                waitTimeStats?.completedCalls?.averageWaitTime
              )}{" "}
              {t("avg")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("abandonedCalls")}</span>
            <span className="font-medium text-gray-800">
              {formatDurationShort(
                waitTimeStats?.abandonedCalls?.averageWaitTime
              )}{" "}
              {t("avg")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("timeoutCalls")}</span>
            <span className="font-medium text-gray-800">
              {formatDurationShort(
                waitTimeStats?.timeoutCalls?.averageWaitTime
              )}{" "}
              {t("avg")}
            </span>
          </div>
        </div>
      </div>
    </StatsDetailedCard>
  );
};

export default WaitTimeStats;
