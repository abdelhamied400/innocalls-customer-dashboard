import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";

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
  } = useLocalizedQuery({
    queryKey: ["today-calls-duration"],
    queryFn: statsService.getTodayCallsDuration,
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

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/timer.svg"
          alt="Today Calls Duration Icon"
        />
      }
      title={t("title")}
      value={formatDuration(
        lastHourCallsDuration.allDay.totalAnsweredDuration,
        t
      )}
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

export default TodayCallsDuration;
