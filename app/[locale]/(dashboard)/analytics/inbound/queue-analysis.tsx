import ChartCard, { ChartCardSkeleton } from "@/components/ChartCard";
import { InboundAnalyticsFilters } from "./page";
import {
  Alarm,
  BarChart,
  Call,
  CompareArrows,
  ExitToApp,
  Group,
  Queue,
  Timer,
} from "@mui/icons-material";
import {
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import StatsCard, { StatsCardSkeleton } from "@/components/StatsCard";
import StatsRowCard from "@/components/StatsRowCard";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import NoData from "@/components/Analytics/NoData";
import { useTranslations } from "next-intl";

const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E42",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
];

type InboundAnalyticsQueueAnalysisProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsQueueAnalysis = ({
  filters,
}: InboundAnalyticsQueueAnalysisProps) => {
  const t = useTranslations("analytics.inbound.queueAnalysis");

  const {
    data: abandonedAnalysis,
    isLoading: isLoadingAbandonedAnalysis,
    error: abandonedError,
  } = useLocalizedQuery({
    queryKey: ["inbound-analytics-queue-abandoned-analysis", filters],
    queryFn: () => inboundAnalyticsService.fetchQueueAbandonedAnalysis(filters),
  });

  const {
    data: timeoutAnalysis,
    isLoading: isLoadingTimeoutAnalysis,
    error: timeoutError,
  } = useLocalizedQuery({
    queryKey: ["inbound-analytics-queue-timeout-analysis", filters],
    queryFn: () => inboundAnalyticsService.fetchQueueTimeoutAnalysis(filters),
  });

  if (isLoadingAbandonedAnalysis || isLoadingTimeoutAnalysis) {
    return (
      <div className="flex flex-col gap-4">
        <div className="header flex items-center gap-2">
          <h4>{t("abandonedAnalysis.title")}</h4>
          <hr className="flex-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <ChartCardSkeleton />

          <ChartCardSkeleton />
        </div>

        <div className="header flex items-center gap-2">
          <h4>{t("timeoutAnalysis.title")}</h4>
          <hr className="flex-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <ChartCardSkeleton />

          <ChartCardSkeleton />
        </div>
        <div className="header flex items-center gap-2">
          <h4>{t("comparison.title")}</h4>
          <hr className="flex-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <ChartCardSkeleton />
          <ChartCardSkeleton />
        </div>
      </div>
    );
  }

  if (abandonedError || timeoutError) {
    return (
      <div className="flex flex-col gap-4">
        <p>{abandonedError?.message || timeoutError?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="header flex items-center gap-2">
        <h4>{t("abandonedAnalysis.title")}</h4>
        <hr className="flex-1" />
      </div>
      {!abandonedAnalysis?.stats.length && <NoData />}
      {abandonedAnalysis && abandonedAnalysis?.stats.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <StatsCard
              title={t("abandonedAnalysis.totalAbandoned")}
              value={abandonedAnalysis.total}
              icon={<Call />}
              color="destructive"
            />
            <StatsCard
              title={t("abandonedAnalysis.uniqueCallers")}
              value={abandonedAnalysis.uniqueCallers}
              icon={<Group />}
              color="warning"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <ChartCard
              title={t("abandonedAnalysis.chartTitle")}
              icon={<Alarm />}
              color="destructive"
              legends={abandonedAnalysis.stats.map((stat, index) => ({
                label: stat.timeBucket,
                color: colors[index % colors.length],
              }))}
              variant="compound"
            >
              <ResponsiveContainer width="100%" height={288}>
                <PieChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <Pie
                    data={abandonedAnalysis.stats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="timeBucket"
                    label
                  >
                    {abandonedAnalysis.stats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title={t("abandonedAnalysis.statsTitle")}
              icon={<BarChart />}
              color="destructive"
              variant="compound"
            >
              <div className="flex flex-col gap-2">
                <StatsRowCard
                  label={t("abandonedAnalysis.avgWaitTime")}
                  value={abandonedAnalysis.avgWaitTime}
                  color="primary"
                />
                <StatsRowCard
                  label={t("abandonedAnalysis.minWaitTime")}
                  value={abandonedAnalysis.minWaitTime}
                  color="warning"
                />
                <StatsRowCard
                  label={t("abandonedAnalysis.maxWaitTime")}
                  value={abandonedAnalysis.maxWaitTime}
                  color="success"
                />
                <StatsRowCard
                  label={t("abandonedAnalysis.peakTimeoutHour")}
                  value={abandonedAnalysis.peakHour}
                  color="info"
                />
              </div>
            </ChartCard>
          </div>
        </>
      )}

      <div className="header flex items-center gap-2">
        <h4>{t("timeoutAnalysis.title")}</h4>
        <hr className="flex-1" />
      </div>
      {!timeoutAnalysis?.stats.length && <NoData />}
      {timeoutAnalysis && timeoutAnalysis?.stats.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <StatsCard
              title={t("timeoutAnalysis.totalTimeout")}
              value={timeoutAnalysis.total}
              icon={<Call />}
              color="destructive"
            />
            <StatsCard
              title={t("timeoutAnalysis.uniqueCallers")}
              value={timeoutAnalysis.uniqueCallers}
              icon={<Group />}
              color="warning"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <ChartCard
              title={t("timeoutAnalysis.chartTitle")}
              icon={<ExitToApp />}
              color="warning"
              legends={timeoutAnalysis.stats.map((stat, index) => ({
                label: stat.timeBucket,
                color: colors[index % colors.length],
              }))}
              variant="compound"
            >
              <ResponsiveContainer width="100%" height={288}>
                <PieChart>
                  <Pie
                    data={timeoutAnalysis.stats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    nameKey="timeBucket"
                    label
                  >
                    {timeoutAnalysis.stats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title={t("timeoutAnalysis.statsTitle")}
              icon={<Queue />}
              color="warning"
              variant="compound"
            >
              <div className="flex flex-col gap-2">
                <StatsRowCard
                  label={t("timeoutAnalysis.avgWaitTime")}
                  value={timeoutAnalysis.avgWaitTime}
                  color="primary"
                />
                <StatsRowCard
                  label={t("timeoutAnalysis.minWaitTime")}
                  value={timeoutAnalysis.minWaitTime}
                  color="warning"
                />
                <StatsRowCard
                  label={t("timeoutAnalysis.maxWaitTime")}
                  value={timeoutAnalysis.maxWaitTime}
                  color="success"
                />
                <StatsRowCard
                  label={t("timeoutAnalysis.peakTimeoutHour")}
                  value={timeoutAnalysis.peakHour}
                  color="info"
                />
              </div>
            </ChartCard>
          </div>
        </>
      )}

      {!!abandonedAnalysis &&
        !!timeoutAnalysis &&
        abandonedAnalysis?.stats.length > 0 &&
        timeoutAnalysis?.stats.length > 0 && (
          <>
            <div className="header flex items-center gap-2">
              <h4>{t("comparison.title")}</h4>
              <hr className="flex-1" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <ChartCard
                title={t("comparison.abandonedVsTimeout")}
                icon={<CompareArrows />}
                color="info"
                variant="compound"
              >
                <StatsRowCard
                  label={t("comparison.totalAbandoned")}
                  value={abandonedAnalysis.total}
                  color="destructive"
                />
                <StatsRowCard
                  label={t("comparison.totalTimeout")}
                  value={timeoutAnalysis.total}
                  color="warning"
                />
                <StatsRowCard
                  label={t("comparison.totalUnanswered")}
                  value={abandonedAnalysis.total + timeoutAnalysis.total}
                  color="info"
                />
              </ChartCard>
              <ChartCard
                title={t("comparison.comparisonTitle")}
                icon={<Timer />}
                color="info"
                variant="compound"
              >
                <StatsRowCard
                  label={t("comparison.avgAbandonWait")}
                  value={`${abandonedAnalysis.avgWaitTime}`}
                  color="destructive"
                />
                <StatsRowCard
                  label={t("comparison.avgTimeoutWait")}
                  value={`${timeoutAnalysis.avgWaitTime}`}
                  color="warning"
                />
                <StatsRowCard
                  label={t("comparison.peakHours")}
                  value={`${abandonedAnalysis.peakHour} | ${timeoutAnalysis.peakHour}`}
                  color="info"
                />
              </ChartCard>
            </div>
          </>
        )}
    </div>
  );
};

export default InboundAnalyticsQueueAnalysis;
