import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useTranslations } from "next-intl";

const ErgWaitingCallsCount = () => {
  const t = useTranslations("dashboard.stats.ergStats.waitingCallsCount");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "erg_waiting_calls_count_refetch_interval"
  );

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["ErgWaitingCallsCount"],
    queryFn: statsService.getErgWaitingCallsCount,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/erg/hourglass_empty.png"
          alt="Waiting Calls Icon"
        />
      }
      title={t("title")}
      value={ergStats.calls.length}
      info={
        <div className="flex flex-col gap-1 rounded-lg bg-gray-100 max-h-48 overflow-y-auto">
          {ergStats.calls.map((call: { queueName: string; caller: string }) => (
            <div
              key={`${call.queueName}-${call.caller}`}
              className="flex flex-col p-4 border-b border-gray-200 last:border-0"
            >
              <span>{call.queueName}</span>
              <span className="font-bold">{call.caller}</span>
            </div>
          ))}
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

export default ErgWaitingCallsCount;
