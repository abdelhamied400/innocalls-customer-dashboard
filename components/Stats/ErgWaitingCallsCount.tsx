import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const ErgWaitingCallsCount = () => {
  const t = useTranslations("dashboard.stats.ergStats.waitingCallsCount");

  const {
    data: ergStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ErgWaitingCallsCount"],
    queryFn: statsService.getErgWaitingCallsCount,
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
        <img
          src="/assets/icons/stats/erg/hourglass_empty.png"
          alt="Waiting Calls Icon"
        />
      }
      title={t("title")}
      value={ergStats.calls.length}
      isRefetching={isRefetching}
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
    ></StatsCard>
  );
};

export default ErgWaitingCallsCount;
