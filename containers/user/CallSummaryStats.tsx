import StatsCard from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import {
  Call,
  CallMade,
  CallReceived,
  South,
  TimerOutlined,
} from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";

const CallSummaryStats = () => {
  const t = useTranslations("dashboard.stats.callSummaryStats");

  const {
    data: summaryStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["callSummaryStats"],
    queryFn: statsService.fetchCallSummaryStats,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {/* Call Summary Stats */}
      <StatsCard
        title={t("totalIncoming.title")}
        value={summaryStats?.inbound?.current || "0"}
        info={`${Math.round(summaryStats?.inbound?.change || 0)}% ${t(
          "totalIncoming.info"
        )}`}
        icon={<CallReceived />}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("totalOutgoing.title")}
        value={summaryStats?.outbound.current || "0"}
        info={`${Math.round(summaryStats?.outbound.change || 0)}% ${t(
          "totalOutgoing.info"
        )}`}
        icon={<CallMade />}
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("answerRate.title")}
        value={`${Math.round(summaryStats?.answerRate.current || 0)}%`}
        info={`${Math.round(summaryStats?.answerRate.change || 0)}% ${t(
          "answerRate.info"
        )}`}
        icon={<Call />}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("talkTime.title")}
        value={`${Math.round(summaryStats?.talkTime.current || 0)}s`}
        info={`${Math.round(summaryStats?.talkTime.change || 0)}% ${t(
          "talkTime.info"
        )}`}
        icon={<TimerOutlined />}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("waitTime.title")}
        value={`${Math.round(summaryStats?.waitTime.current || 0)}s`}
        info={`${Math.round(summaryStats?.waitTime.change || 0)}% ${t(
          "waitTime.info"
        )}`}
        icon={<TimerOutlined />}
        color="destructive"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("internalCalls.title")}
        value={summaryStats?.internal.current || "0"}
        info={`${Math.round(summaryStats?.internal.change || 0)}% ${t(
          "internalCalls.title"
        )}`}
        icon={<South />}
        color="default"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default CallSummaryStats;
