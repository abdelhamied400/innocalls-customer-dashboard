import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";

const AgentStats = () => {
  const t = useTranslations("dashboard.stats.todayCallsDuration");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "today_calls_duration_refetch_interval"
  );

  const {
    data: todayStats,
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
      ?.map((time, index) => {
        if (index === 0) return `${time}${t("h")}`;
        if (index === 1) return `${time}${t("m")}`;
        if (index === 2) return `${time}${t("s")}`;
        return "";
      })
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="agent-stats">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <div className="agent-stats">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <StatsCard
          icon={<img src="/assets/icons/stats/phone.svg" alt="" />}
          title={t("totalAnsweredCalls")}
          value={todayStats.totalAnsweredCount?.toString()}
          className="shadow-none"
          isRefetching={isRefetching}
          canRefetch
          refetchInterval={refetchInterval}
          setRefetchInterval={setRefetchInterval}
          refetch={refetch}
        ></StatsCard>
        <StatsCard
          icon={<img src="/assets/icons/stats/add-call.svg" alt="" />}
          title={t("totalCallsTitle")}
          value={todayStats.total}
          className="shadow-none"
          isRefetching={isRefetching}
          canRefetch
          refetchInterval={refetchInterval}
          setRefetchInterval={setRefetchInterval}
          refetch={refetch}
        ></StatsCard>
        <StatsCard
          icon={
            <img
              src="/assets/icons/stats/timer.svg"
              alt="Today Calls Duration Icon"
            />
          }
          title={t("title")}
          value={formatDuration(todayStats.totalAnsweredDuration, t)}
          className="shadow-none"
          isRefetching={isRefetching}
          canRefetch
          refetchInterval={refetchInterval}
          setRefetchInterval={setRefetchInterval}
          refetch={refetch}
        ></StatsCard>
      </div>
    </div>
  );
};

export default AgentStats;
