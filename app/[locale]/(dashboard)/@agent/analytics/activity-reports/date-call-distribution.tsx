import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { ActivityReportsFilters } from "./page";
import activityReportsService from "@/services/activity-reports.service";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
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
import { BarChart } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

type FetchCallDistributionResponse = Array<{
  date: string;
  totalAnsweredIncomingCalls: number;
  totalAnsweredOutgoingCalls: number;
  totalCalls: number;
  totalIncomingCalls: number;
  totalOutgoingCalls: number;
}>;

type DateCallDistributionProps = {
  filters: ActivityReportsFilters;
};

const DateCallDistribution = ({ filters }: DateCallDistributionProps) => {
  const t = useTranslations("analytics.activityReports");

  const { data, isLoading, isError, error } =
    useLocalizedQuery<FetchCallDistributionResponse>({
      queryKey: ["agent-activity-reports", "date-call-distribution", filters],
      queryFn: () => activityReportsService.fetchDateCallDistribution(filters),
    });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title="Date Call Distribution"
      icon={<BarChart />}
      variant="compound"
      color="primary"
      legends={[
        { label: "Total Calls", color: "#3B82F6" },
        { label: "Incoming Calls", color: "#10B981" },
        { label: "Outgoing Calls", color: "#F59E0B" },
        { label: "Answered Incoming", color: "#8B5CF6" },
        { label: "Answered Outgoing", color: "#EF4444" },
      ]}
    >
      {!isLoading && data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="formattedDate"
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
            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const originalData = payload[0].payload;
                  return `Date: ${originalData.date}`;
                }
                return label;
              }}
            />
            <Legend />

            {/* Bars for call counts */}
            <Bar
              dataKey="totalIncomingCalls"
              fill="#10B981"
              name="Incoming Calls"
              opacity={0.8}
            />
            <Bar
              dataKey="totalOutgoingCalls"
              fill="#F59E0B"
              name="Outgoing Calls"
              opacity={0.8}
            />

            {/* Lines for answered calls */}
            <Line
              type="monotone"
              dataKey="totalAnsweredIncomingCalls"
              stroke="#8B5CF6"
              strokeWidth={2}
              name="Answered Incoming"
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalAnsweredOutgoingCalls"
              stroke="#EF4444"
              strokeWidth={2}
              name="Answered Outgoing"
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
            />

            {/* Total calls as a line */}
            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Total Calls"
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>
  );
};

export default DateCallDistribution;
