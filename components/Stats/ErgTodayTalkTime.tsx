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

const ErgTodayTalkTime = () => {

    const t = useTranslations("dashboard.stats.ergStats.todayTalkTime");
  
    
  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgTodayTalkTime"],
    queryFn: statsService.getErgTodayTalkTime,
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
        <img src="/assets/icons/stats/phone.svg" alt="Today Talk Time Icon" />
      }
      title={t('title')}
      value={ergStats.total}
      info={
        <div className="flex flex-col gap-1">
          <MiniStatsCard
            icon="/assets/icons/stats/erg/mini/timer.svg"
            label={t('average')}
            variant="info"
            value={ergStats.average}
          />
        </div>
      }
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default ErgTodayTalkTime;
