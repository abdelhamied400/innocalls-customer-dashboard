import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { ActivityReportsFilters } from "./page";
import activityReportsService from "@/services/activity-reports.service";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
import { AccessTime } from "@mui/icons-material";
import { useTranslations } from "next-intl";

type FetchTalkTimeDistributionResponse = Array<{
  totalTalkTime: number;
  timeBucket: string;
}>;

type TalkTimeDistributionProps = {
  filters: ActivityReportsFilters;
};

const TalkTimeDistribution = ({ filters }: TalkTimeDistributionProps) => {
  const t = useTranslations("analytics.activityReports");

  const { data, isLoading, isError, error } =
    useLocalizedQuery<FetchTalkTimeDistributionResponse>({
      queryKey: ["agent-activity-reports", "talk-time-distribution", filters],
      queryFn: () => activityReportsService.fetchTalkTimeDistribution(filters),
    });

  // Function to format time bucket for better display
  const formatTimeBucket = (bucket: string): string => {
    // Handle common time bucket formats like "0-1 min", "1-5 min", etc.
    return bucket.replace(/(\d+)-(\d+)/, "$1-$2").replace(/min/g, "min");
  };

  // Format data for better display
  const formattedData = data?.map((item) => ({
    ...item,
    formattedBucket: formatTimeBucket(item.timeBucket),
    // Convert seconds to minutes if needed (assuming totalTalkTime is in seconds)
    talkTimeMinutes: Math.round((item.totalTalkTime / 60) * 100) / 100,
  }));

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title="Talk Time Distribution"
      icon={<AccessTime />}
      variant="compound"
      color="success"
      legends={[{ label: "Total Talk Time (minutes)", color: "#10B981" }]}
    >
      {!isLoading && formattedData && formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="formattedBucket"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value, name) => [`${value} min`, name]}
              labelFormatter={(label) => `Duration: ${label}`}
            />
            <Legend />

            <Bar
              dataKey="totalCalls"
              fill="#10B981"
              name="Total Calls"
              opacity={0.8}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>
  );
};

export default TalkTimeDistribution;
