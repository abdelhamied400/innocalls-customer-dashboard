"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useTranslations } from "next-intl";

const ErgInProgressCallsCount = () => {
  const t = useTranslations("dashboard.stats.ergStats.inProgressCallsCount");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "erg_in_progress_calls_count_refetch_interval"
  );

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ErgInProgressCallsCount"],
    queryFn: statsService.getErgInProgressCallsCount,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
      title={t("title")}
      value={ergStats.inProgressCallsCount}
      isRefetching={isRefetching}
      canRefetch
      refetchInterval={refetchInterval}
      setRefetchInterval={setRefetchInterval}
      refetch={refetch}
    ></StatsCard>
  );
};

export default ErgInProgressCallsCount;
