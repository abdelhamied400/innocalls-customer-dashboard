import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { BarChart, Bolt, ShowChart } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";

const QuickStats = () => {
  const t = useTranslations("dashboard.stats.quickStats");

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "quick_stats_refetch_interval"
  );
  const locale = useLocale();

  const {
    data: quickStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["quick-stats"],
    queryFn: () => statsService.getQuickStats(locale),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  if (isError || !quickStats) {
    return <StatsCardError error={error} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
      {/* Peak Day */}
      <StatsCard
        title={t("peakDay.title")}
        value={quickStats.peakDay}
        icon={<ShowChart />}
        color="info"
      />

      {/* Avg Daily Calls */}
      <StatsCard
        title={t("avgDailyCalls.title")}
        value={quickStats.averageDailyCalls}
        icon={<BarChart />}
        color="success"
      />

      {/* Best Response */}
      <StatsCard
        title={t("bestResponse.title")}
        value={quickStats.bestResponseTime}
        icon={<Bolt />}
        color="warning"
      />
    </div>
  );
};

export default QuickStats;
