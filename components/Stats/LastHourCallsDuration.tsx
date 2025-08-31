"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";

const LastHourCallsDuration = () => {
  const t = useTranslations("dashboard.stats.lastHourCallsDuration");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "last_hour_calls_duration_refetch_interval"
  );

  const {
    data: lastHourCallsDuration,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["last-hour-calls-duration"],
    queryFn: statsService.getLastHourCallsDuration,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  const formatDuration = (
    duration: string[],
    t: ReturnType<typeof useTranslations>
  ) => {
    return duration
      .map((time, index) => {
        if (index === 0) return `${time}${t("h")}`;
        if (index === 1) return `${time}${t("m")}`;
        if (index === 2) return `${time}${t("s")}`;
        return "";
      })
      .join(" ");
  };

  // Remove handleRefetchIntervalChange and useEffect for refetchInterval

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/hourglass.svg"
          alt="Last Hour Calls Icon"
        />
      }
      title={t("title")}
      value={formatDuration(
        lastHourCallsDuration.lastHourOfDay.totalAnsweredDuration,
        t
      )}
      className="shadow-none"
      info={
        <p className="text-sm text-gray-500">
          {t("basedOn")}{" "}
          <span className="font-bold">
            {lastHourCallsDuration.lastHourOfDay.totalAnsweredCount}
          </span>{" "}
          {t("calls")} {t("ofTotal")}{" "}
          <span className="font-bold">
            {lastHourCallsDuration.lastHourOfDay.total}
          </span>{" "}
          {t("calls")}
        </p>
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

export default LastHourCallsDuration;
