import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { BarChart, Bolt, ShowChart } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

const QuickStats = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "quick_stats_refetch_interval"
  );

  const {
    data: quickStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quick-stats"],
    queryFn: statsService.getQuickStats,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
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
        title="Peak Day"
        value={quickStats.peakDay}
        icon={<ShowChart />}
        color="info"
      />

      {/* Avg Daily Calls */}
      <StatsCard
        title="Avg Daily Calls"
        value={quickStats.averageDailyCalls}
        icon={<BarChart />}
        color="success"
      />

      {/* Best Response */}
      <StatsCard
        title="Best Response"
        value={quickStats.bestResponseTime}
        icon={<Bolt />}
        color="warning"
      />
    </div>
  );
};

export default QuickStats;
