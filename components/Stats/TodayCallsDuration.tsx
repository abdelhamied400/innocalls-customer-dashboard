import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { IntervalValue } from "@/constants/stats";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const DEFAULT_REFETCH_INTERVAL = 30000; // 30 seconds in milliseconds
const TodayCallsDuration = () => {
  const t = useTranslations("dashboard.stats.todayCallsDuration");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "today_calls_duration_refetch_interval"
  );

  const {
    data: lastHourCallsDuration,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["today-calls-duration"],
    queryFn: statsService.getTodayCallsDuration,
    refetchOnWindowFocus: false,
    refetchInterval,
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
          src="/assets/icons/stats/timer.svg"
          alt="Today Calls Duration Icon"
        />
      }
      title={t("title")}
      value={formatDuration(lastHourCallsDuration.allDay.totalAnsweredDuration)}
      className="shadow-none"
      info={
        <p className="text-sm text-gray-500">
          {t("basedOn")}{" "}
          <span className="font-bold">
            {lastHourCallsDuration.allDay.totalAnsweredCount}
          </span>{" "}
          {t("calls")} {t("ofTotal")}{" "}
          <span className="font-bold">
            {lastHourCallsDuration.allDay.total}
          </span>{" "}
          {t("calls")}
        </p>
      }
      isRefetching={isRefetching}
      canRefetch
      refetchInterval={refetchInterval}
      setRefetchInterval={setRefetchInterval}
      refetch={refetch}
    ></StatsCard>
  );
};

export default TodayCallsDuration;
