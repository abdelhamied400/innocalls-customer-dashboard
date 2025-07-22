"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import MiniStatsCard from "../MiniStatsCard";
import { useTranslations } from "next-intl";

const ErgLast30DaysWaitingTime = () => {
  const t = useTranslations("dashboard.stats.ergStats.last30DaysWaitingTime");

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgLast30DaysWaitingTime"],
    queryFn: statsService.getErgLast30DaysWaitingTime,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/erg/last30.png"
          alt="Last 30 Days Waiting Time Icon"
        />
      }
      title={t("title")}
      value={ergStats.totalWaitTime}
      info={
        <div className="flex flex-col gap-1">
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/alarm_on.svg"
            label={t("completed")}
            variant="success"
            value={ergStats.totalWaitTimeCompletedCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer_2.svg"
            label={t("avgCompleted")}
            variant="default"
            value={ergStats.avgWaitTimeCompletedCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/ring_volume.svg"
            label={t("abandoned")}
            variant="warning"
            value={ergStats.totalWaitTimeAbandonCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer.svg"
            label={t("avgAbandoned")}
            variant="info"
            value={ergStats.avgWaitTimeAbandonCalls}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/ring_volume.svg"
            label={t("exitTimeout")}
            variant="destructive"
            value={ergStats.totalWaitTimeExitTimeout}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer.svg"
            label={t("avgExitTimeout")}
            variant="indigo"
            value={ergStats.avgWaitTimeExitTimeout}
          />
        </div>
      }
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
    ></StatsCard>
  );
};

export default ErgLast30DaysWaitingTime;
