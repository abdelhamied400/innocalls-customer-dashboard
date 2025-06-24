"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React from "react";

const LiveCallsCount = () => {
  const t = useTranslations("dashboard.stats.liveCallsCount");

  const {
    data: liveCallsCount,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["live-calls-count"],
    queryFn: statsService.getLiveCallsCount,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading || isRefetching) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
      title={t('title')}
      value={liveCallsCount}
      className="bg-info-100 shadow-none"
    ></StatsCard>
  );
};

export default LiveCallsCount;
