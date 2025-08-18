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
import { Schedule } from "@mui/icons-material";
import { useTranslations } from "next-intl";

type FetchHourlyCallDistributionResponse = Array<{
  answeredCalls: number;
  hourOfDay: number;
  totalCalls: number;
  unansweredCalls: number;
}>;

type HourlyCallDistributionProps = {
  filters: ActivityReportsFilters;
};

const HourlyCallDistribution = ({ filters }: HourlyCallDistributionProps) => {
  const t = useTranslations("analytics.activityReports");

  const { data, isLoading, isError, error } =
    useLocalizedQuery<FetchHourlyCallDistributionResponse>({
      queryKey: ["agent-activity-reports", "hourly-call-distribution", filters],
      queryFn: () =>
        activityReportsService.fetchHourlyCallDistribution(filters),
    });

  // Format hour for better display (12-hour format with AM/PM)
  const formattedData = data?.map((item) => ({
    ...item,
    formattedHour: formatHour(item.hourOfDay),
    hourDisplay: `${item.hourOfDay}:00`,
  }));

  function formatHour(hour: number): string {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  }

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title="Hourly Call Distribution"
      icon={<Schedule />}
      variant="compound"
      color="info"
      legends={[
        { label: "Total Calls", color: "#3B82F6" },
        { label: "Answered Calls", color: "#10B981" },
        { label: "Unanswered Calls", color: "#EF4444" },
      ]}
    >
      {!isLoading && formattedData && formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="hourDisplay"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={1}
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
                  return `Time: ${originalData.formattedHour}`;
                }
                return label;
              }}
            />
            <Legend />

            {/* Bars for answered and unanswered calls */}
            <Bar
              dataKey="answeredCalls"
              fill="#10B981"
              name="Answered Calls"
              opacity={0.8}
            />
            <Bar
              dataKey="unansweredCalls"
              fill="#EF4444"
              name="Unanswered Calls"
              opacity={0.8}
            />

            {/* Line for total calls trend */}
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

export default HourlyCallDistribution;
