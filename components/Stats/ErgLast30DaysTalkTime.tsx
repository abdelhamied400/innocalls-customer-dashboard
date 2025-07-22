"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import MiniStatsCard from "../MiniStatsCard";
import { useTranslations } from "next-intl";

const ErgLast30DaysTalkTime = () => {
  const t = useTranslations("dashboard.stats.ergStats.last30DaysTalkTime");

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgLast30DaysTalkTime"],
    queryFn: statsService.getErgLast30DaysTalkTime,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/phone.svg"
          alt="Last 30 Days Talk Time Icon"
        />
      }
      title={t("title")}
      value={ergStats.total}
      info={
        <div className="flex flex-col gap-1">
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer.svg"
            label={t("average")}
            variant="info"
            value={ergStats.average}
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

export default ErgLast30DaysTalkTime;
