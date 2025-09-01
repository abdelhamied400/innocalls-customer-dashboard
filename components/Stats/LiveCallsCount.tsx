"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useTranslations } from "@/providers/TranslationProvider";
import React from "react";

const LiveCallsCount = () => {
  const t = useTranslations("dashboard.stats.liveCallsCount");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_calls_count_refetch_interval"
  );

  const {
    data: liveCallsCount,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["live-calls-count"],
    queryFn: statsService.getLiveCallsCount,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
      title={t("title")}
      value={liveCallsCount}
      className="bg-info-100 shadow-none"
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
      canRefetch
      refetchInterval={refetchInterval}
      setRefetchInterval={setRefetchInterval}
      refetch={refetch}
    ></StatsCard>
  );
};

export default LiveCallsCount;
