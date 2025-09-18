import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { ActivityReportsFilters } from "./page";
import activityReportsService from "@/services/activity-reports.service";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import NoData from "@/components/Analytics/NoData";
import { AccessTime } from "@mui/icons-material";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import RechartTooltip from "@/components/RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";

type FetchTalkTimeDistributionResponse = Array<{
  totalTalkTime: number;
  timeBucket: string;
}>;

type TalkTimeDistributionProps = {
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

const TalkTimeDistribution = ({ filters }: TalkTimeDistributionProps) => {
  const t = useTranslations("analytics.activityAnalysis");
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const { data, isLoading, isError, error } =
    useLocalizedQuery<FetchTalkTimeDistributionResponse>({
      queryKey: ["agent-activity-reports", "talk-time-distribution", filters],
      queryFn: () => activityReportsService.fetchTalkTimeDistribution(filters),
    });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title={t("talkTime.title")}
      icon={<AccessTime />}
      variant="compound"
      color="success"
      legends={data?.map((item) => ({
        label: `${t(`talkTime.legends.timeBucket.${item.timeBucket}`)}`,
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
              label={({ fill, timeBucket, percent, x, y, textAnchor }) => (
                <text
                  x={x}
                  y={y}
                  fill={fill}
                  textAnchor={textAnchor === "start" ? "end" : "start"}
                  dominantBaseline="central"
                >
                  {`${t(`waitTime.legends.timeBucket.${timeBucket}`)} (${(
                    percent * 100
                  ).toFixed(1)}%)`}
                </text>
              )}
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
                t("talkTime.legends.totalCalls"),
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

export default TalkTimeDistribution;
