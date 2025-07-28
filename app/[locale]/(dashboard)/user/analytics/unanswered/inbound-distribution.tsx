import { useQuery } from "@tanstack/react-query";
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
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
// Material Icons
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import NoData from "@/components/Analytics/NoData";
import { UnansweredAnalyticsFilters } from "./page";
import { useTranslations } from "next-intl";

type InboundDistributionProps = {
  filters: UnansweredAnalyticsFilters;
};

const InboundDistribution = ({ filters }: InboundDistributionProps) => {
  const t = useTranslations("analytics.unansweredAnalytics");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inboundDistribution", filters],
    queryFn: () => unansweredAnalyticsService.fetchInboundDistribution(filters),
  });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title={t("charts.inboundDistribution")}
      icon={<GroupOutlinedIcon />}
      variant="compound"
      color="primary"
    >
      {!isLoading && data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E7EF" />
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
            <Legend />

            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#1976D2"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.totalCalls")}
            />
            <Line
              type="monotone"
              dataKey="unansweredCalls"
              stroke="#757575"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.missedTotal")}
            />
            <Line
              type="monotone"
              dataKey="internalCalls"
              stroke="#43A047"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.inboundInternal")}
            />
            <Line
              type="monotone"
              dataKey="externalCalls"
              stroke="#7C3AED"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.inboundExternal")}
            />
            <Line
              type="monotone"
              dataKey="internalUnansweredCalls"
              stroke="#FBC02D"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.missedInternal")}
            />
            <Line
              type="monotone"
              dataKey="externalUnansweredCalls"
              stroke="#E53935"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.missedExternal")}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default InboundDistribution;
