import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import PercentBarStat from "@/components/PercentBarStat";
import { Call } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { useTranslations } from "next-intl";

const TotalCallsStats = () => {
  const t = useTranslations("dashboard.stats.totalCallsStats");

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "total_calls_stats_refetch_interval"
  );

  const {
    data: totalCallsStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["total-calls-stats"],
    queryFn: statsService.getTotalCallsStats,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError || !totalCallsStats) {
    return <StatsDetailedCardError error={error} />;
  }

  return (
    <StatsDetailedCard
      title={t("title")}
      value={totalCallsStats?.totalCalls}
      subtitle={t("subtitle")}
      valueSubtitle={`${totalCallsStats?.previousTotalCalls}% ${t(
        "valueSubtitle"
      )}`}
      icon={<Call />}
      color="primary"
      isRefetching={isRefetching}
    >
      <PercentBarStat
        label={t("completedCalls")}
        value={totalCallsStats?.completed?.count}
        percentage={totalCallsStats?.completed?.percentage}
        color="green"
        showPercentage
      />
      <PercentBarStat
        label={t("abandonedCalls")}
        value={totalCallsStats?.abandoned?.count}
        percentage={totalCallsStats?.abandoned?.percentage}
        color="orange"
        showPercentage
      />
      <PercentBarStat
        label={t("timeoutCalls")}
        value={totalCallsStats?.timeout?.count}
        percentage={totalCallsStats?.timeout?.percentage}
        color="red"
        showPercentage
      />
    </StatsDetailedCard>
  );
};

export default TotalCallsStats;
