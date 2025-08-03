"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import MiniStatsCard from "../MiniStatsCard";
import { useTranslations } from "next-intl";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";

const ErgTodayTalkTime = () => {
  const t = useTranslations("dashboard.stats.ergStats.todayTalkTime");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "erg_today_talk_time_refetch_interval"
  );

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["ErgTodayTalkTime"],
    queryFn: statsService.getErgTodayTalkTime,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={
        <img src="/assets/icons/stats/phone.svg" alt="Today Talk Time Icon" />
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
      canRefetch
      refetchInterval={refetchInterval}
      setRefetchInterval={setRefetchInterval}
      refetch={refetch}
    ></StatsCard>
  );
};

export default ErgTodayTalkTime;
