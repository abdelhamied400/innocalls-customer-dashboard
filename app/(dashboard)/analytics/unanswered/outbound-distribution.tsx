import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import NoData from "@/components/Analytics/NoData";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import { UnansweredAnalyticsFilters } from "./page";
import { useTranslations } from "@/providers/TranslationProvider";

type OutboundDistributionProps = {
  filters: UnansweredAnalyticsFilters;
};

const OutboundDistribution = ({ filters }: OutboundDistributionProps) => {
  const t = useTranslations("analytics.unanswered");

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["outboundDistribution", filters],
    queryFn: () =>
      unansweredAnalyticsService.fetchOutboundDistribution(filters),
  });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title={t("charts.outboundDistribution")}
      icon={<GroupOutlined />}
      variant="compound"
      color="primary"
    >
      {!isLoading && data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.totalCalls")}
            />
            <Line
              type="monotone"
              dataKey="unansweredCalls"
              stroke="#9CA3AF"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.unansweredTotal")}
            />
            <Line
              type="monotone"
              dataKey="internalCalls"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.outboundInternal")}
            />
            <Line
              type="monotone"
              dataKey="externalCalls"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.outboundExternal")}
            />
            <Line
              type="monotone"
              dataKey="internalUnansweredCalls"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name={t(
                "outbound.callDistribution.lineLabels.unansweredInternal"
              )}
            />
            <Line
              type="monotone"
              dataKey="externalUnansweredCalls"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name={t(
                "outbound.callDistribution.lineLabels.unansweredExternal"
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default OutboundDistribution;
