import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
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
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import NoData from "@/components/Analytics/NoData";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import { UnansweredAnalyticsFilters } from "./page";

type OutboundDistributionProps = {
  filters: UnansweredAnalyticsFilters;
};

const OutboundDistribution = ({ filters }: OutboundDistributionProps) => {
  const { data, isLoading, isError, error } = useQuery({
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
      title="Outbound Distribution"
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
            <Legend />

            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Total Out"
            />
            <Line
              type="monotone"
              dataKey="unansweredCalls"
              stroke="#9CA3AF"
              strokeWidth={2}
              dot={false}
              name="Unans. Total"
            />
            <Line
              type="monotone"
              dataKey="internalCalls"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Int. Outbound"
            />
            <Line
              type="monotone"
              dataKey="externalCalls"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              name="Ext. Outbound"
            />
            <Line
              type="monotone"
              dataKey="internalUnansweredCalls"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="Int. Unans."
            />
            <Line
              type="monotone"
              dataKey="externalUnansweredCalls"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Ext. Unans."
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default OutboundDistribution;
