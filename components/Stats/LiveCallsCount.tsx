"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const LiveCallsCount = () => {
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
      title="Live Calls Count"
      value={liveCallsCount}
      className="bg-blue-100 shadow-none"
      info={
        <p className="text-sm text-gray-500">
          <span className="text-green-500">+120,34%</span> Up from yesterday
        </p>
      }
    ></StatsCard>
  );
};

export default LiveCallsCount;
