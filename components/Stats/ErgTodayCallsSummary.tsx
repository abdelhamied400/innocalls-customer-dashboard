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

const ErgTodayCallsSummary = () => {
  const t = useTranslations("dashboard.stats.ergStats.todayCallsSummary");

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgTodayCallsSummary"],
    queryFn: statsService.getErgTodayCallsSummary,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
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
      icon={
        <img
          src="/assets/icons/stats/phone.svg"
          alt="Today Calls Summary Icon"
        />
      }
      title={t("title")}
      value={ergStats.total}
      info={
        <div className="flex flex-col gap-1">
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/ring_volume.svg"
            label={t("abandon")}
            variant="warning"
            value={ergStats.abandon}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer_2.svg"
            label={t("completed")}
            variant="default"
            value={ergStats.completed}
          />
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer_off.svg"
            label={t("timeout")}
            variant="destructive"
            value={ergStats.timeout}
          />
        </div>
      }
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgTodayCallsSummary;
