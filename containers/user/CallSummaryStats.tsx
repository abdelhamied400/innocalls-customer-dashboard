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
import { formatNumbers } from "@/lib/utils";

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
        info={t("totalIncoming.info", {
          percentage: `${Math.round(summaryStats?.inbound?.change || 0)}\u200E`,
        })}
        icon={<CallReceived />}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("totalOutgoing.title")}
        value={summaryStats?.outbound?.current || "0"}
        info={t("totalOutgoing.info", {
          percentage: `${formatNumbers(
            summaryStats?.outbound?.change || 0
          )}\u200E`,
        })}
        icon={<CallMade />}
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("answerRate.title")}
        value={`${formatNumbers(
          summaryStats?.answerRate?.current || 0
        )}\u200E%`}
        info={t("answerRate.info", {
          percentage: `${formatNumbers(
            summaryStats?.answerRate.change || 0
          )}\u200E`,
        })}
        icon={<Call />}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("talkTime.title")}
        value={`${formatNumbers(summaryStats?.talkTime?.current || 0)}${t(
          "talkTime.s"
        )}`}
        info={t("talkTime.info", {
          percentage: `${formatNumbers(
            summaryStats?.talkTime?.change || 0
          )}\u200E`,
        })}
        icon={<TimerOutlined />}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("waitTime.title")}
        value={`${formatNumbers(summaryStats?.waitTime?.current || 0)}${t(
          "waitTime.s"
        )}`}
        info={t("waitTime.info", {
          percentage: `${formatNumbers(
            summaryStats?.waitTime?.change || 0
          )}\u200E`,
        })}
        icon={<TimerOutlined />}
        color="destructive"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title={t("internalCalls.title")}
        value={summaryStats?.internal?.current || "0"}
        info={t("internalCalls.info", {
          percentage: `${formatNumbers(
            summaryStats?.internal?.change || 0
          )}\u200E`,
        })}
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
