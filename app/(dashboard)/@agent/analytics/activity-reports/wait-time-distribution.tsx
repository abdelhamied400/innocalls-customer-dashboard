import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { ActivityReportsFilters } from "./page";
import activityReportsService from "@/services/activity-reports.service";
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { defaultLocale, locales } from "@/i18n/config";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import NoData from "@/components/Analytics/NoData";
import { HourglassEmpty } from "@mui/icons-material";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import RechartTooltip from "@/components/RechartTooltip";

type FetchWaitTimeDistributionResponse = Array<{
  totalCalls: number;
  timeBucket: string;
}>;

type WaitTimeDistributionProps = {
  filters: ActivityReportsFilters;
};

// Colors for pie chart segments
const COLORS = [
  "#10B981", // emerald-500
  "#3B82F6", // blue-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
];

const WaitTimeDistribution = ({ filters }: WaitTimeDistributionProps) => {
  const t = useTranslations("analytics.activityAnalysis");
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const { data, isLoading, isError, error } =
    useLocalizedQuery<FetchWaitTimeDistributionResponse>({
      queryKey: ["agent-activity-reports", "wait-time-distribution", filters],
      queryFn: () => activityReportsService.fetchWaitTimeDistribution(filters),
    });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title={t("waitTime.title")}
      icon={<HourglassEmpty />}
      variant="compound"
      color="warning"
      legends={data?.map((item) => ({
        label: `${t(`waitTime.legends.timeBucket.${item.timeBucket}`)}`,
        color: COLORS[data.indexOf(item) % COLORS.length],
      }))}
    >
      {!isLoading && data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ timeBucket, percent }) =>
                `${t(`waitTime.legends.timeBucket.${timeBucket}`)} (${(
                  percent * 100
                ).toFixed(1)}%)`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="totalCalls"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ direction: locale.dir }}
              formatter={(value, name) => [
                value,
                t("waitTime.legends.totalCalls"),
              ]}
              labelFormatter={(label) => `${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <NoData />
      )}
    </ChartCard>
  );
};

export default WaitTimeDistribution;
