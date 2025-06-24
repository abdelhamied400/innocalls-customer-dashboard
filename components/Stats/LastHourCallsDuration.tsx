"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const LastHourCallsDuration = () => {

    const t = useTranslations("dashboard.stats.lastHourCallsDuration");
  
  const {
    data: lastHourCallsDuration,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["last-hour-calls-duration"],
    queryFn: statsService.getLastHourCallsDuration,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  const formatDuration = (duration: string[]) => {
    return duration
      .map((time, index) => {
        if (index === 0) return `${time}H`;
        if (index === 1) return `${time}M`;
        if (index === 2) return `${time}S`;
        return "";
      })
      .join(" ");
  };

  if (isLoading || isRefetching) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/hourglass.svg"
          alt="Last Hour Calls Icon"
        />
      }
      title={t('title')}
      value={formatDuration(
        lastHourCallsDuration.lastHourOfDay.totalAnsweredDuration
      )}
      className="shadow-none"
      info={
        <p className="text-sm text-gray-500">
          {t('basedOn')}{" "}
          <span className="font-bold">
            {lastHourCallsDuration.lastHourOfDay.totalAnsweredCount}
          </span>{" "}
          {t('calls')} {t('ofTotal')}{" "}
          <span className="font-bold">
            {lastHourCallsDuration.lastHourOfDay.total}
          </span>{" "}
          {t('calls')}
        </p>
      }
    ></StatsCard>
  );
};

export default LastHourCallsDuration;
