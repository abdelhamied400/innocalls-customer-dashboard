import ChartCard from "@/components/ChartCard";
import AllInboundAnalytics from "@/services/inbound-analytics.service";
import { LineAxis } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InboundAnalyticsFilters } from "./page";
import NoData from "@/components/Analytics/NoData";
import { useTranslations } from "@/providers/TranslationProvider";

type InboundAnalyticsOverviewProps = { filters: InboundAnalyticsFilters };
const InboundAnalyticsOverview = ({
  filters,
}: InboundAnalyticsOverviewProps) => {
  const t = useTranslations("analytics.inbound.overview");

  const legends = {
    team: [
      { label: t("legends.totalCalls"), color: "#3B82F6" },
      { label: t("legends.completedCalls"), color: "#10B981" },
      { label: t("legends.timeoutCalls"), color: "#F59E42" },
      { label: t("legends.abandonedCalls"), color: "#EF4444" },
    ],
    all: [
      { label: t("legends.totalCalls"), color: "#3B82F6" },
      { label: t("legends.answeredCalls"), color: "#10B981" },
      { label: t("legends.externalCalls"), color: "#F59E42" },
      ...(filters.includeInternalCalls
        ? [{ label: t("legends.internalCalls"), color: "#A855F7" }]
        : []),
      { label: t("legends.unansweredCalls"), color: "#EF4444" },
    ],
  };

  const {
    data: overviewData,
    isLoading,
    error,
    isError,
  } = useLocalizedQuery({
    queryKey: ["inbound-analytics-overview", filters],
    queryFn: () => AllInboundAnalytics.fetchOverview(filters),
  });

  return (
    <ChartCard
      icon={<LineAxis />}
      title={t("title")}
      color="primary"
      legends={legends[filters.filterBy]}
      variant="compound"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      {overviewData?.length === 0 && <NoData />}
      {(overviewData?.length ?? 0) > 0 && (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="hourOfDay"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: t("xAxisLabel"),
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(_, name) => {
                  // Map dataKey to label

                  const keyToLabel: Record<string, string> = {
                    totalCalls: t("legends.totalCalls"),
                    answeredCalls: t("legends.answeredCalls"),
                    externalCalls: t("legends.externalCalls"),
                    internalCalls: t("legends.internalCalls"),
                    unansweredCalls: t("legends.unansweredCalls"),
                    abandonedCalls: t("legends.abandonedCalls"),
                    completedCalls: t("legends.completedCalls"),
                    timeoutCalls: t("legends.timeoutCalls"),
                  };

                  return [_, keyToLabel[name as string] || name];
                }}
              />
              <Line
                type="monotone"
                dataKey="totalCalls"
                label={t("legends.totalCalls")}
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="answeredCalls"
                label={t("legends.answeredCalls")}
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="externalCalls"
                label={t("legends.externalCalls")}
                stroke="#F59E42"
                strokeWidth={3}
                dot={false}
              />
              {filters.includeInternalCalls && (
                <Line
                  type="monotone"
                  dataKey="internalCalls"
                  label={t("legends.internalCalls")}
                  stroke="#A855F7"
                  strokeWidth={3}
                  dot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="unansweredCalls"
                label={t("legends.unansweredCalls")}
                stroke="#EF4444"
                strokeWidth={3}
                dot={false}
              />
              {/* team */}
              <Line
                type="monotone"
                dataKey="abandonedCalls"
                label={t("legends.abandonedCalls")}
                stroke="#F54002"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completedCalls"
                label={t("legends.completedCalls")}
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="timeoutCalls"
                label={t("legends.timeoutCalls")}
                stroke="#F59E42"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};

export default InboundAnalyticsOverview;
