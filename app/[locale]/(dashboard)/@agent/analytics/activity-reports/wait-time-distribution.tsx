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
import { HourglassEmpty } from "@mui/icons-material";
import { useTranslations } from "next-intl";

type FetchWaitTimeDistributionResponse = Array<{
  totalCalls: number;
  timeBucket: string;
}>;

type WaitTimeDistributionProps = {
  filters: ActivityReportsFilters;
};

const WaitTimeDistribution = ({ filters }: WaitTimeDistributionProps) => {
  const t = useTranslations("analytics.activityReports");

  const { data, isLoading, isError, error } =
    useLocalizedQuery<FetchWaitTimeDistributionResponse>({
      queryKey: ["agent-activity-reports", "wait-time-distribution", filters],
      queryFn: () => activityReportsService.fetchWaitTimeDistribution(filters),
    });

  // Function to format time bucket for better display
  const formatTimeBucket = (bucket: string): string => {
    // Handle common time bucket formats like "0-30 sec", "30-60 sec", etc.
    return bucket
      .replace(/(\d+)-(\d+)/, "$1-$2")
      .replace(/sec/g, "s")
      .replace(/min/g, "m");
  };

  // Format data for better display
  const formattedData = data?.map((item) => ({
    ...item,
    formattedBucket: formatTimeBucket(item.timeBucket),
  }));

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title="Wait Time Distribution"
      icon={<HourglassEmpty />}
      variant="compound"
      color="warning"
      legends={[{ label: "Total Calls", color: "#F59E0B" }]}
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
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Wait Time: ${label}`}
            />
            <Legend />

            <Bar
              dataKey="totalCalls"
              fill="#F59E0B"
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

export default WaitTimeDistribution;
