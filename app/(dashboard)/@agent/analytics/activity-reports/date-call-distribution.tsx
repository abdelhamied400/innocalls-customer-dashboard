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
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import RechartTooltip from "@/components/RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";

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
  const t = useTranslations("analytics.activityAnalysis");
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

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
      title={t("dateDistribution.title")}
      icon={<BarChart />}
      variant="compound"
      color="primary"
      legends={[
        { label: t("dateDistribution.legends.totalCalls"), color: "#3B82F6" },
        {
          label: t("dateDistribution.legends.incomingCalls"),
          color: "#10B981",
        },
        {
          label: t("dateDistribution.legends.outgoingCalls"),
          color: "#F59E0B",
        },
        {
          label: t("dateDistribution.legends.answeredIncoming"),
          color: "#8B5CF6",
        },
        {
          label: t("dateDistribution.legends.answeredOutgoing"),
          color: "#EF4444",
        },
      ]}
    >
      {!isLoading && data && data.length > 0 ? (
        <ResponsiveContainer
          style={{ direction: "ltr" }}
          width="100%"
          height={400}
        >
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
              contentStyle={{ direction: locale.dir }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const originalData = payload[0].payload;
                  return `${originalData.date}`;
                }
                return label;
              }}
            />
            <Legend />

            {/* Bars for call counts */}
            <Bar
              dataKey="totalIncomingCalls"
              fill="#10B981"
              name={t("dateDistribution.legends.incomingCalls")}
              opacity={0.8}
            />
            <Bar
              dataKey="totalOutgoingCalls"
              fill="#F59E0B"
              name={t("dateDistribution.legends.outgoingCalls")}
              opacity={0.8}
            />

            {/* Lines for answered calls */}
            <Line
              type="monotone"
              dataKey="totalAnsweredIncomingCalls"
              stroke="#8B5CF6"
              strokeWidth={2}
              name={t("dateDistribution.legends.answeredIncoming")}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalAnsweredOutgoingCalls"
              stroke="#EF4444"
              strokeWidth={2}
              name={t("dateDistribution.legends.answeredOutgoing")}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
            />

            {/* Total calls as a line */}
            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#3B82F6"
              strokeWidth={3}
              name={t("dateDistribution.legends.totalCalls")}
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
