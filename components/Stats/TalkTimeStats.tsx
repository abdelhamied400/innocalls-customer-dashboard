import StatsDetailedCard, {
  StatsDetailedCardError,
  StatsDetailedCardSkeleton,
} from "@/components/StatsDetailedCard";
import { AvTimer } from "@mui/icons-material";
import StatsSubCard from "@/components/StatsSubCard";
import StatsMetricCard from "@/components/StatsMetricCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import statsService from "@/services/stats.service";
import { formatDurationShort } from "@/lib/date";
import { useLocale, useTranslations } from "next-intl";
import { formatNumbers } from "@/lib/utils";

const TalkTimeStats = () => {
  const t = useTranslations("dashboard.stats.talkTimeStats");
  const tCommon = useTranslations("common");

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "talk_time_stats_refetch_interval"
  );

  const {
    data: talkTimeStats,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["talk-time-stats"],
    queryFn: statsService.getTalkTimeStats,
  });

  if (isLoading) {
    return <StatsDetailedCardSkeleton />;
  }

  if (isError || !talkTimeStats) {
    return <StatsDetailedCardError error={error} />;
  }

  return (
    <StatsDetailedCard
      title={t("title")}
      value={`${talkTimeStats?.totalTalkTimeHours}${t("h")}`}
      subtitle={t("subtitle")}
      valueSubtitle={t("valueSubtitle", {
        percentage: `${formatNumbers(
          talkTimeStats?.totalTalkTimeChangePercentage || 0
        )}\u200E`,
      })}
      icon={<AvTimer />}
      color="success"
      isRefetching={isRefetching}
    >
      {/* Talk Time Metrics */}
      <div className="space-y-4">
        <StatsMetricCard
          label={t("averagePerCall")}
          value={formatDurationShort(talkTimeStats?.averageTalkTime, {
            t: tCommon,
          })}
          color="success"
          performanceChange={t("valueSubtitle", {
            percentage: `${formatNumbers(
              talkTimeStats?.averageTalkTimeChangePercentage || 0
            )}\u200E`,
          })}
        />

        <div className="grid grid-cols-2 gap-3">
          <StatsSubCard
            color="success"
            value={`${formatNumbers(talkTimeStats?.dailyAverageHours || 0)}${t(
              "h"
            )}`}
            label={t("dailyAverage")}
          />
          <StatsSubCard
            color="success"
            value={`${formatNumbers(
              talkTimeStats?.peakHourTalkTimeHours || 0
            )}${t("h")}`}
            label={t("peakHour")}
          />
        </div>
      </div>
    </StatsDetailedCard>
  );
};

export default TalkTimeStats;
