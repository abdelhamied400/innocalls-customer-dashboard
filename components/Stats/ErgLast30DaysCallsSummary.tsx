"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import MiniStatsCard from "../MiniStatsCard";
import { useTranslations } from "@/providers/TranslationProvider";

const ErgLast30DaysCallsSummary = () => {
  const t = useTranslations("dashboard.stats.ergStats.last30DaysCallsSummary");

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["ErgLast30DaysCallsSummary"],
    queryFn: statsService.getErgLast30DaysCallsSummary,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/phone.svg"
          alt="Last 30 Days Calls Summary Icon"
        />
      }
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
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
    ></StatsCard>
  );
};

export default ErgLast30DaysCallsSummary;
